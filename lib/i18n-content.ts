// เลือกค่าตาม locale จากคอลัมน์คู่ _th/_en — ถ้า EN ว่าง fallback ไป TH เสมอ
export function localized<T extends Record<string, unknown>>(
  row: T,
  base: string,
  locale: string
): string {
  const en = row[`${base}_en`]
  const th = row[`${base}_th`]
  if (locale === "en" && typeof en === "string" && en.trim() !== "") return en
  return typeof th === "string" ? th : ""
}
