-- ============================================================
-- ทับสะแกโฟกัส — Baseline schema (0001_init)
-- สองภาษา (_th/_en), RLS แบบ public อ่าน published, admin จัดการทุกอย่าง
-- รันบน Supabase SQL Editor (โปรเจกต์นี้เป็น project ใหม่ public schema ว่าง)
-- ห่อด้วย begin/commit: ถ้าพลาดตรงไหน rollback ทั้งหมด → รันซ้ำได้สะอาด
-- ============================================================
begin;

-- ---------- Extensions ----------
create extension if not exists pg_trgm; -- ค้นหาไทย/อังกฤษแบบ substring (ILIKE/trigram)

-- ---------- Enums ----------
do $$ begin
  create type public.user_role as enum ('admin', 'shop_owner', 'member');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.content_status as enum ('draft', 'published', 'hidden');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.news_type as enum ('announcement', 'event');
exception when duplicate_object then null; end $$;

-- ---------- ฟังก์ชัน updated_at (ไม่อ้างอิงตาราง สร้างก่อนได้) ----------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end; $$;

-- ============================================================
-- profiles (1:1 กับ auth.users)
-- ============================================================
create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role         public.user_role not null default 'member',
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- สร้าง profile อัตโนมัติเมื่อมีผู้ใช้ใหม่ใน auth.users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(
      new.raw_user_meta_data ->> 'name',
      new.raw_user_meta_data ->> 'full_name',
      split_part(coalesce(new.email, ''), '@', 1)
    )
  )
  on conflict (id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- เช็กว่าเป็น admin (SECURITY DEFINER → bypass RLS ของ profiles กัน recursion)
-- ต้องประกาศ "หลัง" สร้างตาราง profiles เพราะ SQL function เช็ก relation ตอนสร้าง
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ============================================================
-- Lookup tables (หมวดหมู่ — แก้/เพิ่มได้, มี label สองภาษา)
-- ============================================================
create table public.shop_categories (
  id         smallint generated always as identity primary key,
  slug       text not null unique,
  label_th   text not null,
  label_en   text,
  sort_order smallint not null default 0
);

create table public.place_categories (
  id         smallint generated always as identity primary key,
  slug       text not null unique,
  label_th   text not null,
  label_en   text,
  sort_order smallint not null default 0
);

-- ============================================================
-- news_articles
-- ============================================================
create table public.news_articles (
  id              uuid primary key default gen_random_uuid(),
  author_id       uuid references public.profiles (id) on delete set null,
  type            public.news_type not null default 'announcement',
  slug            text not null unique,
  title_th        text not null,
  title_en        text,
  summary_th      text,
  summary_en      text,
  content_th      text,
  content_en      text,
  cover_image_url text,
  status          public.content_status not null default 'draft',
  view_count      integer not null default 0,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create trigger trg_news_updated_at
  before update on public.news_articles
  for each row execute function public.set_updated_at();

create index idx_news_status_published on public.news_articles (status, published_at desc);
create index idx_news_title_th_trgm on public.news_articles using gin (title_th gin_trgm_ops);
create index idx_news_title_en_trgm on public.news_articles using gin (title_en gin_trgm_ops);

-- ============================================================
-- shops
-- ============================================================
create table public.shops (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid references public.profiles (id) on delete set null, -- nullable: admin ป้อนได้
  category_id    smallint references public.shop_categories (id) on delete set null,
  name_th        text not null,
  name_en        text,
  description_th text,
  description_en text,
  address        text,            -- ใช้ร่วม (ที่อยู่ไทย) ไม่แปล
  phone          text,
  lat            double precision,
  lng            double precision,
  status         public.content_status not null default 'draft',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger trg_shops_updated_at
  before update on public.shops
  for each row execute function public.set_updated_at();

create index idx_shops_status on public.shops (status);
create index idx_shops_category on public.shops (category_id);
create index idx_shops_name_th_trgm on public.shops using gin (name_th gin_trgm_ops);
create index idx_shops_name_en_trgm on public.shops using gin (name_en gin_trgm_ops);

create table public.shop_images (
  id         uuid primary key default gen_random_uuid(),
  shop_id    uuid not null references public.shops (id) on delete cascade,
  url        text not null,
  sort_order smallint not null default 0
);
create index idx_shop_images_shop on public.shop_images (shop_id);

-- ============================================================
-- tourism_places
-- ============================================================
create table public.tourism_places (
  id             uuid primary key default gen_random_uuid(),
  author_id      uuid references public.profiles (id) on delete set null,
  category_id    smallint references public.place_categories (id) on delete set null,
  name_th        text not null,
  name_en        text,
  description_th text,
  description_en text,
  address        text,
  lat            double precision,
  lng            double precision,
  status         public.content_status not null default 'draft',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create trigger trg_places_updated_at
  before update on public.tourism_places
  for each row execute function public.set_updated_at();

create index idx_places_status on public.tourism_places (status);
create index idx_places_category on public.tourism_places (category_id);
create index idx_places_name_th_trgm on public.tourism_places using gin (name_th gin_trgm_ops);
create index idx_places_name_en_trgm on public.tourism_places using gin (name_en gin_trgm_ops);

create table public.place_images (
  id         uuid primary key default gen_random_uuid(),
  place_id   uuid not null references public.tourism_places (id) on delete cascade,
  url        text not null,
  sort_order smallint not null default 0
);
create index idx_place_images_place on public.place_images (place_id);

-- ============================================================
-- Row Level Security
-- เปิด RLS ทุกตาราง (deny-by-default) แล้วเพิ่ม policy
-- ============================================================
alter table public.profiles        enable row level security;
alter table public.shop_categories enable row level security;
alter table public.place_categories enable row level security;
alter table public.news_articles   enable row level security;
alter table public.shops           enable row level security;
alter table public.shop_images     enable row level security;
alter table public.tourism_places  enable row level security;
alter table public.place_images    enable row level security;

-- ---------- profiles ----------
create policy "profiles: เจ้าของหรือ admin อ่านได้"
  on public.profiles for select
  using (id = auth.uid() or public.is_admin());

create policy "profiles: เจ้าของแก้ของตัวเองได้"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles: admin จัดการได้ทั้งหมด"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());
-- (การ insert ตอนสมัครทำผ่าน trigger handle_new_user ซึ่งเป็น SECURITY DEFINER จึง bypass RLS)

-- ---------- lookup: หมวดหมู่ (อ่าน public, admin จัดการ) ----------
create policy "shop_categories: อ่าน public" on public.shop_categories for select using (true);
create policy "shop_categories: admin จัดการ" on public.shop_categories for all using (public.is_admin()) with check (public.is_admin());

create policy "place_categories: อ่าน public" on public.place_categories for select using (true);
create policy "place_categories: admin จัดการ" on public.place_categories for all using (public.is_admin()) with check (public.is_admin());

-- ---------- news_articles ----------
create policy "news: public อ่านเฉพาะ published"
  on public.news_articles for select
  using (status = 'published' or public.is_admin());

create policy "news: admin จัดการได้ทั้งหมด"
  on public.news_articles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- shops ----------
create policy "shops: public อ่านเฉพาะ published"
  on public.shops for select
  using (status = 'published' or public.is_admin() or owner_id = auth.uid());

create policy "shops: admin จัดการได้ทั้งหมด"
  on public.shops for all
  using (public.is_admin())
  with check (public.is_admin());

-- (เผื่ออนาคต) เจ้าของร้านแก้ข้อมูลร้านตัวเองได้
create policy "shops: เจ้าของแก้ร้านตัวเองได้"
  on public.shops for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- ---------- shop_images (อ่านตามร้านที่เห็นได้) ----------
create policy "shop_images: อ่านตามร้านที่ published"
  on public.shop_images for select
  using (exists (
    select 1 from public.shops s
    where s.id = shop_id
      and (s.status = 'published' or public.is_admin() or s.owner_id = auth.uid())
  ));

create policy "shop_images: admin จัดการได้"
  on public.shop_images for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- tourism_places ----------
create policy "places: public อ่านเฉพาะ published"
  on public.tourism_places for select
  using (status = 'published' or public.is_admin());

create policy "places: admin จัดการได้ทั้งหมด"
  on public.tourism_places for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- place_images ----------
create policy "place_images: อ่านตามสถานที่ที่ published"
  on public.place_images for select
  using (exists (
    select 1 from public.tourism_places p
    where p.id = place_id
      and (p.status = 'published' or public.is_admin())
  ));

create policy "place_images: admin จัดการได้"
  on public.place_images for all
  using (public.is_admin())
  with check (public.is_admin());

-- ============================================================
-- Storage: bucket สาธารณะสำหรับรูปร้าน/สถานที่/ปกข่าว
-- ============================================================
insert into storage.buckets (id, name, public)
values ('public-images', 'public-images', true)
on conflict (id) do nothing;

create policy "storage: อ่าน public-images ได้ทุกคน"
  on storage.objects for select
  using (bucket_id = 'public-images');

create policy "storage: admin อัปโหลด public-images"
  on storage.objects for insert
  with check (bucket_id = 'public-images' and public.is_admin());

create policy "storage: admin แก้ public-images"
  on storage.objects for update
  using (bucket_id = 'public-images' and public.is_admin())
  with check (bucket_id = 'public-images' and public.is_admin());

create policy "storage: admin ลบ public-images"
  on storage.objects for delete
  using (bucket_id = 'public-images' and public.is_admin());

commit;
