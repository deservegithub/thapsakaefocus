import type { Metadata } from "next"
import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"
import { SearchBox } from "@/components/search-box"
import { localizedUrls } from "@/lib/site"

// canonical + hreflang ของหน้าแรก (URL ที่ถูกแชร์/ลิงก์มากสุด) — หน้าอื่นพึ่ง hreflang ใน sitemap
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: localizedUrls("/"),
    },
  }
}

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("home")
  const nav = useTranslations("nav")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader active="home" />

      {/* Hero */}
      <section className="bg-primary-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h1 className="max-w-2xl text-4xl leading-tight font-bold">{t("title")}</h1>
          <p className="text-primary-100 mt-3 max-w-xl text-lg">{t("subtitle")}</p>
          <div className="mt-6">
            <SearchBox variant="hero" />
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        {/* ทางลัดไปหมวดที่ทำแล้ว */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/news"
            className="bg-primary-600 hover:bg-primary-700 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white"
          >
            📰 {nav("news")} ›
          </Link>
          <Link
            href="/shops"
            className="bg-accent-500 hover:bg-accent-600 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white"
          >
            🛍️ {nav("shops")} ›
          </Link>
          <Link
            href="/tourism"
            className="bg-primary-600 hover:bg-primary-700 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-medium text-white"
          >
            🏖️ {nav("tourism")} ›
          </Link>
        </div>
        <div className="mt-6 rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          🚧 ครบ 3 หมวดเนื้อหาแล้ว — ระบบค้นหา/ตัวนับออนไลน์/ล็อกอิน กำลังพัฒนาตามแผน
        </div>
      </main>
    </div>
  )
}
