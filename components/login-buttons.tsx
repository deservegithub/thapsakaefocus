"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"

type Provider = "google" | "facebook"

export function LoginButtons() {
  const t = useTranslations("auth")
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<Provider | null>(null)

  async function signIn(provider: Provider) {
    setLoading(provider)
    const supabase = createClient()
    const next = searchParams.get("next") || "/"
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
    if (error) setLoading(null)
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => signIn("google")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-lg border border-neutral-300 bg-white py-3 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
      >
        <span className="text-lg">🇬</span>
        {loading === "google" ? "…" : t("google")}
      </button>

      <button
        onClick={() => signIn("facebook")}
        disabled={loading !== null}
        className="flex w-full items-center justify-center gap-3 rounded-lg py-3 text-sm font-medium text-white disabled:opacity-60"
        style={{ background: "#1877F2" }}
      >
        <span className="text-lg">f</span>
        {loading === "facebook" ? "…" : t("facebook")}
      </button>

      {/* LINE — เพิ่มผ่าน Custom OIDC ในรอบถัดไป */}
      <button
        disabled
        className="flex w-full items-center justify-center gap-3 rounded-lg py-3 text-sm font-medium text-white opacity-50"
        style={{ background: "#06C755" }}
      >
        <span className="text-lg">💬</span>
        {t("lineSoon")}
      </button>
    </div>
  )
}
