"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { removeStorageObjects } from "@/lib/storage"

function str(fd: FormData, key: string): string | null {
  const v = fd.get(key)
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null
}
function num(fd: FormData, key: string): number | null {
  const v = str(fd, key)
  if (v === null) return null
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

export async function savePlace(formData: FormData) {
  const supabase = await createClient()
  const id = str(formData, "id")

  const name_th = str(formData, "name_th")
  if (!name_th) throw new Error("ต้องกรอกชื่อสถานที่ (TH)")

  // รูปอัปโหลดฝั่ง client แล้ว — รับมาเป็น URL
  const cover_image_url = str(formData, "cover_url")

  const row = {
    category_id: num(formData, "category_id"),
    name_th,
    name_en: str(formData, "name_en"),
    description_th: str(formData, "description_th"),
    description_en: str(formData, "description_en"),
    address: str(formData, "address"),
    lat: num(formData, "lat"),
    lng: num(formData, "lng"),
    cover_image_url,
    status: str(formData, "status") || "draft",
  }

  let placeId = id
  if (id) {
    // เก็บ cover เดิมไว้เทียบ — ถ้าแอดมินเปลี่ยนรูป ต้องลบไฟล์เก่าทิ้งกัน orphan
    const { data: existing } = await supabase
      .from("tourism_places")
      .select("cover_image_url")
      .eq("id", id)
      .maybeSingle()
    const { error } = await supabase.from("tourism_places").update(row).eq("id", id)
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
    if (existing?.cover_image_url && existing.cover_image_url !== cover_image_url) {
      await removeStorageObjects(supabase, [existing.cover_image_url])
    }
  } else {
    const { data, error } = await supabase.from("tourism_places").insert(row).select("id").single()
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
    placeId = data.id
  }

  // แกลเลอรี — รับ URL ที่อัปโหลดฝั่ง client มาแล้ว → ต่อท้าย place_images
  const urls = formData
    .getAll("gallery_url")
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
  if (urls.length > 0) {
    const { count } = await supabase
      .from("place_images")
      .select("*", { count: "exact", head: true })
      .eq("place_id", placeId)
    const start = count ?? 0
    const rows = urls.map((url, i) => ({ place_id: placeId, url, sort_order: start + i }))
    const { error } = await supabase.from("place_images").insert(rows)
    if (error) throw new Error("บันทึกรูปไม่สำเร็จ: " + error.message)
  }

  revalidatePath("/admin/tourism")
  redirect("/admin/tourism")
}

export async function deletePlace(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  // เก็บ URL รูปทั้งหมดก่อนลบ — แถวใน place_images จะ cascade หายไปพร้อมสถานที่
  const { data: place } = await supabase
    .from("tourism_places")
    .select("cover_image_url, place_images(url)")
    .eq("id", id)
    .maybeSingle()
  const { error } = await supabase.from("tourism_places").delete().eq("id", id)
  if (error) throw new Error(error.message)
  await removeStorageObjects(supabase, [
    place?.cover_image_url,
    ...((place?.place_images ?? []) as { url: string }[]).map((img) => img.url),
  ])
  revalidatePath("/admin/tourism")
}

export async function setPlaceStatus(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const status = formData.get("status") as string
  const { error } = await supabase.from("tourism_places").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/tourism")
}

export async function deletePlaceImage(formData: FormData) {
  const supabase = await createClient()
  const imageId = formData.get("imageId") as string
  const placeId = formData.get("placeId") as string
  const { data: img } = await supabase
    .from("place_images")
    .select("url")
    .eq("id", imageId)
    .maybeSingle()
  const { error } = await supabase.from("place_images").delete().eq("id", imageId)
  if (error) throw new Error(error.message)
  await removeStorageObjects(supabase, [img?.url])
  revalidatePath(`/admin/tourism/${placeId}`)
}
