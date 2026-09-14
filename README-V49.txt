V49 – Immediate Leave + Confirmed Split Screen

ปรับระบบคุมสอบ:
1) ออกจากหน้าข้อสอบจริง (visibility hidden) = นับทันที ไม่รอ 3–5 วินาที
2) ไม่ใช้ blur หรือ fullscreenchange เป็นเหตุการณ์เสี่ยง เพื่อลดการเตือนผิดจาก UI มือถือ
3) Split Screen / Multi-window = ต้องตรวจพบพื้นที่หน้าต่างหดมากและค้างต่อเนื่อง 4 วินาที จึงนับ
4) แก้ตัวตรวจ Split Screen ให้มี hold timer จริง แม้ resize เกิดเพียงครั้งเดียว
5) หน้าอาจารย์แสดงเหตุการณ์ล่าสุดแบบ Live เช่น “แบ่งหน้าจอ/หน้าต่างหด” พร้อมเวลา
6) จำนวนเหตุการณ์ยังอัปเดตผ่าน getLiveResults แบบเบา ไม่โหลด Events ทั้งชีตทุก 5 วินาที

การติดตั้ง:
- อัปไฟล์เว็บทั้งหมดขึ้น GitHub Pages
- นำ Code.gs.txt ไปแทน Code.gs ใน Apps Script แล้ว Deploy เป็น New version
- ข้อสอบที่เผยแพร่ใหม่ใช้ระบบ V49
