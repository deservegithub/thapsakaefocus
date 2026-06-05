import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"
import { getPublishedNews, type NewsType } from "@/lib/news"
import { localized } from "@/lib/i18n-content"
import { formatDate, formatNumber } from "@/lib/format"

const TYPES: NewsType[] = ["announcement", "event"]

export default async function NewsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ type?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { type: rawType } = await searchParams
  const activeType = TYPES.includes(rawType as NewsType) ? (rawType as NewsType) : undefined

  const t = await getTranslations("news")
  const news = await getPublishedNews(activeType)
  const [featured, ...rest] = news

  const tabCls = (on: boolean) =>
    `rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
      on ? "bg-primary-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"
    }`

  const typeChip = (type: NewsType) =>
    type === "event" ? "bg-accent-50 text-accent-700" : "bg-primary-50 text-primary-700"

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <SiteHeader active="news" />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold text-neutral-800">{t("title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("subtitle")}</p>

        {/* แท็บกรองประเภท */}
        <div className="mt-5 flex gap-2 overflow-x-auto">
          <Link href="/news" className={tabCls(!activeType)}>
            {t("all")}
          </Link>
          <Link href="/news?type=announcement" className={tabCls(activeType === "announcement")}>
            {t("announcement")}
          </Link>
          <Link href="/news?type=event" className={tabCls(activeType === "event")}>
            {t("event")}
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-400">
            {t("empty")}
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {/* ข่าวเด่น (การ์ดใหญ่) */}
            {featured && (
              <Link
                href={`/news/${featured.slug}`}
                className="block overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
              >
                {featured.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featured.cover_image_url}
                    alt=""
                    className="h-44 w-full object-cover sm:h-56"
                  />
                ) : (
                  <div
                    className={`flex h-44 items-center justify-center text-sm text-white/70 sm:h-56 ${
                      featured.type === "event"
                        ? "from-accent-200 to-accent-400 bg-gradient-to-br"
                        : "from-primary-200 to-primary-400 bg-gradient-to-br"
                    }`}
                  >
                    รูปปกข่าว
                  </div>
                )}
                <div className="p-4">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${typeChip(featured.type)}`}
                  >
                    {t(featured.type)}
                  </span>
                  <h2 className="mt-2 text-lg leading-snug font-semibold text-neutral-800">
                    {localized(featured, "title", locale)}
                  </h2>
                  <p className="mt-1 line-clamp-2 text-sm text-neutral-600">
                    {localized(featured, "summary", locale)}
                  </p>
                  <p className="mt-2 text-xs text-neutral-400">
                    {formatDate(featured.published_at, locale)} · 👁{" "}
                    {formatNumber(featured.view_count, locale)} {t("views")}
                  </p>
                </div>
              </Link>
            )}

            {/* ข่าวอื่น ๆ (การ์ดแนวนอน) */}
            {rest.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-2.5 shadow-sm transition hover:shadow-md"
              >
                {item.cover_image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.cover_image_url}
                    alt=""
                    className="h-24 w-24 shrink-0 rounded-md object-cover"
                  />
                ) : (
                  <div
                    className={`flex h-24 w-24 shrink-0 items-center justify-center rounded-md text-[10px] text-white/70 ${
                      item.type === "event"
                        ? "from-accent-200 to-accent-400 bg-gradient-to-br"
                        : "from-primary-200 to-primary-400 bg-gradient-to-br"
                    }`}
                  >
                    รูป
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <span
                    className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-medium ${typeChip(item.type)}`}
                  >
                    {t(item.type)}
                  </span>
                  <h3 className="mt-1 line-clamp-2 leading-snug font-medium text-neutral-800">
                    {localized(item, "title", locale)}
                  </h3>
                  <p className="mt-1 line-clamp-1 text-sm text-neutral-500">
                    {localized(item, "summary", locale)}
                  </p>
                  <p className="mt-1 text-xs text-neutral-400">
                    {formatDate(item.published_at, locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
