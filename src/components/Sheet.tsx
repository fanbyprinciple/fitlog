import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import './Sheet.css'

type SheetProps = {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
}

export function Sheet({ open, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <div className="sheet-root" role="dialog" aria-modal="true" aria-label={title}>
      <button
        type="button"
        className="sheet-scrim"
        aria-label="close"
        onClick={onClose}
      />
      <section className="sheet">
        <header className="sheet__head">
          <h2 className="sheet__title">{title}</h2>
          <button
            type="button"
            className="sheet__close"
            onClick={onClose}
            aria-label="close"
          >
            <X size={20} />
          </button>
        </header>
        <div className="sheet__body">{children}</div>
      </section>
    </div>,
    document.body,
  )
}
