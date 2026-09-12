(()=>{
'use strict';
const $=id=>document.getElementById(id);
const BANK_KEY='vocOnlineExamBankV30';
const PREVIEW_KEY='vocOnlineExamPreviewV30';

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
  list:'<path d="M9 6h11M9 12h11M9 18h11"/><path d="M4 6h.01M4 12h.01M4 18h.01"/>',
  ai:'<path d="M12 3v3M12 18v3M3 12h3M18 12h3"/><circle cx="12" cy="12" r="5"/><path d="m8.5 8.5 7 7M15.5 8.5l-7 7"/>',
  add:'<path d="M12 5v14M5 12h14"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 13h8l1-13"/>',
  eye:'<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>'
 };
 return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name]||paths.brand}</svg>`;
};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

let bank=[];
try{bank=JSON.parse(localStorage.getItem(BANK_KEY)||'[]')}catch{bank=[]}

function saveBank(){
 localStorage.setItem(BANK_KEY,JSON.stringify(bank));
 renderBank();
 updatePreview();
}
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
  <div class="pro-context"><div><h1 id="proTitle">สร้างใบงาน</h1><p id="proSubtitle">นำเข้าโจทย์จาก AI เพิ่มโจทย์เอง และจัดเอกสาร A4</p></div><div class="pro-state">ระบบงานครู</div></div>`;
 document.querySelector('.appbar').insertAdjacentElement('afterend',shell);

 const examPane=document.createElement('section');examPane.id='proExamPane';examPane.className='pro-pane';examPane.innerHTML=`
  <div class="exam-studio-grid">
   <article class="pro-card exam-bank-card">
    <div class="pro-card-head"><div><div class="pro-kicker">ONLINE EXAM BANK</div><h2>คลังข้อสอบออนไลน์</h2></div>${svg('exam')}</div>
    <p>คลังนี้แยกจากใบงานโดยสิ้นเชิง ข้อสอบออนไลน์จะใช้เฉพาะคำถามในหน้านี้เท่านั้น</p>
    <div class="pro-tabs"><button type="button" class="active" data-exam-tab="ai">นำเข้าจาก AI</button><button type="button" data-exam-tab="manual">เพิ่มคำถามเอง</button></div>
    <div id="examTabAi">
      <label class="pro-label">ข้อความข้อสอบจาก AI</label>
      <textarea id="onlineAiRaw" class="pro-textarea" placeholder="วางข้อสอบปรนัยหรือถาม–ตอบที่ AI สร้างไว้"></textarea>
      <div class="pro-actions-row"><button class="pro-btn secondary" id="onlineAiPrompt">${svg('ai')}<span>เปิด ChatGPT พร้อมคำสั่ง</span></button><button class="pro-btn primary" id="onlineAiParse">${svg('list')}<span>วิเคราะห์ข้อความ</span></button></div>
      <div id="onlineAiParsed" class="pro-import-list"></div>
      <button class="pro-btn primary pro-full" id="onlineAiImport" hidden>${svg('add')}<span>นำเข้าข้อที่เลือก</span></button>
    </div>
    <div id="examTabManual" hidden>
      <label class="pro-label">ประเภทคำถาม</label><select id="onlineManualType" class="pro-input"><option value="mcq">ปรนัย ก ข ค ง</option><option value="text">ถาม–ตอบ</option></select>
      <label class="pro-label">คำถาม</label><textarea id="onlineManualQ" class="pro-textarea" placeholder="พิมพ์คำถาม"></textarea>
      <div id="onlineManualChoices">
        <input class="pro-input" data-choice="ก" placeholder="ก. ตัวเลือก"><input class="pro-input" data-choice="ข" placeholder="ข. ตัวเลือก"><input class="pro-input" data-choice="ค" placeholder="ค. ตัวเลือก"><input class="pro-input" data-choice="ง" placeholder="ง. ตัวเลือก">
        <label class="pro-label">เฉลย</label><select id="onlineManualAnswer" class="pro-input"><option>ก</option><option>ข</option><option>ค</option><option>ง</option></select>
      </div>
      <div id="onlineManualText" hidden><label class="pro-label">แนวคำตอบ</label><textarea id="onlineManualModel" class="pro-textarea" placeholder="ใส่แนวคำตอบสำหรับครู"></textarea></div>
      <label class="pro-label">คะแนนข้อนี้</label><input id="onlineManualPoints" class="pro-input" type="number" min="0.5" step="0.5" value="1">
      <button class="pro-btn primary pro-full" id="onlineManualAdd">${svg('add')}<span>เพิ่มเข้าคลังข้อสอบ</span></button>
    </div>
   </article>

   <article class="pro-card exam-list-card">
    <div class="pro-card-head"><div><div class="pro-kicker">QUESTION LIST</div><h2>คำถามที่จะเผยแพร่</h2></div><span class="pro-count" id="onlineBankCount">0 ข้อ</span></div>
    <div class="pro-summary"><div class="pro-metric"><small>ปรนัย</small><b id="onlineMcqCount">0</b></div><div class="pro-metric"><small>ถาม–ตอบ</small><b id="onlineTextCount">0</b></div></div>
    <div class="pro-quick-add">
      <div class="pro-quick-head"><b>＋ เพิ่มคำถามตรงนี้</b><span>ไม่ต้องกลับไปฝั่งซ้าย</span></div>
      <select id="quickManualType" class="pro-input"><option value="mcq">ปรนัย ก ข ค ง</option><option value="text">ถาม–ตอบ</option></select>
      <textarea id="quickManualQ" class="pro-textarea" placeholder="พิมพ์คำถาม"></textarea>
      <div id="quickManualChoices">
        <input class="pro-input" data-qchoice="ก" placeholder="ก. ตัวเลือก"><input class="pro-input" data-qchoice="ข" placeholder="ข. ตัวเลือก"><input class="pro-input" data-qchoice="ค" placeholder="ค. ตัวเลือก"><input class="pro-input" data-qchoice="ง" placeholder="ง. ตัวเลือก">
        <select id="quickManualAnswer" class="pro-input"><option value="ก">เฉลย ก</option><option value="ข">เฉลย ข</option><option value="ค">เฉลย ค</option><option value="ง">เฉลย ง</option></select>
      </div>
      <div id="quickManualText" hidden><textarea id="quickManualModel" class="pro-textarea" placeholder="แนวคำตอบสำหรับครู (ใส่หรือไม่ใส่ก็ได้)"></textarea></div>
      <button class="pro-btn primary pro-full" id="quickManualAdd">${svg('add')}<span>เพิ่มเข้ารายการคำถาม</span></button>
    </div>
    <div id="onlineBankList" class="pro-list"></div>
    <div class="pro-actions-row"><button class="pro-btn secondary" id="onlineClearBank">${svg('trash')}<span>ล้างคลัง</span></button><button class="pro-btn primary" id="proPublishBtn">${svg('publish')}<span>ตั้งค่าและเผยแพร่</span></button></div>
   </article>

   <article class="pro-card exam-preview-card">
    <div class="pro-card-head"><div><div class="pro-kicker">STUDENT PREVIEW</div><h2>ตัวอย่างหน้าจอนักเรียนจริง</h2></div>${svg('eye')}</div>
    <p>ตัวอย่างนี้ใช้ไฟล์ <b>student-exam.html</b> ตัวเดียวกับที่นักเรียนเปิดจริง จึงเห็นหน้าตาเดียวกันก่อนเผยแพร่</p>
    <div class="phone-preview"><iframe id="studentPreviewFrame" title="ตัวอย่างหน้าจอนักเรียน" src="./student-exam.html?preview=1"></iframe></div>
   </article>
  </div>`;

 shell.insertAdjacentElement('afterend',examPane);

 const resultsPane=document.createElement('section');resultsPane.id='proResultsPane';resultsPane.className='pro-pane';resultsPane.innerHTML=`
  <article class="pro-card"><div class="pro-results-hero"><div><div class="pro-kicker">EXAM RESULTS</div><h2>ผลการสอบออนไลน์</h2><p>ดูรายชื่อ คะแนนปรนัย ตรวจคำตอบข้อเขียน ให้คะแนน และดูเฉลยจาก Google Sheet</p><button class="pro-btn primary" id="proOpenResults">${svg('results')}<span>เปิดผลการสอบ</span></button></div><div class="pro-results-icon">${svg('results')}</div></div></article>`;
 examPane.insertAdjacentElement('afterend',resultsPane);

 document.querySelectorAll('#proTeacherNav button').forEach(b=>b.addEventListener('click',()=>setMode(b.dataset.mode)));
 document.querySelectorAll('[data-exam-tab]').forEach(b=>b.onclick=()=>switchExamTab(b.dataset.examTab));
 $('proPublishBtn').onclick=()=>{const b=$('publishExamBtn');if(b)b.click();else alert('กำลังเตรียมเครื่องมือเผยแพร่ กรุณาลองอีกครั้ง')};
 $('proOpenResults').onclick=()=>{const b=$('examResultsBtn');if(b)b.click();else alert('กำลังเตรียมผลการสอบ กรุณาลองอีกครั้ง')};

 bindOnlineStudio();
 bindQuickAdd();
 setMode(localStorage.getItem('teacherMode')||'worksheet');
 renderBank();
 updatePreview();
}

