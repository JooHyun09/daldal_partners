/**
 * 달달 파트너스 — 자산관리 대시보드 Worker
 * - /api/portfolio : 전체 포트폴리오 (holdings × 실시간시세)
 * - /api/holdings  : 보유종목 CRUD
 * - /              : 대시보드 HTML
 */
import { getFinnhubPrice, getUsdKrwRate } from "./finnhub";
import { getKisStockPrice, getKisToken } from "./kis";
import { renderDashboard } from "./dashboard";

export interface Env {
  DB: D1Database;
  FINNHUB_API_KEY: string;
  KIS_APP_KEY: string;
  KIS_APP_SECRET: string;
}

interface Holding {
  id: number;
  account: string;
  account_label: string;
  market: string;
  ticker: string | null;
  name: string;
  quantity: number;
  avg_price: number;
  currency: string;
  is_cash: number;
  cash_value_krw: number;
}

// 평가금액 계산 (시세 × 수량, 원화 환산)
function calcValue(h: Holding, price: number | null, fxRate: number): number {
  if (h.is_cash) return h.cash_value_krw;
  if (price === null) return h.avg_price * h.quantity; // 시세 실패 시 매입가 기준
  const value = price * h.quantity;
  return h.currency === "USD" ? value * fxRate : value;
}

function calcCost(h: Holding, fxRate: number): number {
  if (h.is_cash) return h.cash_value_krw;
  const cost = h.avg_price * h.quantity;
  return h.currency === "USD" ? cost * fxRate : cost;
}

// 포트폴리오 전체 계산 (모든 holdings + 실시간 시세)
async function buildPortfolio(env: Env) {
  const { results } = await env.DB.prepare(
    "SELECT * FROM holdings ORDER BY account, name"
  ).all<Holding>();

  const fxRate = await getUsdKrwRate(env.FINNHUB_API_KEY);

  // KR 종목이 있으면 토큰을 먼저 한 번만 발급받아 캐시 (동시요청 race condition 방지)
  const hasKr = results.some((h) => h.market === "KR" && !h.is_cash && h.ticker);
  if (hasKr) {
    await getKisToken(env.KIS_APP_KEY, env.KIS_APP_SECRET);
  }

  const items = await Promise.all(
    results.map(async (h) => {
      let price: number | null = null;
      if (!h.is_cash && h.ticker) {
        if (h.market === "US") {
          price = await getFinnhubPrice(h.ticker, env.FINNHUB_API_KEY);
        } else if (h.market === "KR") {
          price = await getKisStockPrice(h.ticker, env.KIS_APP_KEY, env.KIS_APP_SECRET);
        }
      }
      const value = calcValue(h, price, fxRate);
      const cost = calcCost(h, fxRate);
      const pnl = value - cost;
      const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
      return { ...h, current_price: price, value_krw: value, cost_krw: cost, pnl_krw: pnl, pnl_pct: pnlPct };
    })
  );

  return { items, fxRate, generatedAt: new Date().toISOString() };
}

