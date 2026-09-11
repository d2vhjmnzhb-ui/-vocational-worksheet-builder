ระบบสอบออนไลน์ถูกเพิ่มเข้า worksheet-builder-v28 เดิมแล้ว

ไฟล์เว็บครูเดิม: index.html (แก้เฉพาะเพิ่มการเรียก exam-publish.js)
ไฟล์เพิ่ม: exam-publish.js
เว็บนักเรียน: student-exam.html
Google Apps Script: Code.gs

ก่อนใช้งานจริง:
1) สร้าง Google Sheet ว่างและคัดลอก Sheet ID
2) วาง Code.gs ใน Google Apps Script แล้วแก้ SS_ID
3) Deploy เป็น Web app: Execute as Me / Who has access Anyone
4) คัดลอก URL ที่ลงท้าย /exec
5) เปิด exam-publish.js และ student-exam.html แล้วแทน PUT_YOUR_APPS_SCRIPT_EXEC_URL_HERE ด้วย URL /exec เดียวกัน
6) อัปโหลดไฟล์ทั้งหมดขึ้น GitHub Pages แทนชุดเดิม

ใช้งาน:
- สร้างข้อสอบปรนัยในเว็บเดิมตามปกติ
- กด “เผยแพร่เป็นข้อสอบออนไลน์”
- ตั้งเวลา / จำนวนครั้งที่ออกจากหน้าสอบ / แสดงคะแนน / จำกัดครั้ง
- กดเผยแพร่ จะได้รหัสและลิงก์สำหรับนักเรียน

หมายเหตุ: เบราว์เซอร์ล็อกเครื่อง 100% ไม่ได้ ระบบนี้ตรวจและบันทึกการสลับแท็บ/ออกจากหน้า/ออก fullscreen และส่งอัตโนมัติตามค่าที่ครูกำหนด
