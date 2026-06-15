import type { Metadata, Viewport } from "next"
import { IBM_Plex_Sans_Thai } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { SITE_URL, SITE_NAME_TH, SITE_NAME_EN } from "@/lib/site"
import { SerwistProvider } from "@serwist/turbopack/react"
import { SiteFooter } from "@/components/site-footer"
import { Analytics } from "@/components/analytics"
import "../globals.css"

const ibmPlexThai = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
})

// ข้อความ meta ต่อ locale (ชื่อ/คำอธิบายเว็บ) — ใช้ทั้ง <title> และ Open Graph
const META = {
  th: {
    name: SITE_NAME_TH,
    description:
      "ศูนย์รวมข้อมูลข่าวสาร ร้านค้า และการท่องเที่ยวของอำเภอทับสะแก จังหวัดประจวบคีรีขันธ์",
  },
  en: {
    name: SITE_NAME_EN,
    description:
      "News, local shops, and travel guide for Thapsakae District, Prachuap Khiri Khan, Thailand.",
  },
} as const

// metadataBase ทำให้ field ที่เป็น URL สัมพัทธ์ (og:image จาก opengraph-image, canonical) กลายเป็น absolute
// หมายเหตุ: ไม่ตั้ง canonical/alternates ที่นี่ เพราะ metadata ถูก inherit ลงหน้าลูก →
// canonical ของหน้าแรกจะรั่วไปทุกหน้า hreflang ครบทุก URL จัดการที่ app/sitemap.ts แทน
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const m = META[locale as keyof typeof META] ?? META.th
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: m.name, template: `%s — ${m.name}` },
    description: m.description,
    openGraph: {
      type: "website",
      siteName: m.name,
      title: m.name,
      description: m.description,
      locale: locale === "en" ? "en_US" : "th_TH",
      alternateLocale: locale === "en" ? "th_TH" : "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: m.name,
      description: m.description,
    },
    // PWA: ทำให้เปิดแบบ standalone บน iOS ได้ (manifest link Next ใส่ให้อัตโนมัติจาก app/manifest.ts)
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: m.name,
    },
  }
}

// สี theme ของแถบเบราว์เซอร์/PWA = teal primary-600 (ตรงกับ manifest)
export const viewport: Viewport = {
  themeColor: "#0e8580",
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  // จำเป็นสำหรับ static rendering ของ next-intl
  setRequestLocale(locale)

  return (
    <html lang={locale} className={`${ibmPlexThai.variable} h-full antialiased`}>
      {/* suppressHydrationWarning: กัน warning จาก attribute ที่ browser extension ฉีดใส่ body
          (เช่น ColorZilla cz-shortcut-listen) — ไม่กระทบ hydration ของเนื้อหาจริง */}
      <body className="flex min-h-full flex-col font-sans" suppressHydrationWarning>
        <Analytics />
        {/* ลงทะเบียน service worker (PWA) — sw compile ที่ /serwist/sw.js */}
        <SerwistProvider swUrl="/serwist/sw.js">
          <NextIntlClientProvider>
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </NextIntlClientProvider>
        </SerwistProvider>
      </body>
    </html>
  )
}
