-- ============================================================
-- DEMO seed ข่าว (ข้อมูลทดสอบ — ลบออกก่อน launch ได้)
-- มีทั้งแบบแปล EN ครบ และแบบยังไม่แปล (title_en/content_en = null) เพื่อทดสอบ fallback
-- ลบ demo ทั้งหมด:  delete from public.news_articles where slug like 'demo-%';
-- ============================================================

insert into public.news_articles
  (slug, type, title_th, title_en, summary_th, summary_en, content_th, content_en, status, published_at)
values
  (
    'demo-coconut-festival-2569', 'event',
    'เทศกาลมะพร้าวทับสะแก ประจำปี 2569',
    'Thapsakae Coconut Festival 2026',
    'รวมของดีของอำเภอ ออกร้านอาหารพื้นบ้าน การแสดงวัฒนธรรม และตลาดนัดชุมชนริมทะเล',
    'Local products, traditional food stalls, cultural shows, and a seaside community market.',
    E'อำเภอทับสะแกขอเชิญชวนทุกท่านร่วมงานเทศกาลมะพร้าวประจำปี ซึ่งจัดขึ้นเพื่อส่งเสริมผลผลิตท้องถิ่นและการท่องเที่ยวของชุมชน\n\nภายในงานพบกับการออกร้านอาหารพื้นบ้าน ผลิตภัณฑ์แปรรูปจากมะพร้าว การแสดงวัฒนธรรม และตลาดนัดชุมชนริมทะเลตลอดสามวัน',
    E'Thapsakae district invites everyone to the annual Coconut Festival, held to promote local produce and community tourism.\n\nEnjoy traditional food stalls, coconut products, cultural performances, and a seaside community market across three days.',
    'published', now() - interval '1 day'
  ),
  (
    'demo-beach-road-maintenance', 'announcement',
    'ประกาศปิดปรับปรุงถนนเส้นเลียบชายหาดชั่วคราว',
    'Temporary closure of the beachfront road for maintenance',
    'ระหว่างวันที่ 5–10 มิ.ย. เพื่อความปลอดภัยโปรดเลี่ยงเส้นทาง',
    'Between June 5–10. Please avoid the route for your safety.',
    E'เทศบาลแจ้งปิดปรับปรุงผิวจราจรถนนเลียบชายหาดชั่วคราว ระหว่างวันที่ 5–10 มิถุนายน 2569\n\nขออภัยในความไม่สะดวก โปรดใช้เส้นทางเลี่ยงตามป้ายบอกทาง',
    E'The municipality announces a temporary closure of the beachfront road for resurfacing between June 5–10, 2026.\n\nWe apologize for the inconvenience; please follow the signed detour.',
    'published', now() - interval '3 day'
  ),
  (
    'demo-friday-market', 'event',
    'ตลาดนัดชุมชนทุกเย็นวันศุกร์ หน้าที่ว่าการอำเภอ',
    null,
    'พบกับสินค้าชุมชน อาหารพื้นถิ่น และผลไม้ตามฤดูกาล',
    null,
    E'ตลาดนัดชุมชนเปิดทุกเย็นวันศุกร์ บริเวณลานหน้าที่ว่าการอำเภอทับสะแก ตั้งแต่เวลา 16:00 น. เป็นต้นไป\n\nพบกับสินค้าชุมชน อาหารพื้นถิ่น และผลไม้ตามฤดูกาลมากมาย',
    null,
    'published', now() - interval '5 day'
  ),
  (
    'demo-beach-cleanup-volunteers', 'announcement',
    'เปิดรับสมัครอาสาสมัครเก็บขยะชายหาด',
    'Call for beach cleanup volunteers',
    'กิจกรรมรักษ์ทะเลทับสะแก รับจำนวนจำกัด',
    'Thapsakae sea conservation activity. Limited spots.',
    E'ชวนชาวทับสะแกร่วมเป็นอาสาสมัครเก็บขยะชายหาด เพื่อรักษาความสะอาดและระบบนิเวศชายฝั่ง\n\nรับจำนวนจำกัด ลงทะเบียนได้ที่จุดประชาสัมพันธ์',
    E'Join Thapsakae residents as beach cleanup volunteers to keep our coast clean and protect the ecosystem.\n\nLimited spots — register at the information desk.',
    'published', now() - interval '7 day'
  )
on conflict (slug) do nothing;
