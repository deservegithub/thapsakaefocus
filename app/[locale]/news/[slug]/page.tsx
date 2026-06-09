import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"
import { getNewsBySlug, incrementNewsView, sortedImages } from "@/lib/news"
import { localized } from "@/lib/i18n-content"
import { Gallery } from "@/components/gallery"
import { formatDate, formatNumber } from "@/lib/format"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) return {}
  return {
    title: `${localized(article, "title", locale)} — ทับสะแกโฟกัส`,
    description: localized(article, "summary", locale),
  }
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  setRequestLocale(locale)

  const article = await getNewsBySlug(slug)
  if (!article) notFound()

  // นับวิว (ไม่ block — ไม่ทำให้หน้าพังถ้าพลาด)
  await incrementNewsView(slug)

  const t = await getTranslations("news")
  const media = await getTranslations("media")
  const title = localized(article, "title", locale)
  const content = localized(article, "content", locale)
  const paragraphs = content.split(/\n+/).filter((p) => p.trim() !== "")

  // แจ้งเตือนเมื่อขอ EN แต่เนื้อหายังไม่แปล (fallback ไป TH)
  const showFallbackNote =
    locale === "en" && (!article.content_en || article.content_en.trim() === "")

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <SiteHeader active="news" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Link href="/news" className="text-primary-600 text-sm font-medium">
          ‹ {t("backToList")}
        </Link>

        <article className="mt-4">
          <span
            className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${
              article.type === "event"
                ? "bg-accent-50 text-accent-700"
                : "bg-primary-50 text-primary-700"
            }`}
          >
            {t(article.type)}
          </span>

          <h1 className="mt-3 text-2xl leading-snug font-bold text-neutral-900 sm:text-3xl">
            {title}
          </h1>

          <p className="mt-3 border-b border-neutral-200 pb-4 text-sm text-neutral-400">
            {formatDate(article.published_at, locale)} · 👁{" "}
            {formatNumber(article.view_count, locale)} {t("views")}
          </p>

          {showFallbackNote && (
            <p className="bg-accent-50 text-accent-800 mt-4 rounded-lg px-3 py-2 text-sm">
              {t("notTranslated")}
            </p>
          )}

          {article.cover_image_url ? (
            <div className="relative my-6 h-52 w-full sm:h-72">
              <Image
                src={article.cover_image_url}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="rounded-xl object-cover"
              />
            </div>
          ) : (
            <div
              className={`my-6 flex h-52 items-center justify-center rounded-xl text-sm text-white/70 sm:h-72 ${
                article.type === "event"
                  ? "from-accent-200 to-accent-400 bg-gradient-to-br"
                  : "from-primary-300 to-primary-500 bg-gradient-to-br"
              }`}
            >
              รูปปกข่าว
            </div>
          )}

          <div className="space-y-4 text-[16px] leading-relaxed text-neutral-700">
            {paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <Gallery images={sortedImages(article.news_images)} title={media("photos")} />
        </article>
      </main>
    </div>
  )
}
