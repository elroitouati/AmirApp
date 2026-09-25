import { useState } from 'react'
import { Button, Card, Label } from '../components/ui.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import DurationChart from '../components/DurationChart.jsx'
import { dayName, formatClock, formatDate, formatTime } from '../lib/time.js'

export default function HistoryScreen({ history, onDelete }) {
  const [openId, setOpenId] = useState(null)
  const open = history.find((w) => w.id === openId)

  if (open) return <Detail workout={open} onBack={() => setOpenId(null)} onDelete={() => { onDelete(open.id); setOpenId(null) }} />

  return (
    <div className="flex animate-enter flex-col gap-5">
      <h1 className="text-3xl font-black">היסטוריה</h1>

      {history.length === 0 ? (
        <Card className="p-6 text-center">
          <div className="text-xl font-bold">עוד אין אימונים</div>
          <div className="mt-1 text-muted">אחרי שתסיים ותשמור אימון, הוא יופיע כאן.</div>
        </Card>
      ) : (
        <>
          <DurationChart history={history} />
          <ul className="flex flex-col gap-3">
            {history.map((w) => (
              <li key={w.id}>
                <button
                  type="button"
                  onClick={() => setOpenId(w.id)}
                  className="flex w-full items-center justify-between rounded-3xl border border-line bg-surface p-4 text-start shadow-soft transition active:scale-[0.99]"
                >
                  <div>
                    <div className="text-lg font-bold">יום {dayName(w.startedAt)}</div>
                    <div className="text-sm text-muted">
                      <span className="num">{formatDate(w.startedAt)}</span>
                      {w.endedEarly && ' · הסתיים מוקדם'}
                    </div>
                  </div>
                  <div className="num text-2xl font-black">{formatClock(w.durationMs)}</div>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  )
}

function Detail({ workout, onBack, onDelete }) {
  const [confirm, setConfirm] = useState(false)
  return (
    <div className="flex animate-enter flex-col gap-4">
      <button type="button" onClick={onBack} className="-ms-1 min-h-11 self-start px-1 text-lg font-bold text-muted">
        → חזרה
      </button>
      <div>
        <h1 className="text-3xl font-black">יום {dayName(workout.startedAt)}</h1>
        <p className="text-muted">
          <span className="num">{formatDate(workout.startedAt)}</span> · התחיל ב-<span className="num">{formatTime(workout.startedAt)}</span>
        </p>
      </div>

      <Card className="p-5">
        <Label>משך כולל</Label>
        <div className="num mt-1 text-5xl font-black">{formatClock(workout.durationMs)}</div>
        <div className="mt-1 text-muted">
          {workout.exercises.length} מתוך {workout.totalExercises} תרגילים{workout.endedEarly ? ' · הסתיים מוקדם' : ''}
        </div>
      </Card>

      <Card className="divide-y divide-line">
        <div className="flex items-center justify-between px-4 py-3.5">
          <span className="text-lg font-bold">חימום</span>
          <span className="num text-xl font-black">{formatClock(workout.warmupMs)}</span>
        </div>
        {workout.exercises.map((e) => (
          <div key={e.id} className="flex items-center justify-between px-4 py-3.5">
            <span className="text-lg font-bold">{e.name}</span>
            <span className="num text-xl font-black">{formatClock(e.durationMs)}</span>
          </div>
        ))}
      </Card>

      <Button variant="danger" size="md" className="mt-2" onClick={() => setConfirm(true)}>
        מחק אימון
      </Button>

      <ConfirmDialog
        open={confirm}
        title="למחוק את האימון?"
        message="לא ניתן לשחזר אחרי המחיקה."
        confirmLabel="מחק"
        danger
        onConfirm={() => {
          setConfirm(false)
          onDelete()
        }}
        onCancel={() => setConfirm(false)}
      />
    </div>
  )
}
