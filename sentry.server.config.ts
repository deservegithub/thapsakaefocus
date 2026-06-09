// Sentry (ฝั่งเซิร์ฟเวอร์ Node runtime) — init เฉพาะเมื่อมี DSN เท่านั้น (ไม่มี DSN = ไม่ส่งข้อมูล)
import * as Sentry from "@sentry/nextjs"

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
    enabled: process.env.NODE_ENV === "production",
  })
}
