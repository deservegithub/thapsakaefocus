import Link from "next/link"
import { createClient } from "@/lib/supabase/server"

async function counts() {
  const supabase = await createClient()
  const [news, shops, places] = await Promise.all([
    supabase.from("news_articles").select("*", { count: "exact", head: true }),
    supabase.from("shops").select("*", { count: "exact", head: true }),
    supabase.from("tourism_places").select("*", { count: "exact", head: true }),
  ])
  return { news: news.count ?? 0, shops: shops.count ?? 0, places: places.count ?? 0 }
}

export default async function AdminDashboard() {
  const c = await counts()

  const cards = [
    { icon: "📰", label: "ข่าวสาร", value: c.news },
    { icon: "🛍️", label: "ร้านค้า", value: c.shops },
    { icon: "🏖️", label: "สถานที่ท่องเที่ยว", value: c.places },
  ]

  return (
    <div>
      <h2 className="text-xl font-bold text-neutral-800">แดชบอร์ด</h2>
      <p className="mt-1 text-sm text-neutral-500">ภาพรวมเนื้อหาในระบบ</p>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="text-3xl">{card.icon}</div>
            <div className="mt-3 text-2xl font-bold">{card.value}</div>
            <div className="text-sm text-neutral-500">{card.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-5">
        <div>
          <div className="font-medium text-neutral-800">จัดการข่าวสาร</div>
          <div className="text-sm text-neutral-500">
            เพิ่ม/แก้ไข/ลบ/ซ่อน + อัปโหลดรูป (ร้านค้า/ท่องเที่ยว เร็ว ๆ นี้)
          </div>
        </div>
        <Link
          href="/admin/news"
          className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          ไปจัดการข่าว ›
        </Link>
      </div>
    </div>
  )
}
