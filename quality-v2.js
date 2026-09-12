(function(){
const $=id=>document.getElementById(id),previousRender=window.render,letters=['ก','ข','ค','ง'];
const banks={ohm:[
{l:'remember',q:'ข้อใดกล่าวถึงกฎของโอห์มได้ถูกต้อง',c:['กระแสไฟฟ้าแปรผันตรงกับแรงดัน เมื่อความต้านทานคงที่','กระแสไฟฟ้าแปรผกผันกับแรงดันทุกกรณี','ความต้านทานมีค่าเท่ากับกำลังไฟฟ้าเสมอ','แรงดันไฟฟ้าไม่สัมพันธ์กับกระแสไฟฟ้า'],a:'กระแสไฟฟ้าแปรผันตรงกับแรงดัน เมื่อความต้านทานคงที่'},
{l:'remember',q:'สมการใดแสดงความสัมพันธ์ตามกฎของโอห์ม',c:['V = IR','V = I/R','I = VR','R = VI'],a:'V = IR'},
{l:'apply',q:'ถ้าต้องการหากระแสไฟฟ้าจากค่าแรงดันและความต้านทาน ควรใช้สมการใด',c:['I = V/R','I = VR','I = R/V','I = V + R'],a:'I = V/R'},
{l:'analyze',q:'วงจรมีแรงดันคงที่ หากความต้านทานเพิ่มขึ้นสองเท่า กระแสไฟฟ้าจะเปลี่ยนอย่างไร',c:['ลดลงเหลือครึ่งหนึ่ง','เพิ่มขึ้นสองเท่า','มีค่าเท่าเดิม','เพิ่มขึ้นสี่เท่า'],a:'ลดลงเหลือครึ่งหนึ่ง'},
{l:'apply',q:'การวัดกระแสไฟฟ้าด้วยมัลติมิเตอร์ควรต่อเครื่องมืออย่างไร',c:['ต่ออนุกรมกับวงจร','ต่อขนานกับแหล่งจ่าย','ต่อคร่อมโหลดโดยไม่เปิดวงจร','ต่อที่จุดใดก็ได้โดยไม่เลือกย่านวัด'],a:'ต่ออนุกรมกับวงจร'},
{l:'apply',q:'ก่อนวัดค่าความต้านทานของอุปกรณ์ในวงจร ควรดำเนินการข้อใดก่อน',c:['ตัดแหล่งจ่ายไฟออกจากวงจร','เพิ่มแรงดันให้สูงที่สุด','ลัดวงจรที่ขั้วอุปกรณ์','เลือกย่านวัดกระแสสูงสุด'],a:'ตัดแหล่งจ่ายไฟออกจากวงจร'},
{l:'analyze',q:'คำนวณได้ว่ากระแสควรเป็น 2 A แต่ค่าที่วัดได้เป็นศูนย์ ควรตรวจสอบสิ่งใดก่อน',c:['การขาดของวงจรและจุดต่อสาย','เพิ่มแรงดันให้สูงขึ้นทันที','ลดค่าความต้านทานโดยไม่ตรวจวงจร','สรุปว่าเครื่องมือเสียโดยไม่ทดสอบ'],a:'การขาดของวงจรและจุดต่อสาย'},
{l:'analyze',q:'ตัวต้านทานร้อนผิดปกติหลังต่อวงจร แนวทางวิเคราะห์ใดเหมาะสมที่สุด',c:['ตรวจกำลังสูญเสียและพิกัดกำลังของตัวต้านทาน','เพิ่มกระแสเพื่อทดสอบความทนทาน','จับตัวต้านทานทันทีเพื่อตรวจอุณหภูมิ','เปลี่ยนเป็นลวดตัวนำแทนตัวต้านทาน'],a:'ตรวจกำลังสูญเสียและพิกัดกำลังของตัวต้านทาน'}],
plc:[
{l:'remember',q:'หน้าที่หลักของ PLC ในระบบควบคุมคือข้อใด',c:['รับข้อมูล ประมวลผลตามโปรแกรม และสั่งเอาต์พุต','เพิ่มแรงดันไฟฟ้าให้มอเตอร์','แปลงไฟฟ้ากระแสสลับเป็นกระแสตรงเท่านั้น','วัดค่าความต้านทานของโหลด'],a:'รับข้อมูล ประมวลผลตามโปรแกรม และสั่งเอาต์พุต'},
{l:'remember',q:'คอนแทค Normally Open ใน Ladder Diagram ทำงานอย่างไรเมื่อเงื่อนไขเป็นจริง',c:['คอนแทคมีสภาวะนำทางตรรกะ','คอนแทคตัดวงจรทางตรรกะ','เอาต์พุตทุกจุดถูกรีเซต','PLC หยุดสแกนโปรแกรม'],a:'คอนแทคมีสภาวะนำทางตรรกะ'},
{l:'apply',q:'วงจร Self-holding เหมาะสำหรับงานใด',c:['รักษาสถานะเอาต์พุตหลังปล่อยปุ่มเริ่ม','วัดความเร็วรอบของมอเตอร์','แปลงสัญญาณแอนะล็อกเป็นดิจิทัล','ป้องกันไฟฟ้าลัดวงจรที่เมนจ่ายไฟ'],a:'รักษาสถานะเอาต์พุตหลังปล่อยปุ่มเริ่ม'},
{l:'apply',q:'ต้องการให้เอาต์พุตทำงานหลังอินพุตครบเวลาที่กำหนด ควรใช้คำสั่งใด',c:['Timer แบบหน่วงเวลาเปิด','Counter แบบนับลง','คำสั่ง Reset เพียงอย่างเดียว','คอนแทคปกติปิดเพียงตัวเดียว'],a:'Timer แบบหน่วงเวลาเปิด'},
{l:'analyze',q:'ไฟสถานะอินพุตติด แต่เอาต์พุตไม่ทำงาน ขั้นตอนตรวจสอบใดเหมาะสมที่สุด',c:['ตรวจเงื่อนไขโปรแกรม สถานะคอยล์ และวงจรเอาต์พุตตามลำดับ','เปลี่ยน PLC ทันทีโดยไม่ตรวจโปรแกรม','เพิ่มแรงดันอินพุตเกินพิกัด','ลัดขั้วเอาต์พุตเพื่อทดสอบ'],a:'ตรวจเงื่อนไขโปรแกรม สถานะคอยล์ และวงจรเอาต์พุตตามลำดับ'},
{l:'analyze',q:'การใช้ SET โดยไม่มีเงื่อนไข RST ที่เหมาะสมอาจทำให้เกิดผลใด',c:['เอาต์พุตค้างทำงานและไม่กลับสู่สถานะที่ต้องการ','Timer หยุดนับทุกตัว','อินพุตทั้งหมดเปลี่ยนเป็นแอนะล็อก','หน่วยความจำถูกลบโดยอัตโนมัติ'],a:'เอาต์พุตค้างทำงานและไม่กลับสู่สถานะที่ต้องการ'}],
transformer:[
{l:'remember',q:'หลักการทำงานพื้นฐานของหม้อแปลงไฟฟ้าอาศัยปรากฏการณ์ใด',c:['การเหนี่ยวนำแม่เหล็กไฟฟ้า','การเปลี่ยนพลังงานเคมีเป็นไฟฟ้า','การสะสมประจุในตัวเก็บประจุ','การนำกระแสทางเดียวของไดโอด'],a:'การเหนี่ยวนำแม่เหล็กไฟฟ้า'},
{l:'remember',q:'หม้อแปลงแบบลดแรงดันมีความสัมพันธ์ของจำนวนรอบขดลวดอย่างไร',c:['ขดทุติยภูมิมีรอบน้อยกว่าขดปฐมภูมิ','ขดทุติยภูมิมีรอบมากกว่าขดปฐมภูมิ','ขดลวดทั้งสองต้องไม่มีแกนร่วมกัน','จำนวนรอบไม่มีผลต่อแรงดัน'],a:'ขดทุติยภูมิมีรอบน้อยกว่าขดปฐมภูมิ'},
{l:'apply',q:'การเลือกหม้อแปลงให้เหมาะกับโหลดควรพิจารณาข้อมูลใดร่วมกัน',c:['แรงดันด้านออก กระแสพิกัด และกำลังโหลด','สีฉนวนและขนาดกล่องเท่านั้น','ความยาวสายโดยไม่ดูพิกัดโหลด','แรงดันด้านเข้าเพียงค่าเดียว'],a:'แรงดันด้านออก กระแสพิกัด และกำลังโหลด'},
{l:'analyze',q:'หม้อแปลงมีเสียงดังและร้อนผิดปกติเมื่อจ่ายโหลด ควรตรวจสอบสาเหตุใดก่อน',c:['ภาระเกินพิกัดหรือการลัดวงจรด้านทุติยภูมิ','จำนวนสกรูฝาครอบไม่เท่ากัน','สีสายด้านปฐมภูมิ','ตำแหน่งฉลากบนตัวหม้อแปลง'],a:'ภาระเกินพิกัดหรือการลัดวงจรด้านทุติยภูมิ'},
{l:'analyze',q:'แรงดันด้านทุติยภูมิลดลงมากเมื่อมีโหลด แนวทางวิเคราะห์ใดเหมาะสมที่สุด',c:['ตรวจพิกัดโหลด แรงดันด้านเข้า และจุดต่อสาย','เพิ่มฟิวส์ให้ใหญ่ขึ้นทันที','ลัดขดลวดบางส่วนเพื่อเพิ่มแรงดัน','ตัดระบบป้องกันออกทั้งหมด'],a:'ตรวจพิกัดโหลด แรงดันด้านเข้า และจุดต่อสาย'}]};
function esc(s){return String(s||'').replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[c]))}
let activeTopic=null;
function data(){try{return JSON.parse(localStorage.getItem('vocResearchDraft'))||{}}catch(e){return{}}}
function topicList(){const d=data(),base=d.topics&&d.topics.length?d.topics:[$('topic').value],all=base.map(x=>String(x||'').trim()).filter(Boolean);return[...new Set(all)]}function topics(){return activeTopic===null?topicList().join(', '):activeTopic}
const summaryStart=/^(?:ดังนั้น|สรุป(?:ว่า)?|กล่าวโดยสรุป|จึงสรุปได้ว่า|เพราะฉะนั้น|ด้วยเหตุนี้)(?:\s|,|:|$)/;
const sourcePatterns=[
 {kind:'abbr',link:'ย่อมาจาก',re:/^(.{2,70}?)\s*ย่อมาจาก\s*(.{2,100})$/i},
 {kind:'advantage',link:'มีข้อดีคือ',re:/^(.{2,70}?)\s*(?:มี)?ข้อดีคือ\s*(.{2,100})$/i},
 {kind:'limitation',link:'มีข้อจำกัดคือ',re:/^(.{2,70}?)\s*(?:มี)?ข้อจำกัดคือ\s*(.{2,100})$/i},
 {kind:'definition',link:'คือ',re:/^(.{2,70}?)\s*คือ\s*(.{2,100})$/i},
 {kind:'meaning',link:'หมายถึง',re:/^(.{2,70}?)\s*หมายถึง\s*(.{2,100})$/i},
 {kind:'function',link:'ทำหน้าที่',re:/^(.{2,70}?)\s*(?:มี)?ทำหน้าที่\s*(.{2,100})$/i},
 {kind:'condition',link:'จะทำงานเมื่อ',re:/^(.{2,70}?)\s*จะทำงานเมื่อ\s*(.{2,100})$/i},
 {kind:'condition',link:'ทำงานเมื่อ',re:/^(.{2,70}?)\s*ทำงานเมื่อ\s*(.{2,100})$/i},
 {kind:'effect',link:'ส่งผลให้',re:/^(.{2,70}?)\s*ส่งผลให้\s*(.{2,100})$/i},
 {kind:'effect',link:'ทำให้เกิด',re:/^(.{2,70}?)\s*ทำให้เกิด\s*(.{2,100})$/i},
 {kind:'measurement',link:'ตรวจสอบด้วย',re:/^(.{2,70}?)\s*ตรวจสอบด้วย\s*(.{2,100})$/i},
 {kind:'measurement',link:'วัดด้วย',re:/^(.{2,70}?)\s*วัดด้วย\s*(.{2,100})$/i},
 {kind:'unit',link:'มีหน่วยเป็น',re:/^(.{2,70}?)\s*มีหน่วยเป็น\s*(.{1,80})$/i},
 {kind:'value',link:'มีค่าเท่ากับ',re:/^(.{2,70}?)\s*มีค่าเท่ากับ\s*(.{1,80})$/i},
 {kind:'procedure',link:'ก่อนดำเนินการต้อง',re:/^ก่อน\s*(.{2,70}?)\s*ต้อง\s*(.{2,100})$/i},
 {kind:'safety',link:'ห้าม',re:/^(.{2,70}?)\s*ห้าม\s*(.{2,100})$/i},
 {kind:'advantage',link:'มีข้อดีคือ',re:/^(.{2,70}?)\s*(?:มี)?ข้อดีคือ\s*(.{2,100})$/i},
 {kind:'limitation',link:'มีข้อจำกัดคือ',re:/^(.{2,70}?)\s*(?:มี)?ข้อจำกัดคือ\s*(.{2,100})$/i},
 {kind:'use',link:'ถูกนำไปใช้ใน',re:/^(.{2,70}?)\s*ถูกนำไปใช้ใน\s*(.{2,100})$/i},
 {kind:'use',link:'ถูกใช้ใน',re:/^(.{2,70}?)\s*ถูกใช้ใน\s*(.{2,100})$/i},
 {kind:'use',link:'นำไปใช้ใน',re:/^(.{2,70}?)\s*นำไปใช้ใน\s*(.{2,100})$/i},
 {kind:'use',link:'นิยมใช้ใน',re:/^(.{2,70}?)\s*นิยมใช้ใน\s*(.{2,100})$/i},
 {kind:'use',link:'ใช้ใน',re:/^(.{2,70}?)\s*ใช้ใน\s*(.{2,100})$/i},
 {kind:'use',link:'ใช้กับ',re:/^(.{2,70}?)\s*ใช้กับ\s*(.{2,100})$/i},
 {kind:'use',link:'ใช้สำหรับ',re:/^(.{2,70}?)\s*ใช้สำหรับ\s*(.{2,100})$/i},
 {kind:'use',link:'ใช้เพื่อ',re:/^(.{2,70}?)\s*ใช้เพื่อ\s*(.{2,100})$/i},
 {kind:'classification',link:'แบ่งเป็น',re:/^(.{2,70}?)\s*(?:แบ่งออก)?เป็น\s*(.{2,100})$/i},
 {kind:'composition',link:'ประกอบด้วย',re:/^(.{2,70}?)\s*ประกอบด้วย\s*(.{2,100})$/i},
 {kind:'principle',link:'ทำงานโดย',re:/^(.{2,70}?)\s*ทำงานโดย\s*(.{2,100})$/i},
 {kind:'principle',link:'อาศัย',re:/^(.{2,70}?)\s*อาศัย\s*(.{2,100})$/i}
];
function cleanFact(x){return String(x||'').replace(/\s+/g,' ').replace(/[.!?。]+$/,'').trim()}
function factSentences(raw){return String(raw||'').replace(/\r/g,'\n').trim().split(/(?:[.!?。;；]\s*|\n+|(?=\s*(?:\d+|[ก-ฮ])\s*[.)]\s*))/).map(cleanFact).filter(x=>x.length>=12&&x.length<=1800&&!summaryStart.test(x))}
function facts(){const d=data(),ids=new Set(d.selected||[]);return(d.sources||[]).filter(s=>ids.has(s.id)&&(activeTopic===null||!s.topic||String(s.topic).trim()===String(activeTopic).trim())).flatMap(s=>factSentences(s.extract||s.snippet)).filter((x,i,a)=>a.indexOf(x)===i)}
function factKey(f){return [f.subject,f.kind,f.link,f.answer].map(x=>cleanFact(x)).join('¦')}
function selectedFactKeys(){const picked=data().factSelections;return Array.isArray(picked)?new Set(picked):null}
function structuredFacts(fs,respectSelection=true){
 const structured=(fs||[]).map(text=>{
   const sentence=cleanFact(text);if(sentence.length<12||sentence.length>180)return null;
   for(const p of sourcePatterns){const m=sentence.match(p.re);if(!m)continue;const subject=cleanFact(m[1]).replace(/^(?:โดยทั่วไป|ในทางปฏิบัติ|สำหรับงาน|ส่วน)\s*/,'').replace(/[,:;]+$/,''),answer=cleanFact(m[2]).replace(/^(?:ใน|กับ)\s+/,'');if(subject.length<2||subject.length>70||answer.length<2||answer.length>100||/^ดังนั้น/.test(subject))continue;return{subject,answer,kind:p.kind,link:p.link,source:sentence,evidence:sentence}}
   return null;
 }).filter(Boolean).filter((x,i,a)=>a.findIndex(y=>y.subject===x.subject&&y.kind===x.kind&&y.answer===x.answer)===i);
 const allText=(fs||[]).join(' '),dcSubject='มอเตอร์กระแสตรง (DC motor)',dcEnergy=/มอเตอร์(?:ไฟฟ้า)?กระแสตรง|DC\s*motor/i.test(allText)&&/ไฟฟ้ากระแสตรง/.test(allText)&&/แรงกล|พลังงานกล/.test(allText);
 if(dcEnergy){const duplicateDefinition=structured.findIndex(f=>f.kind==='definition'&&/มอเตอร์(?:ไฟฟ้า)?กระแสตรง|DC\s*motor/i.test(f.subject)&&/ไฟฟ้ากระแสตรง/.test(f.answer)&&/แรงกล|พลังงานกล/.test(f.answer));if(duplicateDefinition>=0)structured.splice(duplicateDefinition,1);const evidence=(fs||[]).find(x=>/มอเตอร์(?:ไฟฟ้า)?กระแสตรง|DC\s*motor/i.test(x))||cleanFact(allText),dcFacts=[
   {subject:dcSubject,answer:'เปลี่ยนพลังงานไฟฟ้ากระแสตรงเป็นพลังงานกล',kind:'function',link:'ทำหน้าที่',source:'มอเตอร์กระแสตรง (DC motor) ทำหน้าที่เปลี่ยนพลังงานไฟฟ้ากระแสตรงเป็นพลังงานกล',evidence},
   {subject:dcSubject,answer:'พลังงานไฟฟ้ากระแสตรง',kind:'inputEnergy',link:'ใช้พลังงานป้อนเข้าเป็น',source:'มอเตอร์กระแสตรง (DC motor) ใช้พลังงานไฟฟ้ากระแสตรงเป็นพลังงานป้อนเข้า',evidence},
   {subject:dcSubject,answer:'พลังงานกล',kind:'outputEnergy',link:'ให้พลังงานออกเป็น',source:'มอเตอร์กระแสตรง (DC motor) ให้พลังงานออกเป็นพลังงานกล',evidence}
 ];for(const fact of dcFacts.slice().reverse())if(!structured.some(x=>x.subject===fact.subject&&x.kind===fact.kind&&x.answer===fact.answer))structured.unshift(fact)}
 const clauseStart=/(?:มอเตอร์(?:ไฟฟ้า)?|หม้อแปลง|PLC|วงจร|ตัวต้านทาน|ตัวเก็บประจุ|ไดโอด|ทรานซิสเตอร์|รีเลย์|คอนแทคเตอร์|ความเร็ว|กระแส|แรงดัน|กำลัง|อุปกรณ์|ระบบ|การ(?:ทำงาน|วัด|ตรวจสอบ|ควบคุม|ต่อ)|ประเภท|ส่วนประกอบ|นอกจากนี้|โดยทั่วไป)/;
 const passageFacts=[];
 for(const raw of fs||[]){
   if(String(raw).length<=180)continue;
   const words=cleanFact(raw).split(/\s+/),parts=[],starts=[];
   words.forEach((word,i)=>{if(i>0&&clauseStart.test(word))starts.push(i)});
   const cuts=[0,...starts,words.length];
   for(let i=0;i<cuts.length-1;i++){const part=words.slice(cuts[i],cuts[i+1]).join(' ').trim();if(part.length<28||part.length>105||/^(?:คือ|หมายถึง|เนื่องจาก|และ|หรือ|ที่|เพื่อ)/.test(part)||!/(?:คือ|หมายถึง|ใช้|ทำงาน|ควบคุม|วัด|ตรวจสอบ|ประกอบ|แบ่ง|ขึ้นอยู่กับ|สามารถ|มีระบบ|ให้พลังงาน|รับพลังงาน)/.test(part)||summaryStart.test(part))continue;parts.push(part)}
   parts.slice(0,8).forEach(part=>{if(!structured.some(f=>f.answer===part||f.source===part)&&!passageFacts.some(f=>f.answer===part))passageFacts.push({subject:'สาระสำคัญจากเนื้อหาที่เลือก',answer:part,kind:'statement',link:'กล่าวว่า',source:part,evidence:part})})
 }
 structured.push(...passageFacts);
 const picked=selectedFactKeys();return respectSelection&&picked?structured.filter(f=>picked.has(factKey(f))):structured;
}
function factUses(fact){const uses=['ปรนัย','ถาม–ตอบ','ใบงานปฏิบัติ'];if(String(fact.answer||'').length<=55)uses.splice(2,0,'เติมคำ');return uses}
function inspectSource(source){const raw=String(source?.extract||source?.snippet||'').replace(/\s+/g,' ').trim(),items=structuredFacts(factSentences(raw),false);return{raw,items:items.map(f=>({key:factKey(f),evidence:f.evidence||f.source,summary:f.subject+' '+f.link+' '+f.answer,uses:factUses(f)})),count:items.length}}
function domain(){const t=(topics()+' '+facts().join(' ')).toLowerCase();if(/มอเตอร์|motor/.test(t))return'motor';if(/โอห์ม|ohm/.test(t))return'ohm';if(/plc|ladder|gx works|โปรแกรมเมเบิล/.test(t))return'plc';if(/หม้อแปลง|transformer/.test(t))return'transformer';if(/วงจรไฟฟ้า|ความต้านทาน|ตัวต้านทาน|อนุกรม|ขนาน|เคอร์ชอฟฟ์|kirchhoff|kcl|kvl|กำลังไฟฟ้า/.test(t))return'circuit';return''}
function calcOhm(i){const vs=[6,9,12,18,24,30,36,48,60,72],rs=[2,3,4,5,6,8,10,12,15,20],v=vs[i%10],r=rs[(i*3+1)%10],a=+(v/r).toFixed(2);return{l:'apply',q:'วงจรมีแรงดัน '+v+' V และความต้านทาน '+r+' Ω กระแสไฟฟ้ามีค่าเท่าใด',c:[a+' A',+(v*r).toFixed(2)+' A',+(r/v).toFixed(2)+' A',+(a*2).toFixed(2)+' A'],a:a+' A'}}
function circuitCalc(i){const t=[activeTopic||'',...facts()].join(' ');const patterns=/อนุกรม/.test(t)?[1,2,7]:/ขนาน/.test(t)?[3]:/KCL|กระแส.*เคอร์/i.test(t)?[5]:/KVL|แรงดัน.*เคอร์/i.test(t)?[6]:/กำลัง|พลังงาน/.test(t)?[4,8]:/โอห์ม|ohm/i.test(t)?[0,9]:null;if(patterns)i=Math.floor(i/patterns.length)*10+patterns[i%patterns.length];const k=1+Math.floor(i/10),n=i%10;let q,a,u,work;if(n===0)return calcOhm(i);if(n===1){const r1=2*k,r2=5*k;a=r1+r2;u='Ω';q='ตัวต้านทาน '+r1+' Ω และ '+r2+' Ω ต่ออนุกรมกัน ความต้านทานรวมมีค่าเท่าใด';work='Rt = R1 + R2 = '+a+' Ω'}else if(n===2){const r1=2*k,r2=4*k,v=12*k;a=+(v/(r1+r2)).toFixed(2);u='A';q='วงจรอนุกรมมี R1 = '+r1+' Ω, R2 = '+r2+' Ω ต่อกับแหล่งจ่าย '+v+' V กระแสในวงจรมีค่าเท่าใด';work='Rt = '+(r1+r2)+' Ω และ I = V/Rt = '+a+' A'}else if(n===3){const r1=6*k,r2=3*k;a=+((r1*r2)/(r1+r2)).toFixed(2);u='Ω';q='ตัวต้านทาน '+r1+' Ω และ '+r2+' Ω ต่อขนานกัน ความต้านทานรวมมีค่าเท่าใด';work='Rt = (R1R2)/(R1+R2) = '+a+' Ω'}else if(n===4){const v=12*k,current=2*k;a=v*current;u='W';q='โหลดไฟฟ้าใช้แรงดัน '+v+' V และกระแส '+current+' A กำลังไฟฟ้ามีค่าเท่าใด';work='P = VI = '+a+' W'}else if(n===5){const total=8*k,b1=3*k;a=total-b1;u='A';q='ที่จุดต่อหนึ่งมีกระแสไหลเข้า '+total+' A และไหลออกแขนงแรก '+b1+' A ตามกฎ KCL กระแสแขนงที่สองมีค่าเท่าใด';work='Iเข้า = Iออก รวม จึงได้ I2 = '+a+' A'}else if(n===6){const source=18*k,drop=7*k;a=source-drop;u='V';q='วงรอบมีแหล่งจ่าย '+source+' V และแรงดันตกคร่อมอุปกรณ์ตัวแรก '+drop+' V ตามกฎ KVL แรงดันตกคร่อมอุปกรณ์ตัวที่สองมีค่าเท่าใด';work='Vs = V1 + V2 จึงได้ V2 = '+a+' V'}else if(n===7){const v=12*k,r1=2*k,r2=4*k;a=+(v*r2/(r1+r2)).toFixed(2);u='V';q='วงจรแบ่งแรงดันมี R1 = '+r1+' Ω, R2 = '+r2+' Ω และ Vin = '+v+' V แรงดันคร่อม R2 มีค่าเท่าใด';work='Vout = Vin[R2/(R1+R2)] = '+a+' V'}else if(n===8){const p=60*k,t=3;a=p*t;u='Wh';q='อุปกรณ์กำลัง '+p+' W ทำงานเป็นเวลา '+t+' ชั่วโมง ใช้พลังงานไฟฟ้าเท่าใด';work='E = Pt = '+a+' Wh'}else{const v=24*k,current=3*k;a=+(v/current).toFixed(2);u='Ω';q='อุปกรณ์รับแรงดัน '+v+' V และมีกระแส '+current+' A ความต้านทานมีค่าเท่าใด';work='R = V/I = '+a+' Ω'}const nums=[a,+(a*2).toFixed(2),+(a/2).toFixed(2),+(a+2*k).toFixed(2)];return{l:n>=5?'analyze':'apply',q,c:nums.map(x=>x+' '+u),a:a+' '+u+'; '+work}}
function sourceItems(n){
 const fs=facts(),out=[],type=$('type').value,isFill=type==='เติมคำ',isQna=type==='ถาม–ตอบ',isPractice=type==='ใบงานปฏิบัติ';
 const uniq=a=>[...new Set(a.map(x=>String(x??'').replace(/\s+/g,' ').trim()).filter(Boolean))];
 const structured=structuredFacts(fs);
 const distractorBank=['อุปกรณ์สำหรับวัดค่าทางไฟฟ้า','อุปกรณ์สำหรับเก็บพลังงานไฟฟ้า','หน่วยวัดค่าทางไฟฟ้า','อุปกรณ์ป้องกันวงจรไฟฟ้า','ขั้นตอนตรวจสอบการทำงานของระบบ'];
 const answerPool=uniq(structured.map(x=>x.answer));
 const choicesFor=(fact,index)=>{
   const sameKind=structured.filter(x=>x.kind===fact.kind&&x.answer!==fact.answer).map(x=>x.answer);
   const cross=answerPool.filter(x=>x!==fact.answer);
   const pool=uniq([...sameKind,...cross,...distractorBank]);
   const start=index%Math.max(pool.length,1),rot=pool.slice(start).concat(pool.slice(0,start));
   return uniq([fact.answer,...rot]).slice(0,4);
 };
 const statement=f=>f.subject+' '+f.link+' '+f.answer;
 const negate=f=>{
   if(f.link==='คือ')return f.subject+' ไม่ใช่ '+f.answer;
   if(f.link==='หมายถึง')return f.subject+' ไม่ได้หมายถึง '+f.answer;
   if(f.link==='ย่อมาจาก')return f.subject+' ไม่ได้ย่อมาจาก '+f.answer;
   if(f.link==='ใช้สำหรับ')return f.subject+' ไม่ได้ใช้สำหรับ '+f.answer;
   if(f.link==='ใช้เพื่อ')return f.subject+' ไม่ได้ใช้เพื่อ '+f.answer;
   if(f.link==='แบ่งเป็น')return f.subject+' ไม่ได้แบ่งเป็น '+f.answer;
   if(f.link==='ประกอบด้วย')return f.subject+' ไม่ได้ประกอบด้วย '+f.answer;
   if(f.link==='ทำงานโดย')return f.subject+' ไม่ได้ทำงานโดย '+f.answer;
   if(f.link==='อาศัย')return f.subject+' ไม่ได้อาศัย '+f.answer;
   if(f.link==='ใช้พลังงานป้อนเข้าเป็น')return f.subject+' ไม่ได้ใช้พลังงานป้อนเข้าเป็น '+f.answer;
   if(f.link==='ให้พลังงานออกเป็น')return f.subject+' ไม่ได้ให้พลังงานออกเป็น '+f.answer;
   return f.subject+' ไม่ได้ทำหน้าที่ '+f.answer;
 };
 const mcqQuestion=(f,index)=>{
   const printedTopic=String(activeTopic||topics()||'หัวข้อที่กำหนด').trim();
   if(f.kind==='abbr')return index%2?'ข้อใดเป็นคำเต็มของ '+f.subject:f.subject+' ย่อมาจากอะไร';
   if(f.kind==='definition'||f.kind==='meaning')return index%2?'ข้อใดอธิบายความหมายของ '+f.subject+' ได้ถูกต้อง':f.subject+' คืออะไร';
   if(f.kind==='function')return index%2?'ข้อใดกล่าวถูกต้องเกี่ยวกับหน้าที่ของ '+f.subject:'หน้าที่ของ'+f.subject+' คือข้อใด';
   if(f.kind==='classification')return index%2?'ข้อใดกล่าวถูกต้องเกี่ยวกับการจำแนก '+f.subject:f.subject+' แบ่งเป็นอะไรบ้าง';
   if(f.kind==='composition')return index%2?'ข้อใดกล่าวถูกต้องเกี่ยวกับส่วนประกอบของ '+f.subject:f.subject+' ประกอบด้วยอะไรบ้าง';
   if(f.kind==='principle')return index%2?'ข้อใดกล่าวถูกต้องเกี่ยวกับหลักการทำงานของ '+f.subject:f.subject+' ทำงานโดยอาศัยอะไร';
   if(f.kind==='condition')return index%2?'ข้อใดกล่าวถูกต้องเกี่ยวกับเงื่อนไขการทำงานของ '+f.subject:f.subject+' จะทำงานเมื่อใด';
   if(f.kind==='effect')return index%2?'ข้อใดกล่าวถูกต้องเกี่ยวกับผลที่เกิดจาก '+f.subject:f.subject+' ทำให้เกิดผลใด';
   if(f.kind==='measurement')return f.subject+' วัดหรือตรวจสอบด้วยสิ่งใด';
   if(f.kind==='unit')return 'หน่วยของ '+f.subject+' คืออะไร';
   if(f.kind==='value')return f.subject+' มีค่าเท่ากับเท่าใด';
   if(f.kind==='procedure')return 'ก่อน'+f.subject+' ควรปฏิบัติอย่างไร';
   if(f.kind==='safety')return 'ข้อใดเป็นข้อห้ามเกี่ยวกับ '+f.subject;
   if(f.kind==='advantage')return 'ข้อดีของ '+f.subject+' คืออะไร';
   if(f.kind==='limitation')return 'ข้อจำกัดของ '+f.subject+' คืออะไร';
   if(f.kind==='statement')return 'ข้อใดกล่าวถูกต้องเกี่ยวกับ'+printedTopic;
   if(f.kind==='inputEnergy')return f.subject+' ใช้พลังงานชนิดใดเป็นพลังงานป้อนเข้า';
   if(f.kind==='outputEnergy')return f.subject+' ให้พลังงานชนิดใดเป็นพลังงานออก';
   if(['ถูกนำไปใช้ใน','ถูกใช้ใน','นำไปใช้ใน','นิยมใช้ใน','ใช้ใน','ใช้กับ'].includes(f.link))return index%2?'ข้อใดกล่าวถูกต้องเกี่ยวกับการนำ '+f.subject+' ไปใช้งาน':f.subject+' ถูกนำไปใช้ในงานหรืออุปกรณ์ใด';
   return index%2?'ข้อใดกล่าวถูกต้องเกี่ยวกับการใช้งานของ '+f.subject:f.subject+' ใช้สำหรับอะไร';
 };
 const practiceQuestion=f=>{
   if(f.kind==='function')return'บันทึกผลการตรวจสอบหน้าที่ของ '+f.subject;
   if(f.kind==='inputEnergy')return'ระบุพลังงานป้อนเข้าที่ใช้ในการทำงานของ '+f.subject;
   if(f.kind==='outputEnergy')return'ระบุพลังงานออกที่ได้จาก '+f.subject;
   if(f.kind==='use')return'ระบุงานหรืออุปกรณ์ที่ใช้ '+f.subject;
   if(f.kind==='classification')return'บันทึกผลการจำแนก '+f.subject;
   if(f.kind==='composition')return'ระบุส่วนประกอบสำคัญของ '+f.subject;
   if(f.kind==='principle')return'อธิบายหลักการทำงานของ '+f.subject+' ที่ตรวจสอบได้';
   if(f.kind==='condition')return'บันทึกเงื่อนไขที่ทำให้ '+f.subject+' ทำงาน';
   if(f.kind==='effect')return'บันทึกผลที่เกิดจาก '+f.subject;
   if(f.kind==='measurement')return'ระบุเครื่องมือสำหรับวัดหรือตรวจสอบ '+f.subject;
   if(f.kind==='unit')return'ระบุหน่วยวัดของ '+f.subject;
   if(f.kind==='value')return'บันทึกค่าที่กำหนดของ '+f.subject;
   if(f.kind==='procedure')return'บันทึกขั้นตอนที่ต้องทำก่อน '+f.subject;
   if(f.kind==='safety')return'บันทึกข้อควรระวังเกี่ยวกับ '+f.subject;
   if(f.kind==='advantage')return'ระบุข้อดีของ '+f.subject;
   if(f.kind==='limitation')return'ระบุข้อจำกัดของ '+f.subject;
   if(f.kind==='statement')return'บันทึกสาระสำคัญที่ตรวจสอบได้จากเนื้อหา';
   return'บันทึกสาระสำคัญของ '+f.subject;
 };
 structured.forEach((fact,index)=>{
   if(isFill){if(fact.answer.length<=55)out.push({l:'remember',q:fact.subject+' '+fact.link+' ................',c:choicesFor(fact,index),a:fact.answer});return}
   if(isQna){const q=fact.kind==='abbr'?'คำเต็มของ '+fact.subject+' คืออะไร':fact.kind==='function'?'หน้าที่ของ'+fact.subject+' คืออะไร':fact.kind==='use'?(['ถูกนำไปใช้ใน','ถูกใช้ใน','นำไปใช้ใน','นิยมใช้ใน','ใช้ใน','ใช้กับ'].includes(fact.link)?fact.subject+' ถูกนำไปใช้ในงานหรืออุปกรณ์ใด':fact.subject+' ใช้สำหรับอะไร'):fact.kind==='classification'?fact.subject+' แบ่งเป็นอะไรบ้าง':fact.kind==='composition'?fact.subject+' ประกอบด้วยอะไรบ้าง':fact.kind==='principle'?fact.subject+' ทำงานโดยอาศัยอะไร':fact.kind==='condition'?fact.subject+' จะทำงานเมื่อใด':fact.kind==='effect'?fact.subject+' ทำให้เกิดผลใด':fact.kind==='measurement'?fact.subject+' วัดหรือตรวจสอบด้วยสิ่งใด':fact.kind==='unit'?'หน่วยของ '+fact.subject+' คืออะไร':fact.kind==='value'?fact.subject+' มีค่าเท่ากับเท่าใด':fact.kind==='procedure'?'ก่อน'+fact.subject+' ต้องทำสิ่งใด':fact.kind==='safety'?'ข้อห้ามเกี่ยวกับ '+fact.subject+' คืออะไร':fact.kind==='advantage'?'ข้อดีของ '+fact.subject+' คืออะไร':fact.kind==='limitation'?'ข้อจำกัดของ '+fact.subject+' คืออะไร':fact.kind==='statement'?'จงบันทึกสาระสำคัญเกี่ยวกับ '+String(activeTopic||topics()||'หัวข้อที่กำหนด').trim():fact.kind==='inputEnergy'?fact.subject+' ใช้พลังงานชนิดใดเป็นพลังงานป้อนเข้า':fact.kind==='outputEnergy'?fact.subject+' ให้พลังงานชนิดใดเป็นพลังงานออก':'อธิบายความหมายของ '+fact.subject+' โดยสังเขป';out.push({l:'understand',q,c:['คำตอบ','—','—','—'],a:fact.answer});return}
   if(isPractice){out.push({l:'apply',q:practiceQuestion(fact),c:['คำตอบ','—','—','—'],a:fact.answer});return}
   const choices=choicesFor(fact,index);if(choices.length===4)out.push({l:'remember',q:mcqQuestion(fact,index),c:choices,a:fact.answer});
 });
 if(!isFill&&!isQna&&!isPractice){const grouped=new Map();structured.filter(f=>f.kind!=='statement').forEach(f=>{const items=grouped.get(f.subject)||[];items.push(f);grouped.set(f.subject,items)});let groupIndex=0;for(const [subject,items] of grouped){const truths=uniq(items.map(statement));if(truths.length<3)continue;const wrong=negate(items[groupIndex%items.length]);out.push({l:'analyze',q:'ข้อใดกล่าวไม่ถูกต้องเกี่ยวกับ '+subject,c:[wrong,...truths.slice(0,3)],a:wrong});groupIndex++}}
 return out.filter((x,i,a)=>x.c&&x.c.length===4&&a.findIndex(y=>y.q===x.q&&y.a===x.a)===i).slice(0,Math.max(n,1));
}
function legacyQuestions(useFacts){const n=Math.max(1,Math.min(60,window.worksheetStudio?.activeCount??(+$('count').value||1)));if(!useFacts||!facts().length)return[];return sourceItems(n).slice(0,n)}
function sourcePlan(limit){
 const names=topicList(),saved=activeTopic,capacities=[];
 try{for(const topic of names){activeTopic=topic;capacities.push({topic,available:sourceItems(60).length})}}finally{activeTopic=saved}
 const total=capacities.reduce((sum,x)=>sum+x.available,0),target=Math.min(Math.max(1,limit),total);
 if(!total)return null;
 const plan=capacities.map(x=>({...x,count:Math.min(x.available,Math.floor(target*x.available/total)),fraction:(target*x.available/total)%1}));
 let remaining=target-plan.reduce((sum,x)=>sum+x.count,0);for(const item of [...plan].sort((a,b)=>b.fraction-a.fraction)){if(!remaining)break;if(item.count<item.available){item.count++;remaining--}}
 return plan;
}
function questions(useFacts){
 const requested=Math.max(1,Math.min(60,+$('count').value||1)),manualAllocation=window.worksheetStudio?.isManual?.(),fallback=window.worksheetStudio?.allocation()||topicList().map((topic,i,a)=>({topic,count:Math.floor(requested/a.length)+(i<(requested%a.length)?1:0)})),plan=useFacts&&!manualAllocation?(sourcePlan(requested)||fallback):fallback;
 const out=[];try{for(const part of plan){if(!part.count)continue;activeTopic=part.topic;if(window.worksheetStudio)window.worksheetStudio.activeCount=part.count;
 const qs=legacyQuestions(useFacts);qs.forEach(q=>out.push({...q,topic:part.topic}));
 }}finally{activeTopic=null;if(window.worksheetStudio)window.worksheetStudio.activeCount=null}return out;
}
function availableQuestionCount(){const saved=activeTopic;try{return Math.min(60,topicList().reduce((sum,topic)=>{activeTopic=topic;return sum+sourceItems(60).length},0))}finally{activeTopic=saved}}
window.worksheetQuality={topics:topicList,questions,availableQuestionCount,inspectSource};
window.worksheetResearch?.refreshSources?.();
function choice(item,i){const shift=i%4,rot=[...item.c.slice(shift),...item.c.slice(0,shift)],correct=item.c.indexOf(item.a.split(';')[0]),ans=letters[(correct-shift+4)%4];return{html:'<div class="choices">'+rot.map((x,n)=>'<span>'+letters[n]+'. '+esc(x)+'</span>').join('')+'</div>',answer:ans+'. '+item.a}}
function images(){const d=data(),chosen=d.image?[{src:d.image}]:[],found=[...document.querySelectorAll('#imageList img')].map(x=>({src:x.src}));return[...chosen,...found].filter((x,i,a)=>a.findIndex(y=>y.src===x.src)===i)}
function dots(){return '<div class="answer-lines" aria-label="พื้นที่สำหรับเขียนคำตอบ"><span>................................................................................................</span></div>'}
function answerArea(){return $('type').value==='ถาม–ตอบ'?'<div class="answer-inline" aria-label="พื้นที่สำหรับเขียนคำตอบ"><b>ตอบ:</b><span></span></div>':$('type').value==='เติมคำ'?'':dots()}
function setResearchStatus(message,tone='info'){const target=$('researchStatus');if(!target)return;target.textContent=message;target.dataset.tone=tone}
function shortageText(made,requested){const missing=Math.max(0,requested-made);return'สร้างได้ '+made+' จากที่ตั้งไว้ '+requested+' ข้อ • ต้องเพิ่มเนื้อหาที่ใช้สร้างโจทย์ได้อีก '+missing+' ประเด็น (กด “ดูส่วนที่ใช้สร้างโจทย์” ใต้เนื้อหาเพื่อเช็กส่วนที่ระบบอ่านได้)'}
function rebuild(useFacts){
 const list=document.querySelector('.exercise');if(!list)return;
 const type=$('type').value,limit=Math.max(1,Math.min(60,+$('count').value||1)),manual=(window.worksheetManual?.items()||[]).slice(0,limit),generated=questions(useFacts).slice(0,Math.max(0,limit-manual.length)),isChoice=type.includes('ปรนัย')||type==='คำนวณ'||type==='แบบผสม';
 list.innerHTML='';
 generated.forEach((item,i)=>{const li=document.createElement('li');let body='<small class="question-topic">'+esc(item.topic)+'</small>'+esc(item.q),answer=item.a;if(item.c&&item.c.length===4&&(isChoice&&(type!=='แบบผสม'||i%3!==2))){const c=choice(item,i);body+=c.html;answer=c.answer}else body+=answerArea();li.innerHTML=body+'<div class="answer"><b>เฉลย/แนวคำตอบ:</b> '+esc(answer)+'</div>';list.appendChild(li)});
 manual.forEach(item=>{const li=document.createElement('li');li.className='manual-question';if(item.kind==='qna'){li.innerHTML='<small class="question-topic">'+esc(item.topic||'โจทย์ที่นำเข้า')+'</small>'+esc(item.question)+'<div class="answer-inline"><b>ตอบ:</b><span></span></div><div class="answer"><b>แนวคำตอบ:</b> '+esc(item.answer||'—')+'</div>'}else{const correct=letters[item.correct]||'ก';li.innerHTML='<small class="question-topic">'+esc(item.topic||'โจทย์ที่ครูเพิ่ม')+'</small>'+esc(item.question)+'<div class="choices">'+item.choices.map((x,n)=>'<span>'+letters[n]+'. '+esc(x)+'</span>').join('')+'</div><div class="answer"><b>เฉลย:</b> '+correct+'. '+esc(item.choices[item.correct])+'</div>'}list.appendChild(li)});
 const total=generated.length+manual.length,score=document.querySelector('.scorebox');if(score)score.innerHTML='คะแนนที่ได้ ______ / '+total+' คะแนน<br>ผู้ตรวจ __________________';
 const instruction=[...document.querySelectorAll('.block')].find(x=>x.querySelector('h3')?.textContent==='คำชี้แจง')?.querySelector('p');
 if(instruction){instruction.textContent=instruction.textContent.replace(/จำนวน \d+ ข้อ|คะแนนเต็ม \d+ คะแนน/g,m=>m.startsWith('จำนวน')?'จำนวน '+total+' ข้อ':'คะแนนเต็ม '+total+' คะแนน');if(!isChoice&&!instruction.textContent.includes('ตอบ:')&&!instruction.textContent.includes('ช่องว่าง'))instruction.textContent+=type==='ถาม–ตอบ'?' ให้เขียนคำตอบหลังคำว่า “ตอบ:”':' ให้เติมคำลงในช่องว่างที่กำหนดด้วยจุด (....)';}
 if(useFacts)setResearchStatus(total<limit?shortageText(total,limit):'สร้างคำถามจากเนื้อหาที่เลือกครบ '+total+' ข้อแล้ว',total<limit?'warning':'success')
}
function documentTitle(){const custom=$('customTitle').value.trim(),k=$('docKind').value,list=topicList();if(custom)return custom;if(list.length<=3){const names=list.length<2?list[0]||$('subject').value:list.slice(0,-1).join(', ')+' และ'+list[list.length-1];return k+' เรื่อง '+names}return k==='ใบงาน'?'ใบงานบูรณาการ รายวิชา'+$('subject').value:k+' รายวิชา'+$('subject').value}function docKind(){const k=$('docKind').value,meta=document.querySelector('.doc-meta h2');if(meta)meta.textContent=documentTitle();const ps=document.querySelectorAll('.doc-meta p');if(ps[1])ps[1].innerHTML='<b>รูปแบบคำถาม:</b> '+esc($('type').value);const no=document.querySelector('.doc-no');if(no)no.innerHTML='ฉบับที่<br><b>01</b>';const exam=k!=='ใบงาน';document.querySelectorAll('.block').forEach(b=>{const h=b.querySelector('h3')?.textContent||'';if(exam&&(h.includes('จุดประสงค์')||h.includes('ความรู้เบื้องต้น')))b.style.display='none'});const ins=[...document.querySelectorAll('.block')].find(x=>x.querySelector('h3')?.textContent.includes('คำชี้แจง'))?.querySelector('p');if(ins&&exam)ins.textContent='ให้ผู้เรียนทำ'+k+'ให้ครบทุกข้อ เลือกคำตอบหรือแสดงวิธีทำตามที่โจทย์กำหนด คะแนนเต็ม '+$('count').value+' คะแนน'}
function practiceExtras(){const p=$('paper');p.querySelectorAll('.practice-image,.practice-summary').forEach(x=>x.remove());if($('type').value!=='ใบงานปฏิบัติ')return;const meta=p.querySelector('.doc-meta'),image=data().image;if(image&&meta)meta.insertAdjacentHTML('afterend','<figure class="practice-image"><img src="'+esc(image)+'" alt="ภาพประกอบการปฏิบัติงาน"><figcaption>ภาพประกอบการปฏิบัติงาน</figcaption></figure>');const list=p.querySelector('.exercise');if(list)list.insertAdjacentHTML('afterend','<section class="block practice-summary"><h3>สรุปผลการปฏิบัติ</h3><p>บันทึกผลที่สังเกตได้ ปัญหาที่พบ วิธีแก้ไข และข้อเสนอแนะ</p>'+dots()+'<p>ผลการตรวจสอบงาน: ............................................................................................</p>'+dots()+'</section>')}
function polish(useFacts){const p=$('paper');if(!p)return;p.querySelectorAll('.foot,.worksheet-image,.sources-print,.source-warning').forEach(x=>x.remove());[...p.querySelectorAll('.student-line span')].filter(x=>x.textContent.trim().startsWith('วันที่')).forEach(x=>x.remove());const crest=p.querySelector('.crest');if(crest)crest.innerHTML='<img src="./pic-logo.png" alt="ตราวิทยาลัยเทคนิคปากช่อง">';docKind();if(!window.worksheetStudio?.renderSpecial()){rebuild(useFacts);practiceExtras()}}
let fromSources=false;if($('type').value==='วิเคราะห์')$('type').value='ปรนัย 4 ตัวเลือก ก ข ค ง';function render(){previousRender();polish(fromSources)}window.render=render;function requestedCapacity(){const requested=Math.max(1,Math.min(60,+$('count').value||1)),available=availableQuestionCount();return{requested,available,missing:Math.max(0,requested-available)}}function generateFromSelected(){
 try{
   const manualCount=(window.worksheetManual?.items()||[]).length;
   const fs=facts();
   if(!fs.length && manualCount){
     fromSources=false;
     render();
     setResearchStatus('สร้างใบงานจากโจทย์ที่นำเข้าจาก AI หรือที่ครูเพิ่มแล้ว','success');
     return;
   }
   if(!fs.length){
     alert('กรุณานำเข้าข้อสอบจาก AI หรือเพิ่มโจทย์เองก่อนสร้างใบงาน');
     return;
   }
   const capacity=requestedCapacity();
   fromSources=true;
   render();
   const list=document.querySelector('.exercise');
   const made=list?.querySelectorAll('li').length||0;
   if(!made){const message='ยังไม่พบประโยคที่ครบความหมายสำหรับสร้างข้อสอบ กรุณาเพิ่มเนื้อหาเป็นประโยคสั้น ๆ เช่น “คำศัพท์ คือ ...”, “... ทำหน้าที่ ...” หรือ “... ใช้สำหรับ ...”';setResearchStatus(message,'warning');alert(message);return}
   if(made<capacity.requested){const message=shortageText(made,capacity.requested);setResearchStatus(message,'warning');alert(message)}
 }catch(err){
   console.error(err);
   alert('เกิดข้อผิดพลาดในการสร้างคำถาม: '+(err?.message||err));
 }
}window.worksheetQuality.generateFromSelected=generateFromSelected;$('generateBtn').onclick=generateFromSelected;$('aiGenerateBtn').onclick=generateFromSelected;
$('docKind').value=localStorage.getItem('vocDocKind')||'ใบงาน';$('customTitle').value=localStorage.getItem('vocCustomTitle')||'';function buildLabel(){$('aiGenerateBtn').textContent='สร้าง'+$('docKind').value+'จากเนื้อหาที่เลือก'}$('docKind').onchange=()=>{localStorage.setItem('vocDocKind',$('docKind').value);buildLabel();render()};$('customTitle').oninput=()=>{localStorage.setItem('vocCustomTitle',$('customTitle').value);render()};buildLabel();
$('aiGenerateBtn').onclick=generateFromSelected;
$('downloadPdfBtn').onclick=async()=>{const b=$('downloadPdfBtn'),old=b.innerHTML;if(typeof html2pdf==='undefined'){alert('ไม่สามารถเปิดตัวสร้าง PDF ได้ กรุณารีเฟรชหน้าแล้วลองใหม่');return}b.disabled=true;b.textContent='กำลังสร้าง PDF…';const name=($('docKind').value+'-'+$('subject').value).replace(/[\\/:*?"<>|]/g,'-')+'.pdf';try{await html2pdf().set({margin:0,filename:name,image:{type:'jpeg',quality:.96},html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff',logging:false},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:['li','.doc-header','.student-line','.question-visual']}}).from($('paper')).save()}catch(e){alert('สร้าง PDF ไม่สำเร็จ กรุณาใช้ปุ่มพิมพ์แล้วเลือกบันทึกเป็น PDF แทน')}finally{b.disabled=false;b.innerHTML=old}};
const reset=$('resetBtn').onclick;$('resetBtn').onclick=()=>{localStorage.removeItem('vocDocKind');localStorage.removeItem('vocCustomTitle');localStorage.removeItem('vocResearchDraft');localStorage.removeItem('vocManualQuestions');reset()};render();
})();
