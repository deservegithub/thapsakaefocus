import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { NewsForm } from "@/components/admin/news-form"

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from("news_articles").select("*").eq("id", id).maybeSingle()
  if (!data) notFound()

  return (
    <div>
      <div className="mb-5 text-sm text-neutral-500">
        <Link href="/admin/news">จัดการข่าวสาร</Link> ›{" "}
        <span className="text-neutral-800">แก้ไขข่าว</span>
      </div>
      <h2 className="mb-5 text-xl font-bold text-neutral-800">แก้ไขข่าว</h2>
      <NewsForm initial={data} />
    </div>
  )
}
