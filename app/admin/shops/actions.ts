"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

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

// อัปโหลดไฟล์รูปทั้งหมดที่แนบมา → คืน URL สาธารณะ
async function uploadImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  files: File[]
): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
    const path = `shops/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from("public-images")
      .upload(path, file, { contentType: file.type || undefined })
    if (error) throw new Error("อัปโหลดรูปไม่สำเร็จ: " + error.message)
    urls.push(supabase.storage.from("public-images").getPublicUrl(path).data.publicUrl)
  }
  return urls
}

export async function saveShop(formData: FormData) {
  const supabase = await createClient()
  const id = str(formData, "id")

  const name_th = str(formData, "name_th")
  if (!name_th) throw new Error("ต้องกรอกชื่อร้าน (TH)")

  // รูปหน้าปก (เดี่ยว) — ไม่เลือกใหม่ = คงของเดิม
  let cover_image_url = str(formData, "cover_image_url")
  const coverFile = formData.get("cover")
  if (coverFile instanceof File && coverFile.size > 0) {
    const [url] = await uploadImages(supabase, [coverFile])
    if (url) cover_image_url = url
  }

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
    const { error } = await supabase.from("shops").update(row).eq("id", id)
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
  } else {
    const { data, error } = await supabase.from("shops").insert(row).select("id").single()
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
    shopId = data.id
  }

  // อัปโหลดรูปที่แนบเพิ่ม → ต่อท้าย shop_images
  const files = formData.getAll("images").filter((f): f is File => f instanceof File)
  const urls = await uploadImages(supabase, files)
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
  const supabase = await createClient()
  const id = formData.get("id") as string
  const { error } = await supabase.from("shops").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/shops")
}

export async function setShopStatus(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const status = formData.get("status") as string
  const { error } = await supabase.from("shops").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/shops")
}

export async function deleteShopImage(formData: FormData) {
  const supabase = await createClient()
  const imageId = formData.get("imageId") as string
  const shopId = formData.get("shopId") as string
  const { error } = await supabase.from("shop_images").delete().eq("id", imageId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/shops/${shopId}`)
}
