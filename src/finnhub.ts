// Finnhub(해외주식 시세) + KIS(국내주식 시세) 연동 모듈

interface Env {
  DB: D1Database;
  FINNHUB_API_KEY: string;
  KIS_APP_KEY: string;
  KIS_APP_SECRET: string;
}

// ── Finnhub: 미국 주식 시세 ──────────────────────────────
export async function getFinnhubPrice(ticker: string, apiKey: string): Promise<number | null> {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`
    );
    if (!res.ok) return null;
    const data = await res.json<{ c: number }>();
    return data.c || null; // c = current price
  } catch {
    return null;
  }
}

// ── Finnhub: 환율 (USD/KRW) ──────────────────────────────
export async function getUsdKrwRate(apiKey: string): Promise<number> {
  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/forex/rates?base=USD&token=${apiKey}`
    );
    if (res.ok) {
      const data = await res.json<{ quote?: Record<string, number> }>();
      if (data.quote?.KRW) return data.quote.KRW;
    }
  } catch {
    // fallthrough
  }
  return 1450; // fallback 고정값 (API 실패 시)
}