function bindQuickAdd(){
 const type=$('quickManualType'),q=$('quickManualQ'),choices=$('quickManualChoices'),text=$('quickManualText');
 if(!type||!q)return;
 const sync=()=>{const isText=type.value==='text';choices.hidden=isText;text.hidden=!isText};
 type.onchange=sync;sync();
 $('quickManualAdd').onclick=()=>{
   const question=q.value.trim();if(!question){alert('กรุณาพิมพ์คำถาม');return}
   if(type.value==='text'){
     bank.push({type:'text',q:question,modelAnswer:$('quickManualModel').value.trim(),points:1});
     $('quickManualModel').value='';
   }else{
     const vals={};document.querySelectorAll('[data-qchoice]').forEach(el=>vals[el.dataset.qchoice]=el.value.trim());
     if(['ก','ข','ค','ง'].some(k=>!vals[k])){alert('กรุณาใส่ตัวเลือก ก ข ค ง ให้ครบ');return}
     bank.push({type:'mcq',q:question,choices:vals,answer:$('quickManualAnswer').value,points:1});
     document.querySelectorAll('[data-qchoice]').forEach(el=>el.value='');
   }
   q.value='';saveBank();
 };
}

function switchExamTab(tab){
 document.querySelectorAll('[data-exam-tab]').forEach(b=>b.classList.toggle('active',b.dataset.examTab===tab));
 $('examTabAi').hidden=tab!=='ai';$('examTabManual').hidden=tab!=='manual';
}
function setMode(mode){
 document.body.dataset.proMode=mode;localStorage.setItem('teacherMode',mode);
 document.querySelectorAll('#proTeacherNav button').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
 const map={worksheet:['สร้างใบงาน','นำเข้าโจทย์จาก AI เพิ่มโจทย์เอง และจัดเอกสาร A4'],exam:['ข้อสอบออนไลน์','สร้างคลังข้อสอบแยกจากใบงาน ตรวจหน้าจอนักเรียน แล้วจึงเผยแพร่'],results:['ผลการสอบ','ตรวจคะแนน คำตอบข้อเขียน และผลการเข้าสอบจาก Google Sheet']};
 if($('proTitle'))$('proTitle').textContent=map[mode][0];if($('proSubtitle'))$('proSubtitle').textContent=map[mode][1];
 if(mode==='exam')setTimeout(updatePreview,100);
}

