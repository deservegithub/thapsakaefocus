import type { MetadataRoute } from "next"
import { routing } from "@/i18n/routing"
import { SITE_URL, localizedUrls } from "@/lib/site"
import { getPublishedNews } from "@/lib/news"
import { getPublishedShops } from "@/lib/shops"
import { getPublishedPlaces } from "@/lib/tourism"

const defaultLocale = routing.defaultLocale

// แต่ละรายการ: loc เป็น URL ของ locale หลัก (th) + แนบ hreflang ครบทุก locale (th/en)
function entry(
  path: string,
  opts: {
    lastModified?: string | Date
    changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"]
    priority?: number
  } = {}
): MetadataRoute.Sitemap[number] {
  const clean = path === "/" ? "" : path
  return {
    url: `${SITE_URL}/${defaultLocale}${clean}`,
    alternates: { languages: localizedUrls(path) },
    ...opts,
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // หน้า static สาธารณะ (ไม่รวม /login, /search — ไม่ต้องการให้ index)
  const staticEntries: MetadataRoute.Sitemap = [
    entry("/", { changeFrequency: "daily", priority: 1 }),
    entry("/news", { changeFrequency: "daily", priority: 0.9 }),
    entry("/shops", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/tourism", { changeFrequency: "weekly", priority: 0.9 }),
    entry("/contact", { changeFrequency: "yearly", priority: 0.3 }),
    entry("/privacy", { changeFrequency: "yearly", priority: 0.2 }),
    entry("/terms", { changeFrequency: "yearly", priority: 0.2 }),
  ]

  // เนื้อหา dynamic — ถ้าดึงไม่ได้ (เช่น ยังไม่ตั้ง env ตอน build) ก็ปล่อยว่าง ไม่ให้ build พัง
  const [news, shops, places] = await Promise.all([
    getPublishedNews().catch(() => []),
    getPublishedShops().catch(() => []),
    getPublishedPlaces().catch(() => []),
  ])

  const newsEntries = news.map((n) =>
    entry(`/news/${n.slug}`, {
      lastModified: n.published_at ?? undefined,
      changeFrequency: "weekly",
      priority: 0.7,
    })
  )
  const shopEntries = shops.map((s) =>
    entry(`/shops/${s.id}`, { changeFrequency: "weekly", priority: 0.6 })
  )
  const placeEntries = places.map((p) =>
    entry(`/tourism/${p.id}`, { changeFrequency: "weekly", priority: 0.6 })
  )

  return [...staticEntries, ...newsEntries, ...shopEntries, ...placeEntries]
}
