import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// OAuth callback — แลก code เป็น session (PKCE) แล้ว redirect
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") || "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // next ขึ้นต้นด้วย / เสมอ (กัน open redirect)
      const dest = next.startsWith("/") ? next : "/"
      return NextResponse.redirect(`${origin}${dest}`)
    }
  }

  return NextResponse.redirect(`${origin}/th/login?error=auth`)
}
