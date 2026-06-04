/* Tailwind (Play CDN) config กลาง — แมปสีจาก tokens.css
   โหลดไฟล์นี้ "หลัง" <script src=cdn.tailwindcss.com> ในทุกหน้า */
tailwind.config = {
  theme: {
    extend: {
      fontFamily: { sans: ['"IBM Plex Sans Thai"', 'system-ui', 'sans-serif'] },
      colors: {
        primary: {
          50:'var(--color-primary-50)',100:'var(--color-primary-100)',200:'var(--color-primary-200)',
          300:'var(--color-primary-300)',400:'var(--color-primary-400)',500:'var(--color-primary-500)',
          600:'var(--color-primary-600)',700:'var(--color-primary-700)',800:'var(--color-primary-800)',900:'var(--color-primary-900)'
        },
        accent: {
          50:'var(--color-accent-50)',100:'var(--color-accent-100)',200:'var(--color-accent-200)',
          300:'var(--color-accent-300)',400:'var(--color-accent-400)',500:'var(--color-accent-500)',
          600:'var(--color-accent-600)',700:'var(--color-accent-700)',800:'var(--color-accent-800)',900:'var(--color-accent-900)'
        },
        neutral: {
          0:'var(--color-neutral-0)',50:'var(--color-neutral-50)',100:'var(--color-neutral-100)',
          200:'var(--color-neutral-200)',300:'var(--color-neutral-300)',400:'var(--color-neutral-400)',
          500:'var(--color-neutral-500)',600:'var(--color-neutral-600)',700:'var(--color-neutral-700)',
          800:'var(--color-neutral-800)',900:'var(--color-neutral-900)'
        },
        online: 'var(--color-online)',
        success: 'var(--color-success)', warning: 'var(--color-warning)', danger: 'var(--color-danger)'
      },
      borderRadius: { md:'var(--radius-md)', lg:'var(--radius-lg)', xl:'var(--radius-xl)' }
    }
  }
}
