import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  // ไทยเป็นภาษาหลัก, อังกฤษเป็นภาษารอง
  locales: ["th", "en"],
  defaultLocale: "th",
})
