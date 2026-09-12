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
@media(max-width:650px){.exam-grid{grid-template-columns:1fr}.exam-modal{padding:16px}.grade-row{grid-template-columns:1fr}}
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
<div class="exam-grid"><div class="exam-field"><label>เวลาสอบ (นาที)</label><input id="onlineExamMinutes" type="number" min="1" max="300" value="50"></div><div class="exam-field"><label>ออกจากหน้าสอบครบกี่ครั้งให้ส่งอัตโนมัติ</label><input id="onlineExamMaxLeave" type="number" min="1" max="20" value="3"></div></div>
<div class="exam-grid"><div class="exam-field"><label>แสดงคะแนนหลังส่ง</label><select id="onlineExamShowScore"><option value="yes">แสดง</option><option value="no">ไม่แสดง</option></select></div><div class="exam-field"><label>การเข้าสอบ</label><select id="onlineExamOneAttempt"><option value="yes">1 ครั้งต่อรหัสนักเรียน</option><option value="no">อนุญาตหลายครั้ง</option></select></div></div>
<div class="exam-field"><label>เฉลยหลังส่งข้อสอบ</label><select id="onlineExamAllowReview"><option value="no">ไม่แสดง</option><option value="yes">ให้นักเรียนดูเฉลย/แนวคำตอบหลังส่ง</option></select></div>
<div class="exam-result" id="onlineExamResult"></div>
<div class="exam-actions"><button class="exam-cancel" id="pubClose">ปิด</button><button class="exam-confirm" id="pubGo">เผยแพร่</button></div>
</div>`;document.body.appendChild(pub);
$('pubClose').onclick=()=>pub.classList.remove('open');pub.onclick=e=>{if(e.target===pub)pub.classList.remove('open')};

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
    const base=new URL(STUDENT_EXAM_URL,location.href).href;
    const link=base+(base.includes('?')?'&':'?')+'exam='+encodeURIComponent(finalExamId);
    result.innerHTML=`<b>เผยแพร่สำเร็จ</b><br>รหัสข้อสอบ: <b>${esc(finalExamId)}</b><br><a href="${esc(link)}" target="_blank">เปิดลิงก์นักเรียน</a><br><button class="exam-copy" id="copyExamLink">คัดลอกลิงก์</button>`;
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
<div class="exam-table-wrap"><table class="exam-table"><thead><tr><th>รหัส</th><th>ชื่อ–สกุล</th><th>สถานะ</th><th>คะแนนปรนัย</th><th>คะแนนถามตอบ</th><th>คะแนนรวม</th><th>ออกจากหน้า</th><th></th></tr></thead><tbody id="resultBody"></tbody></table></div>
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

async function loadResults(){
  const examId=$('resultExamSelect').value;if(!examId)return;
  $('resultSummary').textContent='กำลังโหลดผลสอบ...';$('resultBody').innerHTML='';
  try{
    const d=await api({action:'getResults',examId});
    $('resultSummary').textContent=`${d.exam.title} • ผู้เข้าสอบ ${d.rows.length} คน • คะแนนเต็ม ${d.exam.maxPoints} คะแนน`;
    $('resultBody').innerHTML=d.rows.map(r=>`<tr>
      <td>${esc(r.studentId)}</td><td>${esc(r.studentName)}</td>
      <td><span class="${r.status==='SUBMITTED'?'badge-status':'badge-status badge-wait'}">${r.status==='SUBMITTED'?'ส่งแล้ว':'กำลังทำ'}</span></td>
      <td>${r.autoScore}</td><td>${r.manualScore}</td><td><b>${r.finalScore}</b> / ${d.exam.maxPoints}</td><td>${r.leaves}</td>
      <td><button class="exam-mini" data-attempt="${esc(r.attemptId)}">ดูคำตอบ/ตรวจ</button></td>
    </tr>`).join('');
    document.querySelectorAll('[data-attempt]').forEach(b=>b.onclick=()=>openAttempt(b.dataset.attempt));
  }catch(e){$('resultSummary').textContent='โหลดผลสอบไม่ได้: '+e.message}
}
$('resultRefresh').onclick=loadResults;$('resultExamSelect').onchange=()=>{loadResults();$('resultDetail').innerHTML=''};

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


// Public hooks for the professional dashboard.
window.openOnlineExamPublish = openPublish;
window.openOnlineExamResults = openResults;

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addButtons);else addButtons();
})();
