# Supabase — ฐานข้อมูลทับสะแกโฟกัส

Migration SQL สำหรับสร้าง schema (ยังไม่ได้รัน — รอรีวิว/อนุมัติ)

## ลำดับไฟล์
1. `migrations/0001_init.sql` — extensions, profiles + trigger, lookup, news/shops/tourism + images, RLS, storage
2. `migrations/0002_seed_categories.sql` — หมวดหมู่เริ่มต้น (สองภาษา)

## วิธีรัน (Supabase SQL Editor — ไม่ต้องแชร์ความลับ)
1. เข้า Supabase Dashboard → โปรเจกต์ → เมนูซ้าย **SQL Editor** → **New query**
2. คัดลอกเนื้อหา `0001_init.sql` ทั้งไฟล์ → วาง → **Run**
3. ทำซ้ำกับ `0002_seed_categories.sql`
4. ตรวจที่ **Table Editor** ว่ามีตารางครบ และ **Authentication > Policies** มี RLS policy

> ทางเลือก (ภายหลัง): ติดตั้ง Supabase CLI แล้ว `supabase link` + `supabase db push` เพื่อจัดการ migration เป็นระบบ — ต้องใช้ access token + DB password

## ตั้ง admin คนแรก (หลังล็อกอินครั้งแรก)
ระบบสร้าง `profiles` อัตโนมัติด้วย role `member` เมื่อสมัคร/ล็อกอินครั้งแรก จากนั้นเลื่อนเป็น admin:
```sql
-- ดู user id จากอีเมล
select id, email from auth.users where email = 'YOUR_EMAIL';
-- เลื่อนเป็น admin
update public.profiles set role = 'admin' where id = 'USER_ID_ที่ได้';
```

## หมายเหตุการออกแบบ
- **สองภาษา:** ฟิลด์ข้อความเป็นคู่ `_th`/`_en` — TH บังคับ, EN ใส่ทีหลังได้ (แอป fallback ไป TH)
- **slug เดี่ยว** (canonical) ใช้ทั้ง /th และ /en
- **admin gate = `public.is_admin()`** (SECURITY DEFINER) ไม่ใช้ JWT custom claim → **ไม่ต้องตั้ง Access Token Hook ใน dashboard**
- **RLS:** anon/ผู้ใช้ทั่วไป `SELECT` ได้เฉพาะ `status='published'` · admin จัดการทุกอย่าง · storage `public-images` อ่าน public ได้ เขียนเฉพาะ admin
- ค้นหาไทย/อังกฤษ: มี GIN trigram index บน `*_th`/`*_en` (ILIKE/`%`)

## ตรวจหลังรัน (ด้วย anon key — สำคัญ)
หลังรันเสร็จ แจ้งทีมพัฒนาให้ทดสอบว่า anon อ่าน published ได้จริง (กัน RLS บังหน้าเว็บว่างเปล่า)
