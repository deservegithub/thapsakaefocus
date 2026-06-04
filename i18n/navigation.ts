import { createNavigation } from "next-intl/navigation"
import { routing } from "./routing"

// ใช้ Link/useRouter/usePathname/redirect ที่รู้จัก locale แทนของ next/navigation
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
