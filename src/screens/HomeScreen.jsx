import { useState } from 'react'
import { Button, Card, Label, PlanButton } from '../components/ui.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { PROGRAM } from '../config/program.js'
import { DAY_NAMES, formatClock, formatDate, startOfWeek } from '../lib/time.js'

export default function HomeScreen({ history, active, onStart, onResume, onDiscard, onOpenPlan }) {
  const [confirmDiscard, setConfirmDiscard] = useState(false)
  const now = Date.now()
  const today = new Date(now).getDay()
  const isTrainingDay = PROGRAM.trainingDays.includes(today)
  const last = history[0]
  const weekStart = startOfWeek(now)
  const thisWeek = history.filter((w) => w.startedAt >= weekStart).length

  return (
    <div className="flex min-h-full flex-col gap-5">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/icons/logo-header.png" alt="" className="size-12 rounded-2xl shadow-soft" />
          <h1 className="text-xl font-black tracking-wide" dir="ltr">
            BODYWEIGHT 20M
          </h1>
        </div>
        <PlanButton onClick={onOpenPlan} />
      </header>

      <Card className="p-5">
        <Label>היום</Label>
        <div className="mt-1 flex items-center justify-between gap-3">
          <div className="text-3xl font-black">יום {DAY_NAMES[today]}</div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              isTrainingDay ? 'bg-accent text-on-accent' : 'border border-line text-muted'
            }`}
          >
            {isTrainingDay ? 'יום אימון' : 'יום מנוחה'}
          </span>
        </div>
        <p className="mt-2 text-muted">ימי אימון: {PROGRAM.trainingDays.map((d) => DAY_NAMES[d]).join(' / ')}</p>
      </Card>

      <div className="flex flex-1 flex-col justify-center gap-3 py-2">
        {active ? (
          <>
            <Card className="p-4 text-center">
              <div className="text-lg font-bold">יש אימון שלא הסתיים</div>
              <div className="text-muted">התחיל ב-{formatDate(active.startedAt)}, אפשר להמשיך מאיפה שהפסקת</div>
            </Card>
            <Button size="xl" onClick={onResume}>
              המשך אימון
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setConfirmDiscard(true)}>
              בטל את האימון הפתוח
            </Button>
          </>
        ) : (
          <Button size="xl" onClick={onStart} className="min-h-32 text-4xl">
            התחל אימון
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <Label>אימון אחרון</Label>
          {last ? (
            <>
              <div className="num mt-1 text-2xl font-black">{formatClock(last.durationMs)}</div>
              <div className="text-sm text-muted">
                יום {DAY_NAMES[new Date(last.startedAt).getDay()]}, <span className="num">{formatDate(last.startedAt)}</span>
              </div>
            </>
          ) : (
            <div className="mt-1 text-lg font-bold text-muted">עוד אין</div>
          )}
        </Card>
        <Card className="p-4">
          <Label>השבוע</Label>
          <div className="mt-1 text-2xl font-black">
            <span className="num">{thisWeek}</span>
            <span className="text-lg text-muted"> מתוך {PROGRAM.weeklyGoal}</span>
          </div>
          <div className="mt-2 flex gap-1.5" aria-hidden="true">
            {Array.from({ length: PROGRAM.weeklyGoal }, (_, i) => (
              <span key={i} className={`h-2 flex-1 rounded-full ${i < thisWeek ? 'bg-accent' : 'bg-line'}`} />
            ))}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        open={confirmDiscard}
        title="לבטל את האימון?"
        message="האימון הפתוח יימחק ולא יישמר בהיסטוריה."
        confirmLabel="כן, בטל"
        cancelLabel="לא"
        danger
        onConfirm={() => {
          setConfirmDiscard(false)
          onDiscard()
        }}
        onCancel={() => setConfirmDiscard(false)}
      />
    </div>
  )
}
