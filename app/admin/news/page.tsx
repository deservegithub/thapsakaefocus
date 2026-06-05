import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { deleteNews, setNewsStatus } from "./actions"
import { ConfirmSubmit } from "@/components/admin/confirm-submit"

const STATUS: Record<string, { label: string; cls: string }> = {
  published: { label: "เผยแพร่", cls: "bg-green-50 text-success" },
  draft: { label: "ฉบับร่าง", cls: "bg-neutral-100 text-neutral-500" },
  hidden: { label: "ซ่อน", cls: "bg-accent-50 text-accent-700" },
}

export default async function AdminNewsList() {
  const supabase = await createClient()
  const { data: news } = await supabase
    .from("news_articles")
    .select("id, slug, type, title_th, title_en, status, published_at, updated_at")
    .order("updated_at", { ascending: false })

  const rows = news ?? []

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">จัดการข่าวสาร</h2>
          <p className="text-sm text-neutral-500">ทั้งหมด {rows.length} รายการ</p>
        </div>
        <Link
          href="/admin/news/new"
          className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          + เพิ่มข่าว
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">หัวข้อ (TH)</th>
              <th className="px-4 py-3 font-medium">EN</th>
              <th className="px-4 py-3 font-medium">หมวด</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 text-right font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-neutral-400">
                  ยังไม่มีข่าว — กด “เพิ่มข่าว”
                </td>
              </tr>
            ) : (
              rows.map((n) => {
                const st = STATUS[n.status] ?? STATUS.draft
                return (
                  <tr key={n.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium">{n.title_th}</td>
                    <td className="px-4 py-3">
                      {n.title_en ? (
                        <span className="text-success rounded-md bg-green-50 px-2 py-0.5 text-[11px]">
                          ✓
                        </span>
                      ) : (
                        <span className="bg-accent-50 text-accent-700 rounded-md px-2 py-0.5 text-[11px]">
                          ยังไม่แปล
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">
                      {n.type === "event" ? "กิจกรรม" : "ประกาศ"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${st.cls}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/news/${n.id}`} className="text-primary-600">
                          แก้ไข
                        </Link>
                        <form action={setNewsStatus}>
                          <input type="hidden" name="id" value={n.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={n.status === "published" ? "hidden" : "published"}
                          />
                          <button type="submit" className="text-neutral-500 hover:text-neutral-700">
                            {n.status === "published" ? "ซ่อน" : "เผยแพร่"}
                          </button>
                        </form>
                        <form action={deleteNews}>
                          <input type="hidden" name="id" value={n.id} />
                          <ConfirmSubmit
                            message="ลบข่าวนี้?"
                            className="text-danger hover:underline"
                          >
                            ลบ
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