// 오늘 날짜 기준 스냅샷 저장 (Cron이 매일 호출, 수동 트리거도 가능)
async function takeSnapshot(env: Env): Promise<{ date: string; net_worth_krw: number }> {
  const portfolio = await buildPortfolio(env);
  const finValue = portfolio.items.reduce((s, i) => s + i.value_krw, 0);
  const finCost = portfolio.items.reduce((s, i) => s + i.cost_krw, 0);

  const { results: fixed } = await env.DB.prepare("SELECT * FROM fixed_assets").all<{ value_krw: number }>();
  const fixedTotal = fixed.reduce((s, f) => s + f.value_krw, 0);
  const netWorth = finValue + fixedTotal;

  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD (UTC 기준)

  await env.DB.prepare(
    `INSERT INTO daily_snapshot (date, fin_value_krw, fin_cost_krw, net_worth_krw, fx_rate)
     VALUES (?,?,?,?,?)
     ON CONFLICT(date) DO UPDATE SET
       fin_value_krw=excluded.fin_value_krw,
       fin_cost_krw=excluded.fin_cost_krw,
       net_worth_krw=excluded.net_worth_krw,
       fx_rate=excluded.fx_rate`
  )
    .bind(date, finValue, finCost, netWorth, portfolio.fxRate)
    .run();

  return { date, net_worth_krw: netWorth };
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const url = new URL(request.url);
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    // ── GET /api/portfolio ──────────────────────────
    if (url.pathname === "/api/portfolio" && request.method === "GET") {
      const portfolio = await buildPortfolio(env);
      return Response.json(portfolio, { headers: cors });
    }

    // ── GET /api/holdings (raw list, 시세 없이) ─────
    if (url.pathname === "/api/holdings" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM holdings ORDER BY account, name"
      ).all();
      return Response.json(results, { headers: cors });
    }

    // ── POST /api/holdings (신규 종목 추가) ──────────
    if (url.pathname === "/api/holdings" && request.method === "POST") {
      const body = await request.json<Partial<Holding>>();
      const result = await env.DB.prepare(
        `INSERT INTO holdings (account, account_label, market, ticker, name, quantity, avg_price, currency, is_cash, cash_value_krw)
         VALUES (?,?,?,?,?,?,?,?,?,?)`
      )
        .bind(
          body.account, body.account_label, body.market, body.ticker ?? null,
          body.name, body.quantity ?? 0, body.avg_price ?? 0,
          body.currency ?? "KRW", body.is_cash ?? 0, body.cash_value_krw ?? 0
        )
        .run();
      return Response.json({ success: true, id: result.meta.last_row_id }, { headers: cors });
    }

    // ── PUT /api/holdings/:id (수정) ────────────────
    const putMatch = url.pathname.match(/^\/api\/holdings\/(\d+)$/);
    if (putMatch && request.method === "PUT") {
      const id = putMatch[1];
      const body = await request.json<Partial<Holding>>();
      await env.DB.prepare(
        `UPDATE holdings SET quantity=?, avg_price=?, cash_value_krw=?, updated_at=datetime('now') WHERE id=?`
      )
        .bind(body.quantity ?? 0, body.avg_price ?? 0, body.cash_value_krw ?? 0, id)
        .run();
      return Response.json({ success: true }, { headers: cors });
    }

    // ── DELETE /api/holdings/:id ─────────────────────
    const delMatch = url.pathname.match(/^\/api\/holdings\/(\d+)$/);
    if (delMatch && request.method === "DELETE") {
      await env.DB.prepare("DELETE FROM holdings WHERE id=?").bind(delMatch[1]).run();
      return Response.json({ success: true }, { headers: cors });
    }

    // ── GET /api/fixed-assets (부동산/대출) ──────────
    if (url.pathname === "/api/fixed-assets" && request.method === "GET") {
      const { results } = await env.DB.prepare("SELECT * FROM fixed_assets").all();
      return Response.json(results, { headers: cors });
    }

    // ── GET /api/snapshots (추이 그래프용 일별 데이터) ──
    if (url.pathname === "/api/snapshots" && request.method === "GET") {
      const { results } = await env.DB.prepare(
        "SELECT * FROM daily_snapshot ORDER BY date ASC"
      ).all();
      return Response.json(results, { headers: cors });
    }

    // ── POST /api/snapshot (수동 스냅샷 트리거, 테스트용) ──
    if (url.pathname === "/api/snapshot" && request.method === "POST") {
      const result = await takeSnapshot(env);
      return Response.json({ success: true, ...result }, { headers: cors });
    }

    // ── GET / (대시보드) ──────────────────────────────
    if (url.pathname === "/" || url.pathname === "/dashboard") {
      const html = renderDashboard();
      return new Response(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      });
    }

    return new Response("Not Found", { status: 404, headers: cors });
  },

  // ── Cron Trigger: 매일 UTC 0시(한국시간 09:00) 스냅샷 저장 ──
  async scheduled(event, env, ctx): Promise<void> {
    const result = await takeSnapshot(env);
    console.log(`Daily snapshot saved: ${result.date} net_worth=${Math.round(result.net_worth_krw)}`);
  },
} satisfies ExportedHandler<Env>;
