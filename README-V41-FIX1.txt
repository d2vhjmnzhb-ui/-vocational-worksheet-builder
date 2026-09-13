V41 FIX1 — Slide Studio open bug

แก้ปัญหา: กดเมนู “สร้างสไลด์” แล้วพื้นที่ด้านล่างว่าง
สาเหตุ: slide-builder.js ไม่ได้ expose window.openSlideStudio ให้ teacher-dashboard.js เรียก
การแก้ไข:
- เพิ่ม window.openSlideStudio = open
- เพิ่ม window.closeSlideStudio = close
- เพิ่ม fallback เปิด Slide Studio เมื่อ teacherMode=slides
- เปลี่ยน cache-busting query ของ slide-builder.js เพื่อบังคับ GitHub Pages/เบราว์เซอร์โหลดไฟล์ใหม่
