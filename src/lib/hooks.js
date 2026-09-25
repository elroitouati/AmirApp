import { useEffect, useState } from 'react'

// מחזיר את Date.now() ומרענן כל interval. משמש רק לתצוגה –
// הזמנים עצמם מחושבים תמיד מ-timestamps.
export function useNow(active = true, interval = 250) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    const tick = () => setNow(Date.now())
    tick()
    const id = setInterval(tick, interval)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [active, interval])
  return now
}

// Screen Wake Lock – המסך לא נכבה בזמן אימון.
// הנעילה משתחררת אוטומטית כשהאפליקציה עוברת לרקע, לכן מבקשים שוב כשחוזרים.
export function useWakeLock(active) {
  useEffect(() => {
    if (!active || !('wakeLock' in navigator)) return
    let lock = null
    let cancelled = false
    const request = async () => {
      if (document.visibilityState !== 'visible') return
      try {
        const l = await navigator.wakeLock.request('screen')
        if (cancelled) l.release()
        else lock = l
      } catch {
        // לא נתמך / נדחה (למשל מצב חיסכון בסוללה)
      }
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible' && (!lock || lock.released)) request()
    }
    request()
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      cancelled = true
      document.removeEventListener('visibilitychange', onVisible)
      lock?.release().catch(() => {})
    }
  }, [active])
}
