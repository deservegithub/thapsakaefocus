import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// Supabase client ฝั่งเซิร์ฟเวอร์ (Server Components / Route Handlers / Server Actions)
// Next 16: cookies() เป็น async ต้อง await
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // ถูกเรียกจาก Server Component (set cookie ไม่ได้) — ข้ามได้
            // proxy.ts รับหน้าที่ refresh session (เขียน cookie ที่อัปเดต) ให้แล้ว
          }
        },
      },
    }
  )
}
