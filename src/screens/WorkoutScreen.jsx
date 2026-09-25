import { useEffect, useState } from 'react'
import { Button, Card, Label, PlanButton } from '../components/ui.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import { PROGRAM } from '../config/program.js'
import { useNow, useWakeLock } from '../lib/hooks.js'
import { signalDone } from '../lib/sound.js'
import { formatClock, formatCountdown, formatDate, formatDiff } from '../lib/time.js'
import { endEarly, endWarmup, finishExercise, warmupEndsAt } from '../lib/workout.js'

const exerciseInfo = (id) => PROGRAM.exercises.find((e) => e.id === id)

export default function WorkoutScreen({ workout, update, previous, onSave, onOpenPlan }) {
  const inSummary = workout.phase === 'summary'
  const now = useNow(!inSummary)
  const [confirmEnd, setConfirmEnd] = useState(false)
  useWakeLock(!inSummary)

  // סוף החימום – מחושב מול timestamp, כך שגם אחרי שהמסך היה כבוי המעבר מדויק
  useEffect(() => {
    if (workout.phase !== 'warmup') return
    const end = warmupEndsAt(workout)
    if (now >= end) {
      update((w) => endWarmup(w, warmupEndsAt(w)))
      if (now - end < 15000) signalDone() // לא מצפצף אם חזרנו לאפליקציה הרבה אחרי
    }
  }, [now, workout, update])

  const totalMs = (workout.endedAt ?? now) - workout.startedAt

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-30 bg-bg pt-safe">
        <div className="mx-auto flex min-h-14 max-w-lg items-center justify-between px-5 pb-3">
          {inSummary ? (
            <span className="text-lg font-bold text-muted">סיכום אימון</span>
          ) : (
            <div>
              <Label>זמן כולל</Label>
              <div className="num text-4xl font-black leading-none">{formatClock(totalMs)}</div>
            </div>
          )}
          <PlanButton onClick={onOpenPlan} />
        </div>
        {!inSummary && <StepBar workout={workout} />}
      </header>

      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col px-5 pt-4">
        {workout.phase === 'warmup' && (
          <Warmup workout={workout} now={now} onSkip={() => update((w) => endWarmup(w, Date.now()))} />
        )}
        {workout.phase === 'exercise' && (
          <Exercise workout={workout} now={now} onDone={() => update((w) => finishExercise(w, Date.now()))} />
        )}
        {inSummary && <Summary workout={workout} previous={previous} onSave={onSave} />}

        {!inSummary && (
          <div className="flex justify-center pt-2 pb-safe">
            <button type="button" onClick={() => setConfirmEnd(true)} className="min-h-11 px-4 text-sm text-muted underline-offset-4 active:underline">
              סיים אימון מוקדם
            </button>
          </div>
        )}
      </main>

      <ConfirmDialog
        open={confirmEnd}
        title="לסיים את האימון עכשיו?"
        message="התרגילים שכבר סיימת יישמרו. התרגיל הנוכחי לא ייספר."
        confirmLabel="כן, סיים"
        cancelLabel="המשך להתאמן"
        onConfirm={() => {
          setConfirmEnd(false)
          update((w) => endEarly(w, Date.now()))
        }}
        onCancel={() => setConfirmEnd(false)}
      />
    </div>
  )
}

