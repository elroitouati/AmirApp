const TABS = [
  { id: 'home', label: 'בית' },
  { id: 'history', label: 'היסטוריה' },
]

export default function BottomNav({ tab, onChange }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg gap-2 px-4 pt-2 pb-safe">
        {TABS.map((t) => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onChange(t.id)}
              aria-current={active ? 'page' : undefined}
              className={`min-h-12 flex-1 rounded-2xl text-lg font-bold transition ${
                active ? 'bg-surface text-ink shadow-soft' : 'text-muted'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
