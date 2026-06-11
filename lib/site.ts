import { routing } from "@/i18n/routing"

// Base URL ของเว็บ (ใช้กับ metadataBase, sitemap, robots, canonical/hreflang)
// ตั้งผ่าน env ได้ — ตอน deploy ควรตั้ง NEXT_PUBLIC_SITE_URL ให้ตรง production
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://thapsakaefocus.com"
).replace(/\/$/, "")

export const SITE_NAME_TH = "ทับสะแกโฟกัส"
export const SITE_NAME_EN = "Thapsakae Focus"

// สร้างชุด URL ต่อ locale สำหรับ path เดียว (ใช้กับ alternates.languages / hreflang)
// path ต้องขึ้นต้นด้วย "/" หรือเป็น "" สำหรับหน้าแรก เช่น "/news", "/shops/abc"
export function localizedUrls(path: string): Record<string, string> {
  const clean = path === "/" ? "" : path
  return Object.fromEntries(
    routing.locales.map((locale) => [locale, `${SITE_URL}/${locale}${clean}`])
  )
}
