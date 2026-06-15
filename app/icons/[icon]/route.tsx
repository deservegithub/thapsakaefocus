import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

// ไอคอน PWA แบบ maskable สร้างอัตโนมัติด้วย ImageResponse (เหมือนเทคนิค OG image)
// URL มีนามสกุล .png จึงข้าม proxy/intl ได้ (matcher ตัด path ที่มีจุด)
// path: /icons/icon-192.png, /icons/icon-512.png
// ⚠️ ไอคอนนี้เป็น placeholder (wordmark "ทับสะแก" บนพื้น teal) — ก่อน launch ควรแทนด้วยโลโก้จริง

const SIZES: Record<string, number> = {
  "icon-192.png": 192,
  "icon-512.png": 512,
}

// wordmark 2 บรรทัด — ชื่ออำเภอจริง
// หมายเหตุ: satori shape อักษรไทยตัวที่ไม่มีสระตามผิด (เช่น "ท" เดี่ยว → กลายเป็น n)
// แต่ละบรรทัดมีสระประกอบ ("ทับ" มี ◌ั, "สะแก" มี ◌ะ/แ) จึง render ถูกต้อง
const LINES = ["ทับ", "สะแก"]

export function generateStaticParams() {
  return Object.keys(SIZES).map((icon) => ({ icon }))
}

export const dynamicParams = false

export async function GET(_req: Request, ctx: { params: Promise<{ icon: string }> }) {
  const { icon } = await ctx.params
  const size = SIZES[icon]
  if (!size) return new Response("Not found", { status: 404 })

  const font = await readFile(join(process.cwd(), "assets/IBMPlexSansThai-SemiBold.ttf"))

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // พื้นเต็ม (maskable) — เนื้อหาอยู่ใน safe zone กลางภาพ
        background: "linear-gradient(135deg, #0e8580 0%, #0c6a67 100%)",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontSize: size * 0.26,
          lineHeight: 1.05,
        }}
      >
        {LINES.map((line) => (
          <div key={line} style={{ display: "flex" }}>
            {line}
          </div>
        ))}
      </div>
    </div>,
    {
      width: size,
      height: size,
      fonts: [{ name: "IBM Plex Sans Thai", data: font, weight: 600, style: "normal" }],
    }
  )
}
