# แผนงานโครงการ ทับสะแกโฟกัส (Thapsakae Focus)
### เอกสารวางแผนก่อนพัฒนา (Pre-development Plan & Checklist)

> เอกสารฉบับนี้ใช้สำหรับตรวจสอบความพร้อมและความถูกต้องก่อนลงมือพัฒนา
> ปรับปรุงล่าสุด: 4 มิถุนายน 2569 · สถานะ: ฉบับร่างเพื่อตรวจสอบ (แก้ไขครั้งที่ 4 — เพิ่มข้อกำหนดสองภาษา ไทย/อังกฤษ ตั้งแต่ชั้นฐานข้อมูล + UI i18n; ครั้งที่ 3 — ปรับ data model เป็น profiles, เพิ่มแนวทาง RLS/ค้นหาไทย/แผนที่, เติมข้อควรระวัง free-tier และ Next.js 16)

---

## 1. ภาพรวมโครงการ

| หัวข้อ | รายละเอียด |
|---|---|
| ชื่อโครงการ | ทับสะแกโฟกัส (thapsakaefocus.com) |
| ประเภท | Community Portal — ศูนย์กลางข้อมูลข่าวสารและบริการของอำเภอทับสะแก |
| ตัวตนแพลตฟอร์ม | แพลตฟอร์มชุมชน **เชิงพาณิชย์** (ไม่เกี่ยวข้องกับราชการ/อบต.) |
| กลุ่มเป้าหมาย | คนในพื้นที่อำเภอทับสะแก และนักท่องเที่ยว |
| จุดแข็ง | ความครบวงจรของข้อมูลท้องถิ่นในที่เดียว |
| สถานะปัจจุบัน | มีเว็บเดิมสร้างด้วย Next.js แล้ว เนื้อหายังเป็นข้อมูลทดสอบ |

---

## 2. การตัดสินใจเชิงกลยุทธ์ที่ยืนยันแล้ว (Locked Decisions)

รายการต่อไปนี้คือข้อสรุปที่ใช้เป็นฐานของแผนทั้งหมด หากเปลี่ยนข้อใดต้องทบทวนแผนใหม่

- [x] เป็นแพลตฟอร์มชุมชนเชิงพาณิชย์ ไม่ผูกกับหน่วยงานราชการ
- [x] หมวดหลักสำหรับเปิดตัว: **ข่าวสาร + ร้านค้า + ท่องเที่ยว** (หมวดอื่นตามมาภายหลัง)
- [x] โมเดลรายได้: เปิดตัวยังไม่มีรายได้ — อนาคตขายโฆษณา/แบนเนอร์ และรับออกแบบเว็บไซต์
- [x] มือถือ: ใช้ **PWA** (ไม่ทำ native app ในเฟสแรก)
- [x] เนื้อหา: admin ป้อนเองก่อน — อนาคตให้ร้านค้าแก้ไขข้อมูลตัวเองได้
- [x] การกำกับเนื้อหา (moderation) marketplace/เว็บบอร์ด: เป็นหน้าที่ของ admin
- [x] เฟรมเวิร์ก: ใช้ **Next.js 16 ขึ้นไป** (แนะนำรุ่นแพตช์ล่าสุด 16.2.6+)
- [x] สมัครสมาชิก/เข้าสู่ระบบ: รองรับ social login ผ่าน **Google, Facebook, Line**
- [x] หน้า admin: เน้นการจัดการที่ **ง่ายและไม่ซับซ้อน**

---

## 3. ขอบเขตงาน (Scope)

### อยู่ในขอบเขตเฟสเปิดตัว (In Scope)

