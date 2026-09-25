import AsyncStorage from '@react-native-async-storage/async-storage'

const HISTORY_KEY = 'bw20m.history.v1'
const ACTIVE_KEY = 'bw20m.active.v1'

async function read(key, fallback) {
  try {
    const raw = await AsyncStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, value) {
  const op = value == null ? AsyncStorage.removeItem(key) : AsyncStorage.setItem(key, JSON.stringify(value))
  op.catch(() => {})
}

export const loadHistory = () => read(HISTORY_KEY, [])
export const saveHistory = (list) => write(HISTORY_KEY, list)
export const loadActive = () => read(ACTIVE_KEY, null)
export const saveActive = (workout) => write(ACTIVE_KEY, workout)
