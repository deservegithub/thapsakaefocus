import type { Metadata } from "next"
import Link from "next/link"
import { IBM_Plex_Sans_Thai } from "next/font/google"
import { redirect } from "next/navigation"
import { getCurrentProfile } from "@/lib/auth"
import "../globals.css"

const ibmPlexThai = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ระบบจัดการ · ทับสะแกโฟกัส",
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // ด่าน UX (ด่านจริงคือ RLS ที่ DB): ต้องเป็น admin เท่านั้น
  const profile = await getCurrentProfile()
  if (!profile || profile.role !== "admin") {
    redirect("/th/login?next=/admin")
  }

  return (
    <html lang="th" className={`${ibmPlexThai.variable} h-full antialiased`}>
      <body className="min-h-full bg-neutral-100 font-sans text-neutral-800">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="flex w-60 shrink-0 flex-col bg-neutral-900 text-neutral-300">
            <div className="flex h-16 items-center gap-2 border-b border-neutral-800 px-5">
              <div className="bg-primary-600 flex h-8 w-8 items-center justify-center rounded-md text-white">
                🌊
              </div>
              <div>
                <div className="text-sm font-semibold text-white">ทับสะแกโฟกัส</div>
                <div className="text-[10px] text-neutral-500">ระบบจัดการ</div>
              </div>
            </div>
            <nav className="flex-1 space-y-1 p-3 text-sm">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium hover:bg-neutral-800"
              >
                📊 แดชบอร์ด
              </Link>
              <Link
                href="/admin/news"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-neutral-800"
              >
                📰 ข่าวสาร
              </Link>
              <Link
                href="/admin/shops"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-neutral-800"
              >
                🛍️ ร้านค้า
              </Link>
              <Link
                href="/admin/tourism"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-neutral-800"
              >
                🏖️ ท่องเที่ยว
              </Link>
            </nav>
            <div className="border-t border-neutral-800 p-3">
              <Link
                href="/th"
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-neutral-800"
              >
                ↩ กลับสู่เว็บไซต์
              </Link>
            </div>
          </aside>

          {/* เนื้อหา */}
          <div className="min-w-0 flex-1">
            <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-6">
              <h1 className="font-semibold">ระบบจัดการ</h1>
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-600">{profile.display_name || "แอดมิน"}</span>
                <form action="/auth/signout" method="post">
                  <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-700">
                    ออกจากระบบ
                  </button>
                </form>
              </div>
            </header>
            <main className="p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
