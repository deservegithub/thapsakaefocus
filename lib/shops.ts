import { createClient } from "@/lib/supabase/server"

export type ShopCategory = {
  id: number
  slug: string
  label_th: string
  label_en: string | null
  sort_order: number
}

export type ShopImage = { url: string; sort_order: number }

export type ShopListItem = {
  id: string
  name_th: string
  name_en: string | null
  description_th: string | null
  description_en: string | null
  address: string | null
  phone: string | null
  lat: number | null
  lng: number | null
  cover_image_url: string | null
  category: { slug: string; label_th: string; label_en: string | null } | null
  shop_images: ShopImage[]
}

export type ShopDetail = ShopListItem & {
  created_at: string
  updated_at: string
}

const SHOP_SELECT =
  "id, name_th, name_en, description_th, description_en, address, phone, lat, lng, cover_image_url, category:shop_categories(slug,label_th,label_en), shop_images(url,sort_order)"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getShopCategories(): Promise<ShopCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("shop_categories").select("*").order("sort_order")
  if (error) throw error
  return (data ?? []) as ShopCategory[]
}

export async function getPublishedShops(categoryId?: number): Promise<ShopListItem[]> {
  const supabase = await createClient()
  let query = supabase
    .from("shops")
    .select(SHOP_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })

  if (categoryId) query = query.eq("category_id", categoryId)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as ShopListItem[]
}

export async function getShopById(id: string): Promise<ShopDetail | null> {
  if (!UUID_RE.test(id)) return null // กัน error "invalid input syntax for uuid"
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("shops")
    .select(`${SHOP_SELECT}, created_at, updated_at`)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle()
  if (error) throw error
  return (data as unknown as ShopDetail) ?? null
}

// เรียงรูปตาม sort_order (เรียงใน JS เลี่ยงความซับซ้อนของ foreignTable order)
export function sortedImages(images: ShopImage[]): ShopImage[] {
  return [...images].sort((a, b) => a.sort_order - b.sort_order)
}