function StepBar({ workout }) {
  const total = workout.exercises.length
  return (
    <div className="mx-auto flex max-w-lg gap-1.5 px-5 pb-3" aria-hidden="true">
      {workout.exercises.map((ex, i) => {
        const done = i < workout.completed.length
        const current = workout.phase === 'exercise' && i === workout.currentIndex
        return (
          <span
            key={ex.id}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${done ? 'bg-accent' : current ? 'bg-muted' : 'bg-line'}`}
            style={{ maxWidth: `${100 / total}%` }}
          />
        )
      })}
    </div>
  )
}

function Warmup({ workout, now, onSkip }) {
  const remaining = warmupEndsAt(workout) - now
  const first = exerciseInfo(workout.exercises[0]?.id)
  return (
    <div className="flex flex-1 animate-enter flex-col">
      <h2 className="text-center text-4xl font-black">חימום</h2>
      <div className="flex flex-1 items-center justify-center py-6">
        <ProgressRing progress={remaining / workout.warmupDurationMs} size={280}>
          <div className="text-center">
            <div className="num text-6xl font-black">{formatCountdown(remaining)}</div>
            <div className="mt-1 text-muted">נשאר</div>
          </div>
        </ProgressRing>
      </div>
      {first && <NextUp label="התרגיל הראשון" name={first.name} />}
      <Button variant="secondary" size="lg" className="mt-3" onClick={onSkip}>
        דלג
      </Button>
    </div>
  )
}

function Exercise({ workout, now, onDone }) {
  const i = workout.currentIndex
  const total = workout.exercises.length
  const ex = exerciseInfo(workout.exercises[i].id) ?? workout.exercises[i]
  const next = workout.exercises[i + 1]
  const elapsed = now - workout.exerciseStartedAt

  return (
    <div key={ex.id} className="flex flex-1 animate-enter flex-col">
      <div className="text-lg font-bold text-muted">
        תרגיל <span className="num">{i + 1}</span> מתוך <span className="num">{total}</span>
      </div>
      <h2 className="mt-1 text-5xl font-black leading-tight">{ex.name}</h2>
      {ex.note && <p className="mt-2 text-xl text-muted">{ex.note}</p>}

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Card className="p-4">
          <Label>סטים × חזרות</Label>
          <div className="mt-1 text-3xl font-black">
            <span className="num">{ex.sets}</span> × <span className="num">{ex.reps}</span>
          </div>
        </Card>
        <Card className="p-4">
          <Label>מנוחה בין סטים</Label>
          <div className="mt-1 text-3xl font-black">
            <span className="num">{ex.restSec}</span>
            <span className="text-lg text-muted"> שנ׳</span>
          </div>
        </Card>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-6">
        <Label>זמן בתרגיל</Label>
        <div className="num text-6xl font-black text-muted">{formatClock(elapsed)}</div>
      </div>

      <NextUp label="הבא בתור" name={next ? next.name : 'סיכום האימון'} />
      <Button size="xl" className="mt-3" onClick={onDone}>
        סיימתי תרגיל
      </Button>
    </div>
  )
}

function NextUp({ label, name }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-line px-4 py-3">
      <span className="text-muted">{label}</span>
      <span className="text-lg font-bold">{name}</span>
    </div>
  )
}

function Summary({ workout, previous, onSave }) {
  const total = workout.endedAt - workout.startedAt
  const prevById = new Map(previous?.exercises.map((e) => [e.id, e.durationMs]) ?? [])

  return (
    <div className="flex flex-1 animate-enter flex-col pb-safe">
      <h2 className="text-4xl font-black">{workout.endedEarly ? 'האימון הסתיים' : 'כל הכבוד!'}</h2>
      <p className="mt-1 text-lg text-muted">
        {workout.endedEarly
          ? `הושלמו ${workout.completed.length} מתוך ${workout.exercises.length} תרגילים`
          : 'סיימת את כל התרגילים'}
      </p>

      <Card className="mt-5 p-5">
        <Label>משך כולל</Label>
        <div className="num mt-1 text-5xl font-black">{formatClock(total)}</div>
        {previous ? (
          <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3">
            <div className="text-sm text-muted">
              אימון קודם · <span className="num">{formatDate(previous.startedAt)}</span>
              <div className="num text-base font-bold text-ink">{formatClock(previous.durationMs)}</div>
            </div>
            <Diff ms={total - previous.durationMs} />
          </div>
        ) : (
          <div className="mt-2 text-muted">זה האימון הראשון שלך – מכאן יתחילו ההשוואות.</div>
        )}
      </Card>

      <Card className="mt-3 divide-y divide-line">
        {workout.warmupMs != null && (
          <Row name="חימום" ms={workout.warmupMs} />
        )}
        {workout.completed.map((c) => (
          <Row key={c.id} name={c.name} ms={c.durationMs} prev={prevById.get(c.id)} />
        ))}
        {workout.completed.length === 0 && <div className="p-4 text-muted">לא הושלמו תרגילים</div>}
      </Card>

      <div className="flex-1" />
      <Button size="xl" className="mt-6" onClick={onSave}>
        סיים ושמור
      </Button>
    </div>
  )
}

function Row({ name, ms, prev }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <span className="text-lg font-bold">{name}</span>
      <span className="flex items-baseline gap-2">
        {prev != null && <Diff ms={ms - prev} small />}
        <span className="num text-xl font-black">{formatClock(ms)}</span>
      </span>
    </div>
  )
}

// מהיר יותר = טוב (ירוק), איטי יותר = אדום
function Diff({ ms, small }) {
  const color = Math.abs(ms) < 1000 ? 'text-muted' : ms < 0 ? 'text-good' : 'text-bad'
  return <span className={`num font-bold ${color} ${small ? 'text-sm' : 'text-2xl'}`}>{Math.abs(ms) < 1000 ? 'אותו זמן' : formatDiff(ms)}</span>
}
