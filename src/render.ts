/**
 * 헤르메스 종목분석 결과 페이지 렌더러
 * HermesAnalysisResult JSON → 모바일 HTML 페이지
 */

export function renderResultPage(d: any): string {
  const f = d.financials || {};
  const t = d.technical || {};
  const tg = d.target || {};
  const ai = d.ai_opinion || {};
  const strategies: any[] = d.strategies || [];
  const news: any[] = d.news || [];
  const personalized = d.personalized || null;
  const priceHistory = d.price_history || null;

  const changeClass = d.change < 0 ? 'down' : 'up';
  const changeArrow = d.change < 0 ? '▼' : '▲';
  const opinionMap: Record<string, string> = { BUY: '매수', HOLD: '홀드', SELL: '매도' };
  const opinionClass: Record<string, string> = { BUY: 'op-buy', HOLD: 'op-hold', SELL: 'op-sell' };

  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(d.name)} 종목분석 — 달달 파트너스</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/tabler-icons/2.47.0/iconfont/tabler-icons.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js"></script>
<style>${commonStyle()}${resultStyle()}</style>
</head>
<body>
<div class="wrap">

<a href="/" class="back-link"><i class="ti ti-arrow-left"></i> 목록으로</a>

<div class="sec-lbl">종목 기본 정보</div>
<div class="card">
  <div class="info-top">
    <div>
      <div class="stock-name">${esc(d.name)} <span class="stock-code">${esc(d.ticker)}</span></div>
      <div class="stock-meta">${esc(d.market || '')} · ${esc(d.sector || '')}</div>
      <div class="price-row"><span class="price">${fmt(d.price)}</span><span class="chg ${changeClass}">${changeArrow} ${fmt(Math.abs(d.change))} (${fmtPct(d.change_pct)})</span></div>
      <div class="as-of">${esc(d.as_of || '')} 기준</div>
    </div>
    <div class="score-block">
      <div class="score-circle ${scoreColorClass(d.score)}">${d.score ?? '-'}<span>종합점수</span></div>
      <span class="badge ${opinionClass[d.opinion] || 'op-hold'}">${opinionMap[d.opinion] || d.opinion || '-'}</span>
    </div>
  </div>
</div>

${tg.price ? `
<div class="sec-lbl">목표주가 및 상승여력</div>
<div class="card">
  <div class="target-row">
    <div class="target-b"><div class="t-lbl">헤르메스 목표가</div><div class="t-price">${fmt(tg.price)}</div><div class="t-up">${fmtPct(tg.upside_pct)}</div></div>
    <div class="target-b"><div class="t-lbl">52주 최고</div><div class="t-price sm">${fmt(tg.week52_high)}</div><div class="t-sub">${esc(tg.week52_high_date || '')}</div></div>
    <div class="target-b"><div class="t-lbl">52주 최저</div><div class="t-price sm">${fmt(tg.week52_low)}</div><div class="t-sub">${esc(tg.week52_low_date || '')}</div></div>
  </div>
</div>` : ''}

${priceHistory?.points?.length ? `
<div class="sec-lbl">주가 차트</div>
<div class="card">
  <div style="position:relative;width:100%;height:200px"><canvas id="priceChart"></canvas></div>
  <div class="legend">
    <span class="legend-item"><span class="legend-dot" style="background:#185FA5"></span>종가</span>
    <span class="legend-item"><span class="legend-dot" style="background:#BA7517"></span>MA20</span>
    <span class="legend-item"><span class="legend-dot" style="background:#993556"></span>MA60</span>
  </div>
</div>` : ''}

<div class="sec-lbl">재무 지표 <span class="sec-hint">— 탭하면 해석 확인</span></div>
<div class="metric-grid">
  ${renderMetric('PER', f.per, 'x', f.per_sector_avg, '업종 평균', perTip(f))}
  ${renderMetric('PBR', f.pbr, 'x', f.pbr_sector_avg, '업종 평균', pbrTip(f))}
  ${renderMetric('ROE', f.roe, '%', f.roe_prev, '전년', roeTip(f))}
  ${renderMetric('EPS', f.eps, '', f.eps_yoy_pct ?? null, 'YoY', epsTip(f), true)}
  ${f.peg != null ? renderMetric('PEG', f.peg, '', null, '피터 린치 기준', pegTip(f)) : ''}
  ${renderMetric('부채비율', f.debt_ratio, '%', f.debt_ratio_sector_avg, '업종 평균', debtTip(f))}
  ${f.dividend_yield != null ? renderMetric('배당수익률', f.dividend_yield, '%', null, f.dividend_per_share ? `연 ${fmt(f.dividend_per_share)}원` : '', divTip(f)) : ''}
  ${f.operating_margin != null ? renderMetric('영업이익률', f.operating_margin, '%', f.operating_margin_prev, '전년', opmTip(f)) : ''}