- ระบบแสดงผลและจัดการ **ข่าวสาร** (ประกาศ/กิจกรรม)
- ระบบแสดงผลและจัดการ **ร้านค้าและบริการ** (admin ป้อน)
- ระบบแสดงผลและจัดการ **สถานที่ท่องเที่ยว** (admin ป้อน)
- ระบบ **ค้นหา** ภายในสามหมวดข้างต้น (MVP: `pg_trgm`/`ILIKE` — ดูหมายเหตุค้นหาภาษาไทยในข้อ 7)
- ระบบ **สมัครสมาชิก/เข้าสู่ระบบ** ผ่าน Google, Facebook, Line (social login)
- หน้า **admin** สำหรับเพิ่ม/แก้ไข/ลบ/ซ่อนเนื้อหา (เน้นใช้งานง่าย)
- การตั้งค่าเป็น **PWA** (ติดตั้งบนหน้าจอ, ทำงาน offline บางส่วน)
- ตัวนับ **ผู้ใช้ออนไลน์ตอนนี้** ในส่วน footer
- หน้าเชิงนโยบาย: เงื่อนไขการใช้บริการ, ความเป็นส่วนตัว, ติดต่อ

### อยู่นอกขอบเขตเฟสแรก (Out of Scope — ทำภายหลัง)

- หมวดหางาน, เว็บบอร์ด, ซื้อขาย (marketplace)
- ระบบให้ร้านค้าสมัครและแก้ไขข้อมูลตัวเอง (shop_owner)
- ระบบโฆษณา/แบนเนอร์ และระบบคิดเงิน
- แอป native บน App Store / Play Store
- ระบบสถิติสะสม (ยอดผู้เข้าชมทั้งหมด) แบบละเอียด

> หลักการ: ออกแบบฐานข้อมูลและ layout **เผื่อ** ของนอกขอบเขตไว้ล่วงหน้า เพื่อให้เพิ่มทีหลังได้โดยไม่ต้องรื้อ

---

## 4. โครงสิทธิ์ผู้ใช้ (Roles)

| Role | สิทธิ์ | เฟส |
|---|---|---|
| `admin` | จัดการเนื้อหาทุกหมวด, กำกับ moderation, ซ่อน/อนุมัติเนื้อหา | เปิดตัว |
| `shop_owner` | แก้ไขข้อมูลร้านค้าของตัวเอง | อนาคต |
| `member` | สมาชิกทั่วไป (โพสต์เว็บบอร์ด/ซื้อขาย) | อนาคต |

ฟิลด์ `role` ในตาราง `users` เป็นกุญแจที่ทำให้ขยายไปสู่ระบบ shop_owner/member ได้โดยไม่ต้องแก้โครงสร้าง

---

## 5. สถาปัตยกรรมระบบ (Architecture)

เนื่องจากเลือกแนวทาง PWA ระบบจึงเป็น **โปรเจกต์ Next.js เดียว** ที่เสริมความสามารถ PWA ไม่ต้องใช้ monorepo หรือ Expo ในเฟสนี้

```
ผู้ใช้ (เบราว์เซอร์ / PWA บนมือถือ)
        │
        ▼
Next.js (App Router) — เว็บ + PWA
        │  เรียกผ่าน Supabase client / API
        ▼
Supabase
 ├─ PostgreSQL  (ข้อมูลข่าว ร้านค้า ท่องเที่ยว ผู้ใช้)
 ├─ Auth         (สมาชิก + role · social login: Google/Facebook/Line)
 ├─ Storage      (รูปร้านค้า / สถานที่)
 └─ Realtime     (ตัวนับออนไลน์ผ่าน Presence)
```

แนวทางขยายในอนาคต: หากต้องการแอปบนสโตร์จริง สามารถห่อ PWA ด้วย Capacitor หรือแยกทำ Expo ภายหลัง โดยใช้ backend Supabase ชุดเดิมได้ทั้งหมด

---

## 6. ชุดเครื่องมือ (Tech Stack)

