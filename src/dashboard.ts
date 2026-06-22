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

.btn{
  background:var(--gold); color:#16263D; border:none; border-radius:8px;
  padding:8px 14px; font-size:12px; font-weight:700; cursor:pointer;
}
.btn:hover{opacity:.9;}
.btn-ghost{background:transparent;border:1px solid var(--line);color:var(--ink);}
.del-btn{
  background:transparent; border:none; color:var(--muted); cursor:pointer;
  font-size:14px; padding:2px 6px; border-radius:4px;
}
.del-btn:hover{color:var(--neg); background:rgba(224,88,95,0.1);}
.add-row{margin:14px 0;}
.modal-bg{
  position:fixed; inset:0; background:rgba(0,0,0,.6);
  display:none; align-items:center; justify-content:center; z-index:50;
}
.modal-bg.show{display:flex;}
.modal{
  background:var(--card); border:1px solid var(--line); border-radius:14px;
  padding:22px; width:92%; max-width:380px; max-height:88vh; overflow-y:auto;
}
.modal h3{margin:0 0 16px;font-size:15px;color:var(--gold);}
.field{margin-bottom:12px;}
.field label{display:block;font-size:11px;color:var(--muted);margin-bottom:5px;}
.field input,.field select{
  width:100%; background:rgba(245,242,234,0.05); border:1px solid var(--line);
  border-radius:8px; padding:9px 10px; color:var(--ink); font-size:13px;
}
.modal-actions{display:flex;gap:8px;margin-top:18px;}
.modal-actions button{flex:1;padding:10px;border-radius:8px;font-size:13px;font-weight:600;cursor:pointer;}
.cancel-btn{background:transparent;border:1px solid var(--line);color:var(--muted);}
.save-btn{background:var(--gold);border:none;color:#16263D;}
.error-msg{color:var(--neg);font-size:12px;margin-top:8px;}
.chart-wrap{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:18px;margin-bottom:24px;}
.chart-empty{color:var(--muted);font-size:12px;text-align:center;padding:24px 0;}
</style>
</head>
<body>
<div class="wrap">
<header>
  <h1>달달 <span>파트너스</span></h1>
  <div class="updated" id="updated">불러오는 중…</div>
</header>
<div id="root">로딩 중…</div>
<div class="add-row"><button class="btn" onclick="openModal()">+ 종목 추가</button></div>
</div>

<div class="modal-bg" id="modalBg">
  <div class="modal">
    <h3>종목 추가</h3>
    <div class="field"><label>계좌</label>
      <select id="f-account">
        <option value="homerun_wrap|홈런랩">홈런랩</option>
        <option value="mirae_asset|미래에셋">미래에셋</option>
        <option value="dc_pension|DC형퇴직연금(미래에셋대우)">DC형퇴직연금</option>
        <option value="parking|파킹통장">파킹통장</option>
      </select>
    </div>
    <div class="field"><label>시장</label>
      <select id="f-market">
        <option value="KR">국내 (KR)</option>
        <option value="US">해외 (US)</option>
      </select>
    </div>
    <div class="field"><label>종목명</label><input id="f-name" placeholder="예: 삼성전자"></div>
    <div class="field"><label>티커/종목코드 (KR: 6자리, US: 영문)</label><input id="f-ticker" placeholder="예: 005930 또는 AAPL"></div>
    <div class="field"><label>수량</label><input id="f-qty" type="number" step="any" placeholder="0"></div>
    <div class="field"><label>매입 평균단가 (KR=원, US=달러)</label><input id="f-price" type="number" step="any" placeholder="0"></div>
    <div id="modalError"></div>
    <div class="modal-actions">
      <button class="cancel-btn" onclick="closeModal()">취소</button>
      <button class="save-btn" onclick="submitHolding()">저장</button>
    </div>
  </div>
</div>

<script>
const FIRE_GOAL = 1200000000;
function won(n){ return Math.round(n).toLocaleString('ko-KR'); }
function eok(n){ return (n/100000000).toFixed(2)+'억'; }
function pct(n){ return (n>=0?'+':'')+n.toFixed(1)+'%'; }

function openModal(){ document.getElementById('modalBg').classList.add('show'); }
function closeModal(){
  document.getElementById('modalBg').classList.remove('show');
  document.getElementById('modalError').innerHTML = '';
  ['f-name','f-ticker','f-qty','f-price'].forEach(id=>document.getElementById(id).value='');
}

async function submitHolding(){
  const [account, account_label] = document.getElementById('f-account').value.split('|');
  const market = document.getElementById('f-market').value;
  const name = document.getElementById('f-name').value.trim();
  const ticker = document.getElementById('f-ticker').value.trim();
  const quantity = parseFloat(document.getElementById('f-qty').value);
  const avg_price = parseFloat(document.getElementById('f-price').value);
  const currency = market === 'US' ? 'USD' : 'KRW';

  if(!name || !ticker || isNaN(quantity) || isNaN(avg_price)){
    document.getElementById('modalError').innerHTML = '<div class="error-msg">모든 항목을 입력해주세요.</div>';
    return;
  }

  try{
    const res = await fetch('/api/holdings', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ account, account_label, market, ticker, name, quantity, avg_price, currency, is_cash:0, cash_value_krw:0 })
    });
    if(!res.ok) throw new Error('서버 오류');
    closeModal();
    load();
  }catch(e){
    document.getElementById('modalError').innerHTML = '<div class="error-msg">저장 실패: '+e.message+'</div>';
  }
}

