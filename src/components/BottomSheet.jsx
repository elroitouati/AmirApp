import { useEffect, useRef, useState } from 'react'

const CLOSE_MS = 220

// חלון שעולה מלמטה. נסגר בהחלקה למטה, בלחיצה על הרקע או ב-Esc.
export default function BottomSheet({ open, onClose, label, children }) {
  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const sheetRef = useRef(null)
  const scrollRef = useRef(null)
  const drag = useRef(null)

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
    } else if (mounted) {
      setClosing(true)
      const t = setTimeout(() => setMounted(false), CLOSE_MS)
      return () => clearTimeout(t)
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!mounted) return null

  const setOffset = (dy, animate) => {
    const el = sheetRef.current
    if (!el) return
    el.style.transition = animate ? `transform ${CLOSE_MS}ms cubic-bezier(0.2,0.8,0.2,1)` : 'none'
    el.style.transform = dy ? `translateY(${dy}px)` : ''
  }

  const start = (y, fromHandle) => {
    const atTop = (scrollRef.current?.scrollTop ?? 0) <= 0
    drag.current = atTop || fromHandle ? { y0: y, dy: 0, t0: Date.now() } : null
  }
  const move = (y) => {
    const d = drag.current
    if (!d) return
    d.dy = Math.max(0, y - d.y0)
    setOffset(d.dy, false)
  }
  const end = () => {
    const d = drag.current
    drag.current = null
    if (!d) return
    const velocity = d.dy / Math.max(1, Date.now() - d.t0)
    if (d.dy > 110 || (d.dy > 40 && velocity > 0.6)) {
      setOffset(sheetRef.current?.offsetHeight ?? 600, true)
      setTimeout(onClose, CLOSE_MS - 40)
    } else {
      setOffset(0, true)
    }
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={label}>
      <div
        className={`absolute inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity duration-200 ${closing ? 'opacity-0' : 'animate-fade'}`}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-h-[88dvh] max-w-lg flex-col rounded-t-[2rem] border border-b-0 border-line bg-bg shadow-[0_-20px_50px_-20px_rgba(0,0,0,0.7)] ${
          closing ? 'translate-y-full transition-transform duration-200 ease-in' : 'animate-sheet'
        }`}
        onTouchStart={(e) => start(e.touches[0].clientY, false)}
        onTouchMove={(e) => move(e.touches[0].clientY)}
        onTouchEnd={end}
        onTouchCancel={end}
      >
        <div
          className="flex shrink-0 cursor-grab justify-center pt-3 pb-2 touch-none"
          onPointerDown={(e) => {
            if (e.pointerType !== 'mouse') return
            e.currentTarget.setPointerCapture(e.pointerId)
            start(e.clientY, true)
          }}
          onPointerMove={(e) => e.pointerType === 'mouse' && move(e.clientY)}
          onPointerUp={(e) => e.pointerType === 'mouse' && end()}
        >
          <div className="h-1.5 w-12 rounded-full bg-line" />
        </div>
        <div ref={scrollRef} className="overflow-y-auto overscroll-contain px-5 pb-safe">
          {children}
        </div>
      </div>
    </div>
  )
}
