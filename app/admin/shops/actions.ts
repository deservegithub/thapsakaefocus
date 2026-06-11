"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
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

export async function saveShop(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const id = str(formData, "id")

  const name_th = str(formData, "name_th")
  if (!name_th) throw new Error("ต้องกรอกชื่อร้าน (TH)")

  // รูปอัปโหลดฝั่ง client แล้ว — รับมาเป็น URL
  const cover_image_url = str(formData, "cover_url")

  const row = {
    category_id: num(formData, "category_id"),
    name_th,
    name_en: str(formData, "name_en"),
    description_th: str(formData, "description_th"),
    description_en: str(formData, "description_en"),
    address: str(formData, "address"),
    phone: str(formData, "phone"),
    lat: num(formData, "lat"),
    lng: num(formData, "lng"),
    cover_image_url,
    status: str(formData, "status") || "draft",
  }

  let shopId = id
  if (id) {
    // เก็บ cover เดิมไว้เทียบ — ถ้าแอดมินเปลี่ยนรูป ต้องลบไฟล์เก่าทิ้งกัน orphan
    const { data: existing } = await supabase
      .from("shops")
      .select("cover_image_url")
      .eq("id", id)
      .maybeSingle()
    const { error } = await supabase.from("shops").update(row).eq("id", id)
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
    if (existing?.cover_image_url && existing.cover_image_url !== cover_image_url) {
      await removeStorageObjects(supabase, [existing.cover_image_url])
    }
  } else {
    const { data, error } = await supabase.from("shops").insert(row).select("id").single()
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
    shopId = data.id
  }

  // แกลเลอรี — รับ URL ที่อัปโหลดฝั่ง client มาแล้ว → ต่อท้าย shop_images
  const urls = formData
    .getAll("gallery_url")
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
  if (urls.length > 0) {
    const { count } = await supabase
      .from("shop_images")
      .select("*", { count: "exact", head: true })
      .eq("shop_id", shopId)
    const start = count ?? 0
    const rows = urls.map((url, i) => ({ shop_id: shopId, url, sort_order: start + i }))
    const { error } = await supabase.from("shop_images").insert(rows)
    if (error) throw new Error("บันทึกรูปไม่สำเร็จ: " + error.message)
  }

  revalidatePath("/admin/shops")
  redirect("/admin/shops")
}

export async function deleteShop(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const id = formData.get("id") as string
  // เก็บ URL รูปทั้งหมดก่อนลบ — แถวใน shop_images จะ cascade หายไปพร้อมร้าน
  const { data: shop } = await supabase
    .from("shops")
    .select("cover_image_url, shop_images(url)")
    .eq("id", id)
    .maybeSingle()
  const { error } = await supabase.from("shops").delete().eq("id", id)
  if (error) {
    console.error("deleteShop:", error)
    throw new Error("ลบร้านไม่สำเร็จ")
  }
  await removeStorageObjects(supabase, [
    shop?.cover_image_url,
    ...((shop?.shop_images ?? []) as { url: string }[]).map((img) => img.url),
  ])
  revalidatePath("/admin/shops")
}

export async function setShopStatus(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const id = formData.get("id") as string
  const status = formData.get("status") as string
  const { error } = await supabase.from("shops").update({ status }).eq("id", id)
  if (error) {
    console.error("setShopStatus:", error)
    throw new Error("เปลี่ยนสถานะไม่สำเร็จ")
  }
  revalidatePath("/admin/shops")
}

export async function deleteShopImage(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()
  const imageId = formData.get("imageId") as string
  const shopId = formData.get("shopId") as string
  const { data: img } = await supabase
    .from("shop_images")
    .select("url")
    .eq("id", imageId)
    .maybeSingle()
  const { error } = await supabase.from("shop_images").delete().eq("id", imageId)
  if (error) {
    console.error("deleteShopImage:", error)
    throw new Error("ลบรูปไม่สำเร็จ")
  }
  await removeStorageObjects(supabase, [img?.url])
  revalidatePath(`/admin/shops/${shopId}`)
}
