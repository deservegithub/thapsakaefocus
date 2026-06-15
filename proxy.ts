import createMiddleware from "next-intl/middleware"
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"
import { routing } from "./i18n/routing"

// Next 16: middleware → proxy (Node.js runtime)
// ประกอบ 2 อย่างเข้าด้วยกันอย่างระวังเรื่อง cookie (ไม่งั้น session หลุดสุ่มบน prod):
//  1) next-intl locale routing (เฉพาะหน้า public ใต้ [locale])
//  2) Supabase session refresh (ทุก request รวม /admin)
const intlMiddleware = createMiddleware(routing)

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // /admin (Thai-only, นอก [locale]) และ /auth/* (callback/signout) ไม่ผ่าน intl locale-redirect
  // /apple-icon = metadata route ของ Next (ไม่มีนามสกุลในพาธ) ถ้าไม่ข้าม intl จะถูก redirect ไป /th/apple-icon → 404
  const skipIntl =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/apple-icon")

  // response ฐาน: ถ้า skipIntl ใช้ NextResponse.next, ไม่งั้นให้ next-intl จัดการ (อาจ redirect/rewrite locale)
  const response = skipIntl ? NextResponse.next({ request }) : intlMiddleware(request)

  // refresh session ของ Supabase แล้วเธรด cookie ที่อัปเดตลงบน response เดียวกัน
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ใช้ getUser() (revalidate กับเซิร์ฟเวอร์) ไม่ใช่ getSession() (อ่าน cookie ปลอมได้)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // gate ชั้น UX: ยังไม่ล็อกอินแล้วเข้า /admin → เด้งไป login (ด่านจริงคือ RLS ที่ DB)
  if (pathname.startsWith("/admin") && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/th/login"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  // ทำงานทุก path ยกเว้น api, ไฟล์ภายใน Next และไฟล์ที่มีนามสกุล (static assets)
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}
