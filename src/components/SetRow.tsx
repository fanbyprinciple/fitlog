import { motion, useReducedMotion } from 'framer-motion'
import { Check, MoreHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import {
  useActiveWorkoutStore,
  type LoggedSet,
  type SetType,
} from '../state/useActiveWorkoutStore'
import { useSettingsStore } from '../state/useSettingsStore'
import { useRestTimerStore } from '../state/useRestTimerStore'
import { fromKg, plateStep, roundForUnit, toKg } from '../lib/units'
import { NumberStepper } from './NumberStepper'
import './SetRow.css'

type Props = {
  loggedExerciseId: string
  setIndex: number
  set: LoggedSet
  defaultRestSec: number
  /** "previous" comparison string, e.g. "80kg × 6" */
  previous?: string | null
}

const TYPE_LABEL: Record<SetType, string> = {
  normal: '',
  warmup: 'W',
  drop: 'D',
  failure: 'F',
}

export function SetRow({
  loggedExerciseId,
  setIndex,
  set,
  defaultRestSec,
  previous,
}: Props) {
  const updateSet = useActiveWorkoutStore((s) => s.updateSet)
  const completeSet = useActiveWorkoutStore((s) => s.completeSet)
  const uncompleteSet = useActiveWorkoutStore((s) => s.uncompleteSet)
  const removeSet = useActiveWorkoutStore((s) => s.removeSet)
  const startTimer = useRestTimerStore((s) => s.start)
  const unit = useSettingsStore((s) => s.unit)
  const reduced = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)

  const completed = set.completedAt !== null
  const weightInUnit = roundForUnit(fromKg(set.weightKg, unit), unit)

  function onWeightChange(next: number) {
    updateSet(loggedExerciseId, set.id, { weightKg: toKg(next, unit) })
  }
  function onRepsChange(next: number) {
    updateSet(loggedExerciseId, set.id, { reps: next })
  }
  function onComplete() {
    if (completed) {
      uncompleteSet(loggedExerciseId, set.id)
      return
    }
    if (set.reps === 0 && set.type !== 'warmup') return
    completeSet(loggedExerciseId, set.id)
    if (set.type !== 'warmup' && defaultRestSec > 0) {
      startTimer(defaultRestSec)
    }
  }

  function changeType(t: SetType) {
    updateSet(loggedExerciseId, set.id, { type: t })
    setMenuOpen(false)
  }

  return (
    <motion.div
      layout={reduced ? false : 'position'}
      className={`set-row ${completed ? 'is-completed' : ''} type-${set.type}`}
    >
      <button
        type="button"
        className={`set-row__index type-${set.type}`}
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={`set ${setIndex + 1} options`}
      >
        {set.type === 'normal' ? setIndex + 1 : TYPE_LABEL[set.type]}
      </button>

      <div className="set-row__previous tnum" aria-label="previous">
        {previous ?? '—'}
      </div>

      <NumberStepper
        value={weightInUnit}
        step={plateStep(unit)}
        decimals={unit === 'kg' ? 1 : 0}
        ariaLabel="weight"
        onChange={onWeightChange}
        unit={unit}
      />

      <NumberStepper
        value={set.reps}
        step={1}
        decimals={0}
        ariaLabel="reps"
        onChange={onRepsChange}
        unit="reps"
      />

      <button
        type="button"
        className={`set-row__check ${completed ? 'is-completed' : ''}`}
        onClick={onComplete}
        aria-label={completed ? 'mark set incomplete' : 'mark set complete'}
        aria-pressed={completed}
      >
        <Check size={20} strokeWidth={3} />
      </button>

      {menuOpen ? (
        <div className="set-row__menu" role="menu">
          <button
            type="button"
            role="menuitem"
            className={`set-row__menu-item ${set.type === 'normal' ? 'is-active' : ''}`}
            onClick={() => changeType('normal')}
          >
            normal
          </button>
          <button
            type="button"
            role="menuitem"
            className={`set-row__menu-item ${set.type === 'warmup' ? 'is-active' : ''}`}
            onClick={() => changeType('warmup')}
          >
            warmup
          </button>
          <button
            type="button"
            role="menuitem"
            className={`set-row__menu-item ${set.type === 'drop' ? 'is-active' : ''}`}
            onClick={() => changeType('drop')}
          >
            drop
          </button>
          <button
            type="button"
            role="menuitem"
            className={`set-row__menu-item ${set.type === 'failure' ? 'is-active' : ''}`}
            onClick={() => changeType('failure')}
          >
            failure
          </button>
          <hr className="set-row__menu-rule" />
          <button
            type="button"
            role="menuitem"
            className="set-row__menu-item set-row__menu-item--danger"
            onClick={() => removeSet(loggedExerciseId, set.id)}
          >
            <Trash2 size={14} /> remove set
          </button>
          <button
            type="button"
            role="menuitem"
            className="set-row__menu-item set-row__menu-item--ghost"
            onClick={() => setMenuOpen(false)}
            aria-label="close menu"
          >
            <MoreHorizontal size={14} /> close
          </button>
        </div>
      ) : null}
    </motion.div>
  )
}
