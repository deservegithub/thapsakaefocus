import { createClient } from "@/lib/supabase/server"

export type Profile = {
  id: string
  display_name: string | null
  role: "admin" | "shop_owner" | "member"
}

// ใช้ getUser() (revalidate) สำหรับการตัดสินใจเรื่องสิทธิ์ — ไม่ใช้ getSession()
export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("id, display_name, role")
    .eq("id", user.id)
    .maybeSingle()

  return (data as Profile) ?? null
}

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile()
  return profile?.role === "admin"
}

// บังคับสิทธิ์ admin ในระดับโค้ด — ชั้น defense-in-depth นอกเหนือจาก RLS
// server action ถูกยิงตรงได้ (ไม่ผ่าน UI) จึงต้องเช็คเองทุกครั้ง ไม่พึ่งแค่ admin layout
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    throw new Error("ไม่มีสิทธิ์ดำเนินการ — ต้องเข้าสู่ระบบด้วยบัญชีผู้ดูแล")
  }
}
