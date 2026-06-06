import { createClient } from "@/lib/supabase/server"

export type NewsType = "announcement" | "event"

export type NewsListItem = {
  id: string
  slug: string
  type: NewsType
  title_th: string
  title_en: string | null
  summary_th: string | null
  summary_en: string | null
  cover_image_url: string | null
  published_at: string | null
  view_count: number
}

export type NewsImage = { url: string; sort_order: number }

export type NewsDetail = NewsListItem & {
  content_th: string | null
  content_en: string | null
  created_at: string
  updated_at: string
  news_images: NewsImage[]
}

const LIST_COLUMNS =
  "id, slug, type, title_th, title_en, summary_th, summary_en, cover_image_url, published_at, view_count"

// ดึงข่าวที่ published เรียงใหม่สุดก่อน (กรอง type ได้)
export async function getPublishedNews(type?: NewsType): Promise<NewsListItem[]> {
  const supabase = await createClient()
  let query = supabase
    .from("news_articles")
    .select(LIST_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false })

  if (type) query = query.eq("type", type)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as NewsListItem[]
}

// ดึงข่าวเดี่ยวจาก slug (เฉพาะ published) — null ถ้าไม่พบ
export async function getNewsBySlug(slug: string): Promise<NewsDetail | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("news_articles")
    .select(
      `${LIST_COLUMNS}, content_th, content_en, created_at, updated_at, news_images(url, sort_order)`
    )
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle()

  if (error) throw error
  return (data as unknown as NewsDetail) ?? null
}

// เรียงรูปแกลเลอรีตาม sort_order
export function sortedImages<T extends { sort_order: number }>(images: T[]): T[] {
  return [...images].sort((a, b) => a.sort_order - b.sort_order)
}

// เพิ่ม view (ไม่ block การ render ถ้าพลาด)
export async function incrementNewsView(slug: string): Promise<void> {
  try {
    const supabase = await createClient()
    await supabase.rpc("increment_news_view", { p_slug: slug })
  } catch {
    // ไม่สำคัญพอจะทำให้หน้าพัง
  }
}
