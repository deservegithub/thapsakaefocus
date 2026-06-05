import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { deleteShop, setShopStatus } from "./actions"
import { ConfirmSubmit } from "@/components/admin/confirm-submit"

const STATUS: Record<string, { label: string; cls: string }> = {
  published: { label: "เผยแพร่", cls: "bg-green-50 text-success" },
  draft: { label: "ฉบับร่าง", cls: "bg-neutral-100 text-neutral-500" },
  hidden: { label: "ซ่อน", cls: "bg-accent-50 text-accent-700" },
}

type Row = {
  id: string
  name_th: string
  name_en: string | null
  status: string
  category: { label_th: string } | null
}

export default async function AdminShopsList() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("shops")
    .select("id, name_th, name_en, status, category:shop_categories(label_th)")
    .order("updated_at", { ascending: false })
  const rows = (data ?? []) as unknown as Row[]

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">จัดการร้านค้า</h2>
          <p className="text-sm text-neutral-500">ทั้งหมด {rows.length} รายการ</p>
        </div>
        <Link
          href="/admin/shops/new"
          className="bg-primary-600 hover:bg-primary-700 rounded-lg px-4 py-2 text-sm font-medium text-white"
        >
          + เพิ่มร้านค้า
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-medium">ชื่อ (TH)</th>
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
                  ยังไม่มีร้านค้า — กด “เพิ่มร้านค้า”
                </td>
              </tr>
            ) : (
              rows.map((s) => {
                const st = STATUS[s.status] ?? STATUS.draft
                return (
                  <tr key={s.id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium">{s.name_th}</td>
                    <td className="px-4 py-3">
                      {s.name_en ? (
                        <span className="text-success rounded-md bg-green-50 px-2 py-0.5 text-[11px]">
                          ✓
                        </span>
                      ) : (
                        <span className="bg-accent-50 text-accent-700 rounded-md px-2 py-0.5 text-[11px]">
                          ยังไม่แปล
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-neutral-500">{s.category?.label_th ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-md px-2 py-0.5 text-[11px] font-medium ${st.cls}`}>
                        {st.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-3">
                        <Link href={`/admin/shops/${s.id}`} className="text-primary-600">
                          แก้ไข
                        </Link>
                        <form action={setShopStatus}>
                          <input type="hidden" name="id" value={s.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={s.status === "published" ? "hidden" : "published"}
                          />
                          <button type="submit" className="text-neutral-500 hover:text-neutral-700">
                            {s.status === "published" ? "ซ่อน" : "เผยแพร่"}
                          </button>
                        </form>
                        <form action={deleteShop}>
                          <input type="hidden" name="id" value={s.id} />
                          <ConfirmSubmit
                            message="ลบร้านนี้?"
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
