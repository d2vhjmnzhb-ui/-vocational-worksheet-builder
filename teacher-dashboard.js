(()=>{
'use strict';
const $=id=>document.getElementById(id);
const svg=(name)=>{
 const paths={
  brand:'<path d="M6 3.5h9a2 2 0 0 1 2 2V20H6a2 2 0 0 1-2-2V5.5a2 2 0 0 1 2-2Z"/><path d="M8 8h5M8 12h5M8 16h3"/><path d="m15.5 14.5 4-4 2 2-4 4-2.5.5.5-2.5Z"/>',
  worksheet:'<path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h4M9 11h6M9 15h6"/>',
  exam:'<rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4M7 8h5M7 12h8"/>',
  results:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  reset:'<path d="M4 4v6h6"/><path d="M5.5 15a8 8 0 1 0 1.8-8.4L4 10"/>',
  print:'<path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/>',
  open:'<path d="M14 3h7v7M10 14 21 3"/><path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>',
  download:'<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/>',
  publish:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  refresh:'<path d="M20 6v5h-5"/><path d="M4 18v-5h5"/><path d="M6.5 8a7 7 0 0 1 11.5-2l2 2M17.5 16a7 7 0 0 1-11.5 2l-2-2"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>'
 };
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.brand}</svg>`;
};
function setButton(id,icon,label){const b=$(id);if(b)b.innerHTML=svg(icon)+`<span class="label">${label}</span>`}
function initHeader(){
 const mark=document.querySelector('.brandmark');if(mark)mark.innerHTML=svg('brand');
 setButton('resetBtn','reset','ล้างข้อมูล');setButton('printBtn','print','พิมพ์');setButton('openPdfBtn','open','เปิด PDF');setButton('downloadPdfBtn','download','บันทึก PDF');
}
function buildShell(){
 if($('proTeacherNav'))return;
 const shell=document.createElement('div');shell.className='pro-shell';shell.innerHTML=`
  <nav class="pro-nav" id="proTeacherNav" aria-label="เมนูหลัก">
    <button type="button" class="active" data-mode="worksheet">${svg('worksheet')}<span>สร้างใบงาน</span></button>
    <button type="button" data-mode="exam">${svg('exam')}<span>ข้อสอบออนไลน์</span></button>
    <button type="button" data-mode="results">${svg('results')}<span>ผลการสอบ</span></button>
  </nav>
  <div class="pro-context"><div><h1 id="proTitle">สร้างใบงาน</h1><p id="proSubtitle">จัดเตรียมเนื้อหา สร้างแบบฝึกหัด และตรวจเอกสาร A4 ในพื้นที่เดียว</p></div><div class="pro-state" id="proState">ระบบงานครู</div></div>`;
 document.querySelector('.appbar').insertAdjacentElement('afterend',shell);
 const examPane=document.createElement('section');examPane.id='proExamPane';examPane.className='pro-pane';examPane.innerHTML=`
  <div class="pro-grid">
    <article class="pro-card">
      <div class="pro-card-head"><div><div class="pro-kicker">ONLINE EXAM</div><h2>เตรียมข้อสอบออนไลน์</h2></div>${svg('exam')}</div>
      <p>ระบบจะเผยแพร่เฉพาะรายการคำถามจริงที่อยู่ในเอกสารปัจจุบัน และตัดข้อความแจ้งเตือนหรือข้อความประกอบออก</p>
      <div class="pro-summary"><div class="pro-metric"><small>รายวิชา</small><b id="proExamSubject">-</b></div><div class="pro-metric"><small>หัวข้อ</small><b id="proExamTopic">-</b></div><div class="pro-metric"><small>คำถามที่พร้อมใช้</small><b id="proExamCount">0 ข้อ</b></div><div class="pro-metric"><small>รูปแบบ</small><b id="proExamTypes">-</b></div></div>
      <div class="pro-checks"><div class="pro-check">${svg('check')}<span>ปรนัยต้องมีตัวเลือก ก ข ค ง และมีเฉลย</span></div><div class="pro-check">${svg('check')}<span>ถาม–ตอบต้องเป็นข้อคำถามจริง ไม่ใช้ข้อความสถานะของใบงาน</span></div><div class="pro-check">${svg('check')}<span>ก่อนเผยแพร่ควรตรวจรายการคำถามด้านขวาให้ครบ</span></div></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="pro-btn primary" id="proPublishBtn">${svg('publish')}<span>ตั้งค่าและเผยแพร่</span></button><button class="pro-btn secondary" id="proRefreshExam">${svg('refresh')}<span>รีเฟรชรายการ</span></button></div>
    </article>
    <article class="pro-card"><div class="pro-card-head"><div><div class="pro-kicker">QUESTION REVIEW</div><h2>รายการคำถามที่จะเผยแพร่</h2></div>${svg('list')}</div><div id="proQuestionList" class="pro-list"></div></article>
  </div>`;
 shell.insertAdjacentElement('afterend',examPane);
 const resultsPane=document.createElement('section');resultsPane.id='proResultsPane';resultsPane.className='pro-pane';resultsPane.innerHTML=`
  <article class="pro-card"><div class="pro-results-hero"><div><div class="pro-kicker">EXAM RESULTS</div><h2>ผลการสอบออนไลน์</h2><p>เปิดหน้าผลสอบเพื่อดูรายชื่อ คะแนนปรนัย คำตอบข้อเขียน ตรวจให้คะแนน และดูเฉลยของแต่ละชุดข้อสอบ</p><button class="pro-btn primary" id="proOpenResults">${svg('results')}<span>เปิดผลการสอบ</span></button></div><div class="pro-results-icon">${svg('results')}</div></div></article>`;
 examPane.insertAdjacentElement('afterend',resultsPane);
 document.querySelectorAll('#proTeacherNav button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
 $('proRefreshExam').onclick=refreshExamPane;$('proPublishBtn').onclick=()=>{const b=$('publishExamBtn');if(b)b.click();else alert('กำลังเตรียมเครื่องมือเผยแพร่ กรุณาลองอีกครั้ง')};
 $('proOpenResults').onclick=()=>{const b=$('examResultsBtn');if(b)b.click();else alert('กำลังเตรียมผลการสอบ กรุณาลองอีกครั้ง')};
 setMode(localStorage.getItem('teacherMode')||'worksheet');
}
function setMode(mode){
 document.body.dataset.proMode=mode;localStorage.setItem('teacherMode',mode);
 document.querySelectorAll('#proTeacherNav button').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
 const map={worksheet:['สร้างใบงาน','จัดเตรียมเนื้อหา สร้างแบบฝึกหัด และตรวจเอกสาร A4 ในพื้นที่เดียว'],exam:['ข้อสอบออนไลน์','ตรวจรายการคำถาม ตั้งค่าเวลา และเผยแพร่ลิงก์สำหรับนักเรียน'],results:['ผลการสอบ','ตรวจคะแนน คำตอบข้อเขียน และผลการเข้าสอบจาก Google Sheet']};
 if($('proTitle'))$('proTitle').textContent=map[mode][0];if($('proSubtitle'))$('proSubtitle').textContent=map[mode][1];
 if(mode==='exam')setTimeout(refreshExamPane,100);
}
function stripQ(li){const c=li.cloneNode(true);c.querySelectorAll('.question-topic,.choices,.answer,.answer-lines,.answer-inline,.question-visual').forEach(x=>x.remove());return (c.textContent||'').replace(/^\s*\d+\s*[.)]\s*/,'').trim()}
function noise(q){return /^(กรุณาเพิ่มเนื้อหา|กรุณาเลือก|กรุณากรอก|ยังไม่มี|ไม่พบ|คำชี้แจง|หมายเหตุ|ตัวอย่าง|เนื้อหาที่เลือก|สร้าง\/อัปเดต)/i.test(q)}
function scanQuestions(){
 const good=[],excluded=[];
 document.querySelectorAll('#paper .exercise > li').forEach((li,i)=>{
  const q=stripQ(li);if(!q)return;
  const choices=[...li.querySelectorAll('.choices span')].filter(x=>(x.textContent||'').trim()).length;
  const answer=(li.querySelector('.answer')?.textContent||'').trim();
  let type='text',valid=true;
  if(noise(q)){valid=false}
  else if(choices===4){type='mcq';valid=/(เฉลย|คำตอบ).*?[กขคง]/i.test(answer)}
  else {type='text';valid=!!li.querySelector('.answer-lines,.answer-inline,.answer')||/[?？]$/.test(q)}
  (valid?good:excluded).push({i:i+1,q,type});
 });
 return {good,excluded};
}
function refreshExamPane(){
 if(!$('proQuestionList'))return;
 $('proExamSubject').textContent=$('subject')?.value?.trim()||'-';$('proExamTopic').textContent=$('topic')?.value?.trim()||'-';
 const {good,excluded}=scanQuestions();const mcq=good.filter(x=>x.type==='mcq').length,text=good.length-mcq;
 $('proExamCount').textContent=`${good.length} ข้อ`;$('proExamTypes').textContent=[mcq?`ปรนัย ${mcq}`:'',text?`ถาม–ตอบ ${text}`:''].filter(Boolean).join(' • ')||'-';
 const html=good.map((x,n)=>`<div class="pro-q"><span class="num">${n+1}</span><span class="text">${escapeHtml(x.q)}</span><span class="pro-tag ${x.type==='text'?'text':''}">${x.type==='mcq'?'ปรนัย':'ถาม–ตอบ'}</span></div>`).join('');
 const bad=excluded.map(x=>`<div class="pro-q"><span class="num">–</span><span class="text">${escapeHtml(x.q)}</span><span class="pro-tag exclude">ไม่นำไปใช้</span></div>`).join('');
 $('proQuestionList').innerHTML=(html||'<div class="pro-empty">ยังไม่มีคำถามที่พร้อมเผยแพร่ กรุณาสร้างหรืออัปเดตเอกสารก่อน</div>')+bad;
}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function watchExamTools(){
 const obs=new MutationObserver(()=>{if($('publishExamBtn'))$('publishExamBtn').classList.add('pro-hidden-source');if($('examResultsBtn'))$('examResultsBtn').classList.add('pro-hidden-source')});obs.observe(document.body,{childList:true,subtree:true});
}
function init(){initHeader();buildShell();watchExamTools();['subject','topic','type','count'].forEach(id=>$(id)?.addEventListener('input',()=>{if(document.body.dataset.proMode==='exam')setTimeout(refreshExamPane,150)}));}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
