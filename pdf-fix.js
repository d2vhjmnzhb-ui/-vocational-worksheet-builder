(function(){
  const $=id=>document.getElementById(id);
  function filename(){return(($('docKind').value||'เอกสาร')+'-'+($('subject').value||'ใบงาน')).replace(/[\\/:*?"<>|]/g,'-')+'.pdf'}
  const options=()=>({margin:0,filename:filename(),image:{type:'jpeg',quality:.98},html2canvas:{scale:2,useCORS:true,allowTaint:false,backgroundColor:'#ffffff',logging:false,windowWidth:1200},jsPDF:{unit:'mm',format:'a4',orientation:'portrait'},pagebreak:{mode:['css','legacy'],avoid:['li','.doc-header','.student-line','.question-visual','.practice-summary']}});
  function hideForPdf(){const entries=[];$('paper').querySelectorAll('.foot,.sources-print,.source-warning,[data-pdf-exclude]').forEach(el=>{entries.push([el,el.style.display]);el.style.display='none'});return()=>entries.forEach(([el,display])=>el.style.display=display)}
  async function pdfBlob(){
    if(typeof html2pdf==='undefined')throw new Error('pdf-library');
    if(document.fonts?.ready)await document.fonts.ready;
    const restore=hideForPdf(),paper=$('paper');
    try{const worker=html2pdf().set(options()).from(paper).toCanvas().toPdf();const pdf=await worker.get('pdf');return pdf.output('blob')}finally{restore()}
  }
  function setBusy(button,busy,label){button.disabled=busy;button.textContent=busy?'กำลังสร้าง PDF…':label}
  $('downloadPdfBtn').onclick=async()=>{const button=$('downloadPdfBtn');setBusy(button,true,'บันทึก PDF');try{const blob=await pdfBlob(),file=new File([blob],filename(),{type:'application/pdf'}),ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);if(ios&&navigator.canShare&&navigator.canShare({files:[file]})){await navigator.share({files:[file],title:filename()})}else{const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=filename();a.style.display='none';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000)}}catch(e){if(e?.name!=='AbortError')alert('ยังบันทึกไม่ได้ กรุณากด “เปิด PDF” แล้วใช้เมนูแชร์เพื่อบันทึกไปยังแอปไฟล์')}finally{setBusy(button,false,'บันทึก PDF')}};
  $('openPdfBtn').onclick=async()=>{const button=$('openPdfBtn'),tab=window.open('','_blank');if(tab)tab.document.write('<p style="font-family:Sarabun,Arial,sans-serif;padding:24px">กำลังสร้าง PDF…</p>');setBusy(button,true,'เปิด PDF');try{const blob=await pdfBlob(),url=URL.createObjectURL(blob);if(tab)tab.location.href=url;else window.location.href=url;setTimeout(()=>URL.revokeObjectURL(url),300000)}catch(e){if(tab)tab.close();alert('เปิด PDF ไม่สำเร็จ กรุณาลองปุ่มพิมพ์')}finally{setBusy(button,false,'เปิด PDF')}};
})();
