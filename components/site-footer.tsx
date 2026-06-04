import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/navigation"
import { OnlineCounter } from "./online-counter"

export async function SiteFooter() {
  const t = await getTranslations("footer")
  const nav = await getTranslations("nav")
  const common = await getTranslations("common")

  return (
    <footer className="bg-neutral-800 text-neutral-300">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-12 md:grid-cols-4">
        <div className="col-span-2 md:col-span-2">
          <div className="mb-2 text-lg font-bold text-white">{common("appName")}</div>
          <p className="mb-4 max-w-md text-sm leading-relaxed text-neutral-400">{t("about")}</p>
          <OnlineCounter />
        </div>

        <div>
          <div className="mb-3 font-semibold text-white">{t("categories")}</div>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/news" className="hover:text-white">
                {nav("news")}
              </Link>
            </li>
            <li>
              <Link href="/shops" className="hover:text-white">
                {nav("shops")}
              </Link>
            </li>
            <li>
              <Link href="/tourism" className="hover:text-white">
                {nav("tourism")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="mb-3 font-semibold text-white">{t("about_title")}</div>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <Link href="/terms" className="hover:text-white">
                {t("terms")}
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:text-white">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white">
                {t("contact")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-neutral-700">
        <div className="mx-auto max-w-6xl px-6 py-4 text-xs text-neutral-500">{t("copyright")}</div>
      </div>
    </footer>
  )
}
