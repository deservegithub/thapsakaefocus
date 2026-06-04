import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

// ชี้ไปที่ ./i18n/request.ts โดยปริยาย
const withNextIntl = createNextIntlPlugin()

const nextConfig: NextConfig = {
  // images.remotePatterns สำหรับ Supabase Storage จะเติมตอนเชื่อม Supabase
}

export default withNextIntl(nextConfig)
