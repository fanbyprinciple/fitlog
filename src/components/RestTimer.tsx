import { useEffect, useState } from 'react'
import { Plus, X } from 'lucide-react'
import { useRestTimerStore } from '../state/useRestTimerStore'
import './RestTimer.css'

function fmt(sec: number): string {
  const s = Math.max(0, Math.abs(sec))
  const m = Math.floor(s / 60)
  const r = s % 60
  return `${m}:${r.toString().padStart(2, '0')}`
}

export function RestTimer() {
  const endsAt = useRestTimerStore((s) => s.endsAt)
  const stop = useRestTimerStore((s) => s.stop)
  const add = useRestTimerStore((s) => s.add)
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (endsAt === null) return
    const t = setInterval(() => setNow(Date.now()), 250)
    return () => clearInterval(t)
  }, [endsAt])

  if (endsAt === null) return null

  const remaining = Math.round((endsAt - now) / 1000)
  const overrun = remaining < 0
  const labelSec = overrun ? -remaining : remaining

  return (
    <div
      className={`rest-timer ${overrun ? 'is-overrun' : ''}`}
      role="status"
      aria-live="off"
    >
      <p className="rest-timer__label">
        {overrun ? 'rest over by' : 'rest'}
      </p>
      <p className="rest-timer__time tnum" aria-label={`rest ${fmt(labelSec)}`}>
        {overrun ? '+' : ''}
        {fmt(labelSec)}
      </p>
      <div className="rest-timer__controls">
        <button
          type="button"
          className="rest-timer__btn"
          onClick={() => add(30)}
        >
          <Plus size={16} /> 30s
        </button>
        <button
          type="button"
          className="rest-timer__btn rest-timer__btn--ghost"
          onClick={stop}
          aria-label="skip rest"
        >
          <X size={16} /> skip
        </button>
      </div>
    </div>
  )
}
