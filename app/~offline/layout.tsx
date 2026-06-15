import type { Metadata } from "next"
import { IBM_Plex_Sans_Thai } from "next/font/google"
import "../globals.css"

// root layout แยกสำหรับหน้า offline (อยู่นอก [locale] จึงต้องมี html/body ของตัวเอง)
// หน้านี้ถูก precache โดย service worker และเสิร์ฟตอนเครื่องไม่มีเน็ต
const ibmPlexThai = IBM_Plex_Sans_Thai({
  variable: "--font-sans",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "ออฟไลน์ · ทับสะแกโฟกัส",
}

export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${ibmPlexThai.variable} h-full antialiased`}>
      <body className="min-h-full font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
