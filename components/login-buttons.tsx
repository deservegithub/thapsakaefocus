"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"

type Provider = "google" | "facebook" | "line"

// provider slug ที่ส่งให้ Supabase
// - google/facebook เป็น provider ในตัว
// - LINE ไม่มีในตัว → เพิ่มเป็น Custom OIDC ใน Supabase Dashboard (slug ขึ้นต้นด้วย custom:)
//   ตั้งชื่อ provider ใน Dashboard ให้ตรงกับค่านี้ (หรือ override ด้วย env)
const LINE_SLUG = process.env.NEXT_PUBLIC_LINE_OIDC_PROVIDER || "custom:line"
const PROVIDER_SLUG: Record<Provider, string> = {
  google: "google",
  facebook: "facebook",
  line: LINE_SLUG,
}

// แสดงปุ่ม LINE เฉพาะเมื่อพร้อมแล้ว (ตั้ง Custom OIDC ใน Supabase เสร็จ → NEXT_PUBLIC_LINE_ENABLED=true)
const LINE_ENABLED = process.env.NEXT_PUBLIC_LINE_ENABLED === "true"

export function LoginButtons() {
  const t = useTranslations("auth")
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState<Provider | null>(null)

  async function signIn(provider: Provider) {
    setLoading(provider)
    const supabase = createClient()
    const next = searchParams.get("next") || "/"
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
    const { error } = await supabase.auth.signInWithOAuth({
      // Custom OIDC slug ("custom:…") ไม่อยู่ในยูเนียน Provider ของ supabase-js — cast จาก type ของเมธอดเอง
      provider: PROVIDER_SLUG[provider] as Parameters<
        typeof supabase.auth.signInWithOAuth
      >[0]["provider"],
      options: { redirectTo },
    })
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

      {LINE_ENABLED && (
        <button
          onClick={() => signIn("line")}
          disabled={loading !== null}
          className="flex w-full items-center justify-center gap-3 rounded-lg py-3 text-sm font-medium text-white disabled:opacity-60"
          style={{ background: "#06C755" }}
        >
          <span className="text-lg">💬</span>
          {loading === "line" ? "…" : t("line")}
        </button>
      )}
    </div>
  )
}
