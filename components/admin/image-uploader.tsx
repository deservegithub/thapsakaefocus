"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

// อัปโหลดรูปฝั่ง client ตรงเข้า Supabase Storage (วนทีละไฟล์ — รองรับหลายรูป)
// ส่ง URL ต่อให้ server action ผ่าน hidden input (เลี่ยง body limit ของ server action)
export function ImageUploader({
  name,
  folder,
  label,
  multiple = false,
  defaultUrls = [],
  hint,
}: {
  name: string
  folder: string
  label: string
  multiple?: boolean
  defaultUrls?: string[]
  hint?: string
}) {
  const [urls, setUrls] = useState<string[]>(defaultUrls.filter(Boolean))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (files.length === 0) return
    setBusy(true)
    setError(null)
    const supabase = createClient()
    const added: string[] = []
    for (const file of files) {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase()
      const path = `${folder}/${crypto.randomUUID()}.${ext}`
      const { error: upErr } = await supabase.storage
        .from("public-images")
        .upload(path, file, { contentType: file.type || undefined })
      if (upErr) {
        setError("อัปโหลดไม่สำเร็จ: " + upErr.message)
        continue
      }
      added.push(supabase.storage.from("public-images").getPublicUrl(path).data.publicUrl)
    }
    setUrls(multiple ? [...urls, ...added] : added.slice(-1))
    setBusy(false)
    e.target.value = ""
  }

  function remove(u: string) {
    setUrls(urls.filter((x) => x !== u))
  }

  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-neutral-600">{label}</label>

      {/* ส่ง URL ให้ server action */}
      {urls.map((u) => (
        <input key={u} type="hidden" name={name} value={u} />
      ))}

      {urls.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {urls.map((u) => (
            <div key={u} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u} alt="" className="h-20 w-20 rounded-md object-cover" />
              <button
                type="button"
                onClick={() => remove(u)}
                className="bg-danger absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={onChange}
        disabled={busy}
        className="text-sm"
      />
      {busy && <p className="text-primary-600 mt-1 text-xs">กำลังอัปโหลด…</p>}
      {error && <p className="text-danger mt-1 text-xs">{error}</p>}
      {hint && !busy && <p className="mt-1 text-xs text-neutral-400">{hint}</p>}
    </div>
  )
}
