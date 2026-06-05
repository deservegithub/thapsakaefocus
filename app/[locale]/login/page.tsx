import { Suspense } from "react"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { LoginButtons } from "@/components/login-buttons"

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("auth")
  const common = await getTranslations("common")

  return (
    <div className="flex min-h-screen flex-col">
      {/* ส่วนหัวแบรนด์ */}
      <div className="bg-primary-600 relative px-6 pt-12 pb-16 text-center text-white">
        <Link
          href="/"
          className="absolute top-3 left-3 flex h-9 w-9 items-center justify-center rounded-md text-xl hover:bg-white/10"
        >
          ‹
        </Link>
        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 text-4xl">
          🌊
        </div>
        <h1 className="text-2xl font-bold">{common("appName")}</h1>
        <p className="text-primary-100 mt-1 text-sm">{t("subtitle")}</p>
      </div>

      <div className="mx-auto -mt-8 w-full max-w-sm flex-1 px-6">
        <div className="rounded-xl bg-white p-5 shadow-md">
          <Suspense fallback={<div className="h-40" />}>
            <LoginButtons />
          </Suspense>
        </div>
        <p className="mt-5 text-center text-xs leading-relaxed text-neutral-500">{t("agree")}</p>
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-neutral-500">
            {t("skip")} ›
          </Link>
        </div>
      </div>
    </div>
  )
}
