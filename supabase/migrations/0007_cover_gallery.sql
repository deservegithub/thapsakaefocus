-- ============================================================
-- โมเดลรูปแบบเดียวกันทุกหมวด: cover เดี่ยว (cover_image_url) + แกลเลอรีหลายรูป
-- - ร้าน/ที่เที่ยว: เพิ่มคอลัมน์ cover_image_url (แกลเลอรีมีอยู่แล้ว: shop_images/place_images)
-- - ข่าว: เพิ่มตาราง news_images (cover_image_url มีอยู่แล้ว)
-- ============================================================
begin;

-- ---------- cover ให้ร้าน/ที่เที่ยว ----------
alter table public.shops add column if not exists cover_image_url text;
alter table public.tourism_places add column if not exists cover_image_url text;

-- ---------- แกลเลอรีให้ข่าว ----------
create table if not exists public.news_images (
  id         uuid primary key default gen_random_uuid(),
  news_id    uuid not null references public.news_articles (id) on delete cascade,
  url        text not null,
  sort_order smallint not null default 0
);
create index if not exists idx_news_images_news on public.news_images (news_id);

alter table public.news_images enable row level security;

drop policy if exists "news_images: อ่านตามข่าวที่ published" on public.news_images;
create policy "news_images: อ่านตามข่าวที่ published"
  on public.news_images for select
  using (
    exists (
      select 1 from public.news_articles n
      where n.id = news_id and (n.status = 'published' or public.is_admin())
    )
  );

drop policy if exists "news_images: admin จัดการได้" on public.news_images;
create policy "news_images: admin จัดการได้"
  on public.news_images for all
  using (public.is_admin())
  with check (public.is_admin());

commit;
