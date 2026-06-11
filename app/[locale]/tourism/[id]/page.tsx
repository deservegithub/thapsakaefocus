import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { SiteHeader } from "@/components/site-header"
import { getPlaceById, sortedImages } from "@/lib/tourism"
import { localized } from "@/lib/i18n-content"
import { PlaceMap } from "@/components/place-map"
import { Gallery } from "@/components/gallery"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}): Promise<Metadata> {
  const { locale, id } = await params
  const place = await getPlaceById(id)
  if (!place) return {}
  return {
    title: localized(place, "name", locale),
    description: localized(place, "description", locale),
  }
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) {
  const { locale, id } = await params
  setRequestLocale(locale)

  const place = await getPlaceById(id)
  if (!place) notFound()

  const t = await getTranslations("tourism")
  const media = await getTranslations("media")
  const images = sortedImages(place.place_images)
  const heroUrl = place.cover_image_url ?? images[0]?.url ?? null
  const showFallbackNote = locale === "en" && (!place.name_en || place.name_en.trim() === "")
  const mapHref =
    place.lat != null && place.lng != null
      ? `https://www.google.com/maps?q=${place.lat},${place.lng}`
      : undefined
  const description = localized(place, "description", locale)
  const paragraphs = description.split(/\n+/).filter((p) => p.trim() !== "")

  return (
    <div className="flex min-h-screen flex-col bg-neutral-50">
      <SiteHeader active="tourism" />

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <Link href="/tourism" className="text-primary-600 text-sm font-medium">
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
            <div className="from-primary-300 to-primary-500 flex h-56 items-center justify-center rounded-xl bg-gradient-to-br text-sm text-white/70">
              รูปสถานที่
            </div>
          )}
        </div>

        {place.category && (
          <span className="bg-primary-50 text-primary-700 mt-4 inline-block rounded-md px-2 py-0.5 text-[11px] font-medium">
            {localized(place.category, "label", locale)}
          </span>
        )}
        <h1 className="mt-2 text-2xl font-bold text-neutral-900">
          {localized(place, "name", locale)}
        </h1>
        {place.address && <p className="mt-1 text-sm text-neutral-500">📍 {place.address}</p>}

        {showFallbackNote && (
          <p className="bg-accent-50 text-accent-800 mt-3 rounded-lg px-3 py-2 text-sm">
            {t("notTranslated")}
          </p>
        )}

        {/* ปุ่มลัด */}
        <div className="mt-5 grid grid-cols-2 gap-2">
          {mapHref ? (
            <a
              href={mapHref}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-600 hover:bg-primary-700 flex items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium text-white"
            >
              🧭 {t("directions")}
            </a>
          ) : (
            <span className="flex items-center justify-center gap-1.5 rounded-lg bg-neutral-200 py-2.5 text-sm font-medium text-neutral-400">
              🧭 {t("directions")}
            </span>
          )}
          <span className="flex items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white py-2.5 text-sm font-medium text-neutral-700">
            🔗 {t("share")}
          </span>
        </div>

        {/* เกี่ยวกับสถานที่ */}
        <h2 className="mt-6 mb-2 font-semibold text-neutral-800">{t("about")}</h2>
        <div className="space-y-3 leading-relaxed text-neutral-700">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* แกลเลอรีรูป */}
        <Gallery images={images} title={media("photos")} />

        {/* แผนที่ (Leaflet + OpenStreetMap) */}
        {place.lat != null && place.lng != null && (
          <>
            <h2 className="mt-6 mb-2 font-semibold text-neutral-800">{t("location")}</h2>
            <PlaceMap lat={place.lat} lng={place.lng} label={localized(place, "name", locale)} />
          </>
        )}
      </main>
    </div>
  )
}
