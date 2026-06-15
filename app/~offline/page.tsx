// หน้า fallback ตอนออฟไลน์ — ต้อง static ล้วน ไม่ดึงข้อมูลจากเครือข่าย
export default function OfflinePage() {
  return (
    <main className="from-primary-700 to-primary-900 flex min-h-screen flex-col items-center justify-center bg-gradient-to-br px-6 text-center text-white">
      <div className="text-5xl">📡</div>
      <h1 className="mt-6 text-2xl font-semibold">ยังไม่มีการเชื่อมต่ออินเทอร์เน็ต</h1>
      <p className="mt-3 max-w-sm text-balance text-white/80">
        ดูเหมือนตอนนี้คุณออฟไลน์อยู่ หน้าที่เคยเปิดไว้ยังดูได้
        แต่เนื้อหาใหม่จะโหลดได้เมื่อกลับมาออนไลน์
      </p>
      <p className="mt-8 text-sm text-white/60">ทับสะแกโฟกัส</p>
    </main>
  )
}
