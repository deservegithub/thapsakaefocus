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

async function uploadImages(
  supabase: Awaited<ReturnType<typeof createClient>>,
  files: File[]
): Promise<string[]> {
  const urls: string[] = []
  for (const file of files) {
    if (!(file instanceof File) || file.size === 0) continue
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
    const path = `places/${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage
      .from("public-images")
      .upload(path, file, { contentType: file.type || undefined })
    if (error) throw new Error("อัปโหลดรูปไม่สำเร็จ: " + error.message)
    urls.push(supabase.storage.from("public-images").getPublicUrl(path).data.publicUrl)
  }
  return urls
}

export async function savePlace(formData: FormData) {
  const supabase = await createClient()
  const id = str(formData, "id")

  const name_th = str(formData, "name_th")
  if (!name_th) throw new Error("ต้องกรอกชื่อสถานที่ (TH)")

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
    lat: num(formData, "lat"),
    lng: num(formData, "lng"),
    cover_image_url,
    status: str(formData, "status") || "draft",
  }

  let placeId = id
  if (id) {
    const { error } = await supabase.from("tourism_places").update(row).eq("id", id)
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
  } else {
    const { data, error } = await supabase.from("tourism_places").insert(row).select("id").single()
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
    placeId = data.id
  }

  const files = formData.getAll("images").filter((f): f is File => f instanceof File)
  const urls = await uploadImages(supabase, files)
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
  const { error } = await supabase.from("tourism_places").delete().eq("id", id)
  if (error) throw new Error(error.message)
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
  const { error } = await supabase.from("place_images").delete().eq("id", imageId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/tourism/${placeId}`)
}
