import type { Metadata } from "next"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"
import { LegalArticle } from "@/components/legal-article"
import { termsSections, TERMS_UPDATED } from "@/lib/legal"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const footer = await getTranslations({ locale, namespace: "footer" })
  return { title: footer("terms") }
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale === "en" ? "en" : "th"
  const t = await getTranslations("legal")
  const footer = await getTranslations("footer")

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <LegalArticle
          title={footer("terms")}
          updatedLabel={t("updated")}
          updatedValue={TERMS_UPDATED[loc]}
          sections={termsSections[loc]}
        />
        <div className="mt-10 flex gap-4 border-t border-neutral-200 pt-6 text-sm">
          <Link href="/privacy" className="text-primary-600 font-medium">
            {footer("privacy")} ›
          </Link>
          <Link href="/contact" className="text-primary-600 font-medium">
            {footer("contact")} ›
          </Link>
        </div>
      </main>
    </div>
  )
}
