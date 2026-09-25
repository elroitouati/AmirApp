export const DAY_NAMES = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת']

const pad = (n) => String(n).padStart(2, '0')

// 125000 → "02:05", 3725000 → "1:02:05"
export function formatClock(ms) {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

// ספירה לאחור – מעגלים כלפי מעלה כדי שלא יוצג 00:00 לפני הסוף
export function formatCountdown(ms) {
  return formatClock(Math.ceil(Math.max(0, ms) / 1000) * 1000)
}

// הפרש עם סימן: "+01:05" / "−00:30"
export function formatDiff(ms) {
  const sign = ms > 0 ? '+' : ms < 0 ? '−' : ''
  return sign + formatClock(Math.abs(ms))
}

// "25.9.26"
export function formatDate(ts) {
  const d = new Date(ts)
  return `${d.getDate()}.${d.getMonth() + 1}.${String(d.getFullYear()).slice(2)}`
}

export function formatTime(ts) {
  const d = new Date(ts)
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export const dayName = (ts) => DAY_NAMES[new Date(ts).getDay()]

// תחילת השבוע (יום ראשון 00:00)
export function startOfWeek(ts) {
  const d = new Date(ts)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() - d.getDay())
  return d.getTime()
}
