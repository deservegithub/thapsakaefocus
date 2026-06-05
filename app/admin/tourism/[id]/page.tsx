import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PlaceForm } from "@/components/admin/place-form"

export default async function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data: place }, { data: categories }] = await Promise.all([
    supabase
      .from("tourism_places")
      .select("*, images:place_images(id, url, sort_order)")
      .eq("id", id)
      .maybeSingle(),
    supabase.from("place_categories").select("id, label_th, label_en").order("sort_order"),
  ])
  if (!place) notFound()

  const images = [...(place.images ?? [])]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((im) => ({ id: im.id, url: im.url }))

  return (
    <div>
      <div className="mb-5 text-sm text-neutral-500">
        <Link href="/admin/tourism">จัดการท่องเที่ยว</Link> ›{" "}
        <span className="text-neutral-800">แก้ไขสถานที่</span>
      </div>
      <h2 className="mb-5 text-xl font-bold text-neutral-800">แก้ไขสถานที่</h2>
      <PlaceForm categories={categories ?? []} initial={{ ...place, images }} />
    </div>
  )
}
