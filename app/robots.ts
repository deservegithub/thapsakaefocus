import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"

// /admin และ /auth เป็นพื้นที่หลังบ้าน — กันบอตไม่ให้ index (ด่านจริงคือ auth/RLS)
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/auth"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
