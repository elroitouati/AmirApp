import { useCallback, useEffect, useState } from 'react'
import { BackHandler, View } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import * as SplashScreen from 'expo-splash-screen'
import * as SystemUI from 'expo-system-ui'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { useFonts, Heebo_400Regular, Heebo_500Medium, Heebo_700Bold, Heebo_800ExtraBold, Heebo_900Black } from '@expo-google-fonts/heebo'
import { ThemeProvider, useTheme } from './src/theme'
import BottomNav from './src/components/BottomNav'
import PlanSheet from './src/components/PlanSheet'
import HomeScreen from './src/screens/HomeScreen'
import HistoryScreen from './src/screens/HistoryScreen'
import WorkoutScreen from './src/screens/WorkoutScreen'
import { PROGRAM } from './src/config/program'
import { loadActive, loadHistory, saveActive, saveHistory } from './src/lib/storage'
import { initFeedback } from './src/lib/feedback'
import { createWorkout, toHistoryEntry } from './src/lib/workout'

SplashScreen.preventAutoHideAsync().catch(() => {})
initFeedback()

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  )
}

function Root() {
  const c = useTheme()
  const [fontsLoaded] = useFonts({ Heebo_400Regular, Heebo_500Medium, Heebo_700Bold, Heebo_800ExtraBold, Heebo_900Black })
  const [data, setData] = useState(null) // { history, active } אחרי טעינה מהאחסון

  useEffect(() => {
    Promise.all([loadHistory(), loadActive()]).then(([history, active]) => setData({ history, active }))
  }, [])

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(c.bg).catch(() => {})
  }, [c.bg])

  const ready = fontsLoaded && data
  useEffect(() => {
    if (ready) SplashScreen.hideAsync().catch(() => {})
  }, [ready])

  if (!ready) return null
  return <Main initial={data} />
}

function Main({ initial }) {
  const c = useTheme()
  const [history, setHistory] = useState(initial.history)
  const [active, setActive] = useState(initial.active)
  // אחרי פתיחה מחדש לא קופצים ישר לאימון – מציגים "המשך אימון" במסך הבית
  const [inWorkout, setInWorkout] = useState(false)
  const [tab, setTab] = useState('home')
  const [planOpen, setPlanOpen] = useState(false)

  // כל שינוי במצב האימון נשמר מיד
  useEffect(() => saveActive(active), [active])
  useEffect(() => saveHistory(history), [history])

  const update = useCallback((fn) => setActive((w) => (w ? fn(w) : w)), [])
  const showWorkout = inWorkout && !!active

  // כפתור "חזרה" של אנדרואיד: מאימון חוזרים לבית (האימון ממשיך ברקע), מהיסטוריה לבית
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showWorkout) {
        setInWorkout(false)
        return true
      }
      if (tab !== 'home') {
        setTab('home')
        return true
      }
      return false
    })
    return () => sub.remove()
  }, [showWorkout, tab])

  const start = () => {
    setActive(createWorkout(PROGRAM))
    setInWorkout(true)
  }
  const save = () => {
    setHistory((h) => [toHistoryEntry(active), ...h.filter((w) => w.id !== active.id)])
    setActive(null)
    setInWorkout(false)
    setTab('home')
  }

  return (
    <View style={{ flex: 1, backgroundColor: c.bg, direction: 'rtl' }}>
      <StatusBar style={c.scheme === 'dark' ? 'light' : 'dark'} />
      {showWorkout ? (
        <WorkoutScreen workout={active} update={update} previous={history[0]} onSave={save} onOpenPlan={() => setPlanOpen(true)} />
      ) : (
        <>
          <View style={{ flex: 1 }}>
            {tab === 'home' ? (
              <HomeScreen
                history={history}
                active={active}
                onStart={start}
                onResume={() => setInWorkout(true)}
                onDiscard={() => setActive(null)}
                onOpenPlan={() => setPlanOpen(true)}
              />
            ) : (
              <HistoryScreen history={history} onDelete={(id) => setHistory((h) => h.filter((w) => w.id !== id))} />
            )}
          </View>
          <BottomNav tab={tab} onChange={setTab} />
        </>
      )}
      <PlanSheet open={planOpen} onClose={() => setPlanOpen(false)} workout={showWorkout ? active : null} />
    </View>
  )
}
