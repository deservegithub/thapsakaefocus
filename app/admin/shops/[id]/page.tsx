import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { ShopForm } from "@/components/admin/shop-form"

export default async function EditShopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: shop }, { data: categories }] = await Promise.all([
    supabase
      .from("shops")
      .select("*, images:shop_images(id, url, sort_order)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("shop_categories").select("id, label_th, label_en").order("sort_order"),
  ])
  if (!shop) notFound()

  // เรียงรูปตาม sort_order
  const images = [...(shop.images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((im) => ({ id: im.id, url: im.url }))

  return (
    <div>
      <div className="mb-5 text-sm text-neutral-500">
        <Link href="/admin/shops">จัดการร้านค้า</Link> ›{" "}
        <span className="text-neutral-800">แก้ไขร้านค้า</span>
      </div>
      <h2 className="mb-5 text-xl font-bold text-neutral-800">แก้ไขร้านค้า</h2>
      <ShopForm categories={categories ?? []} initial={{ ...shop, images }} />
    </div>
  )
}
