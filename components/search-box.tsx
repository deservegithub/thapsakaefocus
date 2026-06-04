"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"

export function SearchBox({
  defaultValue = "",
  variant = "bar",
}: {
  defaultValue?: string
  variant?: "bar" | "hero"
}) {
  const t = useTranslations("search")
  const router = useRouter()
  const [q, setQ] = useState(defaultValue)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const v = q.trim()
    if (v) router.push(`/search?q=${encodeURIComponent(v)}`)
  }

  if (variant === "hero") {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex max-w-md items-center gap-2 rounded-xl bg-white px-4 py-3 shadow-lg"
      >
        <span className="text-lg text-neutral-400">🔍</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 bg-transparent text-neutral-700 outline-none"
          placeholder={t("placeholder")}
        />
        <button
          type="submit"
          className="bg-accent-500 hover:bg-accent-600 rounded-lg px-4 py-1.5 text-sm font-medium text-white"
        >
          {t("button")}
        </button>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 px-3 py-2"
    >
      <span className="text-neutral-400">🔍</span>
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-40 bg-transparent text-sm text-neutral-700 outline-none lg:w-56"
        placeholder={t("placeholder")}
      />
    </form>
  )
}
