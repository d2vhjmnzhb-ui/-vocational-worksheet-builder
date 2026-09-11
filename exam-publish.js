(() => {
  'use strict';
  const EXAM_API_URL = 'https://script.google.com/macros/s/AKfycbxunyrg12A_Fv4fM-6GZZ4rVXz07-EN_rRGsTbBQZmsLcjFnLeLgNX3t-vyHH8d7Xfqgw/exec';
  const STUDENT_EXAM_URL = './student-exam.html';
  const $ = id => document.getElementById(id);
  const txt = el => (el?.textContent || '').trim();
  const esc = s => String(s ?? '').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]));

  const style=document.createElement('style');
  style.textContent=`
  .exam-publish-btn{width:100%;justify-content:center;background:linear-gradient(135deg,#0e7490,#2563eb)!important;color:#fff!important;padding:12px!important;margin-top:9px!important}
  .exam-modal-backdrop{position:fixed;inset:0;background:#071a2ccc;display:none;align-items:center;justify-content:center;z-index:99999;padding:16px}.exam-modal-backdrop.open{display:flex}
  .exam-modal{width:min(640px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:18px;box-shadow:0 24px 80px #0004;padding:22px;color:#16324f}.exam-modal h2{margin:0 0 5px}.exam-muted{color:#64748b;font-size:.88rem}
  .exam-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.exam-field{margin:10px 0}.exam-field label{display:block;font-size:.86rem;font-weight:700;margin-bottom:5px}.exam-field input,.exam-field select{width:100%;padding:10px 11px;border:1px solid #cfdce6;border-radius:10px;font:inherit}
  .exam-actions{display:flex;gap:9px;justify-content:flex-end;margin-top:16px}.exam-actions button,.exam-copy{border:0;border-radius:10px;padding:10px 15px;font-weight:700;cursor:pointer}.exam-cancel{background:#e8eef3;color:#365164}.exam-confirm{background:#0f6097;color:#fff}.exam-result{margin-top:14px;padding:12px;border-radius:11px;background:#eff8fd;border:1px solid #b9dced;display:none;word-break:break-word}.exam-result a{color:#075985;font-weight:700}.exam-copy{margin-top:8px;background:#e0f2fe;color:#075985}
  @media(max-width:650px){.exam-grid{grid-template-columns:1fr}}
  `;document.head.appendChild(style);

  function getMeta(id,fallback=''){const el=$(id);return el?String(el.value||'').trim():fallback}
  function cleanChoice(s){return String(s).replace(/^\s*[กขคง]\s*[.)]\s*/,'').trim()}
  function getQuestionText(li){const c=li.cloneNode(true);c.querySelectorAll('.question-topic,.choices,.answer,.answer-lines,.answer-inline,.question-visual').forEach(x=>x.remove());return txt(c).replace(/^\s*\d+\s*[.)]\s*/,'').trim()}
  function readQuestions(){
    const out=[];
    document.querySelectorAll('#paper .exercise > li').forEach(li=>{
      const choices=[...li.querySelectorAll('.choices span')].map(x=>cleanChoice(txt(x))).filter(Boolean);
      if(choices.length!==4)return;
      const answerText=txt(li.querySelector('.answer'));
      const m=answerText.match(/(?:เฉลย(?:\/แนวคำตอบ)?|คำตอบ)\s*[:：]?\s*([กขคง])(?:\s*[.)])?/i);
      if(!m)return;
      const q=getQuestionText(li); if(!q)return;
      out.push({q,choices:{ก:choices[0],ข:choices[1],ค:choices[2],ง:choices[3]},answer:m[1]});
    });
    return out;
  }

  function addButton(){
    if($('publishExamBtn'))return;
    const ref=$('generateBtn'); if(!ref)return;
    const b=document.createElement('button');b.type='button';b.id='publishExamBtn';b.className='btn generate exam-publish-btn';b.textContent='▶ เผยแพร่เป็นข้อสอบออนไลน์';
    ref.insertAdjacentElement('afterend',b);b.onclick=openModal;
  }

  const modal=document.createElement('div');modal.className='exam-modal-backdrop';modal.id='examPublishModal';modal.innerHTML=`<div class="exam-modal" role="dialog" aria-modal="true">
  <h2>เผยแพร่เป็นข้อสอบออนไลน์</h2><p class="exam-muted" id="examDetected"></p>
  <div class="exam-field"><label>ชื่อชุดข้อสอบ</label><input id="onlineExamTitle"></div>
  <div class="exam-grid"><div class="exam-field"><label>เวลาสอบ (นาที)</label><input id="onlineExamMinutes" type="number" min="1" max="300" value="50"></div><div class="exam-field"><label>ออกจากหน้าสอบครบกี่ครั้งให้ส่งอัตโนมัติ</label><input id="onlineExamMaxLeave" type="number" min="1" max="20" value="3"></div></div>
  <div class="exam-grid"><div class="exam-field"><label>แสดงคะแนนหลังส่ง</label><select id="onlineExamShowScore"><option value="yes">แสดง</option><option value="no">ไม่แสดง</option></select></div><div class="exam-field"><label>การเข้าสอบ</label><select id="onlineExamOneAttempt"><option value="yes">1 ครั้งต่อรหัสนักเรียน</option><option value="no">อนุญาตหลายครั้ง</option></select></div></div>
  <div class="exam-field"><label>เฉลยหลังส่งข้อสอบ</label><select id="onlineExamAllowReview"><option value="no" selected>ไม่แสดงเฉลยให้นักเรียน</option><option value="yes">ให้นักเรียนดูเฉลยและไล่ดูคำตอบหลังส่ง</option></select><div class="exam-muted">เฉลยจะไม่แสดงระหว่างทำข้อสอบ และจะแสดงได้หลังส่งเท่านั้น</div></div>
  <div class="exam-result" id="onlineExamResult"></div><div class="exam-actions"><button type="button" class="exam-cancel" id="examModalCancel">ปิด</button><button type="button" class="exam-confirm" id="examModalPublish">เผยแพร่</button></div></div>`;
  document.body.appendChild(modal);
  $('examModalCancel').onclick=()=>modal.classList.remove('open');modal.onclick=e=>{if(e.target===modal)modal.classList.remove('open')};

  function openModal(){
    const qs=readQuestions();const r=$('onlineExamResult');r.style.display='none';r.innerHTML='';
    $('onlineExamTitle').value=getMeta('customTitle')||`${getMeta('subject','ข้อสอบ')} - ${getMeta('topic')}`.replace(/\s+-\s*$/,'');
    $('examDetected').textContent=`ตรวจพบข้อสอบปรนัยพร้อมเฉลย ${qs.length} ข้อ จากเอกสารที่กำลังแสดง`;
    if(!qs.length){r.style.display='block';r.textContent='ยังไม่พบข้อสอบปรนัย 4 ตัวเลือกที่มีเฉลย ก ข ค ง กรุณาสร้างข้อสอบก่อน';}
    modal.classList.add('open');
  }
  function jsonp(params,timeout=12000){return new Promise((resolve,reject)=>{const cb='__examcb_'+Date.now()+'_'+Math.random().toString(36).slice(2);const s=document.createElement('script');const t=setTimeout(()=>done(new Error('เชื่อมต่อระบบไม่สำเร็จ')),timeout);function done(err,data){clearTimeout(t);try{delete window[cb]}catch(_){window[cb]=undefined}s.remove();err?reject(err):resolve(data)}window[cb]=data=>done(null,data);const u=new URL(EXAM_API_URL);Object.entries({...params,callback:cb,_t:Date.now()}).forEach(([k,v])=>u.searchParams.set(k,String(v)));s.onerror=()=>done(new Error('เชื่อมต่อระบบไม่สำเร็จ'));s.src=u.href;document.head.appendChild(s)})}
  function makeExamId(){const a=new Uint8Array(6);crypto.getRandomValues(a);return 'EX_'+[...a].map(x=>x.toString(16).padStart(2,'0')).join('').toUpperCase()}
  async function createExamNoCors(payload){await fetch(EXAM_API_URL,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)});for(let i=0;i<12;i++){await new Promise(r=>setTimeout(r,500));const d=await jsonp({action:'getExam',examId:payload.examId}).catch(()=>null);if(d&&d.ok)return d}throw new Error('บันทึกข้อสอบไม่สำเร็จ กรุณาลองอีกครั้ง')}
  $('examModalPublish').onclick=async()=>{
    const result=$('onlineExamResult'),btn=$('examModalPublish');
    try{
      if(EXAM_API_URL.includes('PUT_YOUR'))throw new Error('ยังไม่ได้ใส่ URL ของ Google Apps Script ใน exam-publish.js');
      const questions=readQuestions();if(!questions.length)throw new Error('ไม่พบข้อสอบปรนัยพร้อมเฉลย');
      const title=$('onlineExamTitle').value.trim();if(!title)throw new Error('กรุณาใส่ชื่อชุดข้อสอบ');
      btn.disabled=true;btn.textContent='กำลังเผยแพร่...';result.style.display='block';result.textContent='กำลังบันทึกข้อสอบ...';
      const examId=makeExamId();const d=await createExamNoCors({action:'createExam',examId,title,subject:getMeta('subject'),code:getMeta('code'),level:getMeta('level'),year:getMeta('year'),topic:getMeta('topic'),duration:+$('onlineExamMinutes').value||50,maxLeave:+$('onlineExamMaxLeave').value||3,showScore:$('onlineExamShowScore').value==='yes',oneAttempt:$('onlineExamOneAttempt').value==='yes',allowReview:$('onlineExamAllowReview').value==='yes',questions});
      if(!d.ok)throw new Error(d.error||'เผยแพร่ไม่สำเร็จ');
      const finalExamId=(d&&d.exam&&d.exam.examId)||d.examId||examId;
      const base=new URL(STUDENT_EXAM_URL,location.href).href,link=base+(base.includes('?')?'&':'?')+'exam='+encodeURIComponent(finalExamId);
      result.innerHTML=`<b>เผยแพร่สำเร็จ</b><br>รหัสข้อสอบ: <b>${esc(finalExamId)}</b><br><a href="${esc(link)}" target="_blank" rel="noopener">เปิดลิงก์สำหรับนักเรียน</a><br><button class="exam-copy" id="copyExamLink" type="button">คัดลอกลิงก์</button>`;
      $('copyExamLink').onclick=async()=>{await navigator.clipboard.writeText(link);$('copyExamLink').textContent='คัดลอกแล้ว ✓'};
    }catch(e){result.style.display='block';result.textContent='ไม่สำเร็จ: '+e.message}finally{btn.disabled=false;btn.textContent='เผยแพร่'}
  };
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addButton);else addButton();
})();
