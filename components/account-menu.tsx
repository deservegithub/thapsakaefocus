"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import NextLink from "next/link"
import { Link } from "@/i18n/navigation"
import { createClient } from "@/lib/supabase/client"

export function AccountMenu() {
  const t = useTranslations("account")
  const [state, setState] = useState({ loading: true, loggedIn: false, admin: false })

  useEffect(() => {
    const supabase = createClient()
    let active = true
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!active) return
      if (!user) {
        setState({ loading: false, loggedIn: false, admin: false })
        return
      }
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .maybeSingle()
      if (!active) return
      setState({ loading: false, loggedIn: true, admin: data?.role === "admin" })
    })
    return () => {
      active = false
    }
  }, [])

  if (state.loading) return null

  if (!state.loggedIn) {
    return (
      <Link
        href="/login"
        className="bg-primary-600 hover:bg-primary-700 rounded-md px-3 py-1.5 text-sm font-medium text-white"
      >
        {t("login")}
      </Link>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {state.admin && (
        // /admin อยู่นอก [locale] → ใช้ next/link ปกติ ไม่ใส่ prefix locale
        <NextLink href="/admin" className="text-primary-700 font-medium hover:underline">
          {t("admin")}
        </NextLink>
      )}
      <form action="/auth/signout" method="post">
        <button type="submit" className="text-neutral-500 hover:text-neutral-700">
          {t("logout")}
        </button>
      </form>
    </div>
  )
}
