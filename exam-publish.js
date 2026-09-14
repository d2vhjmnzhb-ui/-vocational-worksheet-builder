(() => {
'use strict';

const EXAM_API_URL='https://script.google.com/macros/s/AKfycbxunyrg12A_Fv4fM-6GZZ4rVXz07-EN_rRGsTbBQZmsLcjFnLeLgNX3t-vyHH8d7Xfqgw/exec';
const STUDENT_EXAM_URL='./student-exam.html';
const $=id=>document.getElementById(id);
const txt=el=>(el?.textContent||'').trim();
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const css=document.createElement('style');
css.textContent=`
.exam-publish-btn,.exam-results-btn{width:100%;justify-content:center;color:#fff!important;padding:12px!important;margin-top:9px!important}
.exam-publish-btn{background:linear-gradient(135deg,#0e7490,#2563eb)!important}
.exam-results-btn{background:linear-gradient(135deg,#7c3aed,#db2777)!important}
.exam-backdrop{position:fixed;inset:0;background:#071a2ccc;display:none;align-items:center;justify-content:center;z-index:99999;padding:14px}.exam-backdrop.open{display:flex}
.exam-modal{width:min(920px,100%);max-height:94vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 80px #0004;padding:20px;color:#16324f}
.exam-modal h2,.exam-modal h3{margin-top:0}.exam-muted{color:#64748b;font-size:.88rem}
.exam-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.exam-field{margin:10px 0}.exam-field label{display:block;font-size:.86rem;font-weight:700;margin-bottom:5px}
.exam-field input,.exam-field select,.grade-input{width:100%;padding:10px 11px;border:1px solid #cfdce6;border-radius:10px;font:inherit}
.exam-actions{display:flex;gap:9px;justify-content:flex-end;flex-wrap:wrap;margin-top:16px}
.exam-actions button,.exam-copy,.exam-mini{border:0;border-radius:10px;padding:10px 14px;font-weight:700;cursor:pointer}
.exam-cancel{background:#e8eef3;color:#365164}.exam-confirm{background:#0f6097;color:#fff}.exam-secondary{background:#ede9fe;color:#5b21b6}
.exam-result{margin-top:14px;padding:12px;border-radius:11px;background:#eff8fd;border:1px solid #b9dced;display:none;word-break:break-word}
.exam-copy{margin-top:8px;background:#e0f2fe;color:#075985}
.exam-toolbar{display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-bottom:12px}
.exam-toolbar .exam-field{margin:0;min-width:220px;flex:1}
.exam-table-wrap{overflow:auto;border:1px solid #dbe7ef;border-radius:12px}
.exam-table{width:100%;border-collapse:collapse;font-size:.88rem;min-width:760px}
.exam-table th,.exam-table td{padding:9px 10px;border-bottom:1px solid #e8eef3;text-align:left;white-space:nowrap}
.exam-table th{background:#edf6ff;position:sticky;top:0}
.exam-mini{padding:7px 10px;background:#e0f2fe;color:#075985}
.exam-mini.pink{background:#ffe4ee;color:#9d174d}
.exam-detail{margin-top:15px;border-top:1px dashed #cbd5e1;padding-top:15px}
.answer-card{border:1px solid #dbe7ef;border-radius:12px;padding:12px;margin:10px 0;background:#fbfdff}
.answer-card .student-answer{white-space:pre-wrap;background:#fff;border-radius:9px;padding:9px;margin-top:7px;border:1px solid #edf2f7}
.answer-key{background:#eff8ff;border:1px solid #bfdbfe;border-radius:10px;padding:9px;margin-top:7px}
.grade-row{display:grid;grid-template-columns:1fr 110px;gap:10px;align-items:center;margin-top:8px}
.badge-status{display:inline-block;border-radius:999px;padding:4px 8px;font-size:.75rem;font-weight:800;background:#ecfdf5;color:#047857}
.badge-wait{background:#fff7ed;color:#c2410c}
.published-list{display:grid;gap:10px;margin-top:14px}.published-card{border:1px solid #dbe7ef;border-radius:14px;padding:13px;background:#fff}.published-top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.published-title{font-weight:800;font-size:1rem}.published-id{font-size:.78rem;color:#64748b;margin-top:3px;word-break:break-all}.published-meta{display:flex;gap:8px;flex-wrap:wrap;margin-top:9px}.published-pill{font-size:.78rem;padding:4px 8px;border-radius:999px;background:#eef6fb;color:#31536a}.published-pill.open{background:#dcfce7;color:#166534}.published-pill.closed{background:#f1f5f9;color:#475569}.published-actions{display:flex;gap:7px;flex-wrap:wrap;margin-top:11px}.exam-mini.danger{background:#fee2e2;color:#991b1b}.exam-mini.warning{background:#fff7ed;color:#9a3412}.exam-mini.success{background:#dcfce7;color:#166534}.published-empty{padding:28px;text-align:center;color:#64748b;border:1px dashed #cbd5e1;border-radius:14px}.exam-danger-note{background:#fff7ed;border:1px solid #fed7aa;color:#9a3412;border-radius:11px;padding:10px 12px;font-size:.86rem;margin:8px 0}
@media(max-width:650px){.exam-grid{grid-template-columns:1fr}.exam-modal{padding:16px}.grade-row{grid-template-columns:1fr}.published-top{display:block}}
`;document.head.appendChild(css);

function getMeta(id,fallback=''){const el=$(id);return el?String(el.value||'').trim():fallback}
function cleanChoice(s){return String(s).replace(/^\s*[กขคง]\s*[.)]\s*/,'').trim()}
function getQuestionText(li){const c=li.cloneNode(true);c.querySelectorAll('.question-topic,.choices,.answer,.answer-lines,.answer-inline,.question-visual').forEach(x=>x.remove());return txt(c).replace(/^\s*\d+\s*[.)]\s*/,'').trim()}
function cleanAnswerText(s){return String(s||'').replace(/^(?:เฉลย(?:\/แนวคำตอบ)?|แนวคำตอบ|คำตอบ)\s*[:：]?\s*/i,'').trim()}

