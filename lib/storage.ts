import type { SupabaseClient } from "@supabase/supabase-js"

// bucket เดียวที่ใช้เก็บรูปทั้งหมด (ดู components/admin/image-uploader.tsx)
export const IMAGE_BUCKET = "public-images"

// แปลง public URL ของ Supabase Storage → object path ภายใน bucket
// รูปแบบ: https://<host>/storage/v1/object/public/public-images/<path>
// คืน null ถ้าไม่ใช่ URL ของ bucket นี้ (เช่น รูปจากภายนอก) — จะได้ไม่ไปลบมั่ว
export function storagePathFromUrl(url: string | null | undefined): string | null {
  if (!url) return null
  const marker = `/storage/v1/object/public/${IMAGE_BUCKET}/`
  const i = url.indexOf(marker)
  if (i === -1) return null
  const path = decodeURIComponent(url.slice(i + marker.length).split("?")[0])
  return path || null
}

// ลบไฟล์ใน Storage แบบ best-effort — ทำงานหลัง DB เปลี่ยนสำเร็จแล้ว
// ถ้าลบไฟล์พลาด ไม่โยน error (DB เป็นแหล่งความจริง; ไฟล์ค้างแก้ทีหลังได้ ดีกว่าทำ action พัง)
export async function removeStorageObjects(
  supabase: SupabaseClient,
  urls: (string | null | undefined)[]
): Promise<void> {
  const paths = [...new Set(urls.map(storagePathFromUrl).filter((p): p is string => p !== null))]
  if (paths.length === 0) return
  await supabase.storage.from(IMAGE_BUCKET).remove(paths)
}