| ชั้น | เครื่องมือ | บทบาท |
|---|---|---|
| เฟรมเวิร์ก | Next.js 16.2.6+ (App Router) + TypeScript + React 19.2 | เว็บแอป + SSR |
| PWA | **Serwist (`@serwist/next`)** แนะนำ — ดูแลต่อเนื่องและรองรับ App Router/Turbopack ดีกว่า `@ducanh2912/next-pwa` | ติดตั้งบนมือถือ, offline, push |
| Styling | Tailwind CSS | ระบบดีไซน์ |
| i18n (สองภาษา) | **next-intl** (แนะนำ) + locale routing `/th` `/en` | แปล UI + สลับภาษา ไทย/อังกฤษ |
| Data fetching | TanStack Query | ดึง/แคชข้อมูล |
| Backend / DB | Supabase (PostgreSQL, Auth, Storage, Realtime) | บริการหลังบ้านครบในที่เดียว |
| Auth / Social login | Supabase Auth (Google, Facebook ในตัว + Line ผ่าน Custom OIDC) | สมัคร/เข้าสู่ระบบ + role |
| Admin UI | shadcn/ui (แนะนำ) หรือ Refine | หน้าจัดการเนื้อหาแบบง่าย |
| Realtime | Supabase Presence | ตัวนับผู้ใช้ออนไลน์ |
| แผนที่ | **Leaflet + OpenStreetMap** (แนะนำ — ฟรี) หรือ Google Maps (ต้องเปิด billing + API key) | แสดงตำแหน่งร้านค้า/สถานที่จาก `lat`/`lng` |
| Hosting | Vercel | deploy เว็บ |
| Error tracking | Sentry | ติดตามข้อผิดพลาด |
| Email | Resend หรือ Postmark | อีเมลยืนยันสมาชิก (อนาคต) |
| Analytics | Plausible หรือ Umami | สถิติผู้เข้าชม (เคารพความเป็นส่วนตัว) |

> **หมายเหตุ Next.js 16 (ตรวจกับ official upgrade guide แล้ว):** ใช้รุ่นแพตช์ล่าสุด (16.2.6 ขึ้นไป; ปัจจุบัน 16.2.7) เพราะรวมการแก้ช่องโหว่ความปลอดภัยสำคัญไว้ · App Router ใช้ React 19.2 และรองรับ React Compiler แบบ stable · **Turbopack เป็นค่าเริ่มต้น** ทั้ง `next dev`/`next build` (ตรวจให้ปลั๊กอินทั้งหมดรองรับ) · ไฟล์ `middleware.ts` ถูก deprecated ให้ใช้ `proxy.ts` แทน — **`proxy.ts` รันบน Node.js runtime เท่านั้น ไม่รองรับ edge** (มี codemod ช่วยย้าย) · **Async Request APIs บังคับเต็มรูปแบบ** — `cookies()/headers()/draftMode()/params/searchParams` ต้อง `await` ทุกจุด (กระทบการสร้าง Supabase server client) · `images.domains` ถูก deprecate → ต้องตั้ง **`images.remotePatterns`** ชี้ hostname ของ Supabase Storage ไม่งั้นรูปไม่ optimize · `next lint` ถูกถอดออก → ใช้ ESLint CLI / Biome ตรง ๆ · ตรวจสอบว่า hosting/adapter รองรับ Next.js 16 แล้ว

---

## 7. แบบจำลองข้อมูล (Data Model)

> **สำคัญ:** Supabase Auth จัดการตาราง `auth.users` ให้อยู่แล้ว เราจึงไม่สร้างตาราง `users` ของเราเองซ้ำ แต่ใช้ตาราง `profiles` ที่ผูกกับ `auth.users.id` แทน

### ตารางหลักเฟสแรก

> หมายเหตุสองภาษา: ฟิลด์ข้อความที่ผู้ใช้เห็น (เช่น `title`, `summary`, `content`, `name`, `description`) จะแตกเป็นคู่ `_th`/`_en` ตามหัวข้อ "รองรับสองภาษา" ด้านล่าง — ด้านล่างเขียนชื่อฟิลด์แบบย่อเพื่ออ่านง่าย

**profiles** (ผูก 1:1 กับ `auth.users`)
- `id` (uuid, PK, **FK→auth.users.id**), `display_name`, `role` (admin/shop_owner/member), `created_at`, `updated_at`
- สร้างอัตโนมัติด้วย **trigger `on auth.users insert`** · `email` อ่านจาก `auth.users` ไม่เก็บซ้ำ

