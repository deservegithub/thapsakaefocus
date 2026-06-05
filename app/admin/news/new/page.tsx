import Link from "next/link"
import { NewsForm } from "@/components/admin/news-form"

export default function NewNewsPage() {
  return (
    <div>
      <div className="mb-5 text-sm text-neutral-500">
        <Link href="/admin/news">จัดการข่าวสาร</Link> ›{" "}
        <span className="text-neutral-800">เพิ่มข่าว</span>
      </div>
      <h2 className="mb-5 text-xl font-bold text-neutral-800">เพิ่มข่าว</h2>
      <NewsForm />
    </div>
  )
}
