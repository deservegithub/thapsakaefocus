// จัดรูปแบบวันที่ตาม locale — th ได้ปีพุทธศักราชอัตโนมัติจาก th-TH
export function formatDate(iso: string | null, locale: string): string {
  if (!iso) return ""
  return new Intl.DateTimeFormat(locale === "th" ? "th-TH" : "en-GB", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(iso))
}

// จัดรูปแบบตัวเลข (เช่น view count) ตาม locale
export function formatNumber(n: number, locale: string): string {
  return new Intl.NumberFormat(locale === "th" ? "th-TH" : "en-US").format(n)
}
