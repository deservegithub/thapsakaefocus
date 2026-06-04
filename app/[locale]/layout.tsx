import type { Metadata } from "next"
import { IBM_Plex_Sans_Thai } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider, hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import "../globals.css"

const ibmPlexThai = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ทับสะแกโฟกัส",
  description:
    "ศูนย์รวมข้อมูลข่าวสาร ร้านค้า และการท่องเที่ยวของอำเภอทับสะแก จังหวัดประจวบคีรีขันธ์",
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
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
