import { useEffect, useRef } from 'react'
import { Minus, Plus } from 'lucide-react'
import './NumberStepper.css'

type Props = {
  value: number
  step?: number
  min?: number
  max?: number
  decimals?: number
  onChange: (next: number) => void
  ariaLabel?: string
  unit?: string
}

export function NumberStepper({
  value,
  step = 1,
  min = 0,
  max = 9999,
  decimals = 0,
  onChange,
  ariaLabel,
  unit,
}: Props) {
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  function clamp(n: number): number {
    return Math.min(max, Math.max(min, n))
  }

  function bump(dir: 1 | -1) {
    onChange(clamp(round(value + dir * step)))
  }

  function round(n: number): number {
    const f = 10 ** decimals
    return Math.round(n * f) / f
  }

  function startHold(dir: 1 | -1) {
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => bump(dir), 80)
    }, 380)
  }

  function endHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current)
    if (holdInterval.current) clearInterval(holdInterval.current)
    holdTimer.current = null
    holdInterval.current = null
  }

  useEffect(() => {
    return endHold
  }, [])

  return (
    <div className="stepper" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className="stepper__btn"
        aria-label="decrease"
        onPointerDown={() => startHold(-1)}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onClick={() => bump(-1)}
      >
        <Minus size={18} strokeWidth={2.4} />
      </button>
      <input
        className="stepper__input tnum"
        type="text"
        inputMode={decimals > 0 ? 'decimal' : 'numeric'}
        value={value.toString()}
        onChange={(e) => {
          const n = Number(e.target.value)
          if (!Number.isFinite(n)) return
          onChange(clamp(round(n)))
        }}
        onFocus={(e) => e.target.select()}
        aria-label={ariaLabel}
      />
      {unit ? <span className="stepper__unit">{unit}</span> : null}
      <button
        type="button"
        className="stepper__btn"
        aria-label="increase"
        onPointerDown={() => startHold(1)}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onClick={() => bump(1)}
      >
        <Plus size={18} strokeWidth={2.4} />
      </button>
    </div>
  )
}
