-- ============================================================
-- DEMO seed ร้านค้า (ข้อมูลทดสอบ — ลบก่อน launch ได้)
-- seed เฉพาะเมื่อตาราง shops ว่าง (idempotent)
-- category_id หาจาก slug ใน shop_categories · ไม่ใส่รูป (UI โชว์ placeholder)
-- ร้านสุดท้ายไม่ใส่ name_en/description_en เพื่อทดสอบ fallback
-- ============================================================
do $$
begin
  if not exists (select 1 from public.shops) then
    insert into public.shops
      (name_th, name_en, description_th, description_en, address, phone, lat, lng, category_id, status)
    values
      ('ครัวริมเล ทับสะแก', 'Krua Rim Lay',
       'ร้านอาหารทะเลสดริมหาด เมนูเด่นปูผัดผงกะหรี่และกุ้งเผา',
       'Fresh seafood by the beach — signature curry crab and grilled prawns.',
       '123 ม.4 ต.ทับสะแก อ.ทับสะแก จ.ประจวบคีรีขันธ์', '089-123-4567',
       11.5180, 99.6210, (select id from public.shop_categories where slug = 'restaurant'), 'published'),

      ('คาเฟ่มะพร้าวอ่อน', 'Young Coconut Cafe',
       'คาเฟ่บรรยากาศสบาย เมนูเด่นกาแฟมะพร้าวและของหวาน',
       'A relaxed cafe known for coconut coffee and desserts.',
       'ต.อ่างทอง อ.ทับสะแก จ.ประจวบคีรีขันธ์', '081-222-3344',
       11.5402, 99.5988, (select id from public.shop_categories where slug = 'cafe'), 'published'),

      ('โฮมสเตย์ชายทะเล', 'Seaside Homestay',
       'ที่พักวิวทะเล เงียบสงบ เหมาะพักผ่อนสุดสัปดาห์',
       'Sea-view homestay, quiet and perfect for a weekend getaway.',
       'ต.แสงอรุณ อ.ทับสะแก จ.ประจวบคีรีขันธ์', '086-555-7788',
       11.4760, 99.6125, (select id from public.shop_categories where slug = 'accommodation'), 'published'),

      ('ของฝากแม่สมจิตร', 'Mae Somjit Souvenirs',
       'ของฝากขึ้นชื่อ มะพร้าวแปรรูปและน้ำตาลมะพร้าวแท้',
       'Famous local souvenirs — coconut products and pure coconut sugar.',
       'ต.ทับสะแก อ.ทับสะแก จ.ประจวบคีรีขันธ์', '088-444-1122',
       11.5205, 99.6188, (select id from public.shop_categories where slug = 'souvenir'), 'published'),

      ('อู่ซ่อมรถพี่เอก', null,
       'บริการซ่อมรถยนต์และมอเตอร์ไซค์ เปิดทุกวัน',
       null,
       'ต.ห้วยยาง อ.ทับสะแก จ.ประจวบคีรีขันธ์', '087-999-0000',
       11.4521, 99.6402, (select id from public.shop_categories where slug = 'service'), 'published');
  end if;
end $$;
