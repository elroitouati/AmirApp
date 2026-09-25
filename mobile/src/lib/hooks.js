import { useEffect, useState } from 'react'
import { AppState } from 'react-native'
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake'

// מחזיר את Date.now() ומרענן כל interval. משמש רק לתצוגה –
// הזמנים עצמם מחושבים תמיד מ-timestamps, כך שהם נכונים גם אחרי שהאפליקציה הייתה ברקע.
export function useNow(active = true, interval = 250) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (!active) return
    const tick = () => setNow(Date.now())
    tick()
    const id = setInterval(tick, interval)
    const sub = AppState.addEventListener('change', (s) => s === 'active' && tick())
    return () => {
      clearInterval(id)
      sub.remove()
    }
  }, [active, interval])
  return now
}

// המסך לא נכבה בזמן אימון
export function useKeepScreenOn(active) {
  useEffect(() => {
    if (!active) return
    const tag = 'workout'
    activateKeepAwakeAsync(tag).catch(() => {})
    return () => {
      deactivateKeepAwake(tag).catch?.(() => {})
    }
  }, [active])
}
