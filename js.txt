(()=>{
const $=id=>document.getElementById(id);
let slides=[],cur=0,theme='blue',researchPoints=[],researchSources=[];
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const defaults=()=>({img:'',imageX:50,imageY:50,imageZoom:100,fade:68,fadeDir:'left',titleSize:54,bodySize:20,imageMode:'editorial'});
function seed(){
 const subject=$('subject')?.value||'รายวิชาอาชีวศึกษา',topic=$('topic')?.value||'หัวข้อการเรียนรู้',code=$('code')?.value||'',level=$('level')?.value||'',school=$('school')?.value||'วิทยาลัยเทคนิคปากช่อง';
 slides=[
  {t:topic,k:`${subject}${code?' • '+code:''}`,b:`${level||'ผู้เรียนอาชีวศึกษา'}\nเรียนรู้ เข้าใจง่าย ฝึกปฏิบัติได้จริง`,type:'cover',...defaults()},
  {t:'เป้าหมายการเรียนรู้',k:'LEARNING OBJECTIVES',b:`อธิบายหลักการสำคัญของ ${topic} ได้\nเชื่อมโยงองค์ประกอบและหน้าที่ได้\nประยุกต์ใช้กับงานอาชีพได้อย่างเหมาะสม`,type:'bullets',...defaults()},
  {t:'ภาพรวมของบทเรียน',k:'BIG PICTURE',b:`มอง ${topic} จากภาพรวมก่อนลงรายละเอียด เพื่อเห็นความสัมพันธ์ระหว่างหลักการ องค์ประกอบ การทำงาน และการนำไปใช้จริง`,type:'visual',...defaults()},
  {t:'หลักการสำคัญ',k:'CORE CONCEPT',b:`ความหมายและพื้นฐาน\nองค์ประกอบที่เกี่ยวข้อง\nความสัมพันธ์ของแต่ละส่วน\nการตรวจสอบผลตามหลักวิชาชีพ`,type:'bullets',...defaults()},
  {t:'องค์ประกอบและหน้าที่',k:'COMPONENTS',b:`ส่วนที่ 1 • หน้าที่หลัก\nส่วนที่ 2 • การเชื่อมโยง\nส่วนที่ 3 • การควบคุม\nส่วนที่ 4 • ความปลอดภัย`,type:'cards',...defaults()},
  {t:'ตัวอย่างในงานจริง',k:'APPLICATION',b:`สังเกตการใช้งานจริงของ ${topic}\nระบุอุปกรณ์หรือข้อมูลที่เกี่ยวข้อง\nอธิบายเหตุผลของการเลือกใช้`,type:'visual',...defaults()},
  {t:'กิจกรรม/แบบฝึกคิด',k:'ACTIVITY',b:`ให้ผู้เรียนอธิบายหลักการด้วยภาษาของตนเอง\nยกตัวอย่างการใช้งานจริง 1 กรณี\nสรุปข้อควรระวังในการทำงาน`,type:'bullets',...defaults()},
  {t:'สรุปท้ายบท',k:'RECAP',b:`เข้าใจหลักการ • เห็นความสัมพันธ์ • นำไปใช้ได้ • ตรวจสอบอย่างปลอดภัย`,type:'visual',...defaults()}
 ];
}
function gradient(s){
 const a=Math.max(0,Math.min(100,Number(s.fade??62)))/100;
 const stop=Math.round(48+(a*24));
 const dir=s.fadeDir||'left';
 if(dir==='right')return `linear-gradient(270deg,rgba(4,20,34,.94) 0%,rgba(4,20,34,.78) 34%,rgba(4,20,34,.18) ${stop}%,rgba(4,20,34,0) 100%)`;
 if(dir==='top')return `linear-gradient(180deg,rgba(4,20,34,.92) 0%,rgba(4,20,34,.60) 38%,rgba(4,20,34,0) 100%)`;
 if(dir==='bottom')return `linear-gradient(0deg,rgba(4,20,34,.92) 0%,rgba(4,20,34,.60) 38%,rgba(4,20,34,0) 100%)`;
 return `linear-gradient(90deg,rgba(4,20,34,.96) 0%,rgba(4,20,34,.80) 36%,rgba(4,20,34,.18) ${stop}%,rgba(4,20,34,0) 100%)`;
}
function placeholder(topic){return `<div class="ss-placeholder"><div class="ss-placeholder-icon">▧</div><b>เพิ่มภาพประกอบ</b><span>อัปโหลด • ค้น Google • สร้างด้วย AI</span><small>${esc(topic)}</small></div>`}
function slideHTML(s,i){
 const lines=String(s.b||'').split('\n').filter(Boolean);
 let body='';
 if(s.type==='cards')body=`<div class="cardgrid">${lines.map((x,j)=>`<div class="card"><b>${String(j+1).padStart(2,'0')}</b><p>${esc(x)}</p></div>`).join('')}</div>`;
 else if(s.type==='bullets')body=`<ul>${lines.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`;
 else body=`<p>${esc(s.b)}</p>`;
 const hasImg=!!s.img;
 return `<div class="slide ${s.type==='cover'?'cover':''} ${hasImg?'has-image':'no-image'} image-${s.imageMode||'editorial'}" data-theme="${theme}">
   <div class="ss-bg" style="${hasImg?`background-image:url('${s.img}');background-position:${Number(s.imageX??50)}% ${Number(s.imageY??50)}%;background-size:${Number(s.imageZoom||100)}% auto;`:''}"></div>
   ${hasImg?`<div class="ss-fade" style="background:${gradient(s)}"></div><button class="ss-image-hit" data-image-hit="1" title="ลากเพื่อจัดตำแหน่งภาพ"><span>ลากภาพเพื่อจัดตำแหน่ง</span></button>`:''}
   <div class="ss-slide-brand"><img src="./pic-logo.png" alt="logo"><div><b>${esc($('school')?.value||'วิทยาลัยเทคนิคปากช่อง')}</b><span>PAKCHONG TECHNICAL COLLEGE</span></div></div>
   <div class="ss-content"><div class="kicker">${esc(s.k)}</div><div class="accent"></div><h${s.type==='cover'?1:2} style="font-size:${Number(s.titleSize||54)}px">${esc(s.t)}</h${s.type==='cover'?1:2}><div class="ss-bodycopy" style="font-size:${Number(s.bodySize||20)}px">${body}</div></div>
   <div class="visual" data-upload-zone="1" title="คลิกเพื่อใส่รูป">${hasImg?'':placeholder(s.t)}</div>
   <div class="ss-foot">เรียนรู้จริง • ฝึกปฏิบัติจริง • ต่อยอดสู่อาชีพ</div><span class="num">${String(i+1).padStart(2,'0')}</span>
  </div>`;
}
function save(){
 const s=slides[cur];if(!s)return;
 if($('sstitle'))s.t=$('sstitle').value||s.t;
 if($('ssbodytext'))s.b=$('ssbodytext').value||s.b;
 if($('sstype'))s.type=$('sstype').value||s.type;
 if($('ssfade'))s.fade=Number($('ssfade').value||62);
 if($('ssfadeDir'))s.fadeDir=$('ssfadeDir').value||'left';
 if($('sstitleSize'))s.titleSize=Number($('sstitleSize').value||54);
 if($('ssbodySize'))s.bodySize=Number($('ssbodySize').value||20);
 if($('ssimageMode'))s.imageMode=$('ssimageMode').value||'editorial';
 localStorage.setItem('vocSlidesV36',JSON.stringify(slides));localStorage.setItem('vocSlideThemeV36',theme);
}
function render(){
 const s=slides[cur];if(!s)return;
 $('sscanvas').innerHTML=slideHTML(s,cur);
 $('ssthumbs').innerHTML=slides.map((x,i)=>`<button class="ssthumb ${i===cur?'active':''}" data-i="${i}"><div class="mini">${x.img?`<img src="${x.img}" alt="">`:'<span>SLIDE</span>'}</div><div><b>${i+1}. ${esc(x.t)}</b><span>${esc(x.k)}</span></div></button>`).join('');
 document.querySelectorAll('.ssthumb').forEach(x=>x.onclick=()=>{save();cur=+x.dataset.i;render()});
 $('sstitle').value=s.t;$('ssbodytext').value=s.b;$('sstype').value=s.type;$('sstheme').value=theme;$('ssfade').value=s.fade??68;$('ssfadeValue').textContent=(s.fade??68)+'%';$('ssfadeDir').value=s.fadeDir||'left';
 if($('sstitleSize')){$('sstitleSize').value=s.titleSize||54;$('sstitleSizeValue').textContent=(s.titleSize||54)+' px'}
 if($('ssbodySize')){$('ssbodySize').value=s.bodySize||20;$('ssbodySizeValue').textContent=(s.bodySize||20)+' px'}
 if($('ssimageMode'))$('ssimageMode').value=s.imageMode||'editorial';
 $('ssimgState').textContent=s.img?'มีภาพในสไลด์นี้ • คลิกบนภาพเพื่อเปลี่ยน':'ยังไม่มีภาพ • คลิกช่องรูปบนสไลด์เพื่อเพิ่ม';
 const zone=$('sscanvas').querySelector('[data-upload-zone]'); if(zone)zone.onclick=()=>{$('ssimage').click()};
 const bg=$('sscanvas').querySelector('.ss-bg'); if(bg&&s.img){bg.style.cursor='grab';}
 const hit=$('sscanvas').querySelector('[data-image-hit]'); if(hit&&s.img)bindImageDrag(hit,s);
 if($('sszoom')){$('sszoom').value=s.imageZoom||100;$('sszoomValue').textContent=(s.imageZoom||100)+'%'}
 if($('ssposx')){$('ssposx').value=s.imageX??50;$('ssposxValue').textContent=Math.round(s.imageX??50)+'%'}
 if($('ssposy')){$('ssposy').value=s.imageY??50;$('ssposyValue').textContent=Math.round(s.imageY??50)+'%'}
}

function bindImageDrag(el,s){
 let active=false,lastX=0,lastY=0;
 const start=e=>{active=true;const p=e.touches?e.touches[0]:e;lastX=p.clientX;lastY=p.clientY;el.classList.add('dragging');e.preventDefault()};
 const move=e=>{if(!active)return;const p=e.touches?e.touches[0]:e;const r=$('sscanvas').getBoundingClientRect();s.imageX=Math.max(0,Math.min(100,(s.imageX??50)+(p.clientX-lastX)/r.width*100));s.imageY=Math.max(0,Math.min(100,(s.imageY??50)+(p.clientY-lastY)/r.height*100));lastX=p.clientX;lastY=p.clientY;const bg=$('sscanvas').querySelector('.ss-bg');if(bg)bg.style.backgroundPosition=`${s.imageX}% ${s.imageY}%`;e.preventDefault()};
 const end=()=>{if(!active)return;active=false;el.classList.remove('dragging');save();render()};
 el.addEventListener('pointerdown',start);window.addEventListener('pointermove',move,{passive:false});window.addEventListener('pointerup',end);
 el.addEventListener('touchstart',start,{passive:false});window.addEventListener('touchmove',move,{passive:false});window.addEventListener('touchend',end);
}
function setImagePreset(x,y){slides[cur].imageX=x;slides[cur].imageY=y;save();render()}

function open(){
 if(!slides.length){try{slides=JSON.parse(localStorage.getItem('vocSlidesV36')||localStorage.getItem('vocSlidesV35')||'[]')}catch{};theme=localStorage.getItem('vocSlideThemeV36')||localStorage.getItem('vocSlideThemeV35')||'blue';if(!slides.length)seed();slides=slides.map(s=>({...defaults(),...s}));}
 $('slideStudio').classList.add('open');render();
}
window.openSlideStudio=open;
function close(){save();$('slideStudio').classList.remove('open');if(window.setTeacherMode)setTimeout(()=>window.setTeacherMode('worksheet'),10)}
function add(){save();slides.splice(cur+1,0,{t:'หัวข้อใหม่',k:'NEW SLIDE',b:'พิมพ์เนื้อหาที่ต้องการสอน',type:'visual',...defaults()});cur++;render()}
function del(){if(slides.length<=1)return;slides.splice(cur,1);cur=Math.max(0,cur-1);render()}
function duplicate(){save();slides.splice(cur+1,0,JSON.parse(JSON.stringify(slides[cur])));cur++;render()}
function fileToSlide(file){if(!file)return;const r=new FileReader();r.onload=()=>{slides[cur].img=r.result;save();render()};r.readAsDataURL(file)}
function googleImages(){const s=slides[cur],q=encodeURIComponent(`${$('subject')?.value||''} ${$('topic')?.value||''} ${s.t||''} technical education illustration`);window.open(`https://www.google.com/search?tbm=isch&q=${q}`,'_blank','noopener')}
function aiImage(){
 const s=slides[cur],sub=$('subject')?.value||'รายวิชาอาชีวศึกษา',top=$('topic')?.value||s.t,style=theme==='dark'?'cinematic dark technical':theme==='warm'?'warm educational editorial':'professional vocational education editorial';
 const prompt=`สร้างภาพประกอบสไลด์การสอนแบบ ${style} อัตราส่วน 16:9 สำหรับวิชา ${sub} เรื่อง ${top} หัวข้อสไลด์ “${s.t}” ให้ภาพดูสมจริง มืออาชีพ เหมาะกับนักเรียนอาชีวศึกษา ไม่มีข้อความบนภาพ เว้นพื้นที่ด้านซ้ายสำหรับวางหัวข้อและคำอธิบาย`;
 navigator.clipboard?.writeText(prompt).catch(()=>{});alert('คัดลอกคำสั่งสร้างภาพแล้ว ระบบจะเปิด ChatGPT ให้สร้างภาพ จากนั้นบันทึกภาพแล้วกลับมากด “อัปโหลดภาพ”');window.open('https://chatgpt.com/','_blank','noopener');
}
function splitPoints(text){return String(text||'').replace(/\[[^\]]*\]/g,' ').split(/(?<=[.!?。]|[ครับค่ะ])\s+|\n+/).map(x=>x.trim().replace(/^[-•\d.)\s]+/,'' )).filter(x=>x.length>=28&&x.length<=360).filter((x,i,a)=>a.findIndex(y=>y.slice(0,55)===x.slice(0,55))===i).slice(0,30)}
function renderResearch(msg){let box=$('ssresults');if(!box)return;if(msg){box.innerHTML=`<div class="ssnotice">${esc(msg)}</div>`;return}box.innerHTML=researchPoints.length?researchPoints.map((x,i)=>`<label class="sspoint"><input type="checkbox" data-rp="${i}" checked><span>${esc(x)}</span></label>`).join(''):`<div class="ssnotice">ยังไม่มีเนื้อหา — วางข้อความจาก AI หรือค้นจากเว็บก่อน</div>`;$('sssourceLinks').innerHTML=researchSources.map(x=>`<div>• <a href="${x.url}" target="_blank" rel="noopener">${esc(x.title)}</a></div>`).join('')}
async function wikiSearch(){let q=($('ssquery')?.value||`${$('subject')?.value||''} ${$('topic')?.value||''}`).trim();if(!q)return;renderResearch('กำลังค้นหาเนื้อหาอ้างอิง…');researchPoints=[];researchSources=[];try{let api='https://th.wikipedia.org/w/api.php?origin=*&action=query&generator=search&gsrsearch='+encodeURIComponent(q)+'&gsrlimit=5&prop=extracts|info&exintro=1&explaintext=1&inprop=url&format=json';let r=await fetch(api);if(!r.ok)throw new Error();let j=await r.json();let pages=Object.values(j.query?.pages||{});pages.forEach(pg=>{researchPoints.push(...splitPoints(pg.extract));researchSources.push({title:pg.title,url:pg.fullurl})});researchPoints=[...new Set(researchPoints)].slice(0,24);renderResearch(researchPoints.length?'':`ไม่พบเนื้อหาสำหรับ “${q}”`)}catch(e){renderResearch('ค้นหาออนไลน์ไม่สำเร็จ ลองใช้ Google หรือวางข้อความจาก AI แทน')}}
function usePasted(){let pts=splitPoints($('sspasted')?.value||'');if(!pts.length){renderResearch('ยังไม่พบประเด็นที่ใช้ได้ ลองวางเนื้อหาให้ยาวขึ้น');return}researchPoints=pts;researchSources=[{title:'เนื้อหาที่ครูวางเอง',url:'#'}];renderResearch()}
function selectedPoints(){return [...document.querySelectorAll('[data-rp]:checked')].map(x=>researchPoints[+x.dataset.rp]).filter(Boolean)}
function buildFromResearch(){let pts=selectedPoints();if(!pts.length){alert('กรุณาเลือกอย่างน้อย 1 ประเด็น');return}let subject=$('subject')?.value||'รายวิชาอาชีวศึกษา',topic=$('topic')?.value||'หัวข้อการเรียนรู้',code=$('code')?.value||'',level=$('level')?.value||'';let groups=[];for(let i=0;i<pts.length;i+=3)groups.push(pts.slice(i,i+3));slides=[{t:topic,k:`${subject}${code?' • '+code:''}`,b:`${level||'ผู้เรียนอาชีวศึกษา'}\nสร้างจากเนื้อหาที่ครูตรวจเลือก`,type:'cover',...defaults()},...groups.slice(0,9).map((g,i)=>({t:i===0?'ความรู้พื้นฐาน':`${topic} • ${i+1}`,k:'CONTENT',b:g.join('\n'),type:g.length>1?'bullets':'visual',...defaults()})),{t:'สรุปท้ายบท',k:'RECAP',b:pts.slice(0,5).map(x=>x.length>110?x.slice(0,107)+'…':x).join('\n'),type:'bullets',...defaults()}];cur=0;render()}
function ppt(){
 save();if(!window.PptxGenJS){alert('ตัวส่งออก PowerPoint ยังโหลดไม่เสร็จ');return}let p=new PptxGenJS();p.layout='LAYOUT_WIDE';p.author='Vocational Learning Studio';
 slides.forEach((s,i)=>{let sl=p.addSlide();sl.background={color:theme==='dark'?'0B1728':theme==='warm'?'FFF6E9':'F7FBFF'};if(s.img){try{sl.addImage({data:s.img,x:0,y:0,w:13.333,h:7.5});}catch(e){}sl.addShape(p.ShapeType.rect,{x:0,y:0,w:8.0,h:7.5,fill:{color:'061522',transparency:18},line:{color:'061522',transparency:100}})}
 sl.addImage({path:'./pic-logo.png',x:.55,y:.45,w:.55,h:.55});sl.addText($('school')?.value||'วิทยาลัยเทคนิคปากช่อง',{x:1.18,y:.46,w:4.2,h:.26,fontFace:'Sarabun',fontSize:10,bold:true,color:s.img?'FFFFFF':'17324A'});sl.addText(s.k,{x:.72,y:1.48,w:5.8,h:.32,fontFace:'Sarabun',fontSize:11,bold:true,color:'F0A941'});sl.addText(s.t,{x:.72,y:1.95,w:6.1,h:1.18,fontFace:'Sarabun',fontSize:Math.max(20,Math.min(38,Number(s.titleSize||54)*.58)),bold:true,color:s.img?'FFFFFF':'143D5B',fit:'shrink'});let arr=String(s.b||'').split('\n').filter(Boolean);if(s.type==='bullets'||s.type==='cards')sl.addText(arr.map(v=>({text:v,options:{bullet:{indent:14}}})),{x:.8,y:3.25,w:5.9,h:2.55,fontFace:'Sarabun',fontSize:Math.max(10,Math.min(24,Number(s.bodySize||20)*.8)),color:s.img?'FFFFFF':'243746',fit:'shrink',breakLine:true,paraSpaceAfterPt:8});else sl.addText(s.b,{x:.8,y:3.25,w:5.9,h:2.3,fontFace:'Sarabun',fontSize:Math.max(10,Math.min(25,Number(s.bodySize||20)*.85)),color:s.img?'FFFFFF':'243746',fit:'shrink'});sl.addText(String(i+1).padStart(2,'0'),{x:12.15,y:6.85,w:.5,h:.25,fontSize:10,color:'AAB8C2'});});
 p.writeFile({fileName:`${($('subject')?.value||'บทเรียน').replace(/[\\/:*?"<>|]/g,'-')}-${($('topic')?.value||'สไลด์').replace(/[\\/:*?"<>|]/g,'-')}.pptx`})
}
function pdf(){save();let host=document.createElement('div');host.id='ssprintHost';slides.forEach((s,i)=>{let pg=document.createElement('div');pg.className='ssprintpage';pg.innerHTML=`<div class="sscanvas">${slideHTML(s,i)}</div>`;host.appendChild(pg)});$('slideStudio').appendChild(host);document.body.classList.add('ssprinting');setTimeout(()=>{window.print();setTimeout(()=>{document.body.classList.remove('ssprinting');host.remove()},600)},150)}
document.addEventListener('DOMContentLoaded',()=>{
 document.body.insertAdjacentHTML('beforeend',`<div id="slideStudio">
  <header class="ssbar"><div class="ssbrand"><img src="./pic-logo.png"><div><b>Vocational Learning Studio</b><span>Slide Studio • สื่อการสอน 16:9</span></div></div><div class="sstools"><button class="ssbtn" id="ssundo" disabled>↶</button><button class="ssbtn" id="ssadd">＋ เพิ่มสไลด์</button><button class="ssbtn" id="ssdup">ทำสำเนา</button><button class="ssbtn danger" id="ssdel">ลบ</button><button class="ssbtn" id="sspdf">PDF</button><button class="ssbtn primary" id="ssppt">PowerPoint</button><button class="ssbtn" id="ssclose">ปิด</button></div></header>
  <div class="ssbody">
   <aside class="ssleft"><div class="ssleft-title"><b>รายการสไลด์</b><span id="sscount"></span></div><div id="ssthumbs"></div></aside>
   <main class="sscenter"><div class="sseditbar"><span>สไลด์ปัจจุบัน</span><button id="ssquickUpload">▣ เพิ่มภาพ</button><button id="ssquickGoogle">G ค้น Google</button><button id="ssquickAI">✦ AI สร้างภาพ</button></div><div class="sscanvas" id="sscanvas"></div><div class="sseditpanel"><div><label>หัวข้อหลัก</label><input id="sstitle"></div><div><label>เนื้อหา</label><textarea id="ssbodytext"></textarea></div><div><label>รูปแบบ</label><select id="sstype"><option value="cover">หน้าปก</option><option value="visual">ข้อความ + ภาพ</option><option value="bullets">หัวข้อย่อย</option><option value="cards">การ์ดข้อมูล</option></select></div><div class="ss-font-control"><label>ขนาดหัวข้อ <b id="sstitleSizeValue">54 px</b></label><input id="sstitleSize" type="range" min="28" max="78" value="54"></div><div class="ss-font-control"><label>ขนาดเนื้อหา <b id="ssbodySizeValue">20 px</b></label><input id="ssbodySize" type="range" min="12" max="34" value="20"></div><button class="ssapply" id="ssapply">อัปเดตสไลด์</button></div></main>
   <aside class="ssright">
    <div class="ss-tabs"><button class="active" data-sstab="image">รูปภาพ</button><button data-sstab="content">เนื้อหา</button><button data-sstab="style">สไตล์</button></div>
    <section id="sstab-image" class="sstabpane active"><h3>รูปภาพสไลด์</h3><p class="ssmuted" id="ssimgState"></p><div class="sssourceBtns"><button class="ssaction ai" id="ssaiimage">✦ สร้างภาพด้วย AI</button><button class="ssaction" id="ssgoogleimg">G ค้น Google Images</button><label class="ssaction upload">▣ อัปโหลดเอง<input id="ssimage" type="file" accept="image/*"></label></div><div class="ssnote"><b>ใส่รูปง่าย:</b> ถ้ายังไม่มีภาพ จะเห็นปุ่ม + เพิ่มรูปภาพบนสไลด์ เมื่อใส่แล้วลากภาพด้วยนิ้ว/เมาส์เพื่อจัดตำแหน่งได้</div><div class="ss-image-controls"><div class="sscontrol"><label>ซูมภาพ <b id="sszoomValue">100%</b></label><input id="sszoom" type="range" min="100" max="240" value="100"></div><div class="sscontrol"><label>ตำแหน่งแนวนอน <b id="ssposxValue">50%</b></label><input id="ssposx" type="range" min="0" max="100" value="50"></div><div class="sscontrol"><label>ตำแหน่งแนวตั้ง <b id="ssposyValue">50%</b></label><input id="ssposy" type="range" min="0" max="100" value="50"></div><div class="ss-presets"><button data-pos="0,50">ซ้าย</button><button data-pos="50,50">กลาง</button><button data-pos="100,50">ขวา</button><button data-pos="50,0">บน</button><button data-pos="50,100">ล่าง</button></div></div><div class="sscontrol"><label>การวางภาพ</label><select id="ssimageMode"><option value="editorial">Editorial เต็มพื้นหลัง + เฟด</option><option value="split">Split ภาพด้านขวา</option><option value="panel">Panel ภาพในกรอบ</option></select></div><div class="sscontrol"><label>แถบไล่เฟดทับภาพ <b id="ssfadeValue">68%</b></label><input id="ssfade" type="range" min="0" max="100" value="62"></div><div class="sscontrol"><label>ทิศทางเฟด</label><select id="ssfadeDir"><option value="left">ซ้าย → ขวา</option><option value="right">ขวา → ซ้าย</option><option value="top">บน → ล่าง</option><option value="bottom">ล่าง → บน</option></select></div><button class="ssaction danger" id="ssremoveimg">ลบรูปออกจากสไลด์</button></section>
    <section id="sstab-content" class="sstabpane"><h3>หาเนื้อหา</h3><div class="sssourceBtns"><button class="ssaction ai" id="ssai">เปิด AI พร้อมคำสั่ง</button><button class="ssaction" id="ssgoogle">G ค้น Google</button></div><textarea class="sspaste" id="sspasted" placeholder="วางข้อความจาก AI / เอกสาร / เว็บไซต์ตรงนี้"></textarea><div class="ssrow"><button class="sssmall" id="ssusepaste">วิเคราะห์ข้อความ</button><button class="sssmall" id="sssearch">ค้น Wikipedia</button></div><input id="ssquery" class="ssinput" placeholder="คำค้น: ชื่อวิชา + หัวข้อ"><div id="ssresults" class="ssresults"></div><div id="sssourceLinks" class="sssourceLinks"></div><button class="ssaction ai" id="ssbuildcontent">สร้างสไลด์จากประเด็นที่เลือก</button></section>
    <section id="sstab-style" class="sstabpane"><h3>ชุดรูปแบบ</h3><div class="ssthemes"><button data-theme="blue" class="active"><span class="theme blue"></span><b>Modern Blue</b></button><button data-theme="dark"><span class="theme dark"></span><b>Dark Tech</b></button><button data-theme="warm"><span class="theme warm"></span><b>Warm Classroom</b></button><button data-theme="minimal"><span class="theme minimal"></span><b>Minimal Clean</b></button></div><select id="sstheme" hidden><option value="blue">blue</option><option value="dark">dark</option><option value="warm">warm</option><option value="minimal">minimal</option></select></section>
   </aside>
  </div>
 </div>`);
 const bind=(id,fn)=>$(id)&&( $(id).onclick=fn );
 bind('ssclose',close);bind('ssadd',add);bind('ssdup',duplicate);bind('ssdel',del);bind('ssapply',()=>{save();render()});bind('sspdf',pdf);bind('ssppt',ppt);bind('ssremoveimg',()=>{slides[cur].img='';save();render()});bind('ssgoogleimg',googleImages);bind('ssquickGoogle',googleImages);bind('ssaiimage',aiImage);bind('ssquickAI',aiImage);bind('ssquickUpload',()=>$('ssimage').click());
 $('ssimage').onchange=e=>fileToSlide(e.target.files?.[0]);$('ssfade').oninput=e=>{$('ssfadeValue').textContent=e.target.value+'%';slides[cur].fade=Number(e.target.value);render()};$('ssfadeDir').onchange=e=>{slides[cur].fadeDir=e.target.value;render()};
 $('sstitleSize').oninput=e=>{slides[cur].titleSize=Number(e.target.value);render()};
 $('ssbodySize').oninput=e=>{slides[cur].bodySize=Number(e.target.value);render()};
 $('ssimageMode').onchange=e=>{slides[cur].imageMode=e.target.value;render()};
 if($('sszoom'))$('sszoom').oninput=e=>{slides[cur].imageZoom=Number(e.target.value);render()};
 if($('ssposx'))$('ssposx').oninput=e=>{slides[cur].imageX=Number(e.target.value);render()};
 if($('ssposy'))$('ssposy').oninput=e=>{slides[cur].imageY=Number(e.target.value);render()};
 document.querySelectorAll('[data-pos]').forEach(b=>b.onclick=()=>{const [x,y]=b.dataset.pos.split(',').map(Number);setImagePreset(x,y)});
 document.querySelectorAll('[data-sstab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-sstab]').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('.sstabpane').forEach(x=>x.classList.remove('active'));$('sstab-'+b.dataset.sstab).classList.add('active')});
 document.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{theme=b.dataset.theme;document.querySelectorAll('[data-theme]').forEach(x=>x.classList.toggle('active',x===b));save();render()});
 bind('ssgoogle',()=>{let q=encodeURIComponent(`${$('subject')?.value||''} ${$('topic')?.value||''}`.trim());window.open('https://www.google.com/search?q='+q,'_blank','noopener')});
 bind('ssai',()=>{let sub=$('subject')?.value||'รายวิชาอาชีวศึกษา',top=$('topic')?.value||'หัวข้อบทเรียน',lvl=$('level')?.value||'อาชีวศึกษา';let prompt=`สร้างเนื้อหาสไลด์การสอน วิชา ${sub} เรื่อง ${top} ระดับ ${lvl} จำนวน 10 สไลด์ ภาษาไทยกระชับ ถูกต้อง เรียงจากพื้นฐานไปประยุกต์ แต่ละสไลด์ให้มีหัวข้อและเนื้อหา 2-4 ประเด็น`;navigator.clipboard?.writeText(prompt).catch(()=>{});window.open('https://chatgpt.com/','_blank','noopener')});
 bind('sssearch',wikiSearch);bind('ssusepaste',usePasted);bind('ssbuildcontent',buildFromResearch);renderResearch();
});
})();
