-- ============================================================
-- DEMO seed สถานที่ท่องเที่ยว (ข้อมูลทดสอบ — ลบก่อน launch ได้)
-- seed เฉพาะเมื่อตาราง tourism_places ว่าง (idempotent)
-- category_id หาจาก slug ใน place_categories · ไม่ใส่รูป (UI โชว์ placeholder)
-- "วัดทับสะแก" ไม่ใส่ name_en/description_en เพื่อทดสอบ fallback
-- ============================================================
do $$
begin
  if not exists (select 1 from public.tourism_places) then
    insert into public.tourism_places
      (name_th, name_en, description_th, description_en, address, lat, lng, category_id, status)
    values
      ('หาดทับสะแก', 'Thapsakae Beach',
       'ชายหาดเงียบสงบ ทอดยาวเลียบอ่าวไทย เหมาะชมพระอาทิตย์ขึ้นยามเช้า',
       'A quiet beach along the Gulf of Thailand, great for sunrise views.',
       'ต.ทับสะแก อ.ทับสะแก จ.ประจวบคีรีขันธ์', 11.5160, 99.6300,
       (select id from public.place_categories where slug = 'beach'), 'published'),

      ('อุทยานแห่งชาติหาดวนกร', 'Hat Wanakon National Park',
       'ชายหาดป่าสนทะเลร่มรื่น มีจุดกางเต็นท์และเส้นทางธรรมชาติ',
       'A shady casuarina beach with camping grounds and nature trails.',
       'ต.ห้วยยาง อ.ทับสะแก จ.ประจวบคีรีขันธ์', 11.6170, 99.6050,
       (select id from public.place_categories where slug = 'beach'), 'published'),

      ('สวนมะพร้าวชุมชน', 'Community Coconut Grove',
       'เรียนรู้วิถีชาวสวนมะพร้าวและชิมผลิตภัณฑ์แปรรูปจากมะพร้าว',
       'Learn the coconut farming way of life and taste local coconut products.',
       'ต.อ่างทอง อ.ทับสะแก จ.ประจวบคีรีขันธ์', 11.5420, 99.6010,
       (select id from public.place_categories where slug = 'community'), 'published'),

      ('จุดชมวิวเขาล้าน', 'Khao Lan Viewpoint',
       'จุดชมวิวมองเห็นทะเลและตัวอำเภอจากมุมสูง',
       'A hilltop viewpoint overlooking the sea and the district.',
       'ต.เขาล้าน อ.ทับสะแก จ.ประจวบคีรีขันธ์', 11.4350, 99.6280,
       (select id from public.place_categories where slug = 'viewpoint'), 'published'),

      ('วัดทับสะแก', null,
       'วัดประจำอำเภอ ศูนย์รวมจิตใจของชาวทับสะแก',
       null,
       'ต.ทับสะแก อ.ทับสะแก จ.ประจวบคีรีขันธ์', 11.5198, 99.6175,
       (select id from public.place_categories where slug = 'temple'), 'published');
  end if;
end $$;
