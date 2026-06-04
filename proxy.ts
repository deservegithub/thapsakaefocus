import createMiddleware from "next-intl/middleware"
import { routing } from "./i18n/routing"

// Next 16: ไฟล์ middleware ถูกเปลี่ยนชื่อเป็น proxy (รันบน Node.js runtime)
// next-intl ส่งคืน request handler มาเป็น default export ตรงตาม proxy convention
export default createMiddleware(routing)

export const config = {
  // ทำงานทุก path ยกเว้น api, ไฟล์ภายใน Next และไฟล์ที่มีนามสกุล (static assets)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}