function isNoiseQuestion(q){
  const s=String(q||'').trim();
  if(!s)return true;
  const bad=[
    /^กรุณาเพิ่มเนื้อหา/i,
    /^กรุณาเลือก/i,
    /^กรุณากรอก/i,
    /^ยังไม่มี/i,
    /^ไม่พบ/i,
    /^คำชี้แจง/i,
    /^หมายเหตุ/i,
    /^ตัวอย่าง/i,
    /^เนื้อหาที่เลือก/i,
    /^สร้าง\/อัปเดต/i
  ];
  return bad.some(rx=>rx.test(s));
}

function readQuestions(){
  const bank=window.onlineExamBank?.questions?.()||[];
  return bank.map(q=>q.type==='text'
    ? {type:'text',q:String(q.q||''),modelAnswer:String(q.modelAnswer||''),points:Number(q.points||1)}
    : {type:'mcq',q:String(q.q||''),choices:{...(q.choices||{})},answer:String(q.answer||''),points:Number(q.points||1)}
  ).filter(q=>q.q.trim());
}

function jsonp(params,timeout=25000){
  return new Promise((resolve,reject)=>{
    const cb='__teachcb_'+Date.now()+'_'+Math.random().toString(36).slice(2);
    const s=document.createElement('script');s.charset='UTF-8';
    const t=setTimeout(()=>done(new Error('เชื่อมต่อระบบช้าเกินไป')),timeout);
    function done(err,data){clearTimeout(t);try{delete window[cb]}catch(_){window[cb]=undefined}s.remove();err?reject(err):resolve(data)}
    window[cb]=data=>done(null,data);
    const u=new URL(EXAM_API_URL);
    Object.entries({...params,callback:cb,_t:Date.now()}).forEach(([k,v])=>u.searchParams.set(k,typeof v==='object'?JSON.stringify(v):String(v)));
    s.onerror=()=>done(new Error('เชื่อมต่อระบบไม่สำเร็จ'));
    s.src=u.href;document.head.appendChild(s);
  });
}
async function api(params,retries=2){let e;for(let i=0;i<=retries;i++){try{const d=await jsonp(params);if(!d?.ok)throw new Error(d?.message||d?.errorCode||'ไม่สำเร็จ');return d}catch(x){e=x;if(i<retries)await new Promise(r=>setTimeout(r,700*(i+1)))}}throw e}
function makeExamId(){const a=new Uint8Array(6);crypto.getRandomValues(a);return 'EX_'+[...a].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase()}
async function createExamNoCors(payload){
  await fetch(EXAM_API_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
  for(let i=0;i<16;i++){await new Promise(r=>setTimeout(r,500));const d=await jsonp({action:'getExam',examId:payload.examId}).catch(()=>null);if(d&&d.ok)return d}
  throw new Error('บันทึกข้อสอบไม่สำเร็จ กรุณาลองอีกครั้ง');
}
async function postCommandNoCors(payload,verify){
  await fetch(EXAM_API_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});
  for(let i=0;i<18;i++){
    await new Promise(r=>setTimeout(r,450));
    const d=await jsonp({action:'listExams'}).catch(()=>null);
    if(d&&d.ok&&(!verify||verify(d)))return d;
  }
  throw new Error('เซิร์ฟเวอร์ยังไม่ยืนยันการเปลี่ยนแปลง กรุณารีเฟรชแล้วตรวจอีกครั้ง');
}

