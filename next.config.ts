import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// ชี้ไปที่ ./i18n/request.ts โดยปริยาย
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  experimental: {
    // เพิ่มขีดจำกัดขนาด Server Action (default 1MB) ให้อัปโหลดรูปหลายรูป/รูปใหญ่จากมือถือได้
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  // images.remotePatterns สำหรับ Supabase Storage จะเติมตอนเชื่อม Supabase
}

export default withNextIntl(nextConfig)
