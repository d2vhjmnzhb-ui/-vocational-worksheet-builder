/* V64: bounded, acknowledged writes, version preflight and mobile image resizing. */
(()=>{'use strict';
const API='https://script.google.com/macros/s/AKfycbyV7dVAFmte-KyR2-75Hu6x5ErAZf9PXTr04EiE-EKlohkOs1rUS9uz8DLgW28gWU_Y/exec';
const errors={WORK_CLOSED:'ครูปิดรับงานนี้แล้ว ยังดูงานเดิมได้ แต่ส่งหรือแก้ไขไม่ได้',EXAM_MANAGED_SEPARATELY:'ปิดรับข้อสอบจากเมนูข้อสอบที่เผยแพร่แล้ว',INVALID_RECEIVING:'สถานะรับงานไม่ถูกต้อง',INVALID_CATEGORY:'เลือกหมวดคะแนนให้ถูกต้อง',INVALID_WEIGHTS:'น้ำหนักทั้ง 4 หมวดต้องรวมกันได้ 100 คะแนน',INVALID_SCORING_MODE:'รูปแบบรวมคะแนนไม่ถูกต้อง',FILES_ONLY:'งานนี้รับเฉพาะไฟล์ ไม่รับข้อความหรือลิงก์',FILE_REQUIRED:'กรุณาแนบไฟล์ก่อนส่งงาน',WRONG_FILE_TYPE:'ชนิดไฟล์ไม่ตรงกับที่ครูกำหนด',TEXT_ONLY:'งานนี้รับเฉพาะข้อความ',LINK_ONLY:'งานนี้รับเฉพาะลิงก์',INVALID_VISIBILITY:'การเผยแพร่คะแนนไม่ถูกต้อง',TEACHER_AUTH_REQUIRED:'การเชื่อมต่อครูหมดอายุ กรุณาเชื่อมต่ออีกครั้ง',STUDENT_AUTH_REQUIRED:'ไม่พบรหัสนักเรียนนี้ในห้อง กรุณาตรวจรหัสหรือแจ้งครู',PERSONAL_LINK_REQUIRED:'ห้องนี้ใช้ลิงก์ส่วนตัว กรุณาเปิดลิงก์ที่ครูส่งให้โดยตรง',RUN_SETUP_V55:'ยังไม่ได้เปิดสิทธิ์แนบไฟล์ ครูต้องรัน setupV64 และ Deploy เวอร์ชันใหม่',INVALID_SCORE:'คะแนนต้องอยู่ระหว่าง 0 ถึงคะแนนเต็ม',REVISION_CONFLICT:'งานถูกเปลี่ยนแล้ว กดอัปเดตคะแนนก่อนส่ง/ตรวจอีกครั้ง',INVALID_EXAM:'ไม่พบรหัสข้อสอบนี้',INVALID_ROSTER:'รายชื่อต้องมีรหัสและชื่อ ไม่ซ้ำกัน และไม่เกิน 300 คน',ROSTER_REMOVE_NOT_ALLOWED:'กรุณาคงรายชื่อเดิมไว้เพื่อรักษาคะแนน',EMPTY_SUBMISSION:'เลือกรูป/ไฟล์ หรือพิมพ์คำตอบก่อนกดส่ง',INVALID_URL:'ตรวจลิงก์งานอีกครั้ง เช่น https://drive.google.com/…',FILE_TOO_LARGE:'ไฟล์ใหญ่เกิน 3 MB หรือรวมเกิน 6 MB',FILE_LIMIT:'แนบได้ไม่เกิน 3 ไฟล์ต่อหนึ่งงาน',INVALID_FILE:'รองรับรูป JPG PNG WebP HEIC และ PDF DOCX XLSX PPTX TXT',UNKNOWN_ACTION:'ระบบออนไลน์ยังเป็นเวอร์ชันเก่า ครูต้อง Deploy Code.gs ของ V64',REQUEST_ID_REQUIRED:'กรุณาเปิดเว็บ V64 ใหม่',SERVER_BUSY:'มีผู้ส่งงานพร้อมกันมาก กรุณาลองส่งอีกครั้ง',INVALID_GRADE_SCALE:'คะแนนขั้นต่ำต้องเรียงจากมากไปน้อย ไม่ซ้ำกัน และแถวสุดท้ายต้องเป็น 0',CLASS_NOT_FOUND:'ไม่พบห้องเรียนนี้ กรุณาขอลิงก์ห้องจากครู',SERVER_ERROR:'ระบบออนไลน์ทำงานผิดพลาด กรุณาแจ้งครูตรวจ Apps Script และสิทธิ์ Sheet/Drive'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function get(action,params={},timeout=15000){return new Promise((resolve,reject)=>{
 const cb='work_'+crypto.getRandomValues(new Uint32Array(3)).join('_'),script=document.createElement('script');let settled=false;
 const done=(error,value)=>{if(settled)return;settled=true;clearTimeout(timer);script.remove();window[cb]=()=>{};setTimeout(()=>delete window[cb],60000);error?reject(error):resolve(value)};
 const timer=setTimeout(()=>done(Error('เชื่อมต่อช้า กรุณาตรวจอินเทอร์เน็ตแล้วลองอีกครั้ง')),timeout);
 window[cb]=r=>{if(r&&r.ok){if(r.apiVersion==='V64')healthyAt=Date.now();return done(null,r);}const e=Error(errors[r?.errorCode]||r?.errorCode||'โหลดข้อมูลไม่สำเร็จ');e.server=true;done(e)};
 script.onerror=()=>done(Error('ติดต่อระบบออนไลน์ไม่ได้ ตรวจอินเทอร์เน็ตหรือลิงก์ Apps Script'));script.src=API+'?'+new URLSearchParams({action,...params,callback:cb});document.head.appendChild(script);
});}
function id(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('')}
const pendingWrites=new Map();let healthyAt=0;
async function health(){if(Date.now()-healthyAt<30000)return;const r=await get('workHealth');if(r.apiVersion!=='V64')throw Error(errors.UNKNOWN_ACTION);healthyAt=Date.now()}
async function mutate(body,onProgress=()=>{}){
 await health();const fingerprint=JSON.stringify(body);body={...body,requestId:body.requestId||pendingWrites.get(fingerprint)||id()};pendingWrites.set(fingerprint,body.requestId);
 const controller=new AbortController(),until=Date.now()+55000;let networkFailed=false;
 const posting=fetch(API,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body),signal:controller.signal}).catch(()=>{networkFailed=true});
 try{let n=0;while(Date.now()<until){onProgress(n++?'รอระบบยืนยัน… กรุณาอย่าปิดหน้านี้':'กำลังส่งงาน…');await new Promise(r=>setTimeout(r,Math.min(800+n*200,2200)));const remaining=until-Date.now();if(remaining<=0)break;
 let r;try{r=await get('workReceipt',{requestId:body.requestId},Math.min(6000,remaining))}catch(e){if(e.server){pendingWrites.delete(fingerprint);throw e}continue}if(!r.pending){pendingWrites.delete(fingerprint);return r;}}
 throw Error(networkFailed?'ส่งผ่านเครือข่ายไม่สำเร็จ ข้อมูลที่เลือกยังอยู่ ลองกดส่งอีกครั้งได้':'ยังไม่ยืนยันการบันทึก กดอัปเดตคะแนนตรวจสอบ หรือกดส่งซ้ำด้วยข้อมูลเดิมได้');
 }finally{controller.abort();void posting}
}
function safeUrl(s){try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
function normalizeUrl(s){s=String(s||'').trim();if(!s)return '';if(!/^https?:\/\//i.test(s)&&/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(s))s='https://'+s;return s}
function date(s){return s?new Date(s).toLocaleString('th-TH',{timeZone:'Asia/Bangkok'}):'ไม่กำหนด'}
async function resizedImage(file){
 if(!/^image\/(jpeg|png|webp)$/.test(file.type)||file.size<800*1024)return file;
 const url=URL.createObjectURL(file);try{const img=new Image();img.src=url;await new Promise((r,j)=>{img.onload=r;img.onerror=j});const scale=Math.min(1,1800/Math.max(img.width,img.height)),c=document.createElement('canvas');c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,c.width,c.height);g.drawImage(img,0,0,c.width,c.height);const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',.85));return blob&&blob.size<file.size?new File([blob],file.name.replace(/\.[^.]+$/,'.jpg'),{type:'image/jpeg'}):file;}catch{return file}finally{URL.revokeObjectURL(url)}
}
async function files(input){let a=Array.from(input||[]);if(a.length>3)throw Error(errors.FILE_LIMIT);a=await Promise.all(a.map(resizedImage));if(a.reduce((n,f)=>n+f.size,0)>6*1024*1024)throw Error('ไฟล์รวมเกิน 6 MB กรุณาลดจำนวนไฟล์');return Promise.all(a.map(f=>{if(f.size>3*1024*1024)throw Error(f.name+': '+errors.FILE_TOO_LARGE);if(!/\.(jpe?g|png|webp|heic|heif|pdf|docx|xlsx|pptx|txt)$/i.test(f.name))throw Error(errors.INVALID_FILE);return new Promise((resolve,reject)=>{const r=new FileReader();r.onerror=()=>reject(Error('อ่านไฟล์ไม่สำเร็จ'));r.onload=()=>resolve({name:f.name,base64:String(r.result).split(',')[1]});r.readAsDataURL(f)});}));}
window.WorkAPI={get,mutate,id,esc,safeUrl,normalizeUrl,date,files,health};
})();
