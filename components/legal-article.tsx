import type { LegalSection } from "@/lib/legal"

// แสดงบทความเชิงนโยบาย (ใช้ร่วม terms/privacy) — presentational, ไม่มี hook
export function LegalArticle({
  title,
  updatedLabel,
  updatedValue,
  sections,
}: {
  title: string
  updatedLabel: string
  updatedValue: string
  sections: LegalSection[]
}) {
  return (
    <>
      <h1 className="text-3xl font-bold text-neutral-900">{title}</h1>
      <p className="mt-1 text-sm text-neutral-400">
        {updatedLabel} {updatedValue}
      </p>
      <div className="mt-8 space-y-6 text-[16px] leading-relaxed text-neutral-700">
        {sections.map((s, i) => (
          <section key={i}>
            <h2 className="mb-2 text-lg font-semibold text-neutral-800">{s.h}</h2>
            {s.p.map((para, j) => (
              <p key={j}>{para}</p>
            ))}
          </section>
        ))}
      </div>
    </>
  )
}
