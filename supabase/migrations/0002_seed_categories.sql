-- ============================================================
-- Seed หมวดหมู่เริ่มต้น (สองภาษา) — รันซ้ำได้ (on conflict do nothing)
-- ============================================================

insert into public.shop_categories (slug, label_th, label_en, sort_order) values
  ('restaurant',    'ร้านอาหาร', 'Restaurant',     1),
  ('cafe',          'คาเฟ่',     'Cafe',           2),
  ('accommodation', 'ที่พัก',    'Accommodation',  3),
  ('souvenir',      'ของฝาก',    'Souvenir',       4),
  ('service',       'บริการ',    'Service',        5)
on conflict (slug) do nothing;

insert into public.place_categories (slug, label_th, label_en, sort_order) values
  ('beach',     'ทะเล/ชายหาด',   'Sea / Beach',     1),
  ('viewpoint', 'ภูเขา/จุดชมวิว', 'Mountain / View', 2),
  ('community', 'วิถีชุมชน',      'Community',        3),
  ('temple',    'วัด',           'Temple',           4)
on conflict (slug) do nothing;
