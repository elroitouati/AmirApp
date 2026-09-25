import { useCallback, useEffect, useState } from 'react'
import BottomNav from './components/BottomNav.jsx'
import PlanSheet from './components/PlanSheet.jsx'
import HomeScreen from './screens/HomeScreen.jsx'
import HistoryScreen from './screens/HistoryScreen.jsx'
import WorkoutScreen from './screens/WorkoutScreen.jsx'
import { PROGRAM } from './config/program.js'
import { loadActive, loadHistory, saveActive, saveHistory } from './lib/storage.js'
import { unlockAudio } from './lib/sound.js'
import { createWorkout, toHistoryEntry } from './lib/workout.js'

export default function App() {
  const [history, setHistory] = useState(loadHistory)
  const [active, setActive] = useState(loadActive)
  // אחרי פתיחה מחדש של האפליקציה לא קופצים ישר לאימון – מציגים "המשך אימון" במסך הבית
  const [inWorkout, setInWorkout] = useState(false)
  const [tab, setTab] = useState('home')
  const [planOpen, setPlanOpen] = useState(false)

  // כל שינוי במצב האימון נשמר מיד
  useEffect(() => saveActive(active), [active])
  useEffect(() => saveHistory(history), [history])

  const update = useCallback((fn) => setActive((w) => (w ? fn(w) : w)), [])
  const openPlan = useCallback(() => setPlanOpen(true), [])
  const closePlan = useCallback(() => setPlanOpen(false), [])

  const start = () => {
    unlockAudio()
    setActive(createWorkout(PROGRAM))
    setInWorkout(true)
  }
  const resume = () => {
    unlockAudio()
    setInWorkout(true)
  }
  const save = () => {
    setHistory((h) => [toHistoryEntry(active), ...h.filter((w) => w.id !== active.id)])
    setActive(null)
    setInWorkout(false)
    setTab('home')
  }

  const showWorkout = inWorkout && active

  return (
    <>
      {showWorkout ? (
        <WorkoutScreen workout={active} update={update} previous={history[0]} onSave={save} onOpenPlan={openPlan} />
      ) : (
        <>
          <main key={tab} className="mx-auto min-h-dvh max-w-lg animate-fade px-5 pt-safe pb-28">
            <div className="flex min-h-[calc(100dvh-9rem)] flex-col pt-3">
              {tab === 'home' ? (
                <HomeScreen
                  history={history}
                  active={active}
                  onStart={start}
                  onResume={resume}
                  onDiscard={() => setActive(null)}
                  onOpenPlan={openPlan}
                />
              ) : (
                <HistoryScreen history={history} onDelete={(id) => setHistory((h) => h.filter((w) => w.id !== id))} />
              )}
            </div>
          </main>
          <BottomNav tab={tab} onChange={setTab} />
        </>
      )}
      <PlanSheet open={planOpen} onClose={closePlan} workout={showWorkout ? active : null} />
    </>
  )
}
