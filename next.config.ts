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
  // หมายเหตุ: ไม่ต้องตั้ง serverActions.bodySizeLimit แล้ว เพราะรูปอัปโหลดฝั่ง client
  // ตรงเข้า storage (ดู components/admin/image-uploader.tsx) → server action รับแค่ URL
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