function addButtons(){
  if($('publishExamBtn'))return;
  const ref=$('generateBtn'); if(!ref)return;
  const p=document.createElement('button');p.type='button';p.id='publishExamBtn';p.className='btn generate exam-publish-btn';p.textContent='▶ เผยแพร่เป็นข้อสอบออนไลน์';
  ref.insertAdjacentElement('afterend',p);p.onclick=openPublish;
  const r=document.createElement('button');r.type='button';r.id='examResultsBtn';r.className='btn generate exam-results-btn';r.textContent='📊 ผลการสอบออนไลน์';
  p.insertAdjacentElement('afterend',r);r.onclick=openResults;
}

const pub=document.createElement('div');pub.className='exam-backdrop';pub.innerHTML=`<div class="exam-modal">
<h2>เผยแพร่เป็นข้อสอบออนไลน์</h2><p class="exam-muted" id="examDetected"></p>
<div class="exam-field"><label>ชื่อชุดข้อสอบ</label><input id="onlineExamTitle"></div>
<div class="exam-grid"><div class="exam-field"><label>เวลาสอบ (นาที)</label><input id="onlineExamMinutes" type="number" min="1" max="300" value="50"></div><div class="exam-field"><label>เหตุการณ์เสี่ยงครบกี่ครั้ง</label><input id="onlineExamMaxLeave" type="number" min="1" max="20" value="3"></div></div>
<div class="exam-grid"><div class="exam-field"><label>โหมดการสอบ</label><select id="onlineExamGuard"><option value="guard" selected>โหมดคุมสอบ (แนะนำ)</option><option value="normal">โหมดปกติ</option></select></div><div class="exam-field"><label>เมื่อพบพฤติกรรมเสี่ยงครบจำนวน</label><select id="onlineExamRiskAction"><option value="submit" selected>ส่งข้อสอบอัตโนมัติเมื่อครบจำนวน</option><option value="warn">บันทึกและเตือน — ให้ครูตรวจภายหลัง</option></select></div></div>
<div id="examGuardOptions" style="padding:12px;border:1px solid #dbeafe;background:#f8fbff;border-radius:12px;margin:8px 0 12px">
  <div style="font-weight:800;margin-bottom:8px">การป้องกันในโหมดคุมสอบ</div>
  <div class="exam-grid">
    <div class="exam-field"><label>สุ่มลำดับคำถาม</label><select id="onlineExamShuffleQ"><option value="yes" selected>สุ่ม</option><option value="no">ไม่สุ่ม</option></select></div>
    <div class="exam-field"><label>สุ่มลำดับตัวเลือก</label><select id="onlineExamShuffleC"><option value="yes" selected>สุ่ม</option><option value="no">ไม่สุ่ม</option></select></div>
  </div>
  <div class="exam-grid">
    <div class="exam-field"><label>ขอแสดงเต็มจอเมื่อเริ่มสอบ</label><select id="onlineExamFullscreen"><option value="yes" selected>เปิด</option><option value="no">ปิด</option></select></div>
    <div class="exam-field"><label>ตรวจ Split Screen / สลับโฟกัส</label><select id="onlineExamSplit"><option value="yes" selected>ตรวจ</option><option value="no">ไม่ตรวจ</option></select></div>
  </div>
  <div class="exam-muted">ระบบตรวจได้แบบ best-effort ตามที่เบราว์เซอร์อนุญาต จึงบันทึกเป็นสัญญาณให้ครูตรวจ ไม่ถือว่าเป็นหลักฐานโกงโดยอัตโนมัติ</div>
</div>
<div class="exam-grid"><div class="exam-field"><label>แสดงคะแนนหลังส่ง</label><select id="onlineExamShowScore"><option value="yes">แสดง</option><option value="no">ไม่แสดง</option></select></div><div class="exam-field"><label>การเข้าสอบ</label><select id="onlineExamOneAttempt"><option value="yes">1 ครั้งต่อรหัสนักเรียน</option><option value="no">อนุญาตหลายครั้ง</option></select></div></div>
<div class="exam-field"><label>เฉลยหลังส่งข้อสอบ</label><select id="onlineExamAllowReview"><option value="no">ไม่แสดง</option><option value="yes">ให้นักเรียนดูเฉลย/แนวคำตอบหลังส่ง</option></select></div>
<div class="exam-result" id="onlineExamResult"></div>
<div class="exam-actions"><button class="exam-cancel" id="pubClose">ปิด</button><button class="exam-confirm" id="pubGo">เผยแพร่</button></div>
</div>`;document.body.appendChild(pub);
$('pubClose').onclick=()=>pub.classList.remove('open');pub.onclick=e=>{if(e.target===pub)pub.classList.remove('open')};
$('onlineExamGuard').onchange=()=>{$('examGuardOptions').style.display=$('onlineExamGuard').value==='guard'?'block':'none';};

