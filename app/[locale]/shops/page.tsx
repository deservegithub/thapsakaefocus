import Image from "next/image"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"
import { getPublishedShops, getShopCategories, sortedImages } from "@/lib/shops"
import { localized } from "@/lib/i18n-content"

export default async function ShopsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ cat?: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const { cat } = await searchParams

  const t = await getTranslations("shops")
  const categories = await getShopCategories()
  const activeCat = categories.find((c) => c.slug === cat)
  const shops = await getPublishedShops(activeCat?.id)

  const tabCls = (on: boolean) =>
    `rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap ${
      on ? "bg-primary-600 text-white" : "border border-neutral-200 bg-white text-neutral-600"
    }`

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <SiteHeader active="shops" />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <h1 className="text-2xl font-bold text-neutral-800">{t("title")}</h1>
        <p className="mt-1 text-sm text-neutral-500">{t("subtitle")}</p>

        {/* แท็บหมวดหมู่ (จาก lookup table) */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
          <Link href="/shops" className={tabCls(!activeCat)}>
            {t("all")}
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/shops?cat=${c.slug}`}
              className={tabCls(activeCat?.slug === c.slug)}
            >
              {localized(c, "label", locale)}
            </Link>
          ))}
        </div>

        {shops.length === 0 ? (
          <div className="mt-10 rounded-xl border border-dashed border-neutral-300 bg-white p-10 text-center text-neutral-400">
            {t("empty")}
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {shops.map((shop, i) => {
              const coverUrl =
                shop.cover_image_url ?? sortedImages(shop.shop_images)[0]?.url ?? null
              return (
                <Link
                  key={shop.id}
                  href={`/shops/${shop.id}`}
                  className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  {coverUrl ? (
                    <div className="relative h-28 w-full sm:h-32">
                      <Image
                        src={coverUrl}
                        alt=""
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div
                      className={`flex h-28 items-center justify-center text-xs text-white/70 sm:h-32 ${
                        i % 2 === 0
                          ? "from-accent-200 to-accent-400 bg-gradient-to-br"
                          : "from-primary-200 to-primary-400 bg-gradient-to-br"
                      }`}
                    >
                      รูปร้าน
                    </div>
                  )}
                  <div className="p-3">
                    {shop.category && (
                      <span className="bg-primary-50 text-primary-700 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium">
                        {localized(shop.category, "label", locale)}
                      </span>
                    )}
                    <h3 className="mt-1.5 line-clamp-1 font-semibold text-neutral-800">
                      {localized(shop, "name", locale)}
                    </h3>
                    {shop.address && (
                      <p className="mt-0.5 line-clamp-1 text-xs text-neutral-500">
                        📍 {shop.address}
                      </p>
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
