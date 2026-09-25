// צליל קצר דרך Web Audio (בלי קבצי שמע). באייפון חייבים "לפתוח" את
// ה-AudioContext בלחיצה של המשתמש – לכן unlockAudio נקרא בלחיצה על "התחל אימון".
let ctx = null

export function unlockAudio() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return
    if (!ctx) ctx = new AC()
    if (ctx.state === 'suspended') ctx.resume()
    // באפר שקט קצר – משחרר את הנעילה ב-iOS
    const src = ctx.createBufferSource()
    src.buffer = ctx.createBuffer(1, 1, 22050)
    src.connect(ctx.destination)
    src.start(0)
  } catch {
    // אין תמיכה בשמע
  }
}

function tone(freq, start, duration) {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(0.5, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain).connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

// שלושה צפצופים עולים + רטט איפה שנתמך
export function signalDone() {
  try {
    unlockAudio()
    if (ctx) {
      const t = ctx.currentTime + 0.05
      tone(880, t, 0.18)
      tone(880, t + 0.25, 0.18)
      tone(1320, t + 0.5, 0.4)
    }
  } catch {
    // ignore
  }
  if ('vibrate' in navigator) {
    try {
      navigator.vibrate([200, 100, 200, 100, 400])
    } catch {
      // ignore
    }
  }
}
