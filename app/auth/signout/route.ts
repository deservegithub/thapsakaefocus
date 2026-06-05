import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  // 303 ให้เบราว์เซอร์เปลี่ยนเป็น GET หลัง POST
  return NextResponse.redirect(new URL("/th", request.url), { status: 303 })
}
