import { useState } from 'react'
import { formatClock, formatDate } from '../lib/time.js'

const MAX_BARS = 12

// גרף עמודות של משך האימונים. לחיצה על עמודה מציגה את הערך שלה.
export default function DurationChart({ history }) {
  const items = history.slice(0, MAX_BARS).reverse() // מהישן לחדש, משמאל לימין
  const [selectedId, setSelectedId] = useState(null)
  if (items.length < 2) return null

  const selected = items.find((w) => w.id === selectedId) ?? items[items.length - 1]
  const maxMin = Math.max(...items.map((w) => w.durationMs / 60000))
  const top = Math.max(5, Math.ceil(maxMin / 5) * 5) // עיגול למעלה ל-5 דקות
  const ticks = [top, top / 2, 0]

  return (
    <figure className="rounded-3xl border border-line bg-surface p-4 shadow-soft">
      <figcaption className="flex items-baseline justify-between">
        <span className="text-lg font-bold">משך אימונים</span>
        <span className="text-sm text-muted">
          <span className="num">{formatDate(selected.startedAt)}</span> ·{' '}
          <span className="num font-bold text-ink">{formatClock(selected.durationMs)}</span>
        </span>
      </figcaption>

      <div dir="ltr" className="mt-4 flex gap-2">
        <div className="flex h-36 flex-col justify-between text-[11px] text-muted">
          {ticks.map((t) => (
            <span key={t} className="num -my-1.5 leading-3">
              {t}′
            </span>
          ))}
        </div>
        <div className="relative h-36 flex-1">
          {ticks.map((t) => (
            <div key={t} className="absolute inset-x-0 border-t border-line/70" style={{ bottom: `${(t / top) * 100}%` }} />
          ))}
          <div className="absolute inset-0 flex items-end gap-[2px]">
            {items.map((w) => {
              const isSel = w.id === selected.id
              return (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => setSelectedId(w.id)}
                  aria-label={`${formatDate(w.startedAt)}: ${formatClock(w.durationMs)}`}
                  aria-pressed={isSel}
                  className="flex h-full flex-1 items-end justify-center"
                >
                  <span
                    className={`block w-full max-w-7 rounded-t-[4px] transition-opacity ${isSel ? 'bg-accent' : 'bg-accent opacity-45'}`}
                    style={{ height: `${Math.max(2, (w.durationMs / 60000 / top) * 100)}%` }}
                  />
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div dir="ltr" className="mt-1.5 flex justify-between ps-7 text-[11px] text-muted">
        <span className="num">{formatDate(items[0].startedAt)}</span>
        <span className="num">{formatDate(items[items.length - 1].startedAt)}</span>
      </div>
    </figure>
  )
}
