import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"
import { SearchBox } from "@/components/search-box"
import { searchAll } from "@/lib/search"
import { localized } from "@/lib/i18n-content"

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ q?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { q = "" } = await searchParams
  const query = q.trim()

  const t = await getTranslations("search")
  const results = query ? await searchAll(query) : { news: [], shops: [], places: [] }
  const total = results.news.length + results.shops.length + results.places.length

  const sectionTitle = "mt-6 mb-2 text-sm font-semibold text-neutral-500"
  const rowCls =
    "flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-3 shadow-sm transition hover:shadow-md"

  return (
    <div className="min-h-screen bg-neutral-50">
      <SiteHeader />

      <main className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold text-neutral-800">{t("title")}</h1>
        <div className="mt-4">
          <SearchBox defaultValue={query} variant="hero" />
        </div>

        {!query ? (
          <p className="mt-10 text-center text-neutral-400">{t("prompt")}</p>
        ) : total === 0 ? (
          <p className="mt-10 text-center text-neutral-400">{t("empty", { q: query })}</p>
        ) : (
          <>
            <p className="mt-5 text-sm text-neutral-500">{t("resultsFor", { q: query })}</p>

            {results.news.length > 0 && (
              <section>
                <h2 className={sectionTitle}>{t("countNews", { count: results.news.length })}</h2>
                <div className="space-y-2">
                  {results.news.map((n) => (
                    <Link key={n.id} href={`/news/${n.slug}`} className={rowCls}>
                      <span className="text-xl">📰</span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 font-medium text-neutral-800">
                          {localized(n, "title", locale)}
                        </span>
                        <span className="line-clamp-1 text-xs text-neutral-500">
                          {localized(n, "summary", locale)}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.shops.length > 0 && (
              <section>
                <h2 className={sectionTitle}>{t("countShops", { count: results.shops.length })}</h2>
                <div className="space-y-2">
                  {results.shops.map((s) => (
                    <Link key={s.id} href={`/shops/${s.id}`} className={rowCls}>
                      <span className="text-xl">🛍️</span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 font-medium text-neutral-800">
                          {localized(s, "name", locale)}
                        </span>
                        <span className="line-clamp-1 text-xs text-neutral-500">
                          {s.category ? localized(s.category, "label", locale) : ""}
                          {s.address ? ` · ${s.address}` : ""}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {results.places.length > 0 && (
              <section>
                <h2 className={sectionTitle}>
                  {t("countPlaces", { count: results.places.length })}
                </h2>
                <div className="space-y-2">
                  {results.places.map((pl) => (
                    <Link key={pl.id} href={`/tourism/${pl.id}`} className={rowCls}>
                      <span className="text-xl">🏖️</span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-1 font-medium text-neutral-800">
                          {localized(pl, "name", locale)}
                        </span>
                        <span className="line-clamp-1 text-xs text-neutral-500">
                          {pl.category ? localized(pl.category, "label", locale) : ""}
                          {pl.address ? ` · ${pl.address}` : ""}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}
