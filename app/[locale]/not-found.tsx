import Link from "next/link"

// 404 แบบ static (ไม่เรียก next-intl hook เพื่อกัน error ตอนไม่มี locale context)
// เรนเดอร์ภายใน [locale]/layout จึงได้ <html lang> + ฟอนต์ครบ
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="text-6xl">🌊</div>
      <h1 className="mt-4 text-2xl font-bold text-neutral-800">ไม่พบหน้าที่คุณค้นหา</h1>
      <p className="mt-1 text-sm text-neutral-500">Sorry, we couldn’t find this page.</p>
      <Link
        href="/"
        className="bg-primary-600 hover:bg-primary-700 mt-6 rounded-lg px-5 py-2.5 text-sm font-medium text-white"
      >
        กลับหน้าแรก · Back home
      </Link>
    </div>
  )
}
