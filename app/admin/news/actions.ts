"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

// อ่านค่า string จาก FormData (ว่าง → null)
function str(fd: FormData, key: string): string | null {
  const v = fd.get(key)
  return typeof v === "string" && v.trim() !== "" ? v.trim() : null
}

// บันทึก (insert ถ้าไม่มี id, update ถ้ามี) — เขียนผ่าน user session → RLS is_admin() บังคับ
export async function saveNews(formData: FormData) {
  const supabase = await createClient()
  const id = str(formData, "id")

  let cover_image_url = str(formData, "cover_image_url") // ของเดิม (ถ้าไม่อัปโหลดใหม่)
  const file = formData.get("cover")
  if (file instanceof File && file.size > 0) {
    const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
    const path = `news/${crypto.randomUUID()}.${ext}`
    const { error: upErr } = await supabase.storage
      .from("public-images")
      .upload(path, file, { contentType: file.type || undefined })
    if (upErr) throw new Error("อัปโหลดรูปไม่สำเร็จ: " + upErr.message)
    cover_image_url = supabase.storage.from("public-images").getPublicUrl(path).data.publicUrl
  }

  const title_th = str(formData, "title_th")
  const slug = str(formData, "slug")
  if (!title_th || !slug) throw new Error("ต้องกรอกหัวข้อ (TH) และ slug")

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

  const { error } = id
    ? await supabase.from("news_articles").update(row).eq("id", id)
    : await supabase.from("news_articles").insert(row)
  if (error) throw new Error("บันทึกไม่สำเร็จ: " + error.message)

  revalidatePath("/admin/news")
  redirect("/admin/news")
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
