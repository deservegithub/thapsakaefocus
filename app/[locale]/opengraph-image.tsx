import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { SITE_NAME_TH, SITE_NAME_EN } from "@/lib/site"

// รูป Open Graph (preview ตอนแชร์ลิงก์ไป LINE/Facebook/X) — สร้างอัตโนมัติต่อ locale
// ฟอนต์ไทยฝังจาก assets/ (next/font ใช้ไม่ได้ในบริบทนี้ ต้อง readFile เอง)
export const alt = "ทับสะแกโฟกัส — Thapsakae Focus"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const COPY = {
  th: { name: SITE_NAME_TH, tagline: "ข่าวสาร · ร้านค้า · ท่องเที่ยว — อำเภอทับสะแก" },
  en: { name: SITE_NAME_EN, tagline: "News · Local Shops · Travel — Thapsakae District" },
} as const

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const c = COPY[locale as keyof typeof COPY] ?? COPY.th

  const font = await readFile(join(process.cwd(), "assets/IBMPlexSansThai-SemiBold.ttf"))

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 96px",
        background: "linear-gradient(135deg, #0e8580 0%, #0c6a67 100%)",
        color: "#ffffff",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "#f59e0b" }} />
        <div style={{ fontSize: 30, color: "#c9efed" }}>thapsakaefocus.com</div>
      </div>
      <div style={{ fontSize: 108, lineHeight: 1.1, marginTop: 36 }}>{c.name}</div>
      <div style={{ fontSize: 40, color: "#c9efed", marginTop: 20 }}>{c.tagline}</div>
    </div>,
    {
      ...size,
      fonts: [{ name: "IBM Plex Sans Thai", data: font, weight: 600, style: "normal" }],
    }
  )
}