</div>

${t.trend_score != null ? `
<div class="sec-lbl">기술적 분석</div>
<div class="card">
  <div class="pb-row"><span class="pb-lbl">추세 강도</span><div class="pb-bg"><div class="pb-fill" style="width:${t.trend_score}%;background:#1D9E75"></div></div><span class="pb-val">${t.trend_score}</span></div>
  <div class="pb-row"><span class="pb-lbl">모멘텀</span><div class="pb-bg"><div class="pb-fill" style="width:${t.momentum_score}%;background:#1D9E75"></div></div><span class="pb-val">${t.momentum_score}</span></div>
  <div class="pb-row"><span class="pb-lbl">과매수/도</span><div class="pb-bg"><div class="pb-fill" style="width:${t.overbought_score}%;background:#378ADD"></div></div><span class="pb-val">${t.overbought_score}</span></div>
  <div class="pb-row"><span class="pb-lbl">거래량</span><div class="pb-bg"><div class="pb-fill" style="width:${t.volume_score}%;background:#BA7517"></div></div><span class="pb-val">${t.volume_score}</span></div>
  <div class="divider"></div>
  ${t.ma20 != null ? `<div class="row"><span class="rl">MA20</span><span class="rv">${fmt(t.ma20)} <span class="${t.ma20_position === 'ABOVE' ? 'up' : 'down'}">${t.ma20_position === 'ABOVE' ? '↑ 위' : '↓ 아래'}</span></span></div>` : ''}
  ${t.ma60 != null ? `<div class="row"><span class="rl">MA60</span><span class="rv">${fmt(t.ma60)} <span class="${t.ma60_position === 'ABOVE' ? 'up' : 'down'}">${t.ma60_position === 'ABOVE' ? '↑ 위' : '↓ 아래'}</span></span></div>` : ''}
  ${t.support != null ? `<div class="row"><span class="rl">지지선</span><span class="rv">${fmt(t.support)}</span></div>` : ''}
  ${t.resistance != null ? `<div class="row"><span class="rl">저항선</span><span class="rv">${fmt(t.resistance)}</span></div>` : ''}
</div>` : ''}

${strategies.length ? `
<div class="sec-lbl">투자대가 전략 평가</div>
<div class="strat-list">
  ${strategies.map(renderStrategy).join('')}
</div>` : ''}

${personalized ? renderPersonalized(personalized) : ''}

${ai.summary ? `
<div class="sec-lbl">AI 투자 의견</div>
<div class="card">
  <div class="ai-summary">${esc(ai.summary)}</div>
  ${(ai.opportunities?.length || ai.risks?.length) ? '<div class="divider"></div>' : ''}
  ${ai.opportunities?.length ? `<div class="tag-block"><div class="tag-lbl">기회 요인</div>${ai.opportunities.map((o: string) => `<span class="tag">${esc(o)}</span>`).join('')}</div>` : ''}
  ${ai.risks?.length ? `<div class="tag-block"><div class="tag-lbl">리스크 요인</div>${ai.risks.map((r: string) => `<span class="tag tag-risk">${esc(r)}</span>`).join('')}</div>` : ''}
</div>` : ''}

${news.length ? `
<div class="sec-lbl">관련 뉴스</div>
<div class="card">
  ${news.map((n: any) => `
  <div class="news-item">
    <div class="news-t">${n.url ? `<a href="${esc(n.url)}" target="_blank" rel="noopener">${esc(n.title)}</a>` : esc(n.title)}</div>
    <div class="news-m">${esc(n.source)} · ${timeAgo(n.published_at)}</div>
  </div>`).join('')}
</div>` : ''}

