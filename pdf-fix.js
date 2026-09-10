(function(){
  const $=id=>document.getElementById(id);
  function filename(){return(($('docKind').value||'เอกสาร')+'-'+($('subject').value||'ใบงาน')).replace(/[\\/:*?"<>|]/g,'-')+'.pdf'}
  const options=()=>({margin:0,filename:filename(),image:{type:'jpeg',quality:.98},html2canvas:{scale:2,useCORS:true,allowTaint:false,backgroundColor:'#ffffff',logging:false,windowWidth:1200},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:['li','.doc-header','.student-line','.question-visual','.practice-summary']}});
  function exportCopy(){const copy=$('paper').cloneNode(true);copy.classList.remove('teacher');copy.querySelectorAll('.foot,.sources-print,.source-warning,[data-pdf-exclude]').forEach(el=>el.remove());copy.style.cssText='width:210mm;min-height:297mm;margin:0;padding:14mm 15mm;background:#fff;color:#172b3a;box-shadow:none;display:block;';return copy}
  async function pdfBlob(){
    if(typeof html2pdf==='undefined')throw new Error('pdf-library');
    if(document.fonts?.ready)await document.fonts.ready;
    const holder=document.createElement('div'),copy=exportCopy();
    holder.style.cssText='position:fixed;left:0;top:0;z-index:-1;width:210mm;height:auto;overflow:visible;background:#fff;pointer-events:none;';holder.appendChild(copy);document.body.appendChild(holder);
    try{const worker=html2pdf().set(options()).from(copy).toCanvas().toPdf();const pdf=await worker.get('pdf');return pdf.output('blob')}finally{holder.remove()}
  }
  function setBusy(button,busy,label){button.disabled=busy;button.textContent=busy?'กำลังสร้าง PDF…':label}
  $('downloadPdfBtn').onclick=async()=>{const button=$('downloadPdfBtn');setBusy(button,true,'บันทึก PDF');try{const blob=await pdfBlob(),file=new File([blob],filename(),{type:'application/pdf'}),ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);if(ios&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:filename()})}else{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename();a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}}catch(e){if(e?.name!=='AbortError')alert('ยังบันทึกไม่ได้ กรุณากด “เปิด PDF” แล้วใช้เมนูแชร์เพื่อบันทึกไปยังแอปไฟล์')}finally{setBusy(button,false,'บันทึก PDF')}};
  $('openPdfBtn').onclick=async()=>{const button=$('openPdfBtn'),tab=window.open('','_blank');if(tab)tab.document.write('<p style="font-family:Sarabun,Arial,sans-serif;padding:24px">กำลังสร้าง PDF…</p>');setBusy(button,true,'เปิด PDF');try{const blob=await pdfBlob(),url=URL.createObjectURL(blob);if(tab)tab.location.href=url;else window.location.href=url;setTimeout(()=>URL.revokeObjectURL(url),300000)}catch(e){if(tab)tab.close();alert('เปิด PDF ไม่สำเร็จ กรุณาลองปุ่มพิมพ์')}finally{setBusy(button,false,'เปิด PDF')}};
})();
