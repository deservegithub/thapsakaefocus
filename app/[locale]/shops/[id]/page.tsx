import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"
import { getShopById, sortedImages } from "@/lib/shops"
import { localized } from "@/lib/i18n-content"
import { PlaceMap } from "@/components/place-map"
import { Gallery } from "@/components/gallery"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const shop = await getShopById(id)
  if (!shop) return {}
  return {
    title: localized(shop, "name", locale),
    description: localized(shop, "description", locale),
  }
}

export default async function ShopDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const shop = await getShopById(id)
  if (!shop) notFound()

  const t = await getTranslations("shops")
  const media = await getTranslations("media")
  const images = sortedImages(shop.shop_images)
  const heroUrl = shop.cover_image_url ?? images[0]?.url ?? null
  const showFallbackNote = locale === "en" && (!shop.name_en || shop.name_en.trim() === "")
  const mapHref =
    shop.lat != null && shop.lng != null
      ? `https://www.google.com/maps?q=${shop.lat},${shop.lng}`
      : undefined

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <SiteHeader active="shops" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Link href="/shops" className="text-primary-600 text-sm font-medium">
          ‹ {t("backToList")}
        </Link>

        {/* รูปหน้าปก (cover) */}
        <div className="mt-4 overflow-hidden rounded-xl">
          {heroUrl ? (
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={heroUrl}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="rounded-xl object-cover"
              />
            </div>
          ) : (
            <div className="from-accent-200 to-accent-400 flex h-56 items-center justify-center rounded-xl bg-gradient-to-br text-sm text-white/70">
              รูปร้าน
            </div>
          )}
        </div>

        {shop.category && (
          <span className="bg-primary-50 text-primary-700 mt-4 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium">
            {localized(shop.category, "label", locale)}
          </span>
        )}
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">
          {localized(shop, "name", locale)}
        </h1>

        {showFallbackNote && (
          <p className="bg-accent-50 text-accent-800 mt-3 rounded-lg px-3 py-2 text-sm">
            {t("notTranslated")}
          </p>
        )}

        <p className="mt-2 leading-relaxed text-neutral-700">
          {localized(shop, "description", locale)}
        </p>

        {/* แกลเลอรีรูป */}
        <Gallery images={images} title={media("photos")} />

        {/* ปุ่มลัด */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {shop.phone ? (
            <a
              href={`tel:${shop.phone}`}
              className="bg-primary-600 hover:bg-primary-700 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium text-white"
            >
              📞 {t("call")}
            </a>
          ) : (
            <span className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-200 py-2.5 text-sm font-medium text-neutral-400">
              📞 {t("call")}
            </span>
          )}
          {mapHref ? (
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
            >
              🧭 {t("directions")}
            </a>
          ) : (
            <span className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-100 py-2.5 text-sm font-medium text-neutral-400">
              🧭 {t("directions")}
            </span>
          )}
        </div>

        {/* ข้อมูลติดต่อ */}
        <h2 className="mt-6 mb-2 font-semibold text-neutral-800">{t("contact")}</h2>
        <div className="divide-y divide-neutral-100 rounded-xl border border-neutral-200 bg-white text-sm">
          {shop.address && (
            <div className="flex gap-3 p-3">
              <span>📍</span>
              <span className="text-neutral-700">{shop.address}</span>
            </div>
          )}
          {shop.phone && (
            <div className="flex gap-3 p-3">
              <span>📞</span>
              <a href={`tel:${shop.phone}`} className="text-primary-700 font-medium">
                {shop.phone}
              </a>
            </div>
          )}
        </div>

        {/* แผนที่ (Leaflet + OpenStreetMap) */}
        {shop.lat != null && shop.lng != null && (
          <>
            <h2 className="mt-6 mb-2 font-semibold text-neutral-800">{t("location")}</h2>
            <PlaceMap lat={shop.lat} lng={shop.lng} label={localized(shop, "name", locale)} />
          </>
        )}
      </main>
    </div>
  )
}
