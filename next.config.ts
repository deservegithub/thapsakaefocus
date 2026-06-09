import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"
import { withSentryConfig } from "@sentry/nextjs"

// ชี้ไปที่ ./i18n/request.ts โดยปริยาย
const withNextIntl = createNextIntlPlugin()

// ดึง hostname ของ Supabase Storage จาก env เพื่ออนุญาตให้ next/image ดึงรูปมา optimize ได้
// (ถ้ายังไม่ตั้ง env จะปล่อย remotePatterns ว่าง — รูปจะไม่ถูก optimize แต่ build ไม่พัง)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseHost = supabaseUrl ? new URL(supabaseUrl).hostname : undefined

const nextConfig: NextConfig = {
  experimental: {
    // เพิ่มขีดจำกัดขนาด Server Action (default 1MB) ให้อัปโหลดรูปหลายรูป/รูปใหญ่จากมือถือได้
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    remotePatterns: supabaseHost
      ? [
          {
            protocol: "https",
            hostname: supabaseHost,
            pathname: "/storage/v1/object/**",
          },
        ]
      : [],
  },
}

// ห่อด้วย Sentry — การอัปโหลด source map จะทำงานเฉพาะเมื่อมี SENTRY_ORG/PROJECT/AUTH_TOKEN
// (ไม่มีก็ build ผ่านปกติ เพียงข้ามการอัปโหลด source map)
export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: !process.env.CI,
})