**news_articles**
- `id` (uuid, PK), `author_id` (FK→profiles), `title`, `slug`, `type` (announcement/event), `summary`, `content`, `cover_image_url`, `published_at`, `view_count`, `status`, `created_at`, `updated_at`

**shops**
- `id` (uuid, PK), `owner_id` (FK→profiles, nullable), `name`, `category`, `description`, `address`, `phone`, `lat`, `lng`, `status` (draft/published/hidden), `created_at`, `updated_at`

**tourism_places**
- `id` (uuid, PK), `author_id` (FK→profiles), `name`, `description`, `address`, `lat`, `lng`, `status` (draft/published/hidden), `created_at`, `updated_at`

**shop_images**
- `id` (uuid, PK), `shop_id` (FK→shops), `url`, `sort_order`

**place_images** (เพิ่มเพื่อให้สถานที่ท่องเที่ยวมีรูปได้เหมือนร้านค้า)
- `id` (uuid, PK), `place_id` (FK→tourism_places), `url`, `sort_order`

### ตารางที่เตรียมเพิ่มในอนาคต
`jobs`, `board_posts`, `marketplace_listings`, `ad_banners` — ทั้งหมดผูกกับ `profiles` ในรูปแบบเดียวกัน

### รองรับสองภาษา ไทย/อังกฤษ (i18n) — ออกแบบเผื่อตั้งแต่แรก

ข้อกำหนด: เนื้อหาทุกหมวดต้องแสดงได้ทั้ง **ไทย (หลัก)** และ **อังกฤษ (รอง)** โดยไทยเป็นภาษาเริ่มต้นและอังกฤษเป็น optional (ค่อยเติมทีหลังได้)

**แนวทางที่แนะนำ — แยกคอลัมน์ต่อภาษา (suffix `_th` / `_en`)** เหมาะกับกรณีภาษาคงที่ 2 ภาษา:
- ฟิลด์ข้อความอิสระแตกเป็นคู่: `title_th`/`title_en`, `summary_th`/`summary_en`, `content_th`/`content_en` (news) · `name_th`/`name_en`, `description_th`/`description_en` (shops, tourism)
- `_th` ตั้ง **NOT NULL** (บังคับมีไทย) · `_en` **nullable** (มี fallback ไปไทยเมื่อยังไม่แปล)
- `slug` ทำแยกภาษาเพื่อ SEO: `slug_th` / `slug_en` (หรือใช้ slug อังกฤษเป็นหลักทั้งคู่ก็ได้ — ตัดสินใจตอนทำจริง)
- `address`, `phone`, `lat`, `lng` ไม่ต้องแปล (ใช้ร่วม) — ที่อยู่อาจมีเฉพาะไทยก่อน
- `category`/`type`: ใช้ **lookup table** ที่มี `label_th` / `label_en` (สอดคล้องกับข้อเสนอ enum/lookup ด้านล่าง)
- **ค้นหา (pg_trgm):** สร้าง index แยกทั้งคอลัมน์ `_th` และ `_en` เพื่อให้ค้นได้ทั้งสองภาษา

> ทางเลือก: เก็บเป็น **JSONB** (`title = {"th": "...", "en": "..."}`) — ยืดหยุ่นกว่าหากอนาคตจะเพิ่มภาษาที่ 3 แต่ query/constraint/index ซับซ้อนกว่า · สำหรับ 2 ภาษาคงที่ แนะนำ suffix ก่อน
>
> **ยังไม่ล็อก** เลือกแนวทางสุดท้าย (suffix vs JSONB) ตอนสรุป schema จริง — แต่ทั้งสองทางถูกบันทึกเป็นข้อกำหนดแล้ว

ฝั่ง UI: ใช้ **next-intl** แปลข้อความ static (เมนู/ปุ่ม/label) + locale routing `/th` `/en` และตัวสลับภาษาใน header — แยกกับ i18n ของ "เนื้อหาในฐานข้อมูล" ข้างต้น

