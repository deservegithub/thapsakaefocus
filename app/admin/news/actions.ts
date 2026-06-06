"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// อ่านค่า string จาก FormData (ว่าง → null)
function str(fd: FormData, key: string): string | null {
  const v = fd.get(key)
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null
}

// ทำ slug ให้ปลอดภัยกับ URL: ASCII (อังกฤษ/เลข/ขีด) — เลี่ยงปัญหา encode ของอักขระไทยใน URL
// ถ้าพิมพ์ไทยล้วน (slugify แล้วว่าง) → fallback เป็น id สุ่ม จะได้ route ได้เสมอ
function slugify(s: string): string {
  const base = s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
  return base || "news-" + crypto.randomUUID().slice(0, 8)
}

// บันทึก (insert ถ้าไม่มี id, update ถ้ามี) — เขียนผ่าน user session → RLS is_admin() บังคับ
export async function saveNews(formData: FormData) {
  const supabase = await createClient()
  const id = str(formData, "id")

  // รูปอัปโหลดฝั่ง client แล้ว — รับมาเป็น URL
  const cover_image_url = str(formData, "cover_url")

  const title_th = str(formData, "title_th")
  const rawSlug = str(formData, "slug")
  if (!title_th || !rawSlug) throw new Error("ต้องกรอกหัวข้อ (TH) และ slug")
  const slug = slugify(rawSlug)

  const row = {
    type: str(formData, "type") || "announcement",
    slug,
    title_th,
    title_en: str(formData, "title_en"),
    summary_th: str(formData, "summary_th"),
    summary_en: str(formData, "summary_en"),
    content_th: str(formData, "content_th"),
    content_en: str(formData, "content_en"),
    status: str(formData, "status") || "draft",
    published_at: str(formData, "published_at"),
    cover_image_url,
  }

  let newsId = id
  if (id) {
    const { error } = await supabase.from("news_articles").update(row).eq("id", id)
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
  } else {
    const { data, error } = await supabase.from("news_articles").insert(row).select("id").single()
    if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)
    newsId = data.id
  }

  // แกลเลอรี (รูปหลายรูป) — รับ URL ที่อัปโหลดฝั่ง client มาแล้ว → ต่อท้าย news_images
  const urls = formData
    .getAll("gallery_url")
    .filter((v): v is string => typeof v === "string" && v.trim() !== "")
  if (urls.length > 0) {
    const { count } = await supabase
      .from("news_images")
      .select("*", { count: "exact", head: true })
      .eq("news_id", newsId)
    const start = count ?? 0
    const { error } = await supabase
      .from("news_images")
      .insert(urls.map((url, i) => ({ news_id: newsId, url, sort_order: start + i })))
    if (error) throw new Error("บันทึกรูปแกลเลอรีไม่สำเร็จ: " + error.message)
  }

  revalidatePath("/admin/news")
  redirect("/admin/news")
}

export async function deleteNewsImage(formData: FormData) {
  const supabase = await createClient()
  const imageId = formData.get("imageId") as string
  const newsId = formData.get("newsId") as string
  const { error } = await supabase.from("news_images").delete().eq("id", imageId)
  if (error) throw new Error(error.message)
  revalidatePath(`/admin/news/${newsId}`)
}

export async function deleteNews(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const { error } = await supabase.from("news_articles").delete().eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/news")
}

// สลับ published <-> hidden
export async function setNewsStatus(formData: FormData) {
  const supabase = await createClient()
  const id = formData.get("id") as string
  const status = formData.get("status") as string
  const { error } = await supabase.from("news_articles").update({ status }).eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/news")
}
