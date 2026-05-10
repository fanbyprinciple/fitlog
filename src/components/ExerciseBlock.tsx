import { useState } from 'react'
import { Plus, MoreVertical, Trash2, FileText } from 'lucide-react'
import {
  useActiveWorkoutStore,
  type LoggedExercise,
} from '../state/useActiveWorkoutStore'
import { SetRow } from './SetRow'
import './ExerciseBlock.css'

type Props = {
  exercise: LoggedExercise
  /** map: exerciseId -> last "weight x reps" text from history (P5 will fill) */
  previousByExerciseId?: Record<string, string>
}

export function ExerciseBlock({ exercise, previousByExerciseId }: Props) {
  const addSet = useActiveWorkoutStore((s) => s.addSet)
  const removeExercise = useActiveWorkoutStore((s) => s.removeExercise)
  const setNotes = useActiveWorkoutStore((s) => s.setExerciseNotes)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showNotes, setShowNotes] = useState(Boolean(exercise.notes))

  const previous = previousByExerciseId?.[exercise.exerciseId] ?? null

  return (
    <section className="ex-block" aria-label={exercise.exerciseName}>
      <header className="ex-block__head">
        <div className="ex-block__heading">
          <h3 className="ex-block__title">{exercise.exerciseName}</h3>
          <p className="ex-block__meta">{exercise.muscleGroup}</p>
        </div>
        <button
          type="button"
          className="ex-block__menu-btn"
          aria-label="exercise options"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MoreVertical size={18} />
        </button>
        {menuOpen ? (
          <div className="ex-block__menu" role="menu">
            <button
              type="button"
              role="menuitem"
              className="ex-block__menu-item"
              onClick={() => {
                setShowNotes((v) => !v)
                setMenuOpen(false)
              }}
            >
              <FileText size={14} />
              {showNotes ? 'hide notes' : 'add notes'}
            </button>
            <button
              type="button"
              role="menuitem"
              className="ex-block__menu-item ex-block__menu-item--danger"
              onClick={() => {
                if (confirm(`remove ${exercise.exerciseName} from workout?`)) {
                  removeExercise(exercise.id)
                }
                setMenuOpen(false)
              }}
            >
              <Trash2 size={14} /> remove exercise
            </button>
          </div>
        ) : null}
      </header>

      {showNotes ? (
        <textarea
          className="ex-block__notes"
          value={exercise.notes ?? ''}
          onChange={(e) => setNotes(exercise.id, e.target.value)}
          placeholder="form cue, equipment notes..."
          rows={2}
          maxLength={400}
        />
      ) : null}

      <div className="ex-block__sets-head">
        <span className="ex-block__sh-set">set</span>
        <span className="ex-block__sh-prev">previous</span>
        <span className="ex-block__sh-w">weight</span>
        <span className="ex-block__sh-r">reps</span>
        <span />
      </div>

      <div className="ex-block__sets">
        {exercise.sets.map((s, i) => (
          <SetRow
            key={s.id}
            loggedExerciseId={exercise.id}
            setIndex={i}
            set={s}
            defaultRestSec={exercise.defaultRestSec}
            previous={previous}
          />
        ))}
      </div>

      <button
        type="button"
        className="ex-block__add-set"
        onClick={() => addSet(exercise.id)}
      >
        <Plus size={16} /> add set
      </button>
    </section>
  )
}
