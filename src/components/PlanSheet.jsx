import BottomSheet from './BottomSheet.jsx'
import { Check } from './ui.jsx'
import { PROGRAM } from '../config/program.js'
import { DAY_NAMES } from '../lib/time.js'

// workout (אופציונלי) – כשפתוח באמצע אימון: מדגיש את התרגיל הנוכחי ומסמן את מה שהושלם
export default function PlanSheet({ open, onClose, workout }) {
  const doneIds = new Set(workout?.completed.map((c) => c.id) ?? [])
  const currentId = workout?.phase === 'exercise' ? workout.exercises[workout.currentIndex]?.id : null
  const warmupDone = workout && workout.phase !== 'warmup'
  const warmupCurrent = workout?.phase === 'warmup'

  return (
    <BottomSheet open={open} onClose={onClose} label="התוכנית המלאה">
      <div className="pb-4 pt-2">
        <h2 className="text-3xl font-black">{PROGRAM.title}</h2>
        <p className="mt-1 text-lg text-muted">{PROGRAM.trainingDays.map((d) => DAY_NAMES[d]).join(' / ')}</p>

        <div
          className={`mt-6 flex items-center justify-between rounded-3xl border p-4 ${
            warmupCurrent ? 'border-accent-to bg-surface-2' : 'border-line bg-surface'
          }`}
        >
          <div className="flex items-center gap-3">
            <StatusDot done={warmupDone} current={warmupCurrent} />
            <span className="text-xl font-bold">חימום</span>
          </div>
          <span className="num text-lg font-semibold text-muted">{Math.round(PROGRAM.warmup.durationSec / 60)} דקות</span>
        </div>

        <ol className="mt-3 flex flex-col gap-3">
          {PROGRAM.exercises.map((ex, i) => {
            const done = doneIds.has(ex.id)
            const current = ex.id === currentId
            return (
              <li
                key={ex.id}
                aria-current={current ? 'step' : undefined}
                className={`rounded-3xl border p-4 transition ${
                  current ? 'border-accent-to bg-surface-2 shadow-lift' : 'border-line bg-surface shadow-soft'
                } ${done ? 'opacity-70' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`grid size-9 shrink-0 place-items-center rounded-xl text-lg font-black ${
                      current || done ? 'bg-accent text-on-accent' : 'bg-surface-2 text-muted'
                    }`}
                  >
                    {done ? <Check className="size-5" /> : <span className="num">{i + 1}</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-extrabold leading-tight">{ex.name}</h3>
                      {current && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-on-accent">עכשיו</span>}
                    </div>
                    {ex.note && <p className="mt-1 text-base text-muted">{ex.note}</p>}
                    <div className="mt-3 flex flex-wrap gap-2 text-base">
                      <span className="rounded-xl bg-bg/60 px-3 py-1 font-semibold">
                        <span className="num">{ex.sets}</span> סטים × <span className="num">{ex.reps}</span> חזרות
                      </span>
                      <span className="rounded-xl bg-bg/60 px-3 py-1 text-muted">
                        מנוחה <span className="num">{ex.restSec}</span> שנ׳
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </BottomSheet>
  )
}

function StatusDot({ done, current }) {
  if (done)
    return (
      <span className="grid size-7 place-items-center rounded-lg bg-accent text-on-accent">
        <Check className="size-4" />
      </span>
    )
  return <span className={`size-3 rounded-full ${current ? 'bg-accent' : 'bg-line'}`} />
}
