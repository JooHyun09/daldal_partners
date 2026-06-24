// 달달 파트너스 대시보드 HTML (단일 페이지, vanilla JS)
export function renderDashboard(geminiKeys: [string, string, string]): string {
  const [k1, k2, k3] = geminiKeys;
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
  --gemini:#4A90E2;
}
*{box-sizing:border-box;}
body{
  margin:0; background:var(--bg); color:var(--ink);
  font-family:-apple-system,BlinkMacSystemFont,"Pretendard","Segoe UI",sans-serif;
  -webkit-font-smoothing:antialiased;
}
.wrap{max-width:1080px;margin:0 auto;padding:32px 20px 80px;}
header{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:20px;flex-wrap:wrap;gap:8px;}
h1{font-size:22px;font-weight:700;letter-spacing:-0.01em;margin:0;}
h1 span{color:var(--gold);}
.updated{font-size:12px;color:var(--muted);}

/* ── 탭 ── */
.tabs{display:flex;gap:4px;margin-bottom:24px;border-bottom:1px solid var(--line);padding-bottom:0;}
.tab-btn{
  background:none;border:none;color:var(--muted);cursor:pointer;
  font-size:13px;font-weight:600;padding:8px 16px 10px;
  border-bottom:2px solid transparent;margin-bottom:-1px;
  transition:color .15s,border-color .15s;
}
.tab-btn.active{color:var(--gold);border-bottom-color:var(--gold);}
.tab-panel{display:none;}
.tab-panel.active{display:block;}

/* ── 포트폴리오 기존 스타일 ── */
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

