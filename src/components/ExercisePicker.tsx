import { useMemo, useState } from 'react'
import { Sheet } from './Sheet'
import { useExercises } from '../hooks/useExercises'
import { MUSCLE_GROUPS, type Exercise, type MuscleGroup } from '../lib/exerciseTypes'
import './ExercisePicker.css'

type Props = {
  open: boolean
  onClose: () => void
  onPick: (ex: Exercise) => void
}

export function ExercisePicker({ open, onClose, onPick }: Props) {
  const { all, loading } = useExercises()
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return all.filter((e) => {
      if (muscle !== 'all' && e.muscleGroup !== muscle) return false
      if (q && !e.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [all, search, muscle])

  return (
    <Sheet open={open} onClose={onClose} title="add exercise">
      <div className="picker">
        <input
          type="search"
          className="picker__search"
          placeholder="search bench, squat, curl..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus
        />
        <div className="picker__chips">
          <button
            type="button"
            className={`chip ${muscle === 'all' ? 'is-active' : ''}`}
            onClick={() => setMuscle('all')}
          >
            all
          </button>
          {MUSCLE_GROUPS.map((m) => (
            <button
              key={m}
              type="button"
              className={`chip ${muscle === m ? 'is-active' : ''}`}
              onClick={() => setMuscle(m)}
            >
              {m}
            </button>
          ))}
        </div>
        {loading ? (
          <p className="picker__empty">loading...</p>
        ) : filtered.length === 0 ? (
          <p className="picker__empty">no match.</p>
        ) : (
          <ul className="picker__list">
            {filtered.map((ex) => (
              <li key={ex.id}>
                <button
                  type="button"
                  className="picker__row"
                  onClick={() => {
                    onPick(ex)
                    onClose()
                  }}
                >
                  <span className="picker__row-name">{ex.name}</span>
                  <span className="picker__row-meta">
                    {ex.muscleGroup} · {ex.equipment}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Sheet>
  )
}
