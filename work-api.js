/* V55 shared transport: no opaque-response success claims. */
(()=>{'use strict';
const API='https://script.google.com/macros/s/AKfycbxunyrg12A_Fv4fM-6GZZ4rVXz07-EN_rRGsTbBQZmsLcjFnLeLgNX3t-vyHH8d7Xfqgw/exec';
const errors={TEACHER_AUTH_REQUIRED:'กรุณาใส่กุญแจครูจาก setupV55',STUDENT_AUTH_REQUIRED:'รหัสนักเรียนหรือรหัสเข้าดูงานไม่ถูกต้อง',RUN_SETUP_V55:'ครูต้องรัน setupV55 และ Deploy Apps Script V55 ก่อน',INVALID_SCORE:'คะแนนต้องอยู่ระหว่าง 0 ถึงคะแนนเต็ม',REVISION_CONFLICT:'งานถูกส่งใหม่แล้ว กรุณารีเฟรชและตรวจฉบับล่าสุด',INVALID_EXAM:'ไม่พบรหัสข้อสอบนี้',INVALID_ROSTER:'ตรวจรายชื่อ: ต้องมีรหัสและชื่อ ไม่ซ้ำกัน และไม่เกิน 300 คน',ROSTER_REMOVE_NOT_ALLOWED:'ยังไม่อนุญาตลบรายชื่อเดิมเพื่อรักษาคะแนน กรุณาคงรายชื่อเดิมไว้',EMPTY_SUBMISSION:'กรุณาใส่ข้อความ ลิงก์ หรือแนบไฟล์ก่อนส่ง',INVALID_URL:'ลิงก์ต้องเริ่มด้วย https:// หรือ http://',FILE_TOO_LARGE:'ไฟล์ละไม่เกิน 3 MB รวมไม่เกิน 6 MB',FILE_LIMIT:'แนบได้ไม่เกิน 3 ไฟล์ต่อหนึ่งงาน',INVALID_FILE:'ชนิดไฟล์ไม่รองรับ กรุณาใช้ JPG PNG WebP PDF DOCX XLSX PPTX หรือ TXT',UNKNOWN_ACTION:'กรุณา Deploy Apps Script V55 ก่อนใช้งาน',REQUEST_ID_REQUIRED:'กรุณาอัปเดตหน้าเว็บเป็น V55'};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function get(action,params={}){return new Promise((resolve,reject)=>{
 const cb='work_'+crypto.getRandomValues(new Uint32Array(3)).join('_'),script=document.createElement('script');let settled=false;
 const done=(error,value)=>{if(settled)return;settled=true;clearTimeout(timer);script.remove();window[cb]=()=>{};setTimeout(()=>delete window[cb],60000);error?reject(error):resolve(value)};
 const timer=setTimeout(()=>done(Error('การเชื่อมต่อหมดเวลา กรุณาลองอีกครั้ง')),20000);
 window[cb]=r=>{if(r&&r.ok)return done(null,r);const e=Error(errors[r?.errorCode]||r?.errorCode||'โหลดข้อมูลไม่สำเร็จ');e.server=true;done(e)};
 script.onerror=()=>done(Error('เชื่อมต่อไม่ได้ กรุณาตรวจอินเทอร์เน็ต'));script.src=API+'?'+new URLSearchParams({action,...params,callback:cb});document.head.appendChild(script);
});}
function id(){return Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('')}
const pendingWrites=new Map();
async function mutate(body){
 const fingerprint=JSON.stringify(body);body.requestId=body.requestId||pendingWrites.get(fingerprint)||id();pendingWrites.set(fingerprint,body.requestId);const controller=new AbortController(),t=setTimeout(()=>controller.abort(),25000);
 try{await fetch(API,{method:'POST',mode:'no-cors',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(body),signal:controller.signal})}catch(_){/* A lost response can still commit. Check receipt. */}finally{clearTimeout(t)}
 for(let n=0;n<12;n++){await new Promise(r=>setTimeout(r,Math.min(750+n*250,2500)));let r;try{r=await get('workReceipt',{requestId:body.requestId})}catch(e){if(e.server){pendingWrites.delete(fingerprint);throw e}if(n===11)throw e;continue}if(!r.pending){pendingWrites.delete(fingerprint);return r;}}
 throw Error('ยังไม่ได้รับการยืนยัน กรุณารีเฟรชตรวจสอบก่อนส่งซ้ำ (ข้อมูลที่กรอกยังอยู่)');
}
function safeUrl(s){try{const u=new URL(s);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return ''}}
function date(s){return s?new Date(s).toLocaleString('th-TH',{timeZone:'Asia/Bangkok'}):'ไม่กำหนด'}
async function files(input){const a=Array.from(input||[]);if(a.length>3||a.reduce((n,f)=>n+f.size,0)>6*1024*1024)throw Error(errors.FILE_LIMIT+' รวมไม่เกิน 6 MB');return Promise.all(a.map(f=>{if(f.size>3*1024*1024)throw Error(errors.FILE_TOO_LARGE);if(!/\.(jpe?g|png|webp|pdf|docx|xlsx|pptx|txt)$/i.test(f.name))throw Error(errors.INVALID_FILE);return new Promise((resolve,reject)=>{const r=new FileReader();r.onerror=()=>reject(Error('อ่านไฟล์ไม่สำเร็จ'));r.onload=()=>resolve({name:f.name,base64:String(r.result).split(',')[1]});r.readAsDataURL(f)});}));}
window.WorkAPI={get,mutate,id,esc,safeUrl,date,files};
})();