### หมายเหตุการออกแบบ
- ทุกตารางมี `status` เป็นเครื่องมือ moderation พื้นฐาน (draft/published/hidden) ให้สอดคล้องกันทั้งสามหมวด
- **สองภาษา:** ฟิลด์ข้อความที่ผู้ใช้เห็นต้องมีคู่ `_th`/`_en` (ไทยบังคับ, อังกฤษ optional + fallback) — ดูหัวข้อ i18n ด้านบน
- ทุกตารางมี `updated_at` + trigger อัปเดตอัตโนมัติ เพื่อรู้เวลาที่ admin แก้ล่าสุด
- พิจารณาให้ `category` (shops) / `type` (news) เป็น **enum หรือ lookup table** เพื่อกันค่าพิมพ์ไม่ตรงกันและกรอง/ค้นหาง่าย
- เปิด **Row Level Security (RLS)** ของ Supabase เพื่อรองรับการให้ร้านค้าแก้ข้อมูลตัวเองในอนาคต
- **ข้อควรระวัง RLS:** อย่าเขียน policy ที่ `SELECT role FROM profiles` ภายใน policy ของตาราง `profiles` เอง — จะเกิด **infinite recursion** ให้ใส่ `role` เป็น **custom claim ใน JWT** (ผ่าน Custom Access Token Hook) แล้วเช็กจาก `auth.jwt()` หรือใช้ `SECURITY DEFINER` function แทน
- `lat`/`lng` เตรียมไว้สำหรับแสดงแผนที่ (Leaflet/OSM)
- **การค้นหาภาษาไทย:** PostgreSQL FTS แบบ default ไม่ tokenize ไทย — MVP ใช้ `pg_trgm` + `ILIKE` (substring match แบบ degrade graceful), อนาคตค่อยย้ายไป Meilisearch/Typesense ที่มี Thai tokenizer · เตรียม index ตั้งแต่ออกแบบ

---

## 8. ฟีเจอร์ตัวนับผู้ใช้ออนไลน์ (Online Count)

- ใช้ **Supabase Realtime Presence** — ทุก client เช็กอินเข้า channel กลาง แล้วนับจำนวน
- ฟังเฉพาะ event `sync` แล้วอ่านจำนวน key จาก `presenceState()` เพื่อเลี่ยงการนับซ้ำ
- ค่าที่ได้คือจำนวน client/แท็บที่เชื่อมต่อ (ค่าประมาณของ "คนออนไลน์")
- ไม่ต้องสร้างตารางในฐานข้อมูล
- ข้อควรระวัง: ตรวจสอบโควตา concurrent realtime connections ของแผน Supabase ที่ใช้

---

## 9. การยืนยันตัวตนและสมัครสมาชิก (Auth & Social Login)

ใช้ **Supabase Auth** เป็นระบบเดียวที่ดูแลทั้งสมาชิกทั่วไปและบัญชี admin (แยกด้วยฟิลด์ `role`)

| ผู้ให้บริการ | สถานะใน Supabase | สิ่งที่ต้องเตรียม |
|---|---|---|
| Google | provider ในตัว | สร้าง OAuth credentials ใน Google Cloud Console |
| Facebook | provider ในตัว | สร้างแอปใน Meta for Developers (Facebook Login) |
| Line | **ไม่มีในตัว** — เพิ่มผ่าน Custom OIDC | สร้าง LINE Login channel ใน LINE Developers |

ข้อควรรู้และข้อควรระวัง
- LINE Login รองรับมาตรฐาน OpenID Connect จึงเพิ่มเป็น **Custom OIDC provider** (ขึ้นต้นด้วย `custom:`) ในหน้า Authentication > Sign In / Providers ได้
- แผนฟรีเพิ่ม custom provider ได้สูงสุด **3 ตัว** (Line ใช้ 1 ช่อง) — เพียงพอสำหรับโครงการนี้
- ตั้งค่า Callback/Redirect URL ของทุก provider เป็น `https://<project>.supabase.co/auth/v1/callback`
- ฝั่งโค้ดเรียกผ่าน `signInWithOAuth` (ใช้ PKCE flow)
- บาง provider อาจไม่ส่งอีเมลกลับมา ควรออกแบบให้ระบบรองรับกรณี `email` ว่างได้ (เช่น ให้ผู้ใช้กรอกเพิ่มภายหลัง)
- **เฉพาะ LINE:** scope `email` ต้อง **ยื่นขออนุญาตจาก LINE** ก่อนถึงจะได้อีเมล และบางกรณีไม่คืนอีเมลเลย — วางระบบให้รองรับ
- (ตรวจแล้ว) hosted Supabase รองรับ Custom OIDC ผ่าน Dashboard แบบ auto-discovery และแผนฟรีเพิ่ม custom provider ได้ 3 ตัว — เพียงพอ

