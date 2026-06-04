-- ============================================================
-- RPC: เพิ่ม view_count ของข่าว
-- anon update ไม่ได้ (RLS) จึงใช้ SECURITY DEFINER ให้เพิ่มวิวได้เฉพาะข่าว published
-- ============================================================
create or replace function public.increment_news_view(p_slug text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.news_articles
  set view_count = view_count + 1
  where slug = p_slug and status = 'published';
$$;

grant execute on function public.increment_news_view(text) to anon, authenticated;
