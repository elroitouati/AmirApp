export function Button({ variant = 'primary', size = 'lg', className = '', ...props }) {
  const base =
    'inline-flex w-full items-center justify-center font-extrabold transition duration-150 active:scale-[0.98] disabled:opacity-50'
  const variants = {
    primary: 'bg-accent text-on-accent shadow-lift',
    secondary: 'bg-surface text-ink border border-line shadow-soft',
    danger: 'bg-surface text-bad border border-line shadow-soft',
    ghost: 'text-muted underline-offset-4 hover:underline',
  }
  const sizes = {
    xl: 'min-h-24 rounded-[2rem] px-6 text-3xl',
    lg: 'min-h-16 rounded-3xl px-5 text-xl',
    md: 'min-h-12 rounded-2xl px-4 text-base',
    sm: 'min-h-11 rounded-2xl px-3 text-sm font-semibold',
  }
  return <button type="button" className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />
}

export function Card({ className = '', ...props }) {
  return <div className={`rounded-3xl border border-line bg-surface shadow-soft ${className}`} {...props} />
}

export function PlanButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="התוכנית המלאה"
      className="grid size-11 place-items-center rounded-2xl border border-line bg-surface text-muted shadow-soft transition active:scale-95"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <path d="M9 6h11M9 12h11M9 18h11" />
        <circle cx="4.5" cy="6" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="12" r="1.2" fill="currentColor" stroke="none" />
        <circle cx="4.5" cy="18" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    </button>
  )
}

export function Check({ className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function Label({ children, className = '' }) {
  return <div className={`text-sm font-medium text-muted ${className}`}>{children}</div>
}
