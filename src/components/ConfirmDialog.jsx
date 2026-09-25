import { Button } from './ui.jsx'

export default function ConfirmDialog({ open, title, message, confirmLabel, cancelLabel = 'ביטול', danger, onConfirm, onCancel }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-5" role="alertdialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade bg-black/60" onClick={onCancel} />
      <div className="relative w-full max-w-sm animate-enter rounded-[2rem] border border-line bg-surface p-6 shadow-lift">
        <h2 className="text-2xl font-extrabold">{title}</h2>
        {message && <p className="mt-2 text-base leading-relaxed text-muted">{message}</p>}
        <div className="mt-6 flex flex-col gap-3">
          <Button variant={danger ? 'danger' : 'primary'} size="md" onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="secondary" size="md" onClick={onCancel}>
            {cancelLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
