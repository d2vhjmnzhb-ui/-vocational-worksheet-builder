/* V61: status-only parent report, explicitly excludes all assessment fields. */
(()=>{'use strict';
const esc=WorkAPI.esc;
const state=i=>!i||i.status==='ขาด'?['ขาด','missing']:i.late?['ส่งช้า','late']:['ส่งแล้ว','done'];
window.WorkStatus={open(dash){
 const d=document.getElementById('v55Dialog');
 // Snapshot only the fields permitted in the report. Never render the teacher DOM.
 const works=dash.works.map(w=>({id:w.workId,title:w.title}));
 const students=dash.students.map(s=>({name:s.studentName,id:s.studentId,states:works.map(w=>state(s.items.find(i=>i.workId===w.id)))}));
 const heading=[dash.classInfo.className,dash.classInfo.subject].filter(Boolean).join(' • '),stamp=new Date().toLocaleString('th-TH');
 d.innerHTML=`<h2>ตารางการส่งงาน</h2><p>ข้อมูล ณ ${esc(stamp)} • ภาพแสดงเฉพาะสถานะส่งงาน</p><label>รายชื่อที่ต้องการแสดง<select id="v61Person"><option value="">ทั้งห้อง</option>${students.map((s,n)=>`<option value="${n}">${esc(s.name)}</option>`).join('')}</select></label><div class="v55-actions"><button id="v61Save" class="pro-btn primary">บันทึกภาพส่งผู้ปกครอง</button><button id="v61Close" class="pro-btn secondary">ปิด</button></div><p id="v61Message" role="status"></p><div id="v61Report"></div><div id="v61Images"></div>`;
 const select=d.querySelector('#v61Person'),box=d.querySelector('#v61Report'),images=d.querySelector('#v61Images');let urls=[];
 const selected=()=>select.value===''?students:[students[Number(select.value)]];
 function render(){box.innerHTML=`<h3>${esc(heading)}</h3><div class="v61-overflow"><table class="v61-status"><thead><tr><th>ชื่อ–สกุล</th>${works.map(w=>`<th>${esc(w.title)}</th>`).join('')}<th>ขาด</th></tr></thead><tbody>${selected().map(s=>`<tr><th>${esc(s.name)}</th>${s.states.map(([label,cls])=>`<td class="${cls}">${label}</td>`).join('')}<td>${s.states.filter(x=>x[1]==='missing').length}</td></tr>`).join('')}</tbody></table></div>`;urls.forEach(URL.revokeObjectURL);urls=[];images.innerHTML='';d.querySelector('#v61Message').textContent='';}
 select.onchange=render;render();d.querySelector('#v61Close').onclick=()=>d.close();d.addEventListener('close',()=>{urls.forEach(URL.revokeObjectURL)},{once:true});
 d.querySelector('#v61Save').onclick=async()=>{const b=d.querySelector('#v61Save');b.disabled=true;try{
 await document.fonts.ready;urls.forEach(URL.revokeObjectURL);urls=[];images.innerHTML='';
 const rows=selected();if(!rows.length)throw Error('ยังไม่มีนักเรียนในห้อง');
 const colPages=Math.max(1,Math.ceil(works.length/6)),rowPages=Math.ceil(rows.length/20);let page=0;
 for(let rp=0;rp<rowPages;rp++)for(let cp=0;cp<colPages;cp++){
 const ws=works.slice(cp*6,cp*6+6),ss=rows.slice(rp*20,rp*20+20),width=1100,height=210+ss.length*64;
 const canvas=document.createElement('canvas');canvas.width=width*2;canvas.height=height*2;const ctx=canvas.getContext('2d');ctx.scale(2,2);ctx.fillStyle='#fff';ctx.fillRect(0,0,width,height);
 const text=(value,x,y,max,size=18,color='#173f62')=>{ctx.font=`${size}px system-ui, sans-serif`;ctx.fillStyle=color;let t=String(value??'');while(ctx.measureText(t).width>max&&t.length)t=t.slice(0,-1);if(t!==String(value??''))t+='…';ctx.fillText(t,x,y,max);};
 text('สรุปการส่งงาน',24,36,1040,26);text(heading,24,66,1040,19);text('ข้อมูล ณ '+stamp+' • หน้า '+(++page)+'/'+(colPages*rowPages),24,92,1040,15);
 const nameW=280,colW=(width-48-nameW-70)/Math.max(1,ws.length),y=112;
 ctx.fillStyle='#173f62';ctx.fillRect(24,y,width-48,66);text('ชื่อ–สกุล',34,y+38,nameW-20,18,'#fff');
 ws.forEach((w,j)=>{const x=24+nameW+j*colW;const chars=Array.from(w.title);let line='',lines=[];ctx.font='16px system-ui, sans-serif';for(const c of chars){if(ctx.measureText(line+c).width>colW-14){lines.push(line);line=c}else line+=c}lines.push(line);lines.slice(0,2).forEach((l,k)=>text(l+(k===1&&lines.length>2?'…':''),x+6,y+25+k*23,colW-12,16,'#fff'));});text('ขาด',width-80,y+38,60,18,'#fff');
 ss.forEach((s,r)=>{const yy=178+r*64;ctx.fillStyle=r%2?'#f2f6fa':'#fff';ctx.fillRect(24,yy,width-48,64);text(s.name,34,yy+28,nameW-20,17);text(s.id,34,yy+49,nameW-20,13,'#63778a');s.states.slice(cp*6,cp*6+6).forEach(([label,cls],j)=>{const x=24+nameW+j*colW;ctx.fillStyle={missing:'#ffede8',late:'#fff4d6',done:'#e8f5ee'}[cls];ctx.fillRect(x+2,yy+8,colW-4,46);text(label,x+12,yy+37,colW-22,17,{missing:'#a13c29',late:'#866117',done:'#17654d'}[cls]);});text(s.states.filter(x=>x[1]==='missing').length,width-76,yy+37,55);});
 const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));if(!blob)throw Error('สร้างภาพไม่สำเร็จ');const url=URL.createObjectURL(blob);urls.push(url);const a=document.createElement('a');a.href=url;a.download='work-status-'+page+'.png';a.textContent='ดาวน์โหลดภาพ '+page;a.className='pro-btn secondary';const img=document.createElement('img');img.src=url;img.alt='สรุปการส่งงาน หน้า '+page;images.append(a,img);
 }
 d.querySelector('#v61Message').textContent='สร้างภาพแล้ว กดดาวน์โหลดแต่ละภาพ หรือกดค้างที่ภาพเพื่อบันทึกบน iPad / iPhone';
 }catch(e){d.querySelector('#v61Message').textContent=e.message}finally{b.disabled=false}};
 d.showModal();
}};
})();
