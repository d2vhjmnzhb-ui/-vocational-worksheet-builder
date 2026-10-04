V57-FIX1 — เชื่อม Apps Script บัญชีใหม่
อัป GitHub ทับ 5 ไฟล์:
index.html
student-work.html
work-api.js
exam-publish.js
student-exam.html
ไฟล์ที่เหลือเป็น V57 เดิม เก็บรวมเพื่อให้ใช้อัปทั้งชุดได้

ไม่ต้องแก้ Code.gs หรือ Deploy ซ้ำสำหรับการเปลี่ยน URL ครั้งนี้
ตรวจลิงก์บัญชีใหม่ action=workHealth จริงแล้ว ตอบ {"ok":true,"apiVersion":"V57"}
ยังไม่ได้ทดสอบกุญแจครู สิทธิ์ Sheet หรือการอัปโหลด Drive จริง

หลังอัปเว็บเสร็จ เปิดใหม่/รีเฟรช แล้วใส่กุญแจจาก setupV56/setupV57 ของโปรเจ็กต์บัญชีใหม่
ห้องเรียนและคะแนนใช้ Google Sheet เดิมที่แชร์ไว้ โค้ด SS_ID ไม่เปลี่ยน
student-exam.html เปลี่ยนเฉพาะ URL ระบบ ไม่เปลี่ยน logic สอบหรือ HARD SUBMIT GATE
ไฟล์งานที่เคยอัปโหลดด้วยบัญชีเก่ายังต้องใช้สิทธิ์บัญชีเก่าในการเปิด ไม่ได้ย้ายไฟล์ Drive เก่า

README-V57.txt และ TEST-REPORT-V57.txt เป็นประวัติก่อน FIX1; ข้อความว่า URL ใหม่ยังไม่ได้รับไม่ใช้กับ FIX1 นี้
