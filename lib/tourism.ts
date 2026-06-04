import { createClient } from "@/lib/supabase/server"

export type PlaceCategory = {
  id: number
  slug: string
  label_th: string
  label_en: string | null
  sort_order: number
}

export type PlaceImage = { url: string; sort_order: number }

export type PlaceListItem = {
  id: string
  name_th: string
  name_en: string | null
  description_th: string | null
  description_en: string | null
  address: string | null
  lat: number | null
  lng: number | null
  category: { slug: string; label_th: string; label_en: string | null } | null
  place_images: PlaceImage[]
}

export type PlaceDetail = PlaceListItem & {
  created_at: string
  updated_at: string
}

const PLACE_SELECT =
  "id, name_th, name_en, description_th, description_en, address, lat, lng, category:place_categories(slug,label_th,label_en), place_images(url,sort_order)"

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export async function getPlaceCategories(): Promise<PlaceCategory[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("place_categories").select("*").order("sort_order")
  if (error) throw error
  return (data ?? []) as PlaceCategory[]
}

export async function getPublishedPlaces(categoryId?: number): Promise<PlaceListItem[]> {
  const supabase = await createClient()
  let query = supabase
    .from("tourism_places")
    .select(PLACE_SELECT)
    .eq("status", "published")
    .order("created_at", { ascending: false })

  if (categoryId) query = query.eq("category_id", categoryId)

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as unknown as PlaceListItem[]
}

export async function getPlaceById(id: string): Promise<PlaceDetail | null> {
  if (!UUID_RE.test(id)) return null
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("tourism_places")
    .select(`${PLACE_SELECT}, created_at, updated_at`)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle()
  if (error) throw error
  return (data as unknown as PlaceDetail) ?? null
}

export function sortedImages(images: PlaceImage[]): PlaceImage[] {
  return [...images].sort((a, b) => a.sort_order - b.sort_order)
}