function openPublish(){
  const qs=readQuestions(), mcq=qs.filter(x=>x.type==='mcq').length, text=qs.length-mcq;
  const r=$('onlineExamResult');r.style.display='none';r.innerHTML='';
  $('onlineExamTitle').value=getMeta('customTitle')||`${getMeta('subject','ข้อสอบ')} - ${getMeta('topic')}`.replace(/\s+-\s*$/,'');
  $('examDetected').textContent=`คลังข้อสอบออนไลน์ ${qs.length} ข้อ • ปรนัย ${mcq} ข้อ • ถาม–ตอบ ${text} ข้อ`;
  if(!qs.length){r.style.display='block';r.textContent='ยังไม่พบคำถามในเอกสาร กรุณาสร้างข้อสอบก่อน';}
  pub.classList.add('open');
}

$('pubGo').onclick=async()=>{
  const result=$('onlineExamResult'),btn=$('pubGo');
  try{
    const questions=readQuestions();if(!questions.length)throw new Error('ไม่พบคำถาม');
    const title=$('onlineExamTitle').value.trim();if(!title)throw new Error('กรุณาใส่ชื่อชุดข้อสอบ');
    btn.disabled=true;btn.textContent='กำลังเผยแพร่...';result.style.display='block';result.textContent='กำลังบันทึกข้อสอบ...';
    const examId=makeExamId();
    const d=await createExamNoCors({
      action:'createExam',examId,title,
      subject:getMeta('subject'),code:getMeta('code'),level:getMeta('level'),year:getMeta('year'),topic:getMeta('topic'),
      duration:+$('onlineExamMinutes').value||50,maxLeave:+$('onlineExamMaxLeave').value||3,
      showScore:$('onlineExamShowScore').value==='yes',
      oneAttempt:$('onlineExamOneAttempt').value==='yes',
      allowReview:$('onlineExamAllowReview').value==='yes',
      questions
    });
    const finalExamId=d?.exam?.examId||d?.examId||examId;
    const u=new URL(STUDENT_EXAM_URL,location.href);
    u.searchParams.set('exam',finalExamId);
    if($('onlineExamGuard').value==='guard'){
      u.searchParams.set('guard','1');
      u.searchParams.set('shuffleQ',$('onlineExamShuffleQ').value==='yes'?'1':'0');
      u.searchParams.set('shuffleC',$('onlineExamShuffleC').value==='yes'?'1':'0');
      u.searchParams.set('full',$('onlineExamFullscreen').value==='yes'?'1':'0');
      u.searchParams.set('split',$('onlineExamSplit').value==='yes'?'1':'0');
      u.searchParams.set('risk',$('onlineExamRiskAction').value);
    }
    const link=u.href;
    const guardLabel=$('onlineExamGuard').value==='guard'?'<br><span style="color:#166534">โหมดคุมสอบ: สุ่มข้อ/ช้อยส์ + ตรวจออกจากหน้า/Split Screen ตามค่าที่เลือก</span>':'';
    result.innerHTML=`<b>เผยแพร่สำเร็จ</b><br>รหัสข้อสอบ: <b>${esc(finalExamId)}</b>${guardLabel}<br><a href="${esc(link)}" target="_blank">เปิดลิงก์นักเรียน</a><br><button class="exam-copy" id="copyExamLink">คัดลอกลิงก์</button>`;
    $('copyExamLink').onclick=async()=>{await navigator.clipboard.writeText(link);$('copyExamLink').textContent='คัดลอกแล้ว ✓'};
  }catch(e){result.style.display='block';result.textContent='ไม่สำเร็จ: '+e.message}
  finally{btn.disabled=false;btn.textContent='เผยแพร่'}
};

