import type { MetadataRoute } from "next"

// Web App Manifest — ทำให้ติดตั้งเป็น PWA บนมือถือได้
// ค่าสีดึงมาจาก design tokens (teal primary-600)
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ทับสะแกโฟกัส — Thapsakae Focus",
    short_name: "ทับสะแกโฟกัส",
    description: "ศูนย์กลางข่าวสาร ร้านค้า และการท่องเที่ยวของอำเภอทับสะแก",
    start_url: "/th",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    lang: "th",
    dir: "ltr",
    background_color: "#ffffff",
    theme_color: "#0e8580",
    // หมายเหตุ: ไอคอน placeholder เป็น wordmark เต็มกรอบ ไม่มี safe-zone จึงประกาศ "any"
    // (ไม่ใช่ maskable เพราะอาจถูก crop ใต้มาสก์วงกลม) — เพิ่ม maskable เมื่อมีโลโก้จริงพร้อม padding
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
