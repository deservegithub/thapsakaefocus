import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"
import { getPublishedPlaces, getPlaceCategories, sortedImages } from "@/lib/tourism"
import { localized } from "@/lib/i18n-content"

export default async function TourismListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ cat?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { cat } = await searchParams

  const t = await getTranslations("tourism")
  const categories = await getPlaceCategories()
  const activeCat = categories.find((c) => c.slug === cat)
  const places = await getPublishedPlaces(activeCat?.id)

  const tabCls = (on: boolean) =>
    `rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
      on ? "bg-primary-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"
    }`

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <SiteHeader active="tourism" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold text-neutral-800">{t("title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("subtitle")}</p>

        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <Link href="/tourism" className={tabCls(!activeCat)}>
            {t("all")}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/tourism?cat=${c.slug}`}
              className={tabCls(activeCat?.slug === c.slug)}
            >
              {localized(c, "label", locale)}
            </Link>
          ))}
        </div>

        {places.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-400">
            {t("empty")}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {places.map((place, i) => {
              const img = sortedImages(place.place_images)[0]
              return (
                <Link
                  key={place.id}
                  href={`/tourism/${place.id}`}
                  className="group relative h-48 overflow-hidden rounded-xl shadow-sm sm:h-56"
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={img.url}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`absolute inset-0 ${
                        i % 3 === 0
                          ? "from-primary-300 to-primary-500 bg-gradient-to-br"
                          : i % 3 === 1
                            ? "from-accent-200 to-accent-400 bg-gradient-to-br"
                            : "from-primary-200 to-primary-400 bg-gradient-to-br"
                      }`}
                    >
                      <span className="flex h-full items-center justify-center text-sm text-white/60">
                        รูปสถานที่
                      </span>
                    </div>
                  )}
                  <div className="from-primary-900/80 via-primary-900/10 absolute inset-0 bg-gradient-to-t to-transparent" />
                  <div className="absolute bottom-0 p-3 text-white">
                    {place.category && (
                      <span className="inline-block rounded-md bg-white/20 px-2 py-0.5 text-[11px] font-medium backdrop-blur">
                        {localized(place.category, "label", locale)}
                      </span>
                    )}
                    <h3 className="mt-1 line-clamp-1 font-semibold">
                      {localized(place, "name", locale)}
                    </h3>
                    {place.address && (
                      <p className="line-clamp-1 text-xs text-white/80">📍 {place.address}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