## 10. หน้า Admin (Admin Panel)

เป้าหมายคือจัดการเนื้อหา 3 หมวด (ข่าว ร้านค้า ท่องเที่ยว) ได้ง่าย โดยมีสองแนวทางหลัก

**แนวทางแนะนำ — Custom admin ด้วย shadcn/ui** สร้างเส้นทาง `/admin` ในโปรเจกต์ Next.js เดิม ใช้คอมโพเนนต์ตาราง + ฟอร์มสำเร็จรูป ป้องกันการเข้าถึงด้วย `role = admin` ข้อดีคือดีไซน์กลมกลืนกับเว็บหลักและควบคุมได้เต็มที่ เหมาะกับงานแค่ 3 หมวด
> การ gate สิทธิ์: เช็ก `role` (จาก JWT claim) ใน `proxy.ts` เพื่อกันการเข้าหน้า `/admin` **และ** บังคับ RLS ที่ชั้นฐานข้อมูลเป็นด่านจริง (proxy ป้องกัน UI ได้แต่ไม่ใช่ security boundary เพียงพอ) · จำไว้ว่า `proxy.ts` รัน Node.js runtime เท่านั้น

**แนวทางทางเลือก — Refine** (refine.dev) มี data provider เชื่อม Supabase และสร้างหน้า CRUD ให้อัตโนมัติ เขียนโค้ดน้อยกว่า เหมาะถ้าต้องการหน้า admin เร็วโดยไม่เน้นปรับแต่งดีไซน์

**ช่วงเริ่มต้น** ใช้ Supabase Dashboard ป้อนข้อมูลชั่วคราวไปก่อนได้ ระหว่างที่หน้า admin ยังพัฒนาไม่เสร็จ

ฟังก์ชันขั้นต่ำที่หน้า admin ต้องมี: แสดงรายการ/เพิ่ม/แก้ไข/ลบ/ซ่อน เนื้อหาแต่ละหมวด และอัปโหลดรูปเข้าสู่ Supabase Storage

---

## 11. แผนงานเป็นเฟส (Phased Plan)

### เฟส 0 — เตรียมความพร้อม
- [ ] ยืนยันการตัดสินใจเชิงกลยุทธ์ทั้งหมด (หัวข้อ 2)
- [ ] เตรียมบัญชีและบริการ (Supabase, Vercel, GitHub, โดเมน)

### เฟส 1 — ออกแบบ (Design)
- [ ] ทำ wireframe หน้าหลัก (หน้าแรก, รายการร้านค้า, รายละเอียด, ข่าว, ท่องเที่ยว)
- [ ] กำหนด design system (สี ตัวอักษร component) ให้ใช้ได้ทั้งเว็บและ PWA
- [ ] สรุป schema ฐานข้อมูลขั้นสุดท้าย (หัวข้อ 7) — profiles + trigger, status/updated_at ครบทุกตาราง
- [ ] ตัดสินใจ 3 เรื่องที่ค้าง: แนวทางค้นหาไทย, map provider (Leaflet/OSM vs Google), จัดการ free-tier pause (keep-alive vs Pro)

