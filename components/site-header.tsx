"use client"

import { useLocale, useTranslations } from "next-intl"
import { Link, usePathname } from "@/i18n/navigation"
import { SearchBox } from "@/components/search-box"
import { AccountMenu } from "@/components/account-menu"

type Section = "home" | "news" | "shops" | "tourism"

export function SiteHeader({ active }: { active?: Section }) {
  const t = useTranslations("nav")
  const common = useTranslations("common")
  const locale = useLocale()
  const pathname = usePathname() // path แบบไม่มี prefix locale → ใช้สลับภาษาคงหน้าเดิม

  const linkCls = (section: Section) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      active === section ? "bg-primary-50 text-primary-700" : "text-neutral-600 hover:bg-neutral-50"
    }`

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <div className="bg-primary-600 flex h-9 w-9 items-center justify-center rounded-lg text-lg text-white">
            🌊
          </div>
          <div className="leading-tight">
            <div className="text-primary-700 font-bold">{common("appName")}</div>
            <div className="-mt-0.5 hidden text-[10px] text-neutral-400 sm:block">
              {common("tagline")}
            </div>
          </div>
        </Link>

        {/* เมนูหลัก — แสดงบนจอ sm ขึ้นไป */}
        <nav className="ml-2 hidden items-center gap-1 sm:flex">
          <Link href="/" className={linkCls("home")}>
            {t("home")}
          </Link>
          <Link href="/news" className={linkCls("news")}>
            {t("news")}
          </Link>
          <Link href="/shops" className={linkCls("shops")}>
            {t("shops")}
          </Link>
          <Link href="/tourism" className={linkCls("tourism")}>
            {t("tourism")}
          </Link>
        </nav>

        {/* ขวา: ค้นหา (desktop) + ตัวสลับภาษา */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden md:block">
            <SearchBox />
          </div>
          <div className="flex items-center overflow-hidden rounded-md border border-neutral-200 text-sm">
            <Link
              href={pathname}
              locale="th"
              className={
                locale === "th"
                  ? "bg-primary-600 px-2.5 py-1.5 font-medium text-white"
                  : "px-2.5 py-1.5 text-neutral-500 hover:bg-neutral-50"
              }
            >
              TH
            </Link>
            <Link
              href={pathname}
              locale="en"
              className={
                locale === "en"
                  ? "bg-primary-600 px-2.5 py-1.5 font-medium text-white"
                  : "px-2.5 py-1.5 text-neutral-500 hover:bg-neutral-50"
              }
            >
              EN
            </Link>
          </div>
          <AccountMenu />
        </div>
      </div>
    </header>
  )
}
