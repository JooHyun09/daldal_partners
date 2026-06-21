// 달달 파트너스 대시보드 HTML (단일 페이지, vanilla JS)
export function renderDashboard(): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>달달 파트너스 — 자산관리</title>
<style>
:root{
  --bg:#0F1C2E; --card:#16263D; --paper:#F5F2EA;
  --ink:#F5F2EA; --muted:#8FA3BD;
  --pos:#3FA66B; --neg:#E0585F; --gold:#C9A961;
  --line:rgba(245,242,234,0.08);
}
*{box-sizing:border-box;}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font-family:-apple-system,BlinkMacSystemFont,"Pretendard","Segoe UI",sans-serif;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:1080px;margin:0 auto;padding:32px 20px 80px;}
header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:28px;flex-wrap:wrap;gap:8px;}
h1{font-size:22px;font-weight:700;letter-spacing:-0.01em;margin:0;}
h1 span{color:var(--gold);}
.updated{font-size:12px;color:var(--muted);}

.hero{
  background:linear-gradient(135deg,var(--card),#1B3050);
  border:1px solid var(--line); border-radius:16px;
  padding:28px 24px; margin-bottom:24px;
}
.hero-label{font-size:12px;color:var(--muted);letter-spacing:.06em;text-transform:uppercase;margin-bottom:8px;}
.hero-num{font-size:40px;font-weight:800;letter-spacing:-0.02em;font-variant-numeric:tabular-nums;}
.hero-sub{font-size:13px;color:var(--muted);margin-top:6px;}
.fire-bar-track{height:10px;border-radius:6px;background:rgba(245,242,234,0.08);margin-top:18px;overflow:hidden;}
.fire-bar-fill{height:100%;background:linear-gradient(90deg,var(--gold),#E8D08A);border-radius:6px;transition:width .6s ease;}
.fire-labels{display:flex;justify-content:space-between;font-size:11px;color:var(--muted);margin-top:6px;}

.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:14px;margin-bottom:24px;}
.stat{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px;}
.stat-label{font-size:12px;color:var(--muted);margin-bottom:6px;}
.stat-num{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums;}
.pos{color:var(--pos);} .neg{color:var(--neg);}

.section-title{font-size:14px;font-weight:700;color:var(--gold);margin:28px 0 10px;letter-spacing:.02em;}
.acc-card{background:var(--card);border:1px solid var(--line);border-radius:12px;margin-bottom:14px;overflow:hidden;}
.acc-head{display:flex;justify-content:space-between;align-items:center;padding:14px 16px;background:rgba(245,242,234,0.03);}
.acc-head b{font-size:14px;}
.acc-head .sum{font-size:14px;font-variant-numeric:tabular-nums;}
table{width:100%;border-collapse:collapse;font-size:13px;}
th{text-align:right;color:var(--muted);font-weight:500;padding:8px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.03em;}
th:first-child,td:first-child{text-align:left;}
td{padding:8px 12px;border-top:1px solid var(--line);font-variant-numeric:tabular-nums;}
tr:hover td{background:rgba(245,242,234,0.02);}
.muted{color:var(--muted);font-size:11px;}
@media(max-width:600px){
  table{font-size:11px;}
  th,td{padding:6px 6px;}
  .hero-num{font-size:30px;}
}
</style>
</head>
<body>
<div class="wrap">
<header>
  <h1>달달 <span>파트너스</span></h1>
  <div class="updated" id="updated">불러오는 중…</div>
</header>
<div id="root">로딩 중…</div>
</div>
<script>
const FIRE_GOAL = 1200000000;
function won(n){ return Math.round(n).toLocaleString('ko-KR'); }
function eok(n){ return (n/100000000).toFixed(2)+'억'; }
function pct(n){ return (n>=0?'+':'')+n.toFixed(1)+'%'; }

async function load(){
  try{
    const [pf, fixed] = await Promise.all([
      fetch('/api/portfolio').then(r=>r.json()),
      fetch('/api/fixed-assets').then(r=>r.json())
    ]);
    render(pf, fixed);
  }catch(e){
    document.getElementById('root').innerHTML = '<p style="color:#E0585F">데이터를 불러오지 못했습니다: '+e.message+'</p>';
  }
}
load();

function render(pf, fixed){
  document.getElementById('updated').textContent =
    '환율 1USD=' + Math.round(pf.fxRate).toLocaleString('ko-KR') + '원 · ' +
    new Date(pf.generatedAt).toLocaleString('ko-KR');

  const mortgage = fixed.find(f=>f.category==='mortgage');
  const realEstate = fixed.find(f=>f.category==='real_estate');
  const fixedTotal = fixed.reduce((s,f)=>s+f.value_krw,0);

  const finValue = pf.items.reduce((s,i)=>s+i.value_krw,0);
  const finCost = pf.items.reduce((s,i)=>s+i.cost_krw,0);
  const finPnl = finValue - finCost;
  const netWorth = finValue + fixedTotal;
  const firePct = Math.min(100, (finValue/FIRE_GOAL)*100);

  let html = '';

  html += '<div class="hero">'
    + '<div class="hero-label">FIRE 목표까지 (금융자산 기준)</div>'
    + '<div class="hero-num">' + eok(finValue) + ' <span style="font-size:18px;color:var(--muted);font-weight:500;">/ ' + eok(FIRE_GOAL) + '</span></div>'
    + '<div class="hero-sub">갭 ' + eok(FIRE_GOAL-finValue) + ' 남음 · 진행률 ' + firePct.toFixed(1) + '%</div>'
    + '<div class="fire-bar-track"><div class="fire-bar-fill" style="width:' + firePct + '%"></div></div>'
    + '<div class="fire-labels"><span>0</span><span>12억</span></div>'
    + '</div>';

  html += '<div class="grid">'
    + stat('순자산 (부동산 포함)', eok(netWorth))
    + stat('금융자산', eok(finValue))
    + stat('금융자산 평가손익', (finPnl>=0?'+':'')+eok(finPnl), finPnl>=0?'pos':'neg')
    + stat('부동산 순가치', eok(fixedTotal))
    + '</div>';

  html += '<div class="section-title">계좌별 보유 현황</div>';
  const byAccount = {};
  pf.items.forEach(i=>{
    (byAccount[i.account_label] = byAccount[i.account_label]||[]).push(i);
  });
  Object.keys(byAccount).forEach(acc=>{
    const rows = byAccount[acc];
    const sum = rows.reduce((s,r)=>s+r.value_krw,0);
    const sumPnl = rows.reduce((s,r)=>s+r.pnl_krw,0);
    html += '<div class="acc-card"><div class="acc-head"><b>' + acc + '</b>'
      + '<span class="sum">' + won(sum) + '원 <span class="' + (sumPnl>=0?'pos':'neg') + '">(' + (sumPnl>=0?'+':'') + won(sumPnl) + ')</span></span></div>'
      + '<table><tr><th>종목</th><th>수량</th><th>평가금액</th><th>손익</th><th>수익률</th></tr>'
      + rows.map(r=>'<tr><td>'+r.name+'</td><td>'+(r.is_cash?'-':r.quantity)+'</td><td>'+won(r.value_krw)+'</td>'
        + '<td class="'+(r.pnl_krw>=0?'pos':'neg')+'">'+(r.pnl_krw>=0?'+':'')+won(r.pnl_krw)+'</td>'
        + '<td class="'+(r.pnl_pct>=0?'pos':'neg')+'">'+pct(r.pnl_pct)+'</td></tr>').join('')
      + '</table></div>';
  });

  if(mortgage || realEstate){
    html += '<div class="section-title">부동산 / 대출</div><div class="acc-card"><table>'
      + '<tr><th>항목</th><th></th><th>가치</th></tr>'
      + fixed.map(f=>'<tr><td>'+f.name+'<div class="muted">'+(f.note||'')+'</div></td><td></td><td class="'+(f.value_krw>=0?'pos':'neg')+'">'+won(f.value_krw)+'</td></tr>').join('')
      + '</table></div>';
  }

  document.getElementById('root').innerHTML = html;
}

function stat(label, val, cls){
  return '<div class="stat"><div class="stat-label">'+label+'</div><div class="stat-num '+(cls||'')+'">'+val+'</div></div>';
}
</script>
</body>
</html>`;
}