### เฟส 2 — ตั้งโครงโปรเจกต์ (Scaffolding)
- [ ] ตั้งค่าโปรเจกต์ Next.js 16.2.6+ + TypeScript + Tailwind
- [ ] ตั้งค่า ESLint/Prettier (ปิด semicolon)
- [ ] เชื่อม Supabase (สร้างตาราง, RLS, Storage bucket)
- [ ] ตั้งค่า social login: เปิด Google/Facebook + เพิ่ม Line เป็น Custom OIDC
- [ ] ตั้งค่า PWA (manifest + service worker + ไอคอน)
- [ ] วาง CI/CD เบื้องต้น (GitHub → Vercel)

### เฟส 3 — พัฒนา (Development)
- [ ] หมวดข่าวสาร (แสดงผล + admin จัดการ)
- [ ] หมวดร้านค้า (แสดงผล + รูปภาพ + admin จัดการ)
- [ ] หมวดท่องเที่ยว (แสดงผล + admin จัดการ)
- [ ] ระบบค้นหา
- [ ] ตัวนับผู้ใช้ออนไลน์ใน footer
- [ ] ระบบสมัครสมาชิก/เข้าสู่ระบบด้วย social login (Google/Facebook/Line)
- [ ] หน้า admin (จัดการ 3 หมวด) + การป้องกันด้วย role

### เฟส 4 — ทดสอบและเปิดตัว (Testing & Launch)
- [ ] ทดสอบบนอุปกรณ์จริง (ติดตั้ง PWA บน iOS/Android)
- [ ] ตรวจ SEO, OG image, performance
- [ ] แทนข้อมูลทดสอบด้วยข้อมูลจริง
- [ ] ตรวจหน้าเชิงนโยบายให้ครบ
- [ ] วางแผนดึงร้านค้า/ชุมชนเข้าระบบ

---

## 12. เช็กลิสต์ตรวจสอบก่อนลงมือ (Pre-development Checklist)

### บัญชีและบริการ
- [ ] สร้างโปรเจกต์ Supabase + เก็บ Project URL และ publishable/anon key
- [ ] เปิด Realtime ในโปรเจกต์ Supabase
- [ ] สร้าง OAuth credentials: Google (Cloud Console), Facebook (Meta for Developers)
- [ ] สร้าง LINE Login channel (LINE Developers) สำหรับตั้งเป็น Custom OIDC
- [ ] ตั้งค่า Callback URL ของทุก provider ที่ Supabase
- [ ] เชื่อมต่อ Vercel กับ GitHub repository
- [ ] ตรวจสอบสิทธิ์การจัดการโดเมน thapsakaefocus.com

### โครงสร้างโค้ดและมาตรฐาน
- [ ] ตั้ง Prettier ปิด semicolon (`"semi": false`) ตามมาตรฐานทีม
- [ ] กำหนดโครงสร้างโฟลเดอร์ (`app/`, `components/`, `lib/`, `hooks/`)
- [ ] ตั้งค่า environment variables (`.env.local`) และไม่ commit ขึ้น git

### ฐานข้อมูลและความปลอดภัย
- [ ] สร้างตารางตาม schema (profiles + trigger) และตั้ง RLS policy โดยเช็ก role จาก JWT claim (เลี่ยง recursion)
- [ ] สร้าง Storage bucket สำหรับรูปร้านค้า/สถานที่ พร้อมตั้งสิทธิ์
- [ ] ตั้ง `images.remotePatterns` ใน next.config ให้ชี้ hostname ของ Supabase Storage
- [ ] กำหนดแนวทาง backup ฐานข้อมูล (free tier ไม่มี PITR)
- [ ] กำหนดบัญชี admin คนแรก

### เนื้อหาและข้อมูล (สำคัญต่อความน่าเชื่อถือ)
- [ ] แก้ที่อยู่ให้ถูกต้องเป็น "อำเภอทับสะแก" (เว็บเดิมมีหลายจุดระบุผิดเป็น "อำเภอเมือง")
- [ ] เตรียมข่าวสารจริงอย่างน้อย 5–10 รายการก่อนเปิด
- [ ] เตรียมข้อมูลร้านค้าและสถานที่ท่องเที่ยวจริงให้พอแก่การใช้งาน

