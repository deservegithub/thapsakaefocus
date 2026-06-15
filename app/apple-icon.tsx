import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

// ไอคอนหน้าจอโฮมของ iOS (Safari ไม่อ่าน maskable ใน manifest จึงต้องมีแยก)
// Next auto-link เป็น <link rel="apple-touch-icon"> ให้เอง
// ⚠️ placeholder — แทนด้วยโลโก้จริงก่อน launch
export const size = { width: 180, height: 180 }
export const contentType = "image/png"

export default async function AppleIcon() {
  const font = await readFile(join(process.cwd(), "assets/IBMPlexSansThai-SemiBold.ttf"))

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #0e8580 0%, #0c6a67 100%)",
        color: "#ffffff",
        fontSize: 48,
        lineHeight: 1.05,
      }}
    >
      {/* wordmark 2 บรรทัด — satori shape อักษรไทยที่ไม่มีสระตามผิด จึงเลี่ยงตัวเดียวโดด */}
      <div style={{ display: "flex" }}>ทับ</div>
      <div style={{ display: "flex" }}>สะแก</div>
    </div>,
    {
      ...size,
      fonts: [{ name: "IBM Plex Sans Thai", data: font, weight: 600, style: "normal" }],
    }
  )
}
