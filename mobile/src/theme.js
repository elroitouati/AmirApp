import { createContext, useContext } from 'react'
import { useColorScheme } from 'react-native'

// פלטת הלוגו. מצב כהה הוא ברירת המחדל; מצב בהיר רק אם המכשיר מוגדר כך.
const dark = {
  scheme: 'dark',
  bg: '#2B2D2F',
  surface: '#35373A',
  surface2: '#3D3F43',
  line: '#44474B',
  ink: '#FFFFFF',
  muted: '#A8ABAF',
  accent: ['#E6E6E6', '#9A9A9A'],
  onAccent: '#2B2D2F',
  good: '#9FD3A8',
  bad: '#E8A3A3',
  scrim: 'rgba(0,0,0,0.6)',
}

const light = {
  scheme: 'light',
  bg: '#F2F2F3',
  surface: '#FFFFFF',
  surface2: '#E9E9EB',
  line: '#DCDDDF',
  ink: '#2B2D2F',
  muted: '#63666A',
  accent: ['#4A4D51', '#2B2D2F'],
  onAccent: '#FFFFFF',
  good: '#2F7A3D',
  bad: '#A93B3B',
  scrim: 'rgba(0,0,0,0.45)',
}

const ThemeContext = createContext(dark)

export function ThemeProvider({ children }) {
  const scheme = useColorScheme()
  return <ThemeContext.Provider value={scheme === 'light' ? light : dark}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)

// ב-React Native המשקל נקבע לפי קובץ הגופן, לא לפי fontWeight
export const font = {
  regular: { fontFamily: 'Heebo_400Regular' },
  medium: { fontFamily: 'Heebo_500Medium' },
  bold: { fontFamily: 'Heebo_700Bold' },
  heavy: { fontFamily: 'Heebo_800ExtraBold' },
  black: { fontFamily: 'Heebo_900Black' },
}

// ספרות ברוחב קבוע לטיימרים
export const nums = { fontVariant: ['tabular-nums'] }

export const shadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 10 },
  shadowOpacity: 0.35,
  shadowRadius: 18,
  elevation: 6,
}
