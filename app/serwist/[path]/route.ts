import { spawnSync } from "node:child_process"
import { createSerwistRoute } from "@serwist/turbopack"

// revision สำหรับ cache-busting ของหน้า precache (/~offline)
// ลำดับ: SHA จาก Vercel → git rev-parse (build ในเครื่อง) → UUID (เปลี่ยนทุก build)
const revision =
  process.env.VERCEL_GIT_COMMIT_SHA ||
  spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf-8" }).stdout?.trim() ||
  crypto.randomUUID()

// compile app/sw.ts → เสิร์ฟที่ /serwist/sw.js (อ้างใน <SerwistProvider swUrl>)
export const { dynamic, dynamicParams, revalidate, generateStaticParams, GET } = createSerwistRoute(
  {
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
    swSrc: "app/sw.ts",
    useNativeEsbuild: true,
  }
)