### กฎหมายและความเป็นส่วนตัว
- [ ] จัดทำนโยบายความเป็นส่วนตัว (PDPA) และเงื่อนไขการใช้บริการ
- [ ] กำหนดช่องทางแจ้งปัญหา/ลบข้อมูล

---

## 13. ความเสี่ยงและข้อควรระวัง (Risks)

| ความเสี่ยง | ผลกระทบ | แนวทางรับมือ |
|---|---|---|
| ปัญหาไก่กับไข่ (ไม่มีเนื้อหา → ไม่มีผู้ใช้) | เปิดตัวแล้วเงียบ | เน้นทำ 2–3 หมวดให้มีเนื้อหาจริงแน่น แทนการเปิดครบทุกหมวดแต่ว่างเปล่า |
| ข้อมูลที่อยู่ผิด (อำเภอเมือง vs ทับสะแก) | กระทบความน่าเชื่อถือและ SEO | ตรวจและแก้ข้อมูลทั้งหมดก่อนเปิด |
| โควตา realtime connection เกินแผน | ตัวนับออนไลน์ทำงานผิดพลาดเมื่อคนเยอะ | ตรวจสอบลิมิตแผน Supabase, พิจารณาแผน Pro เมื่อโต |
| **Supabase free pause หลังไม่มี activity 7 วัน** | เว็บดูเหมือนล่มช่วงทราฟฟิกน้อย | ทำ keep-alive (cron ping รายวัน) หรือ budget แผน Pro (~$25/เดือน) ตั้งแต่เปิดตัว |
| ไม่มี backup/PITR บน free tier | ข้อมูลจริงหายกู้ไม่ได้ | กำหนดแนวทาง backup (export ประจำ) ก่อนใส่ข้อมูลจริง |
| PWA library เข้ากันไม่ได้กับ Turbopack | build เฟลตอน setup | ใช้ Serwist + ทดสอบ `next build` จริงก่อนผูกเป็นมาตรฐาน |
| ภาระ moderation ตกที่ admin คนเดียว | ดูแลไม่ทันเมื่อเปิดหมวดชุมชน | เปิด marketplace/เว็บบอร์ดเมื่อพร้อม + เตรียมเครื่องมือซ่อน/รายงาน |

---

## 14. ขั้นตอนถัดไป (Next Steps)

1. ทบทวนและยืนยันเอกสารฉบับนี้
2. เลือกเริ่มจาก **ออกแบบ wireframe + design system** หรือ **ตั้งโครงโปรเจกต์ + ตั้งค่า Supabase/PWA**
3. สรุป schema ฐานข้อมูลขั้นสุดท้ายเพื่อสร้างตารางจริง

---

## 15. ข้อมูลอ้างอิง (References)

- Supabase Realtime Presence — https://supabase.com/docs/guides/realtime/presence
- Supabase Realtime (ภาพรวม) — https://supabase.com/docs/guides/realtime
- Supabase Social Login — https://supabase.com/docs/guides/auth/social-login
- Supabase Custom OAuth/OIDC Providers (สำหรับ Line) — https://supabase.com/docs/guides/auth/custom-oauth-providers
- Next.js Documentation — https://nextjs.org/docs
- Next.js 16 Upgrade Guide — https://nextjs.org/docs/app/guides/upgrading/version-16
- Using Next.js with Expo (กรณีขยายเป็น universal app ในอนาคต) — https://docs.expo.dev/guides/using-nextjs/
- Tailwind CSS — https://tailwindcss.com/docs
- TanStack Query — https://tanstack.com/query/latest
- shadcn/ui — https://ui.shadcn.com
- Refine — https://refine.dev
- Serwist (PWA สำหรับ Next.js App Router) — https://serwist.pages.dev
- Leaflet — https://leafletjs.com · OpenStreetMap — https://www.openstreetmap.org
- Supabase Pricing & Free Tier Limits — https://supabase.com/pricing
- PostgreSQL pg_trgm — https://www.postgresql.org/docs/current/pgtrgm.html

---

*เอกสารนี้เป็นฉบับร่างเพื่อการตรวจสอบ ปรับแก้ได้ตามการตัดสินใจที่เปลี่ยนไป*