const res=document.createElement('div');res.className='exam-backdrop';res.innerHTML=`<div class="exam-modal">
<h2>ผลการสอบออนไลน์</h2>
<div class="exam-toolbar">
  <div class="exam-field"><label>เลือกชุดข้อสอบ</label><select id="resultExamSelect"><option>กำลังโหลด...</option></select></div>
  <button class="exam-confirm exam-mini" id="resultRefresh">รีเฟรชผลสอบ</button>
  <button class="exam-secondary exam-mini" id="showAnswerKey">ดูเฉลยชุดนี้</button>
</div>
<div id="resultSummary" class="exam-muted"></div>
<div class="exam-table-wrap"><table class="exam-table"><thead><tr><th>รหัส</th><th>ชื่อ–สกุล</th><th>สถานะ</th><th>คะแนนปรนัย</th><th>คะแนนถามตอบ</th><th>คะแนนรวม</th><th>เหตุการณ์เสี่ยง</th><th></th></tr></thead><tbody id="resultBody"></tbody></table></div>
<div class="exam-detail" id="resultDetail"></div>
<div class="exam-actions"><button class="exam-cancel" id="resClose">ปิด</button></div>
</div>`;document.body.appendChild(res);
$('resClose').onclick=()=>res.classList.remove('open');res.onclick=e=>{if(e.target===res)res.classList.remove('open')};

async function openResults(){
  res.classList.add('open');
  $('resultDetail').innerHTML='';
  try{
    const d=await api({action:'listExams'});
    const sel=$('resultExamSelect');
    sel.innerHTML=d.exams.length?d.exams.map(x=>`<option value="${esc(x.examId)}">${esc(x.title)} (${
      x.count||0
    } คน)</option>`).join(''):'<option value="">ยังไม่มีข้อสอบ</option>';
    if(d.exams.length)await loadResults();
  }catch(e){$('resultSummary').textContent='โหลดข้อมูลไม่ได้: '+e.message}
}

