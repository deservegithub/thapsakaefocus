import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const footer = await getTranslations({ locale, namespace: "footer" })
  return { title: footer("contact") }
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations("legal")
  const footer = await getTranslations("footer")

  const row = "flex gap-3 p-3 text-sm"

  return (
    <div className="min-h-screen bg-neutral-50">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <h1 className="text-3xl font-bold text-neutral-900">{footer("contact")}</h1>
        <p className="mt-2 text-neutral-600">{t("contactIntro")}</p>

        <h2 className="mt-8 mb-2 font-semibold text-neutral-800">{t("channels")}</h2>
        <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white">
          <div className={row}>
            <span>📧</span>
            <div>
              <div className="font-medium text-neutral-700">{t("email")}</div>
              <a href="mailto:hello@thapsakaefocus.com" className="text-primary-600">
                hello@thapsakaefocus.com
              </a>
            </div>
          </div>
          <div className={row}>
            <span>💬</span>
            <div>
              <div className="font-medium text-neutral-700">{t("line")}</div>
              <span className="text-neutral-500">@thapsakaefocus</span>
            </div>
          </div>
          <div className={row}>
            <span>📘</span>
            <div>
              <div className="font-medium text-neutral-700">{t("facebook")}</div>
              <span className="text-neutral-500">ทับสะแกโฟกัส</span>
            </div>
          </div>
          <div className={row}>
            <span>📍</span>
            <div>
              <div className="font-medium text-neutral-700">{t("area")}</div>
              <span className="text-neutral-500">{t("areaValue")}</span>
            </div>
          </div>
        </div>

        <div className="border-primary-100 bg-primary-50 text-primary-800 mt-6 rounded-xl border p-5 text-sm">
          <div className="mb-1 font-semibold">{t("shopOwnerTitle")}</div>
          <p className="text-primary-700/80">{t("shopOwnerBody")}</p>
        </div>

        <div className="mt-10 flex gap-4 border-t border-neutral-200 pt-6 text-sm">
          <Link href="/terms" className="text-primary-600 font-medium">
            {footer("terms")} ›
          </Link>
          <Link href="/privacy" className="text-primary-600 font-medium">
            {footer("privacy")} ›
          </Link>
        </div>
      </main>
    </div>
  )
}
