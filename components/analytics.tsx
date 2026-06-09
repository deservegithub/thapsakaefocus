// Plausible Analytics (privacy-first) — โหลด script เฉพาะเมื่อมีการตั้งค่า domain เท่านั้น
// ตั้งค่าใน .env.local:
//   NEXT_PUBLIC_PLAUSIBLE_DOMAIN=thapsakaefocus.com
//   (ทางเลือก self-host) NEXT_PUBLIC_PLAUSIBLE_SRC=https://your-instance/js/script.js
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN
  if (!domain) return null

  const src = process.env.NEXT_PUBLIC_PLAUSIBLE_SRC || "https://plausible.io/js/script.js"

  return <script defer data-domain={domain} src={src} />
}
