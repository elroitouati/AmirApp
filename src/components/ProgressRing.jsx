import { useId } from 'react'

// טבעת התקדמות כסופה עם "ראש חץ" בקצה – בהשראת העיגול עם החץ בלוגו
export default function ProgressRing({ progress, size = 260, stroke = 14, children }) {
  const id = useId()
  const r = (size - stroke) / 2 - 6
  const c = 2 * Math.PI * r
  const p = Math.min(1, Math.max(0, progress))
  const angle = -Math.PI / 2 + p * 2 * Math.PI
  const tipX = size / 2 + r * Math.cos(angle)
  const tipY = size / 2 + r * Math.sin(angle)

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="drop-shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="var(--color-accent-from)" />
            <stop offset="1" stopColor="var(--color-accent-to)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-surface)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 300ms linear' }}
        />
        {p > 0.01 && (
          <circle cx={tipX} cy={tipY} r={stroke * 0.85} fill="var(--color-accent-from)" stroke="var(--color-bg)" strokeWidth="3" style={{ transition: 'cx 300ms linear, cy 300ms linear' }} />
        )}
      </svg>
      <div className="absolute inset-0 grid place-items-center">{children}</div>
    </div>
  )
}