let resultLiveTimer=null,resultLiveBusy=false,lastResultSig='';
function renderResultRows(d){
  const sig=JSON.stringify(d.rows.map(r=>[r.attemptId,r.status,r.autoScore,r.manualScore,r.finalScore,r.leaves]));
  if(sig===lastResultSig)return;
  lastResultSig=sig;
  $('resultBody').innerHTML=d.rows.map(r=>`<tr>
    <td>${esc(r.studentId)}</td><td>${esc(r.studentName)}</td>
    <td><span class="${r.status==='SUBMITTED'?'badge-status':'badge-status badge-wait'}">${r.status==='SUBMITTED'?'ส่งแล้ว':'กำลังทำ'}</span></td>
    <td>${r.autoScore}</td><td>${r.manualScore}</td><td><b>${r.finalScore}</b> / ${d.exam.maxPoints}</td><td>${r.leaves}</td>
    <td><button class="exam-mini" data-attempt="${esc(r.attemptId)}">ดูคำตอบ/ตรวจ</button></td>
  </tr>`).join('');
  document.querySelectorAll('[data-attempt]').forEach(b=>b.onclick=()=>openAttempt(b.dataset.attempt));
}
async function loadResults(silent=false){
  const examId=$('resultExamSelect').value;if(!examId||resultLiveBusy)return;
  resultLiveBusy=true;
  if(!silent){$('resultSummary').textContent='กำลังโหลดผลสอบ...';$('resultBody').innerHTML='';lastResultSig='';}
  try{
    const d=await api({action:silent?'getLiveResults':'getResults',examId});
    if(!d||d.ok===false)throw new Error(d?.error||'โหลดข้อมูลไม่ได้');
    $('resultSummary').textContent=`${d.exam.title} • ผู้เข้าสอบ ${d.rows.length} คน • คะแนนเต็ม ${d.exam.maxPoints} คะแนน${silent?' • อัปเดตอัตโนมัติ':''}`;
    renderResultRows(d);
  }catch(e){if(!silent)$('resultSummary').textContent='โหลดผลสอบไม่ได้: '+e.message}
  finally{resultLiveBusy=false}
}
function startResultLive(){
  clearInterval(resultLiveTimer);
  resultLiveTimer=setInterval(()=>{if(res.classList.contains('open'))loadResults(true)},5000);
}
$('resultRefresh').onclick=()=>loadResults(false);
$('resultExamSelect').onchange=()=>{lastResultSig='';loadResults(false);$('resultDetail').innerHTML=''};
startResultLive();

$('showAnswerKey').onclick=async()=>{
  const examId=$('resultExamSelect').value;if(!examId)return;
  const d=await api({action:'getTeacherExam',examId});
  $('resultDetail').innerHTML=`<h3>เฉลยชุดข้อสอบ</h3>`+d.exam.questions.map((q,i)=>`<div class="answer-card"><b>ข้อ ${i+1}. ${esc(q.q)}</b>${
    q.type==='text'?`<div class="answer-key"><b>แนวคำตอบ:</b> ${esc(q.modelAnswer||'—')}</div>`:`<div class="answer-key"><b>เฉลย:</b> ${esc(q.answer)}. ${esc((q.choices||{})[q.answer]||'')}</div>`
  }</div>`).join('');
  $('resultDetail').scrollIntoView({behavior:'smooth',block:'start'});
};

