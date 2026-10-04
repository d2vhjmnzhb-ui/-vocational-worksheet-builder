V63 — ลดการรอหน้าเว็บและจำกัดชื่อใบงาน
โหลด PowerPoint จาก vendor/pptxgen.bundle.js เมื่อกดส่งออกเท่านั้น พร้อม timeout และลองใหม่
ฟอนต์ภายนอกไม่ขวางการเริ่มใช้งานเมนู
ตัด workHealth ที่ซ้ำก่อน listClasses และ getWorkEntry ใช้ apiVersion ในผลตอบกลับแทน
ยังตรวจเวอร์ชันก่อนเขียนข้อมูล และรักษา receipt/timeout/ป้องกันการส่งซ้ำ
ชื่อใบงานในตารางและรายการงานครูแสดงไม่เกิน 2 บรรทัด กดตั้งค่างาน/ดูงานเพื่อดูชื่อเต็ม
ตารางคะแนนเลื่อนไปด้านข้างได้ ชื่อนักเรียนตรึงทางซ้าย
ไม่แก้ Apps Script ใช้ V62 กุญแจและ URL เดิม ไม่ต้อง Deploy ใหม่

อัปโหลดไฟล์ทับ GitHub:
index.html
slide-builder.js
assignments.js
assignments.css
teacher-dashboard.js
work-api.js
student-work.html
student-work.js
student-work.css
vendor/pptxgen.bundle.js (ไฟล์ใหม่ ต้องอยู่ในโฟลเดอร์ vendor)
vendor/PptxGenJS-LICENSE.txt

ทดสอบกับ backend จำลอง ยังไม่ได้ทดสอบบน iPad จริงหรือวัดความเร็วหลังติดตั้งที่เว็บจริง
