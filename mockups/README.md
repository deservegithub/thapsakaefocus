# Mockups — ทับสะแกโฟกัส (Wireframe + Design System)

Wireframe ความเที่ยงปานกลาง (mid-fidelity) แบบ **mobile-first** สำหรับใช้ตรวจทิศทางดีไซน์ก่อนลงโค้ดจริง
ทำด้วย HTML + Tailwind (Play CDN) เพื่อให้ design token/สไตล์ยกไปใช้ใน Next.js + Tailwind ของจริงได้ตรง ๆ (ไม่เสียของ)

## วิธีเปิดดู
```
python -m http.server 5599 --directory mockups
```
แล้วเปิด http://localhost:5599/

## ไฟล์
| ไฟล์ | หน้า |
|---|---|
| `tokens.css` | **Design token (ต้นฉบับ)** — สี/ฟอนต์/สเปซ/มุมโค้ง/เงา → ยกไป Tailwind theme ของจริง |
| `theme.js` | Tailwind config กลางที่แมปสีจาก tokens.css (ทุกหน้าโหลดไฟล์นี้) |
| `base.css` | สไตล์ร่วม + คลาส `.chip` / `.line-clamp-*` |
| `design-system.html` | **หน้าอ้างอิง design system** — color swatch, type scale, ปุ่ม/chip/input/card, radius/shadow |
| `index.html` | หน้าแรก (กดลิงก์ข้ามทุกหน้าได้) |
| `news.html` · `news-detail.html` | ข่าวสาร: รายการ + รายละเอียด |
| `shops.html` · `shop-detail.html` | ร้านค้า: รายการ + รายละเอียด (แกลเลอรี/โทร/นำทาง/แผนที่) |
| `tourism.html` · `tourism-detail.html` | ท่องเที่ยว: รายการ + รายละเอียด |
| `login.html` | เข้าสู่ระบบด้วย Google / Facebook / LINE |
| **เดสก์ท็อป** | |
| `index-desktop.html` | หน้าแรกเดสก์ท็อป (top nav + ตัวสลับภาษา TH/EN + grid) |
| `shops-desktop.html` | รายการร้านค้าเดสก์ท็อป (sidebar filter + grid + แผนที่) |
| `news-detail-desktop.html` | รายละเอียดข่าวเดสก์ท็อป (บทความ + sidebar) |
| **Admin (lo-fi)** | |
| `admin-dashboard.html` | แดชบอร์ด (stat cards + ตารางล่าสุด + sidebar) |
| `admin-news-list.html` | ตารางจัดการข่าว (ค้นหา/กรอง/แก้/ซ่อน/ลบ + คอลัมน์สถานะแปล EN) |
| `admin-news-edit.html` | ฟอร์มเพิ่ม/แก้ไข **แท็บ TH/EN** + อัปโหลดรูป + สถานะ |
| **นโยบาย** | |
| `terms.html` · `privacy.html` (PDPA) · `contact.html` | หน้าเชิงนโยบาย + ติดต่อ (responsive) |

## ทิศทางดีไซน์
- **ฟอนต์:** IBM Plex Sans Thai
- **สีหลัก (ทะเล):** primary `#0e8580` · **สีเน้น (แดด/มะพร้าว):** accent `#f5800c` · neutral โทนทราย
- **Mobile-first:** ออกแบบมือถือเป็นหลัก (PWA) — เดสก์ท็อปเป็น breakpoint รอง (ยังไม่ทำในรอบนี้)
- รูปทั้งหมดเป็น placeholder (gradient) · ตัวเลข/ข้อความเป็นตัวอย่าง
- แผนที่แสดงเป็นกล่อง placeholder — ของจริงใช้ Leaflet + OpenStreetMap (แผนข้อ 6)
- ตัวนับ "ออนไลน์ตอนนี้" ใน footer = Supabase Realtime Presence (แผนข้อ 8)

## สองภาษา (TH/EN)
- แถบนำทางเดสก์ท็อป + หน้านโยบายมี **ตัวสลับภาษา TH|EN**
- ฟอร์ม admin มี **แท็บ TH/EN** (ไทยจำเป็น, อังกฤษ optional + fallback) สะท้อนโครง DB `_th`/`_en`
- หมายเหตุ: mockup มือถือชุดแรก (`news.html` ฯลฯ) ยังไม่ได้เติมปุ่มสลับภาษาในแถบบน — เป็นรายละเอียดเก็บตอนทำจริง

## ยังไม่ได้ทำ (รอบถัดไป ถ้าต้องการ)
- เดสก์ท็อปของหน้าที่เหลือ (news list, tourism, shop-detail, login) — ใช้แพตเทิร์นเดียวกับที่ทำไว้
- หน้าผลการค้นหา, หน้าโปรไฟล์/บัญชีหลังล็อกอิน, ตัวสลับภาษาในมือถือทุกหน้า