async function openAttempt(attemptId){
  $('resultDetail').innerHTML='กำลังโหลดคำตอบ...';
  try{
    const d=await api({action:'getAttemptDetail',attemptId});
    const a=d.attempt;
    $('resultDetail').innerHTML=`<h3>${esc(a.studentName)} • ${esc(a.studentId)}</h3>
      <p class="exam-muted">คะแนนปรนัย ${a.autoScore} • คะแนนถามตอบ ${a.manualScore} • รวม ${a.finalScore} / ${a.maxPoints}</p>
      <div id="gradingCards">${a.questions.map((q,i)=>{
        if(q.type==='text')return `<div class="answer-card">
          <b>ข้อ ${i+1}. ${esc(q.q)}</b>
          <div class="student-answer"><b>คำตอบนักเรียน:</b><br>${esc(q.studentAnswer||'ไม่ได้ตอบ')}</div>
          <div class="answer-key"><b>แนวคำตอบ:</b><br>${esc(q.modelAnswer||'—')}</div>
          <div class="grade-row"><span>ให้คะแนน (เต็ม ${q.points})</span><input class="grade-input" type="number" min="0" max="${q.points}" step="0.25" data-grade="${i}" value="${q.grade??''}"></div>
        </div>`;
        return `<div class="answer-card"><b>ข้อ ${i+1}. ${esc(q.q)}</b><div class="student-answer">นักเรียนตอบ: <b>${esc(q.studentAnswer||'—')}</b></div><div class="answer-key">เฉลย: <b>${esc(q.correctAnswer)}</b> • ${q.correct?'ถูก':'ผิด'}</div></div>`;
      }).join('')}</div>
      <div class="exam-actions"><button class="exam-confirm" id="saveGrades">บันทึกคะแนนถามตอบ</button></div>`;
    const save=$('saveGrades');if(save)save.onclick=async()=>{
      const grades={};document.querySelectorAll('[data-grade]').forEach(x=>{grades[x.dataset.grade]=x.value});
      save.disabled=true;save.textContent='กำลังบันทึก...';
      try{const s=await api({action:'saveGrades',attemptId,gradesJson:JSON.stringify(grades)});save.textContent=`บันทึกแล้ว ✓ รวม ${s.finalScore}/${s.maxPoints}`;await loadResults()}
      catch(e){save.disabled=false;save.textContent='บันทึกคะแนนถามตอบ';alert('บันทึกไม่ได้: '+e.message)}
    };
    $('resultDetail').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(e){$('resultDetail').textContent='โหลดคำตอบไม่ได้: '+e.message}
}


// Published exam manager (V45)
const mgr=document.createElement('div');mgr.className='exam-backdrop';mgr.innerHTML=`<div class="exam-modal">
<h2>ข้อสอบที่เผยแพร่แล้ว</h2>
<p class="exam-muted">ปิดข้อสอบเพื่อเก็บคะแนนไว้แต่หยุดรับผู้เข้าสอบใหม่ หรือเปิดกลับมาใหม่ภายหลังได้</p>
<div class="exam-danger-note"><b>ลบถาวร</b> จะลบชุดข้อสอบ ผลสอบ และบันทึกเหตุการณ์ของชุดนั้นออกจาก Google Sheet ด้วย</div>
<div class="exam-toolbar"><button class="exam-confirm exam-mini" id="publishedRefresh">รีเฟรชรายการ</button></div>
<div id="publishedStatus" class="exam-muted"></div><div id="publishedList" class="published-list"></div>
<div class="exam-actions"><button class="exam-cancel" id="mgrClose">ปิด</button></div>
</div>`;document.body.appendChild(mgr);
$('mgrClose').onclick=()=>mgr.classList.remove('open');mgr.onclick=e=>{if(e.target===mgr)mgr.classList.remove('open')};

function fmtDate(v){try{const d=new Date(v);return isNaN(d)?'—':d.toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'})}catch(_){return '—'}}
async function loadPublishedExams(){
  const box=$('publishedList'),status=$('publishedStatus');box.innerHTML='<div class="published-empty">กำลังโหลดรายการ...</div>';status.textContent='';
  try{
    const d=await api({action:'listExams'});
    if(d.apiVersion!=='V45')status.innerHTML='<span style="color:#b45309">Google Apps Script ยังเป็นเวอร์ชันเก่า กรุณาอัปเดต Code.gs จาก V45 แล้ว Deploy เวอร์ชันใหม่ก่อนใช้ปุ่มปิด/ลบ</span>';
    if(!d.exams.length){box.innerHTML='<div class="published-empty">ยังไม่มีข้อสอบที่เผยแพร่</div>';return}
    box.innerHTML=d.exams.map(x=>`<div class="published-card" data-published="${esc(x.examId)}">
      <div class="published-top"><div><div class="published-title">${esc(x.title||'ไม่มีชื่อ')}</div><div class="published-id">${esc(x.examId)} • ${esc(fmtDate(x.createdAt))}</div></div><span class="published-pill ${x.active===false?'closed':'open'}">${x.active===false?'ปิดรับคำตอบ':'เปิดใช้งาน'}</span></div>
      <div class="published-meta"><span class="published-pill">${Number(x.questionCount||0)} ข้อ</span><span class="published-pill">${Number(x.duration||0)} นาที</span><span class="published-pill">ผู้เข้าสอบ ${Number(x.count||0)} คน</span></div>
      <div class="published-actions">${x.active===false?`<button class="exam-mini success" data-reopen="${esc(x.examId)}">เปิดข้อสอบอีกครั้ง</button>`:`<button class="exam-mini warning" data-closeexam="${esc(x.examId)}">ปิดรับคำตอบ</button>`}<button class="exam-mini" data-viewresults="${esc(x.examId)}">ดูผลสอบ</button><button class="exam-mini danger" data-deleteexam="${esc(x.examId)}" data-title="${esc(x.title||'')}">ลบถาวร</button></div>
    </div>`).join('');
    box.querySelectorAll('[data-closeexam]').forEach(b=>b.onclick=()=>togglePublished(b.dataset.closeexam,false,b));
    box.querySelectorAll('[data-reopen]').forEach(b=>b.onclick=()=>togglePublished(b.dataset.reopen,true,b));
    box.querySelectorAll('[data-deleteexam]').forEach(b=>b.onclick=()=>deletePublished(b.dataset.deleteexam,b.dataset.title,b));
    box.querySelectorAll('[data-viewresults]').forEach(b=>b.onclick=async()=>{const id=b.dataset.viewresults;mgr.classList.remove('open');await openResults();$('resultExamSelect').value=id;await loadResults()});
  }catch(e){box.innerHTML=`<div class="published-empty">โหลดรายการไม่ได้: ${esc(e.message)}</div>`}
}
async function togglePublished(examId,active,btn){
  const actionText=active?'เปิดข้อสอบ':'ปิดรับคำตอบ';
  if(!confirm(`${actionText}ชุดนี้หรือไม่?`))return;
  const old=btn.textContent;btn.disabled=true;btn.textContent='กำลังบันทึก...';
  try{
    await postCommandNoCors({action:'setExamActive',examId,active},d=>{const x=d.exams.find(e=>e.examId===examId);return x&&Boolean(x.active)===active});
    await loadPublishedExams();
  }catch(e){alert(`${actionText}ไม่สำเร็จ: ${e.message}`);btn.disabled=false;btn.textContent=old}
}
async function deletePublished(examId,title,btn){
  const msg=`ต้องการลบถาวรจริงหรือไม่?\n\n${title||examId}\n${examId}\n\nผลสอบและข้อมูลผู้เข้าสอบของชุดนี้จะถูกลบด้วย และเรียกคืนจากหน้าเว็บไม่ได้`;
  if(!confirm(msg))return;
  const typed=prompt('เพื่อยืนยัน ให้พิมพ์คำว่า ลบ');if(typed!=='ลบ')return;
  btn.disabled=true;btn.textContent='กำลังลบ...';
  try{
    await postCommandNoCors({action:'deleteExam',examId},d=>!d.exams.some(e=>e.examId===examId));
    await loadPublishedExams();
  }catch(e){alert('ลบไม่สำเร็จ: '+e.message);btn.disabled=false;btn.textContent='ลบถาวร'}
}
function openPublishedExamManager(){mgr.classList.add('open');loadPublishedExams()}
$('publishedRefresh').onclick=loadPublishedExams;

// Public hooks for the professional dashboard.
window.openOnlineExamPublish = openPublish;
window.openOnlineExamResults = openResults;
window.openPublishedExamManager = openPublishedExamManager;

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addButtons);else addButtons();
})();