async function deleteHolding(id){
  if(!confirm('이 종목을 삭제할까요?')) return;
  await fetch('/api/holdings/'+id, { method:'DELETE' });
  load();
}

async function load(){
  try{
    const [pf, fixed, snapshots] = await Promise.all([
      fetch('/api/portfolio').then(r=>r.json()),
      fetch('/api/fixed-assets').then(r=>r.json()),
      fetch('/api/snapshots').then(r=>r.json())
    ]);
    render(pf, fixed, snapshots);
  }catch(e){
    document.getElementById('root').innerHTML = '<p style="color:#E0585F">데이터를 불러오지 못했습니다: '+e.message+'</p>';
  }
}
load();

function renderChart(snapshots){
  if(!snapshots || snapshots.length < 2){
    return '<div class="chart-wrap"><div class="chart-empty">추이 데이터가 쌓이는 중입니다 (매일 자동 기록, 최소 2일 필요)</div></div>';
  }
  const w = 1000, h = 180, pad = 24;
  const vals = snapshots.map(s=>s.net_worth_krw);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = (max-min) || 1;
  const stepX = (w - pad*2) / (snapshots.length - 1);

  const points = snapshots.map((s,idx)=>{
    const x = pad + idx*stepX;
    const y = pad + (h - pad*2) * (1 - (s.net_worth_krw - min)/range);
    return [x,y];
  });

  const pathD = points.map((p,i)=> (i===0?'M':'L') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
  const areaD = pathD + ' L' + points[points.length-1][0].toFixed(1) + ',' + (h-pad) + ' L' + points[0][0].toFixed(1) + ',' + (h-pad) + ' Z';

  const first = snapshots[0], last = snapshots[snapshots.length-1];
  const change = last.net_worth_krw - first.net_worth_krw;

  return '<div class="chart-wrap">'
    + '<div class="stat-label">순자산 추이 (' + first.date + ' ~ ' + last.date + ')</div>'
    + '<div class="stat-num ' + (change>=0?'pos':'neg') + '" style="margin-bottom:10px;">' + (change>=0?'+':'') + eok(change) + '</div>'
    + '<svg viewBox="0 0 '+w+' '+h+'" style="width:100%;height:140px;display:block;">'
    + '<path d="'+areaD+'" fill="rgba(201,169,97,0.12)" stroke="none"/>'
    + '<path d="'+pathD+'" fill="none" stroke="#C9A961" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
    + '</svg></div>';
}

function render(pf, fixed, snapshots){
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

  html += renderChart(snapshots);

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
      + '<table><tr><th>종목</th><th>수량</th><th>평가금액</th><th>손익</th><th>수익률</th><th></th></tr>'
      + rows.map(r=>'<tr><td>'+r.name+'</td><td>'+(r.is_cash?'-':r.quantity)+'</td><td>'+won(r.value_krw)+'</td>'
        + '<td class="'+(r.pnl_krw>=0?'pos':'neg')+'">'+(r.pnl_krw>=0?'+':'')+won(r.pnl_krw)+'</td>'
        + '<td class="'+(r.pnl_pct>=0?'pos':'neg')+'">'+pct(r.pnl_pct)+'</td>'
        + '<td>'+(r.is_cash?'':'<button class="del-btn" onclick="deleteHolding('+r.id+')">✕</button>')+'</td></tr>').join('')
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
