"use client"

import { useState } from "react"
import { saveNews } from "@/app/admin/news/actions"

type NewsInitial = {
  id: string
  type: string
  slug: string
  title_th: string | null
  title_en: string | null
  summary_th: string | null
  summary_en: string | null
  content_th: string | null
  content_en: string | null
  status: string
  published_at: string | null
  cover_image_url: string | null
}

const field =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
const label = "mb-1 block text-sm font-medium text-neutral-600"

export function NewsForm({ initial }: { initial?: NewsInitial | null }) {
  const [lang, setLang] = useState<"th" | "en">("th")
  const tab = (on: boolean) =>
    `px-4 py-2 text-sm font-medium border-b-2 ${on ? "border-primary-600 text-primary-700" : "border-transparent text-neutral-400"}`

  // ตัด timezone ของ published_at ให้เป็น yyyy-mm-dd สำหรับ input type=date
  const pubDate = initial?.published_at ? initial.published_at.slice(0, 10) : ""

  return (
    <form action={saveNews} className="grid max-w-4xl grid-cols-3 gap-6">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <input type="hidden" name="cover_image_url" defaultValue={initial?.cover_image_url ?? ""} />

      {/* เนื้อหา (แท็บภาษา) */}
      <div className="col-span-2 space-y-5">
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <div className="mb-5 flex items-center gap-1 border-b border-neutral-200">
            <button type="button" onClick={() => setLang("th")} className={tab(lang === "th")}>
              ไทย (หลัก)
            </button>
            <button type="button" onClick={() => setLang("en")} className={tab(lang === "en")}>
              English
            </button>
            <span className="ml-auto text-xs text-neutral-400">
              * ไทยจำเป็น · อังกฤษเติมทีหลังได้
            </span>
          </div>

          {/* แผงไทย */}
          <div className={lang === "th" ? "space-y-4" : "hidden"}>
            <div>
              <label className={label}>หัวข้อข่าว (TH) *</label>
              <input name="title_th" defaultValue={initial?.title_th ?? ""} className={field} />
            </div>
            <div>
              <label className={label}>Slug * (ภาษาอังกฤษ/ตัวเลข/ขีด ใช้ใน URL)</label>
              <input
                name="slug"
                defaultValue={initial?.slug ?? ""}
                className={field}
                placeholder="thapsakae-coconut-festival"
              />
            </div>
            <div>
              <label className={label}>สรุปย่อ (TH)</label>
              <textarea
                name="summary_th"
                defaultValue={initial?.summary_th ?? ""}
                rows={2}
                className={field}
              />
            </div>
            <div>
              <label className={label}>เนื้อหา (TH)</label>
              <textarea
                name="content_th"
                defaultValue={initial?.content_th ?? ""}
                rows={8}
                className={field}
              />
            </div>
          </div>

          {/* แผงอังกฤษ */}
          <div className={lang === "en" ? "space-y-4" : "hidden"}>
            <div>
              <label className={label}>Title (EN)</label>
              <input name="title_en" defaultValue={initial?.title_en ?? ""} className={field} />
            </div>
            <div>
              <label className={label}>Summary (EN)</label>
              <textarea
                name="summary_en"
                defaultValue={initial?.summary_en ?? ""}
                rows={2}
                className={field}
              />
            </div>
            <div>
              <label className={label}>Content (EN)</label>
              <textarea
                name="content_en"
                defaultValue={initial?.content_en ?? ""}
                rows={8}
                className={field}
              />
            </div>
            <p className="text-accent-700 text-xs">เว้นว่างได้ — หน้าเว็บจะ fallback ไปภาษาไทย</p>
          </div>
        </div>
      </div>

      {/* ตั้งค่า (ใช้ร่วม) */}
      <div className="space-y-5">
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
          <div>
            <label className={label}>ประเภท</label>
            <select name="type" defaultValue={initial?.type ?? "announcement"} className={field}>
              <option value="announcement">ประกาศ</option>
              <option value="event">กิจกรรม</option>
            </select>
          </div>
          <div>
            <label className={label}>สถานะ</label>
            <select name="status" defaultValue={initial?.status ?? "draft"} className={field}>
              <option value="draft">ฉบับร่าง</option>
              <option value="published">เผยแพร่</option>
              <option value="hidden">ซ่อน</option>
            </select>
          </div>
          <div>
            <label className={label}>วันที่เผยแพร่</label>
            <input type="date" name="published_at" defaultValue={pubDate} className={field} />
          </div>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <label className={label}>รูปปก</label>
          {initial?.cover_image_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={initial.cover_image_url}
              alt=""
              className="mb-2 h-28 w-full rounded-md object-cover"
            />
          )}
          <input type="file" name="cover" accept="image/*" className="text-sm" />
          <p className="mt-1 text-xs text-neutral-400">
            อัปโหลดเข้า Supabase Storage (ไม่เลือก = คงรูปเดิม)
          </p>
        </div>

        <button
          type="submit"
          className="bg-primary-600 hover:bg-primary-700 w-full rounded-lg py-2.5 font-medium text-white"
        >
          บันทึก
        </button>
      </div>
    </form>
  )
}