function stripNumber(text){return String(text||'').replace(/^\s*(?:ข้อ\s*)?\d+\s*[.)-]\s*/,'').trim()}
function parseBlock(block){
 const lines=String(block||'').replace(/\r/g,'').split('\n').map(x=>x.trim()).filter(Boolean);if(!lines.length)return null;
 let answer='',answerLetter='';const kept=[];
 for(const line of lines){
  const hit=line.match(/^(?:เฉลย|คำตอบ|แนวคำตอบ)\s*[:：-]?\s*(.*)$/i);
  if(hit){answer=hit[1].trim();const lm=answer.match(/^([กขคงA-Da-d])/);if(lm){const x=lm[1].toUpperCase();answerLetter='กขคง'.includes(x)?x:'กขคง'['ABCD'.indexOf(x)]}continue}
  kept.push(line);
 }
 const options=[];kept.forEach((line,i)=>{const m=line.match(/^([กขคงA-Da-d])\s*[.)]\s*(.+)$/);if(m)options.push({i,text:m[2].trim()})});
 if(options.length>=4){
  const first=options[0].i,opts=options.slice(0,4).map(x=>x.text);
  let ans=answerLetter;if(!ans&&answer){const found=opts.findIndex(x=>x===answer||x.includes(answer)||answer.includes(x));if(found>=0)ans='กขคง'[found]}
  return {type:'mcq',q:stripNumber(kept.slice(0,first).join(' ')),choices:{ก:opts[0],ข:opts[1],ค:opts[2],ง:opts[3]},answer:ans||'ก',points:1};
 }
 const q=stripNumber(kept.join(' '));
 return q?{type:'text',q,modelAnswer:answer||'',points:1}:null;
}
function parseAi(text){
 const blocks=String(text||'').replace(/\r/g,'').split(/(?=^\s*(?:ข้อ\s*)?\d+\s*[.)-]\s*)/m).map(x=>x.trim()).filter(Boolean);
 return (blocks.length?blocks:[text]).map(parseBlock).filter(x=>x&&x.q&&x.q.length>2);
}
let parsedOnline=[];

