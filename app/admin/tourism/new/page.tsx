import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { PlaceForm } from "@/components/admin/place-form"

export default async function NewPlacePage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("place_categories")
    .select("id, label_th, label_en")
    .order("sort_order")

  return (
    <div>
      <div className="mb-5 text-sm text-neutral-500">
        <Link href="/admin/tourism">จัดการท่องเที่ยว</Link> ›{" "}
        <span className="text-neutral-800">เพิ่มสถานที่</span>
      </div>
      <h2 className="mb-5 text-xl font-bold text-neutral-800">เพิ่มสถานที่</h2>
      <PlaceForm categories={categories ?? []} />
    </div>
  )
}
