const HISTORY_KEY = 'bw20m.history.v1'
const ACTIVE_KEY = 'bw20m.active.v1'

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  try {
    if (value == null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // אחסון מלא או חסום – ממשיכים בלי לשמור
  }
}

export const loadHistory = () => read(HISTORY_KEY, [])
export const saveHistory = (list) => write(HISTORY_KEY, list)
export const loadActive = () => read(ACTIVE_KEY, null)
export const saveActive = (workout) => write(ACTIVE_KEY, workout)