function bindOnlineStudio(){
 $('onlineAiParse').onclick=()=>{
  parsedOnline=parseAi($('onlineAiRaw').value);drawParsed();
  if(!parsedOnline.length)alert('ยังแยกข้อสอบไม่ได้ กรุณาให้ AI ขึ้นต้นแต่ละข้อด้วย 1. หรือ ข้อ 1');
 };
 $('onlineAiImport').onclick=()=>{
  const selected=[...document.querySelectorAll('[data-online-import]:checked')].map(x=>parsedOnline[+x.dataset.onlineImport]).filter(Boolean);
  if(!selected.length){alert('กรุณาเลือกข้อที่ต้องการนำเข้า');return}
  bank.push(...selected.map(x=>({...x,id:'Q_'+Date.now()+'_'+Math.random().toString(36).slice(2)})));
  $('onlineAiRaw').value='';parsedOnline=[];drawParsed();saveBank();
 };
 $('onlineAiPrompt').onclick=()=>{
  const topic=$('topic')?.value.trim()||'หัวข้อที่สอน',count=Math.max(1,Math.min(60,bank.length||10));
  const prompt=`สร้างข้อสอบเรื่อง “${topic}” จำนวน ${count} ข้อ สำหรับผู้เรียนอาชีวศึกษา สามารถผสมปรนัย 4 ตัวเลือก ก ข ค ง และถาม–ตอบได้

รูปแบบปรนัย:
1. คำถาม
ก. ตัวเลือก
ข. ตัวเลือก
ค. ตัวเลือก
ง. ตัวเลือก
เฉลย: ก

รูปแบบถาม–ตอบ:
2. คำถาม
คำตอบ: แนวคำตอบสั้น ๆ

ห้ามมีคำอธิบายนอกเหนือจากข้อสอบ`;
  navigator.clipboard?.writeText(prompt).catch(()=>{});
  window.open('https://chatgpt.com/?q='+encodeURIComponent(prompt),'_blank','noopener');
 };
 $('onlineManualType').onchange=()=>{
  const text=$('onlineManualType').value==='text';$('onlineManualChoices').hidden=text;$('onlineManualText').hidden=!text;
 };
 $('onlineManualAdd').onclick=()=>{
  const type=$('onlineManualType').value,q=$('onlineManualQ').value.trim(),points=Math.max(.5,+$('onlineManualPoints').value||1);
  if(!q){alert('กรุณาใส่คำถาม');return}
  let item={id:'Q_'+Date.now()+'_'+Math.random().toString(36).slice(2),type,q,points};
  if(type==='mcq'){
   const vals={};document.querySelectorAll('[data-choice]').forEach(x=>vals[x.dataset.choice]=x.value.trim());
   if(Object.values(vals).some(x=>!x)){alert('กรุณาใส่ตัวเลือก ก ข ค ง ให้ครบ');return}
   item.choices=vals;item.answer=$('onlineManualAnswer').value;
  }else item.modelAnswer=$('onlineManualModel').value.trim();
  bank.push(item);$('onlineManualQ').value='';document.querySelectorAll('[data-choice]').forEach(x=>x.value='');$('onlineManualModel').value='';saveBank();
 };
 $('onlineClearBank').onclick=()=>{if(confirm('ต้องการล้างคลังข้อสอบออนไลน์ทั้งหมดหรือไม่?')){bank=[];saveBank()}};
}
function drawParsed(){
 const el=$('onlineAiParsed');if(!el)return;
 el.innerHTML=parsedOnline.map((x,i)=>`<label class="pro-import-item"><input type="checkbox" data-online-import="${i}" checked><span><b>${x.type==='mcq'?'ปรนัย':'ถาม–ตอบ'}</b>${esc(x.q)}</span></label>`).join('');
 $('onlineAiImport').hidden=!parsedOnline.length;
}
function renderBank(){
 if(!$('onlineBankList'))return;
 const mcq=bank.filter(x=>x.type!=='text').length,text=bank.length-mcq;
 $('onlineBankCount').textContent=`${bank.length} ข้อ`;$('onlineMcqCount').textContent=mcq;$('onlineTextCount').textContent=text;
 $('onlineBankList').innerHTML=bank.length?bank.map((q,i)=>`<div class="pro-q online-q"><span class="num">${i+1}</span><span class="text"><b>${q.type==='text'?'ถาม–ตอบ':'ปรนัย'}</b><br>${esc(q.q)}</span><button class="icon-only" data-del-online="${i}" title="ลบ">${svg('trash')}</button></div>`).join(''):'<div class="pro-empty">ยังไม่มีคำถามในคลังข้อสอบออนไลน์</div>';
 document.querySelectorAll('[data-del-online]').forEach(b=>b.onclick=()=>{bank.splice(+b.dataset.delOnline,1);saveBank()});
}
function updatePreview(){
 if(!$('studentPreviewFrame'))return;
 const payload={title:($('customTitle')?.value.trim()||$('subject')?.value.trim()||'ตัวอย่างข้อสอบออนไลน์'),duration:50,maxLeave:3,questions:bank.length?bank.slice(0,8):[
  {type:'mcq',q:'ตัวอย่างคำถามปรนัยจะปรากฏตรงนี้',choices:{ก:'ตัวเลือก ก',ข:'ตัวเลือก ข',ค:'ตัวเลือก ค',ง:'ตัวเลือก ง'}},
  {type:'text',q:'ตัวอย่างคำถามแบบถาม–ตอบจะปรากฏตรงนี้'}
 ]};
 localStorage.setItem(PREVIEW_KEY,JSON.stringify(payload));
 const f=$('studentPreviewFrame');
 try{f.contentWindow?.postMessage({type:'ONLINE_EXAM_PREVIEW',payload},location.origin)}catch(_){}
}
window.onlineExamBank={questions:()=>bank.map(x=>({...x,choices:x.choices?{...x.choices}:undefined}))};

function watchExamTools(){
 const obs=new MutationObserver(()=>{if($('publishExamBtn'))$('publishExamBtn').classList.add('pro-hidden-source');if($('examResultsBtn'))$('examResultsBtn').classList.add('pro-hidden-source')});obs.observe(document.body,{childList:true,subtree:true});
}
function init(){
 initHeader();buildShell();watchExamTools();
 ['subject','topic','customTitle'].forEach(id=>$(id)?.addEventListener('input',()=>{if(document.body.dataset.proMode==='exam')setTimeout(updatePreview,120)}));
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();