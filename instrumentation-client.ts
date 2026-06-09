// Sentry (ฝั่งเบราว์เซอร์) — init เฉพาะเมื่อมี DSN สาธารณะเท่านั้น
import * as Sentry from "@sentry/nextjs"

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN

if (dsn) {
  Sentry.init({
    dsn,
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? "0.1"),
    enabled: process.env.NODE_ENV === "production",
  })
}

// ติดตามการเปลี่ยนหน้า (client navigation) ให้ Sentry
export const onRouterTransitionStart = Sentry.captureRouterTransitionStart