/* ── 콘텐츠 검증 탭 ── */
.yt-input-card{
  background:var(--card);border:1px solid var(--line);border-radius:14px;
  padding:20px;margin-bottom:20px;
}
.yt-input-card label{display:block;font-size:11px;color:var(--muted);font-weight:600;letter-spacing:.08em;margin-bottom:10px;}
.yt-textarea{
  width:100%;min-height:90px;background:rgba(245,242,234,0.04);
  border:1px solid var(--line);border-radius:9px;
  color:var(--ink);font-size:14px;line-height:1.6;
  padding:12px 14px;resize:vertical;outline:none;font-family:inherit;
}
.yt-textarea:focus{border-color:var(--gemini);}
.yt-analyze-btn{
  margin-top:12px;width:100%;padding:12px;
  background:linear-gradient(135deg,#2563eb,#1d4ed8);
  color:#fff;border:none;border-radius:9px;
  font-size:14px;font-weight:700;cursor:pointer;letter-spacing:.03em;
}
.yt-analyze-btn:disabled{background:#1e2533;color:#4b5563;cursor:not-allowed;}
.spinner{
  display:inline-block;width:14px;height:14px;
  border:2px solid #374151;border-top-color:#93c5fd;
  border-radius:50%;animation:spin .7s linear infinite;margin-right:8px;vertical-align:-2px;
}
@keyframes spin{to{transform:rotate(360deg);}}

/* 검증 결과 카드 */
.verdict-banner{
  border-radius:14px;padding:18px 20px;
  display:flex;align-items:center;justify-content:space-between;
  margin-bottom:14px;flex-wrap:wrap;gap:12px;
}
.verdict-banner .v-label-wrap .v-tag{font-size:11px;color:#64748b;font-weight:600;letter-spacing:.1em;margin-bottom:4px;}
.verdict-banner .v-label{font-size:22px;font-weight:800;}
.verdict-banner .v-reason{font-size:13px;color:#94a3b8;max-width:340px;line-height:1.5;}
.result-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;}
@media(max-width:520px){.result-grid{grid-template-columns:1fr;}}
.r-card{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px 18px;}
.r-card-title{font-size:10px;font-weight:700;letter-spacing:.1em;color:#475569;text-transform:uppercase;margin-bottom:12px;}
.checklist-item{display:flex;align-items:flex-start;gap:8px;margin-bottom:8px;}
.checklist-item .ci-icon{font-size:14px;margin-top:1px;flex-shrink:0;}
.checklist-item .ci-text{font-size:13px;font-weight:600;}
.checklist-item .ci-note{font-size:11px;color:#64748b;margin-top:1px;}
.summary-list{list-style:none;margin:0;padding:0 0 0 2px;counter-reset:s;}
.summary-list li{font-size:13px;line-height:1.7;color:#cbd5e1;padding-left:18px;position:relative;margin-bottom:4px;}
.summary-list li::before{content:counter(s)". ";counter-increment:s;position:absolute;left:0;color:var(--muted);}
.portfolio-text{font-size:13px;line-height:1.7;color:#cbd5e1;margin:0;}
.portfolio-text.none{color:#4b5563;}

/* 저장된 검증 기록 */
.cc-item{
  background:var(--card);border:1px solid var(--line);border-radius:12px;
  padding:16px 18px;margin-bottom:12px;display:flex;align-items:flex-start;gap:14px;flex-wrap:wrap;
}
.cc-verdict-dot{
  width:8px;height:8px;border-radius:50%;flex-shrink:0;margin-top:6px;
}
.cc-body{flex:1;min-width:0;}
.cc-header{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;}
.cc-channel{font-size:13px;font-weight:700;}
.cc-type{font-size:11px;color:var(--muted);background:rgba(245,242,234,0.06);padding:2px 8px;border-radius:20px;}
.cc-input{font-size:12px;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:400px;margin-bottom:6px;}
.cc-reason{font-size:12px;color:#94a3b8;line-height:1.5;}
.cc-meta{font-size:11px;color:#4b5563;margin-top:6px;}
.cc-actions{display:flex;gap:6px;flex-shrink:0;}
.apply-btn{
  background:rgba(63,166,107,0.15);border:1px solid rgba(63,166,107,0.4);
  color:#4ade80;font-size:11px;font-weight:600;padding:5px 10px;
  border-radius:6px;cursor:pointer;white-space:nowrap;
}
.apply-btn:disabled{opacity:.4;cursor:not-allowed;}
.apply-btn.done{background:rgba(63,166,107,0.3);color:#86efac;}
.cc-del-btn{
  background:transparent;border:1px solid var(--line);color:var(--muted);
  font-size:11px;padding:5px 9px;border-radius:6px;cursor:pointer;
}
.cc-del-btn:hover{border-color:var(--neg);color:var(--neg);}
.empty-state{text-align:center;padding:48px 0;color:var(--muted);font-size:13px;}
</style>
</head>
<body>
<div class="wrap">
<header>
  <h1>달달 <span>파트너스</span></h1>
  <div class="updated" id="updated">불러오는 중…</div>
</header>

<!-- 탭 -->
<div class="tabs">
  <button class="tab-btn active" onclick="switchTab('portfolio')">📊 포트폴리오</button>
  <button class="tab-btn" onclick="switchTab('checker')">🔍 콘텐츠 검증</button>
  <button class="tab-btn" onclick="switchTab('history')">📋 검증 기록</button>
</div>

<!-- ══ 탭: 포트폴리오 ══ -->
<div class="tab-panel active" id="tab-portfolio">
  <div id="root">로딩 중…</div>
  <div class="add-row"><button class="btn" onclick="openModal()">+ 종목 추가</button></div>
</div>

<!-- ══ 탭: 콘텐츠 검증 ══ -->
<div class="tab-panel" id="tab-checker">
  <div class="yt-input-card">
    <label>유튜브 URL / 영상 제목 / 내용 요약</label>
    <textarea class="yt-textarea" id="yt-input"
      placeholder="예) https://youtube.com/watch?v=...&#10;또는 '삼프로TV - ETF로 FIRE 달성하는 방법' 같은 제목이나 내용을 입력하세요"></textarea>
    <button class="yt-analyze-btn" id="analyzeBtn" onclick="runAnalysis()">🔍 콘텐츠 분석하기</button>
  </div>
  <div id="yt-result"></div>
</div>

<!-- ══ 탭: 검증 기록 ══ -->
<div class="tab-panel" id="tab-history">
  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
    <div class="section-title" style="margin:0;">저장된 검증 기록</div>
    <button class="btn" style="font-size:11px;padding:6px 12px;" onclick="loadHistory()">↺ 새로고침</button>
  </div>
  <div id="history-list">로딩 중…</div>
</div>
</div>

<!-- 종목 추가 모달 -->
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
/* ────────────────────────────────────────────
   공통 유틸
──────────────────────────────────────────── */
const FIRE_GOAL = 1200000000;
function won(n){ return Math.round(n).toLocaleString('ko-KR'); }
function eok(n){ return (n/100000000).toFixed(2)+'억'; }
function pct(n){ return (n>=0?'+':'')+n.toFixed(1)+'%'; }

/* ────────────────────────────────────────────
   탭 전환
──────────────────────────────────────────── */
function switchTab(name){
  document.querySelectorAll('.tab-btn').forEach((b,i)=>{
    const names=['portfolio','checker','history'];
    b.classList.toggle('active', names[i]===name);
  });
  document.querySelectorAll('.tab-panel').forEach(p=>{
    p.classList.toggle('active', p.id==='tab-'+name);
  });
  if(name==='history') loadHistory();
}

/* ────────────────────────────────────────────
   포트폴리오 탭
──────────────────────────────────────────── */
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
      method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ account, account_label, market, ticker, name, quantity, avg_price, currency, is_cash:0, cash_value_krw:0 })
    });
    if(!res.ok) throw new Error('서버 오류');
    closeModal(); load();
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
  const w=1000,h=180,pad=24;
  const vals=snapshots.map(s=>s.net_worth_krw);
  const min=Math.min(...vals),max=Math.max(...vals);
  const range=(max-min)||1;
  const stepX=(w-pad*2)/(snapshots.length-1);
  const points=snapshots.map((s,idx)=>{
    const x=pad+idx*stepX;
    const y=pad+(h-pad*2)*(1-(s.net_worth_krw-min)/range);
    return [x,y];
  });
  const pathD=points.map((p,i)=>(i===0?'M':'L')+p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ');
  const areaD=pathD+' L'+points[points.length-1][0].toFixed(1)+','+(h-pad)+' L'+points[0][0].toFixed(1)+','+(h-pad)+' Z';
  const first=snapshots[0],last=snapshots[snapshots.length-1];
  const change=last.net_worth_krw-first.net_worth_krw;
  return '<div class="chart-wrap">'
    +'<div class="stat-label">순자산 추이 ('+first.date+' ~ '+last.date+')</div>'
    +'<div class="stat-num '+(change>=0?'pos':'neg')+'" style="margin-bottom:10px;">'+(change>=0?'+':'')+eok(change)+'</div>'
    +'<svg viewBox="0 0 '+w+' '+h+'" style="width:100%;height:140px;display:block;">'
    +'<path d="'+areaD+'" fill="rgba(201,169,97,0.12)" stroke="none"/>'
    +'<path d="'+pathD+'" fill="none" stroke="#C9A961" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>'
    +'</svg></div>';
}

function render(pf, fixed, snapshots){
  document.getElementById('updated').textContent =
    '환율 1USD='+Math.round(pf.fxRate).toLocaleString('ko-KR')+'원 · '+
    new Date(pf.generatedAt).toLocaleString('ko-KR');

  const fixedTotal=fixed.reduce((s,f)=>s+f.value_krw,0);
  const finValue=pf.items.reduce((s,i)=>s+i.value_krw,0);
  const finCost=pf.items.reduce((s,i)=>s+i.cost_krw,0);
  const finPnl=finValue-finCost;
  const netWorth=finValue+fixedTotal;
  const firePct=Math.min(100,(finValue/FIRE_GOAL)*100);

  let html='';
  html+='<div class="hero">'
    +'<div class="hero-label">FIRE 목표까지 (금융자산 기준)</div>'
    +'<div class="hero-num">'+eok(finValue)+' <span style="font-size:18px;color:var(--muted);font-weight:500;">/ '+eok(FIRE_GOAL)+'</span></div>'
    +'<div class="hero-sub">갭 '+eok(FIRE_GOAL-finValue)+' 남음 · 진행률 '+firePct.toFixed(1)+'%</div>'
    +'<div class="fire-bar-track"><div class="fire-bar-fill" style="width:'+firePct+'%"></div></div>'
    +'<div class="fire-labels"><span>0</span><span>12억</span></div>'
    +'</div>';
  html+=renderChart(snapshots);
  html+='<div class="grid">'
    +stat('순자산 (부동산 포함)',eok(netWorth))
    +stat('금융자산',eok(finValue))
    +stat('금융자산 평가손익',(finPnl>=0?'+':'')+eok(finPnl),finPnl>=0?'pos':'neg')
    +stat('부동산 순가치',eok(fixedTotal))
    +'</div>';
  html+='<div class="section-title">계좌별 보유 현황</div>';
  const byAccount={};
  pf.items.forEach(i=>{ (byAccount[i.account_label]=byAccount[i.account_label]||[]).push(i); });
  Object.keys(byAccount).forEach(acc=>{
    const rows=byAccount[acc];
    const sum=rows.reduce((s,r)=>s+r.value_krw,0);
    const sumPnl=rows.reduce((s,r)=>s+r.pnl_krw,0);
    html+='<div class="acc-card"><div class="acc-head"><b>'+acc+'</b>'
      +'<span class="sum">'+won(sum)+'원 <span class="'+(sumPnl>=0?'pos':'neg')+'">('+( sumPnl>=0?'+':'')+won(sumPnl)+')</span></span></div>'
      +'<table><tr><th>종목</th><th>수량</th><th>평가금액</th><th>손익</th><th>수익률</th><th></th></tr>'
      +rows.map(r=>'<tr><td>'+r.name+'</td><td>'+(r.is_cash?'-':r.quantity)+'</td><td>'+won(r.value_krw)+'</td>'
        +'<td class="'+(r.pnl_krw>=0?'pos':'neg')+'">'+(r.pnl_krw>=0?'+':'')+won(r.pnl_krw)+'</td>'
        +'<td class="'+(r.pnl_pct>=0?'pos':'neg')+'">'+pct(r.pnl_pct)+'</td>'
        +'<td>'+(r.is_cash?'':`<button class="del-btn" onclick="deleteHolding(${r.id})">✕</button>`)+'</td></tr>').join('')
      +'</table></div>';
  });
  const mortgage=fixed.find(f=>f.category==='mortgage');
  const realEstate=fixed.find(f=>f.category==='real_estate');
  if(mortgage||realEstate){
    html+='<div class="section-title">부동산 / 대출</div><div class="acc-card"><table>'
      +'<tr><th>항목</th><th></th><th>가치</th></tr>'
      +fixed.map(f=>'<tr><td>'+f.name+'<div class="muted">'+(f.note||'')+'</div></td><td></td><td class="'+(f.value_krw>=0?'pos':'neg')+'">'+won(f.value_krw)+'</td></tr>').join('')
      +'</table></div>';
  }
  document.getElementById('root').innerHTML=html;
}
function stat(label,val,cls){
  return '<div class="stat"><div class="stat-label">'+label+'</div><div class="stat-num '+(cls||'')+'\">'+val+'</div></div>';
}

/* ────────────────────────────────────────────
   콘텐츠 검증 탭 — Gemini API
──────────────────────────────────────────── */
const GEMINI_KEYS = [
  "${k1}",
  "${k2}",
  "${k3}"
];
let geminiKeyIdx = 0;

const GEMINI_SYSTEM = \`당신은 '달달 파트너스'의 유튜브 콘텐츠 검증 AI입니다.

[달달 파트너스 투자 원칙]
- 투자 목적: FIRE (경제적 자유/조기 은퇴, 10~20년 목표)
- 투자 스타일: 장기(1년 이상), 수익과 안정의 균형
- 절대 금지: 뇌동매매, 단일 종목 20% 초과 투자, 모르는 종목 추종
- 신뢰 채널 (⭐⭐⭐): 삼프로TV, 수페TV, 소수몽키, ETF아는형
- 참고 채널 (⭐⭐): 테이버, 매일경제MK, 김작가TV

아래 입력된 유튜브 콘텐츠를 분석하여 반드시 아래 JSON 형식으로만 응답하세요. 마크다운 코드블록 없이 순수 JSON만 출력하세요.

{
  "channel_trust": { "name": "채널명", "stars": 0, "grade": "신뢰|참고|미등록", "badge": "⭐⭐⭐|⭐⭐|-" },
  "content_type": { "label": "단기투기|장기투자|정보성|동기부여", "icon": "🔴|🟢|🔵|🟡" },
  "checklist": [
    { "item": "FIRE 목표 부합", "pass": true, "note": "한줄 설명" },
    { "item": "장기 관점 유지", "pass": true, "note": "한줄 설명" },
    { "item": "뇌동매매 위험 없음", "pass": true, "note": "한줄 설명" },
    { "item": "분산투자 원칙 준수", "pass": true, "note": "한줄 설명" },
    { "item": "이해 가능한 종목/전략", "pass": true, "note": "한줄 설명" }
  ],
  "summary": ["요약1", "요약2", "요약3"],
  "portfolio_points": "포트폴리오 적용 포인트 또는 해당 없음",
  "verdict": { "label": "적용|참고|무시", "color": "green|yellow|red", "reason": "판단 이유" }
}\`;

async function callGemini(prompt, attempt=0){
  if(attempt >= GEMINI_KEYS.length) return null;
  const key = GEMINI_KEYS[(geminiKeyIdx + attempt) % GEMINI_KEYS.length];
  try{
    const res = await fetch(
      \`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=\${key}\`,
      { method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          contents:[{parts:[{text: GEMINI_SYSTEM + '\\n\\n입력: ' + prompt}]}],
          generationConfig:{maxOutputTokens:1000, temperature:0.3}
        })
      }
    );
    if(res.status===429) return callGemini(prompt, attempt+1);
    if(!res.ok) throw new Error('HTTP '+res.status);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || null;
  }catch(e){ return callGemini(prompt, attempt+1); }
}

const VERDICT_STYLE = {
  green: { bg:'#0d2e1a', border:'#22c55e', color:'#4ade80', label:'✅ 적용' },
  yellow:{ bg:'#2a1f00', border:'#f59e0b', color:'#fbbf24', label:'⚠️ 참고' },
  red:   { bg:'#2a0a0a', border:'#ef4444', color:'#f87171', label:'🚫 무시' }
};

async function runAnalysis(){
  const input = document.getElementById('yt-input').value.trim();
  if(!input) return;
  const btn = document.getElementById('analyzeBtn');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span>분석 중...';
  document.getElementById('yt-result').innerHTML = '';

  const raw = await callGemini(input);
  geminiKeyIdx = (geminiKeyIdx + 1) % GEMINI_KEYS.length;
  btn.disabled = false;
  btn.innerHTML = '🔍 콘텐츠 분석하기';

  if(!raw){
    document.getElementById('yt-result').innerHTML =
      '<div style="background:#2a0a0a;border:1px solid #7f1d1d;border-radius:10px;padding:14px;color:#f87171;font-size:13px;">⚠️ 잠시 후 다시 시도해주세요. API 요청 한도에 도달했습니다.</div>';
    return;
  }

  let result;
  try{ result = JSON.parse(raw.replace(/\`\`\`json|\`\`\`/g,'').trim()); }
  catch{
    document.getElementById('yt-result').innerHTML =
      '<div style="background:#2a0a0a;border:1px solid #7f1d1d;border-radius:10px;padding:14px;color:#f87171;font-size:13px;">응답 파싱에 실패했습니다. 다시 시도해주세요.</div>';
    return;
  }

  renderResult(result, input);

  // DB 자동 저장
  const passCount = result.checklist.filter(c=>c.pass).length;
  await fetch('/api/content-checks', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      input_text: input,
      channel_name: result.channel_trust?.name,
      channel_grade: result.channel_trust?.grade,
      channel_stars: result.channel_trust?.stars,
      content_type: result.content_type?.label,
      checklist_pass: passCount,
      checklist_total: result.checklist.length,
      summary: JSON.stringify(result.summary),
      portfolio_points: result.portfolio_points,
      verdict: result.verdict?.label,
      verdict_reason: result.verdict?.reason,
      raw_result: JSON.stringify(result)
    })
  });
}

function renderResult(r, inputText){
  const v = VERDICT_STYLE[r.verdict.color] || VERDICT_STYLE.yellow;
  const passCount = r.checklist.filter(c=>c.pass).length;

  let html = '';

  // 판단 배너
  html += \`<div class="verdict-banner" style="background:\${v.bg};border:1px solid \${v.border};">
    <div class="v-label-wrap">
      <div class="v-tag">최종 판단</div>
      <div class="v-label" style="color:\${v.color};">\${v.label}</div>
    </div>
    <div class="v-reason">\${r.verdict.reason}</div>
  </div>\`;

  // 채널 + 콘텐츠 유형
  html += '<div class="result-grid">';
  html += \`<div class="r-card">
    <div class="r-card-title">채널 신뢰도</div>
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="font-size:22px;">\${r.channel_trust.badge||'-'}</span>
      <div>
        <div style="font-weight:700;font-size:15px;">\${r.channel_trust.name}</div>
        <div style="font-size:12px;color:\${r.channel_trust.grade==='신뢰'?'#4ade80':r.channel_trust.grade==='참고'?'#fbbf24':'#94a3b8'};">\${r.channel_trust.grade}</div>
      </div>
    </div>
  </div>\`;
  html += \`<div class="r-card">
    <div class="r-card-title">콘텐츠 성격</div>
    <div style="display:flex;align-items:center;gap:10px;">
      <span style="font-size:26px;">\${r.content_type.icon}</span>
      <div style="font-weight:700;font-size:15px;">\${r.content_type.label}</div>
    </div>
    <div style="margin-top:10px;font-size:12px;color:#64748b;">체크리스트 \${passCount}/\${r.checklist.length} 통과</div>
  </div>\`;
  html += '</div>';

  // 체크리스트
  html += '<div class="r-card" style="margin-bottom:12px;"><div class="r-card-title">달달 원칙 체크리스트</div>';
  r.checklist.forEach(c=>{
    html += \`<div class="checklist-item">
      <span class="ci-icon">\${c.pass?'✅':'❌'}</span>
      <div><div class="ci-text">\${c.item}</div><div class="ci-note">\${c.note}</div></div>
    </div>\`;
  });
  html += '</div>';

  // 요약
  html += '<div class="result-grid">';
  html += '<div class="r-card"><div class="r-card-title">핵심 내용 요약</div><ol class="summary-list">';
  r.summary.forEach(s=>{ html += '<li>'+s+'</li>'; });
  html += '</ol></div>';

  // 포트폴리오 포인트
  const isNone = r.portfolio_points === '해당 없음';
  html += \`<div class="r-card"><div class="r-card-title">포트폴리오 적용 포인트</div>
    <p class="portfolio-text\${isNone?' none':''}">\${isNone?'⚪ 현재 포트폴리오에 직접 적용할 내용이 없습니다.':'💡 '+r.portfolio_points}</p>
  </div>\`;
  html += '</div>';

  document.getElementById('yt-result').innerHTML = html;
}

/* ────────────────────────────────────────────
   검증 기록 탭
──────────────────────────────────────────── */
async function loadHistory(){
  const el = document.getElementById('history-list');
  el.innerHTML = '<div style="color:var(--muted);font-size:13px;padding:20px 0;">불러오는 중…</div>';
  try{
    const items = await fetch('/api/content-checks').then(r=>r.json());
    if(!items.length){
      el.innerHTML = '<div class="empty-state">아직 검증 기록이 없습니다.<br>콘텐츠 검증 탭에서 분석을 시작해보세요 🔍</div>';
      return;
    }
    const VDOT = {적용:'#22c55e', 참고:'#f59e0b', 무시:'#ef4444'};
    el.innerHTML = items.map(item=>{
      const dotColor = VDOT[item.verdict] || '#64748b';
      const applied = item.applied_to_portfolio===1;
      const summaryArr = tryParseArr(item.summary);
      return \`<div class="cc-item" id="cc-\${item.id}">
        <div class="cc-verdict-dot" style="background:\${dotColor};"></div>
        <div class="cc-body">
          <div class="cc-header">
            <span class="cc-channel">\${item.channel_name||'채널 미상'}</span>
            <span class="cc-type">\${item.content_type||'-'}</span>
            <span style="font-size:12px;color:\${dotColor};font-weight:700;">\${item.verdict||'-'}</span>
          </div>
          <div class="cc-input" title="\${item.input_text}">\${item.input_text}</div>
          \${item.verdict_reason?'<div class="cc-reason">'+item.verdict_reason+'</div>':''}
          \${summaryArr.length?'<div style="margin-top:6px;">'+summaryArr.map((s,i)=>'<div style="font-size:11px;color:#64748b;line-height:1.6;">'+(i+1)+'. '+s+'</div>').join('')+'</div>':''}
          <div class="cc-meta">\${item.created_at?.slice(0,16).replace('T',' ')||''} · 체크리스트 \${item.checklist_pass}/\${item.checklist_total}</div>
        </div>
        <div class="cc-actions">
          <button class="apply-btn\${applied?' done':''}" id="applyBtn-\${item.id}"
            onclick="applyToPortfolio(\${item.id})" \${applied?'disabled':''}>
            \${applied?'✅ 반영됨':'📌 포트폴리오에 반영'}
          </button>
          <button class="cc-del-btn" onclick="deleteCheck(\${item.id})">✕</button>
        </div>
      </div>\`;
    }).join('');
  }catch(e){
    el.innerHTML = '<div style="color:var(--neg);font-size:13px;">불러오기 실패: '+e.message+'</div>';
  }
}

function tryParseArr(str){
  try{ const a=JSON.parse(str); return Array.isArray(a)?a:[]; }catch{ return []; }
}

async function applyToPortfolio(id){
  const btn = document.getElementById('applyBtn-'+id);
  if(!btn || btn.disabled) return;
  btn.disabled = true;
  btn.textContent = '반영 중…';
  try{
    await fetch('/api/content-checks/'+id+'/apply', { method:'PATCH' });
    btn.textContent = '✅ 반영됨';
    btn.classList.add('done');
  }catch(e){
    btn.disabled = false;
    btn.textContent = '📌 포트폴리오에 반영';
    alert('반영 실패: '+e.message);
  }
}

async function deleteCheck(id){
  if(!confirm('이 검증 기록을 삭제할까요?')) return;
  await fetch('/api/content-checks/'+id, { method:'DELETE' });
  loadHistory();
}
</script>
</body>
</html>\`;
}
