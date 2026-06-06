"use client"

import { useState } from "react"
import { savePlace, deletePlaceImage } from "@/app/admin/tourism/actions"
import { ConfirmSubmit } from "@/components/admin/confirm-submit"
import { ImageUploader } from "@/components/admin/image-uploader"

type Category = { id: number; label_th: string; label_en: string | null }
type PlaceImage = { id: string; url: string }
type PlaceInitial = {
  id: string
  category_id: number | null
  name_th: string | null
  name_en: string | null
  description_th: string | null
  description_en: string | null
  address: string | null
  lat: number | null
  lng: number | null
  cover_image_url: string | null
  status: string
  images: PlaceImage[]
}

const field =
  "w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-primary-500"
const label = "mb-1 block text-sm font-medium text-neutral-600"

export function PlaceForm({
  categories,
  initial,
}: {
  categories: Category[]
  initial?: PlaceInitial | null
}) {
  const [lang, setLang] = useState<"th" | "en">("th")
  const tab = (on: boolean) =>
    `px-4 py-2 text-sm font-medium border-b-2 ${on ? "border-primary-600 text-primary-700" : "border-transparent text-neutral-400"}`

  return (
    <div className="max-w-4xl space-y-6">
      {initial && initial.images.length > 0 && (
        <div className="rounded-xl border border-neutral-200 bg-white p-5">
          <h3 className="mb-3 text-sm font-medium text-neutral-600">รูปที่มี</h3>
          <div className="flex flex-wrap gap-2">
            {initial.images.map((im) => (
              <div key={im.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url} alt="" className="h-20 w-20 rounded-md object-cover" />
                <form action={deletePlaceImage} className="absolute -top-2 -right-2">
                  <input type="hidden" name="imageId" value={im.id} />
                  <input type="hidden" name="placeId" value={initial.id} />
                  <ConfirmSubmit
                    message="ลบรูปนี้?"
                    className="bg-danger flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
                  >
                    ✕
                  </ConfirmSubmit>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      <form action={savePlace} className="grid grid-cols-3 gap-6">
        {initial?.id && <input type="hidden" name="id" value={initial.id} />}

        <div className="col-span-2 space-y-5">
          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <div className="mb-5 flex items-center gap-1 border-b border-neutral-200">
              <button type="button" onClick={() => setLang("th")} className={tab(lang === "th")}>
                ไทย (หลัก)
              </button>
              <button type="button" onClick={() => setLang("en")} className={tab(lang === "en")}>
                English
              </button>
            </div>

            <div className={lang === "th" ? "space-y-4" : "hidden"}>
              <div>
                <label className={label}>ชื่อสถานที่ (TH) *</label>
                <input name="name_th" defaultValue={initial?.name_th ?? ""} className={field} />
              </div>
              <div>
                <label className={label}>รายละเอียด (TH)</label>
                <textarea
                  name="description_th"
                  defaultValue={initial?.description_th ?? ""}
                  rows={5}
                  className={field}
                />
              </div>
            </div>
            <div className={lang === "en" ? "space-y-4" : "hidden"}>
              <div>
                <label className={label}>Name (EN)</label>
                <input name="name_en" defaultValue={initial?.name_en ?? ""} className={field} />
              </div>
              <div>
                <label className={label}>Description (EN)</label>
                <textarea
                  name="description_en"
                  defaultValue={initial?.description_en ?? ""}
                  rows={5}
                  className={field}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-xl border border-neutral-200 bg-white p-5">
            <div className="col-span-2">
              <label className={label}>ที่อยู่</label>
              <input name="address" defaultValue={initial?.address ?? ""} className={field} />
            </div>
            <div>
              <label className={label}>ละติจูด (lat)</label>
              <input
                name="lat"
                defaultValue={initial?.lat ?? ""}
                className={field}
                placeholder="11.5160"
              />
            </div>
            <div>
              <label className={label}>ลองจิจูด (lng)</label>
              <input
                name="lng"
                defaultValue={initial?.lng ?? ""}
                className={field}
                placeholder="99.6300"
              />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
            <div>
              <label className={label}>หมวดหมู่</label>
              <select
                name="category_id"
                defaultValue={initial?.category_id ?? ""}
                className={field}
              >
                <option value="">— เลือก —</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label_th}
                  </option>
                ))}
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
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <ImageUploader
              name="cover_url"
              folder="places"
              label="รูปหน้าปก (1 รูป)"
              defaultUrls={initial?.cover_image_url ? [initial.cover_image_url] : []}
              hint="ใช้บนการ์ดและหัวหน้ารายละเอียด"
            />
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-5">
            <ImageUploader
              name="gallery_url"
              folder="places/gallery"
              label="รูปแกลเลอรี (เลือกได้หลายรูป)"
              multiple
              hint="เลือกหลายรูปพร้อมกันได้ · แสดงในหน้ารายละเอียด"
            />
          </div>

          <button
            type="submit"
            className="bg-primary-600 hover:bg-primary-700 w-full rounded-lg py-2.5 font-medium text-white"
          >
            บันทึก
          </button>
        </div>
      </form>
    </div>
  )
}