</div>
<script>
function toggleMetric(el){
  const tip=el.querySelector('.inline-tip'),icon=el.querySelector('.exp-icon'),isOpen=tip.classList.contains('open');
  document.querySelectorAll('.metric.open').forEach(m=>{m.classList.remove('open');m.querySelector('.inline-tip').classList.remove('open');m.querySelector('.exp-icon').classList.remove('open');});
  if(!isOpen){el.classList.add('open');tip.classList.add('open');icon.classList.add('open');}
}
function toggleStrat(el){
  const body=el.nextElementSibling,icon=el.querySelector('.exp-icon'),isOpen=body.classList.contains('open');
  document.querySelectorAll('.strat-body.open').forEach(b=>{b.classList.remove('open');b.previousElementSibling.classList.remove('open');b.previousElementSibling.querySelector('.exp-icon').classList.remove('open');});
  if(!isOpen){body.classList.add('open');el.classList.add('open');icon.classList.add('open');}
}
${priceHistory?.points?.length ? renderChartScript(priceHistory) : ''}
</script>
</body>
</html>`;
}

// ─── 헬퍼 함수들 ───────────────────────────────────────────────────

function renderMetric(label: string, value: any, unit: string, compareValue: any, compareLabel: string, tip: any, noUnit = false): string {
  if (value == null) return '';
  const valStr = noUnit ? fmt(value) : `${fmt(value)}${unit}`;
  const sub = compareValue != null
    ? `${compareLabel} ${typeof compareValue === 'number' && Math.abs(compareValue) < 100 ? fmtSigned(compareValue) + (unit === '%' ? '%' : '') : fmt(compareValue) + unit}`
    : (compareLabel || '');
  return `
  <div class="metric" onclick="toggleMetric(this)">
    <div class="metric-top">
      <div><div class="metric-lbl">${label}</div><div class="metric-val">${valStr}</div><div class="metric-sub">${esc(sub)}</div></div>
      <i class="ti ti-chevron-down exp-icon"></i>
    </div>
    <div class="inline-tip"><div class="tip-body">${tip.text}<div class="tip-verdict ${tip.cls}">${tip.verdict}</div></div></div>
  </div>`;
}

function renderStrategy(s: any): string {
  const verdictMap: Record<string, string> = { PASS: '충족', PARTIAL: '부분 충족', FAIL: '미충족' };
  const verdictCls: Record<string, string> = { PASS: 'sv-pass', PARTIAL: 'sv-partial', FAIL: 'sv-fail' };
  const checkIcon: Record<string, string> = { PASS: '✓', PARTIAL: '△', FAIL: '✗' };
  const checkCls: Record<string, string> = { PASS: 'sc-p', PARTIAL: 'sc-w', FAIL: 'sc-f' };
  return `
  <div class="strat-card">
    <div class="strat-hdr" onclick="toggleStrat(this)">
      <div><div class="strat-name">${esc(s.name)}</div><div class="strat-style">${esc(s.style || '')}</div></div>
      <div class="strat-right"><span class="sv ${verdictCls[s.verdict] || 'sv-partial'}">${verdictMap[s.verdict] || s.verdict}</span><i class="ti ti-chevron-down exp-icon"></i></div>
    </div>
    <div class="strat-body">
      <div class="strat-items">
        ${(s.checks || []).map((c: any) => `<div class="si-row"><span class="si-ic ${checkCls[c.status] || 'sc-w'}">${checkIcon[c.status] || '△'}</span><span>${esc(c.label)}</span></div>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderPersonalized(p: any): string {
  const h = p.holding;
  if (!h) return '';
  const profit = (h.eval_amount || 0) - (h.avg_price || 0) * (h.quantity || 0);
  const profitClass = profit >= 0 ? 'up' : 'down';
  return `
  <div class="sec-lbl">개인화 분석</div>
  <div class="card">
    <div class="hold-card">
      <div class="hold-top">
        <div><div class="hold-status-lbl">보유 중</div>${h.purchase_date ? `<div class="hold-date">${esc(h.purchase_date)} 매수</div>` : ''}</div>
        <span class="hold-status ${profitClass}">${profit >= 0 ? '+' : ''}${fmt(profit)}원</span>
      </div>
      <div class="hold-grid">
        <div><div class="hold-item-lbl">보유 수량</div><div class="hold-item-val">${fmt(h.quantity)}주</div></div>
        <div><div class="hold-item-lbl">평균단가</div><div class="hold-item-val">${fmt(h.avg_price)}원</div></div>
        <div><div class="hold-item-lbl">평가금액</div><div class="hold-item-val">${fmt(h.eval_amount)}원</div></div>
        <div><div class="hold-item-lbl">수익률</div><div class="hold-item-val ${profitClass}">${fmtPct(h.return_pct)}</div></div>
      </div>
    </div>
    ${p.portfolio_weight_pct != null ? `
    <div class="bar-wrap">
      <div class="bar-track"><div class="bar-fill" style="width:${Math.min(p.portfolio_weight_pct, 100)}%"><span class="bar-fill-text">${fmt(p.portfolio_weight_pct)}%</span></div></div>
      ${p.total_asset ? `<div class="bar-labels"><span>전체 자산 ${fmt(p.total_asset)}원 중</span><span>${fmt(h.eval_amount)}원</span></div>` : ''}
    </div>` : ''}
    ${p.personalized_opinion ? `<div class="opinion-box"><div class="opinion-text">${esc(p.personalized_opinion)}</div></div>` : ''}
  </div>`;
}

function renderChartScript(ph: any): string {
  const labels = ph.points.map((p: any) => p.date);
  const prices = ph.points.map((p: any) => p.close);
  return `
const _l=${JSON.stringify(labels)},_p=${JSON.stringify(prices)};
function _ma(d,n){return d.map((_,i)=>i<n-1?null:Math.round(d.slice(i-n+1,i+1).reduce((a,b)=>a+b,0)/n));}
new Chart(document.getElementById('priceChart'),{type:'line',data:{labels:_l,datasets:[
  {label:'종가',data:_p,borderColor:'#185FA5',borderWidth:2,pointRadius:0,tension:0.15},
  {label:'MA20',data:_ma(_p,Math.min(20,_p.length)),borderColor:'#BA7517',borderWidth:1.5,borderDash:[4,3],pointRadius:0,tension:0.15},
  {label:'MA60',data:_ma(_p,Math.min(60,_p.length)),borderColor:'#993556',borderWidth:1.5,borderDash:[2,2],pointRadius:0,tension:0.15}
]},options:{responsive:true,maintainAspectRatio:false,interaction:{mode:'index',intersect:false},
  plugins:{legend:{display:false}},
  scales:{x:{ticks:{maxTicksLimit:6,font:{size:10}},grid:{display:false}},y:{ticks:{font:{size:10}}}}}});`;
}

// ─── 재무지표 툴팁 ──────────────────────────────────────────────────

function perTip(f: any) {
  if (f.per == null) return { text: '', verdict: '', cls: '' };
  const cheap = f.per_sector_avg != null && f.per < f.per_sector_avg;
  return { text: `현재 주가가 주당순이익의 몇 배인지 나타냅니다.${f.per_sector_avg != null ? ` 업종 평균(${fmt(f.per_sector_avg)}x) 대비 ${cheap ? '저평가' : '고평가'} 상태입니다.` : ''}`, verdict: cheap ? '✓ 저평가 — 매수 매력 있음' : '△ 업종 대비 높은 편', cls: cheap ? 'tv-good' : 'tv-warn' };
}
function pbrTip(f: any) {
  if (f.pbr == null) return { text: '', verdict: '', cls: '' };
  const cheap = f.pbr_sector_avg != null && f.pbr < f.pbr_sector_avg;
  return { text: `주가가 장부상 순자산의 몇 배인지 나타냅니다.${f.pbr_sector_avg != null ? ` 업종 평균(${fmt(f.pbr_sector_avg)}x) 대비 ${cheap ? '낮은 가격' : '높은 가격'}입니다.` : ''}`, verdict: cheap ? '✓ 저평가 — 자산가치 매력' : '△ 업종 대비 높은 편', cls: cheap ? 'tv-good' : 'tv-warn' };
}
function roeTip(f: any) {
  if (f.roe == null) return { text: '', verdict: '', cls: '' };
  const good = f.roe >= 15;
  return { text: `주주 자본으로 얼마나 이익을 냈는지 나타냅니다. 15% 이상이면 우량.${f.roe_prev != null ? ` 전년(${fmt(f.roe_prev)}%) 대비 ${f.roe >= f.roe_prev ? '개선' : '하락'}.` : ''}`, verdict: good ? '✓ 우량 — 높은 자본 효율성' : f.roe >= 10 ? '△ 보통 — 모니터링 필요' : '✗ 낮음 — 자본 효율성 개선 필요', cls: good ? 'tv-good' : f.roe >= 10 ? 'tv-warn' : 'tv-bad' };
}
function epsTip(f: any) {
  if (f.eps == null) return { text: '', verdict: '', cls: '' };
  const growing = f.eps_yoy_pct != null && f.eps_yoy_pct > 0;
  return { text: `주식 1주당 회사가 얼마나 벌었는지를 나타냅니다.${f.eps_yoy_pct != null ? ` 전년 대비 ${fmtSigned(f.eps_yoy_pct)}% 변화.` : ''}`, verdict: growing ? '✓ 성장 — 이익 증가 추세' : '✗ 감소 — 이익 둔화', cls: growing ? 'tv-good' : 'tv-warn' };
}
function pegTip(f: any) {
  if (f.peg == null) return { text: '', verdict: '', cls: '' };
  return { text: `PER을 EPS 성장률로 나눈 값. 피터 린치 기준 0.5 이하 저평가, 1.5 이상 고평가.`, verdict: f.peg <= 1 ? '✓ 적정 — 성장 대비 저평가' : '△ 성장 대비 다소 높음', cls: f.peg <= 1 ? 'tv-good' : 'tv-warn' };
}
function debtTip(f: any) {
  if (f.debt_ratio == null) return { text: '', verdict: '', cls: '' };
  const safe = f.debt_ratio < 100, better = f.debt_ratio_sector_avg != null && f.debt_ratio < f.debt_ratio_sector_avg;
  return { text: `총부채를 자기자본으로 나눈 비율. 낮을수록 안전.${f.debt_ratio_sector_avg != null ? ` 업종 평균은 ${fmt(f.debt_ratio_sector_avg)}%.` : ''}`, verdict: safe && (better || !f.debt_ratio_sector_avg) ? '✓ 우량 — 재무 안정성 높음' : safe ? '△ 안정권이나 업종 대비 높음' : '✗ 부채 부담 높음', cls: safe ? 'tv-good' : 'tv-bad' };
}
function divTip(f: any) {
  if (f.dividend_yield == null) return { text: '', verdict: '', cls: '' };
  return { text: `현재 주가 대비 연간 배당금 비율.`, verdict: f.dividend_yield >= 3 ? '✓ 양호 — 안정적 현금 수익' : '△ 보통 — 성장주 기준 적정', cls: f.dividend_yield >= 3 ? 'tv-good' : 'tv-warn' };
}
function opmTip(f: any) {
  if (f.operating_margin == null) return { text: '', verdict: '', cls: '' };
  const improving = f.operating_margin_prev != null && f.operating_margin > f.operating_margin_prev;
  return { text: `매출 중 영업이익 비율. 본업 수익 창출 능력.${f.operating_margin_prev != null ? ` 전년(${fmt(f.operating_margin_prev)}%) 대비 ${improving ? '개선' : '악화'}.` : ''}`, verdict: improving ? '✓ 개선 추세 — 수익성 회복' : '△ 전년 대비 둔화', cls: improving ? 'tv-good' : 'tv-warn' };
}

function scoreColorClass(score: number | null): string {
  if (score == null) return '';
  return score >= 70 ? 'up' : score >= 50 ? 'mid' : 'down';
}

function fmt(n: any): string {
  if (n == null || isNaN(n)) return '-';
  return Number(n).toLocaleString('ko-KR', { maximumFractionDigits: 2 });
}
function fmtSigned(n: any): string {
  if (n == null || isNaN(n)) return '-';
  const s = Number(n).toLocaleString('ko-KR', { maximumFractionDigits: 2 });
  return n > 0 ? `+${s}` : s;
}
function fmtPct(n: any): string {
  if (n == null || isNaN(n)) return '-';
  return `${fmtSigned(n)}%`;
}
function esc(s: any): string {
  return String(s ?? '').replace(/[&<>"']/g, (c: string) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}
function timeAgo(iso: string): string {
  if (!iso) return '';
  const h = Math.floor((Date.now() - new Date(iso).getTime()) / 3600000);
  if (h < 1) return '방금 전';
  if (h < 24) return `${h}시간 전`;
  const d = Math.floor(h / 24);
  return d === 1 ? '어제' : `${d}일 전`;
}

// ─── 공통 스타일 ────────────────────────────────────────────────────

export function commonStyle(): string {
  return `
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#F1EFE8;color:#2C2C2A}
.wrap{max-width:480px;margin:0 auto;padding:1rem 1rem 3rem}
`;
}

export function resultStyle(): string {
  return `
.back-link{display:inline-flex;align-items:center;gap:4px;font-size:13px;color:#5F5E5A;text-decoration:none;margin-bottom:14px}
.sec-lbl{font-size:11px;font-weight:600;color:#888780;text-transform:uppercase;letter-spacing:.06em;margin-bottom:8px;margin-top:16px}
.sec-hint{font-size:10px;color:#888780;font-weight:400;text-transform:none;letter-spacing:0}
.card{background:#fff;border:0.5px solid #D3D1C7;border-radius:12px;padding:14px 16px;margin-bottom:4px}
.info-top{display:flex;justify-content:space-between;align-items:flex-start}
.stock-name{font-size:18px;font-weight:600}
.stock-code{font-size:12px;color:#888780;font-weight:400}
.stock-meta{font-size:12px;color:#5F5E5A;margin-top:2px}
.price-row{margin-top:8px;display:flex;align-items:baseline;gap:8px}
.price{font-size:24px;font-weight:600}
.chg{font-size:12px;font-weight:600}
.up{color:#0F6E56}.down{color:#993C1D}.mid{color:#854F0B}
.as-of{font-size:10px;color:#888780;margin-top:2px}
.score-block{display:flex;flex-direction:column;align-items:center;gap:5px}
.score-circle{width:52px;height:52px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#F1EFE8;border:0.5px solid #D3D1C7;font-size:18px;font-weight:600}
.score-circle span{font-size:9px;color:#888780;font-weight:400}
.badge{font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px}
.op-buy{background:#E1F5EE;color:#0F6E56}.op-hold{background:#FAEEDA;color:#854F0B}.op-sell{background:#FAECE7;color:#993C1D}
.target-row{display:grid;grid-template-columns:repeat(3,1fr);gap:6px}
.target-b{text-align:center;padding:9px 6px;background:#F1EFE8;border-radius:8px}
.t-lbl{font-size:10px;color:#5F5E5A;margin-bottom:3px}
.t-price{font-size:17px;font-weight:600}.t-price.sm{font-size:15px}
.t-up{font-size:11px;color:#0F6E56;font-weight:600;margin-top:2px}
.t-sub{font-size:10px;color:#888780;margin-top:2px}
.legend{display:flex;gap:14px;margin-top:10px;font-size:11px;color:#5F5E5A}
.legend-item{display:flex;align-items:center;gap:5px}
.legend-dot{width:10px;height:3px;border-radius:2px}
.metric-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
.metric{background:#fff;border:0.5px solid #D3D1C7;border-radius:8px;padding:10px 11px;cursor:pointer}
.metric.open{border-color:#888780}
.metric-top{display:flex;justify-content:space-between;align-items:flex-start}
.metric-lbl{font-size:11px;color:#5F5E5A;margin-bottom:3px}
.metric-val{font-size:19px;font-weight:600}
.metric-sub{font-size:10px;color:#888780;margin-top:1px}
.exp-icon{font-size:12px;color:#888780;transition:transform .2s;flex-shrink:0;margin-top:2px}
.exp-icon.open{transform:rotate(180deg)}
.inline-tip{overflow:hidden;max-height:0;transition:max-height .25s ease}
.inline-tip.open{max-height:220px}
.tip-body{font-size:12px;color:#5F5E5A;line-height:1.6;padding-top:8px;margin-top:8px;border-top:0.5px solid #D3D1C7}
.tip-verdict{display:inline-block;margin-top:6px;padding:3px 8px;border-radius:20px;font-size:11px;font-weight:600}
.tv-good{background:#E1F5EE;color:#0F6E56}.tv-warn{background:#FAEEDA;color:#854F0B}.tv-bad{background:#FAECE7;color:#993C1D}
.pb-row{display:flex;align-items:center;gap:8px;font-size:12px;margin-bottom:6px}
.pb-lbl{color:#5F5E5A;width:56px;flex-shrink:0;font-size:11px}
.pb-bg{flex:1;background:#F1EFE8;border-radius:4px;height:5px;overflow:hidden}
.pb-fill{height:100%;border-radius:4px}
.pb-val{font-weight:600;width:24px;text-align:right;flex-shrink:0;font-size:12px}
.divider{border:none;border-top:0.5px solid #D3D1C7;margin:10px 0}
.row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;font-size:13px}
.rl{color:#5F5E5A}.rv{font-weight:600}
.strat-list{display:flex;flex-direction:column;gap:7px}
.strat-card{border-radius:8px;border:0.5px solid #D3D1C7;overflow:hidden}
.strat-hdr{display:flex;justify-content:space-between;align-items:center;padding:10px 12px;cursor:pointer;background:#F1EFE8}
.strat-hdr.open{background:#fff}
.strat-name{font-size:13px;font-weight:600}
.strat-style{font-size:10px;color:#888780;margin-top:1px}
.strat-right{display:flex;align-items:center;gap:6px}
.sv{font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px}
.sv-pass{background:#E1F5EE;color:#0F6E56}.sv-partial{background:#FAEEDA;color:#854F0B}.sv-fail{background:#FAECE7;color:#993C1D}
.strat-body{overflow:hidden;max-height:0;transition:max-height .22s ease}
.strat-body.open{max-height:300px}
.strat-items{padding:9px 12px;font-size:12px;color:#5F5E5A;line-height:1.8;background:#fff}
.si-row{display:flex;gap:5px;align-items:flex-start}
.si-ic{width:14px;flex-shrink:0;font-size:12px;margin-top:1px}
.sc-p{color:#0F6E56}.sc-f{color:#993C1D}.sc-w{color:#854F0B}
.hold-card{background:#F1EFE8;border-radius:8px;padding:12px;margin-bottom:14px}
.hold-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.hold-status-lbl{font-size:13px;font-weight:600}
.hold-date{font-size:11px;color:#888780;margin-top:1px}
.hold-status{font-size:11px;font-weight:600;padding:3px 9px;border-radius:20px;background:#E1F5EE}
.hold-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;font-size:12px}
.hold-item-lbl{font-size:10px;color:#888780}
.hold-item-val{font-size:14px;font-weight:600;margin-top:1px}
.bar-track{position:relative;height:28px;background:#F1EFE8;border-radius:8px;overflow:hidden}
.bar-fill{position:absolute;left:0;top:0;height:100%;background:#1D9E75;display:flex;align-items:center;padding-left:10px}
.bar-fill-text{font-size:11px;font-weight:600;color:#fff}
.bar-labels{display:flex;justify-content:space-between;font-size:10px;color:#888780;margin-top:4px}
.bar-wrap{margin-bottom:10px}
.opinion-box{background:#F1EFE8;border-radius:8px;padding:12px;margin-top:10px}
.opinion-text{font-size:13px;color:#5F5E5A;line-height:1.6}
.ai-summary{font-size:13px;color:#5F5E5A;line-height:1.7}
.tag-block{margin-top:8px}
.tag-lbl{font-size:10px;color:#888780;margin-bottom:5px}
.tag{display:inline-block;font-size:11px;padding:3px 7px;border-radius:20px;margin:2px;background:#F1EFE8;color:#5F5E5A;border:0.5px solid #D3D1C7}
.tag-risk{background:#FAECE7;color:#993C1D;border-color:#F5C4B3}
.news-item{padding:8px 0;border-bottom:0.5px solid #D3D1C7}
.news-item:last-child{border-bottom:none}
.news-t{font-size:13px;margin-bottom:2px;line-height:1.4}
.news-t a{color:inherit;text-decoration:none}
.news-m{font-size:11px;color:#888780}
`;
}
