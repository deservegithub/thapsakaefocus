"use client"

import { useEffect, useState } from "react"
import { useTranslations } from "next-intl"
import { createClient } from "@/lib/supabase/client"

// ตัวนับผู้ใช้ออนไลน์ด้วย Supabase Realtime Presence (ไม่ต้องมีตาราง)
// ทุก client/แท็บ join channel กลาง แล้วนับจำนวน key จาก presenceState() ตอน event "sync"
export function OnlineCounter() {
  const t = useTranslations("footer")
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const supabase = createClient()
    const channel = supabase.channel("online-users", {
      config: { presence: { key: crypto.randomUUID() } },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        // จำนวน key = จำนวนแท็บ/ผู้ใช้ที่เชื่อมต่ออยู่ (เลี่ยงนับซ้ำ)
        setCount(Object.keys(channel.presenceState()).length)
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          channel.track({ online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div className="flex items-center gap-2">
      <span className="relative flex h-2.5 w-2.5">
        <span className="bg-online absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
        <span className="bg-online relative inline-flex h-2.5 w-2.5 rounded-full" />
      </span>
      <span className="text-sm text-neutral-200">
        {count === null ? t("connecting") : t("online", { count })}
      </span>
    </div>
  )
}
