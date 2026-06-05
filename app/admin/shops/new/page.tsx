import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { ShopForm } from "@/components/admin/shop-form"

export default async function NewShopPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("shop_categories")
    .select("id, label_th, label_en")
    .order("sort_order")

  return (
    <div>
      <div className="mb-5 text-sm text-neutral-500">
        <Link href="/admin/shops">จัดการร้านค้า</Link> ›{" "}
        <span className="text-neutral-800">เพิ่มร้านค้า</span>
      </div>
      <h2 className="mb-5 text-xl font-bold text-neutral-800">เพิ่มร้านค้า</h2>
      <ShopForm categories={categories ?? []} />
    </div>
  )
}
