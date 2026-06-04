import { useTranslations } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { use } from "react"
import { Link } from "@/i18n/navigation"

export default function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = use(params)
  setRequestLocale(locale)

  const t = useTranslations("home")
  const nav = useTranslations("nav")
  const common = useTranslations("common")

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header + ตัวสลับภาษา (รากฐาน — ดีไซน์เต็มอยู่ใน mockups/) */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary-600 flex h-9 w-9 items-center justify-center rounded-lg text-lg text-white">
              🌊
            </div>
            <div className="leading-tight">
              <div className="text-primary-700 font-bold">{common("appName")}</div>
              <div className="-mt-0.5 text-[10px] text-neutral-400">{common("tagline")}</div>
            </div>
          </div>
          <nav className="ml-2 hidden items-center gap-1 text-sm sm:flex">
            <span className="bg-primary-50 text-primary-700 rounded-md px-3 py-2 font-medium">
              {nav("home")}
            </span>
            <span className="px-3 py-2 text-neutral-600">{nav("news")}</span>
            <span className="px-3 py-2 text-neutral-600">{nav("shops")}</span>
            <span className="px-3 py-2 text-neutral-600">{nav("tourism")}</span>
          </nav>
          <div className="ml-auto flex items-center overflow-hidden rounded-md border border-neutral-200 text-sm">
            <Link
              href="/"
              locale="th"
              className={
                locale === "th"
                  ? "bg-primary-600 px-2.5 py-1.5 font-medium text-white"
                  : "px-2.5 py-1.5 text-neutral-500"
              }
            >
              TH
            </Link>
            <Link
              href="/"
              locale="en"
              className={
                locale === "en"
                  ? "bg-primary-600 px-2.5 py-1.5 font-medium text-white"
                  : "px-2.5 py-1.5 text-neutral-500"
              }
            >
              EN
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary-600 text-white">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h1 className="max-w-2xl text-4xl leading-tight font-bold">{t("title")}</h1>
          <p className="text-primary-100 mt-3 max-w-xl text-lg">{t("subtitle")}</p>
          <div className="mt-6 flex max-w-md items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-lg">
            <span className="text-lg text-neutral-400">🔍</span>
            <input
              className="flex-1 bg-transparent text-neutral-700 outline-none"
              placeholder={t("searchPlaceholder")}
            />
            <button className="bg-accent-500 rounded-lg px-4 py-1.5 text-sm font-medium text-white">
              {locale === "th" ? "ค้นหา" : "Search"}
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-12">
        <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
          🚧 รากฐานโปรเจกต์พร้อมแล้ว — หน้าจริงจะพัฒนาตามดีไซน์ใน{" "}
          <code className="text-primary-700">mockups/</code> ในเฟสพัฒนา (Phase 3)
        </div>
      </main>
    </div>
  )
}
