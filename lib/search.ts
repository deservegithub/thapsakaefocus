import { createClient } from "@/lib/supabase/server"
import type { NewsListItem } from "./news"
import type { ShopListItem } from "./shops"
import type { PlaceListItem } from "./tourism"

export type SearchResults = {
  news: NewsListItem[]
  shops: ShopListItem[]
  places: PlaceListItem[]
}

// ตัดอักขระที่ทำให้ .or() filter ของ PostgREST พัง (comma/วงเล็บ/wildcard)
function sanitize(q: string): string {
  return q
    .replace(/[,()*%:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

const NEWS_COLS =
  "id,slug,type,title_th,title_en,summary_th,summary_en,cover_image_url,published_at,view_count"
const SHOP_COLS =
  "id,name_th,name_en,description_th,description_en,address,phone,lat,lng,category:shop_categories(slug,label_th,label_en),shop_images(url,sort_order)"
const PLACE_COLS =
  "id,name_th,name_en,description_th,description_en,address,lat,lng,category:place_categories(slug,label_th,label_en),place_images(url,sort_order)"

export async function searchAll(qRaw: string): Promise<SearchResults> {
  const q = sanitize(qRaw)
  if (!q) return { news: [], shops: [], places: [] }

  const supabase = await createClient()
  const p = `*${q}*` // PostgREST ilike wildcard

  const [news, shops, places] = await Promise.all([
    supabase
      .from("news_articles")
      .select(NEWS_COLS)
      .eq("status", "published")
      .or(`title_th.ilike.${p},title_en.ilike.${p},summary_th.ilike.${p},summary_en.ilike.${p}`)
      .order("published_at", { ascending: false })
      .limit(20),
    supabase
      .from("shops")
      .select(SHOP_COLS)
      .eq("status", "published")
      .or(
        `name_th.ilike.${p},name_en.ilike.${p},description_th.ilike.${p},description_en.ilike.${p},address.ilike.${p}`
      )
      .limit(20),
    supabase
      .from("tourism_places")
      .select(PLACE_COLS)
      .eq("status", "published")
      .or(
        `name_th.ilike.${p},name_en.ilike.${p},description_th.ilike.${p},description_en.ilike.${p},address.ilike.${p}`
      )
      .limit(20),
  ])

  if (news.error) throw news.error
  if (shops.error) throw shops.error
  if (places.error) throw places.error

  return {
    news: (news.data ?? []) as unknown as NewsListItem[],
    shops: (shops.data ?? []) as unknown as ShopListItem[],
    places: (places.data ?? []) as unknown as PlaceListItem[],
  }
}
