"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"

// แผนที่ Leaflet + OpenStreetMap (ฟรี) — ใช้ vanilla Leaflet ใน useEffect
// เลี่ยง SSR (โหลด leaflet แบบ dynamic ในฝั่ง client) และเลี่ยงปัญหา marker icon ด้วย circleMarker
export function PlaceMap({ lat, lng, label }: { lat: number; lng: number; label?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    let map: import("leaflet").Map | undefined

    import("leaflet").then((mod) => {
      const L = mod.default
      const el = ref.current
      if (cancelled || !el || (el as unknown as { _leaflet_id?: number })._leaflet_id) return

      map = L.map(el, { scrollWheelZoom: false }).setView([lat, lng], 15)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 19,
      }).addTo(map)
      L.circleMarker([lat, lng], {
        radius: 9,
        color: "#0e8580",
        fillColor: "#0e8580",
        fillOpacity: 0.9,
        weight: 3,
      })
        .addTo(map)
        .bindPopup(label ?? "")
    })

    return () => {
      cancelled = true
      map?.remove()
    }
  }, [lat, lng, label])

  return <div ref={ref} className="h-64 w-full rounded-xl" aria-label="แผนที่" />
}
