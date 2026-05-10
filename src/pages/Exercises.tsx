import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, Plus, Trash2 } from 'lucide-react'
import { useExercises, deleteCustomExercise } from '../hooks/useExercises'
import { useAuthStore } from '../state/useAuthStore'
import { MUSCLE_GROUPS, type MuscleGroup } from '../lib/exerciseTypes'
import { AddCustomExerciseSheet } from '../components/AddCustomExerciseSheet'
import './Page.css'
import './Exercises.css'

export function Exercises() {
  const user = useAuthStore((s) => s.user)
  const { all, loading } = useExercises()
  const [search, setSearch] = useState('')
  const [muscle, setMuscle] = useState<MuscleGroup | 'all'>('all')
  const [sheetOpen, setSheetOpen] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return all.filter((e) => {
      if (muscle !== 'all' && e.muscleGroup !== muscle) return false
      if (q && !e.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [all, search, muscle])

  async function onDelete(id: string) {
    if (!user) return
    if (!confirm('remove this custom exercise?')) return
    await deleteCustomExercise(user.uid, id)
  }

  return (
    <div className="page exercises">
      <header className="exercises__head">
        <Link to="/workouts" className="exercises__back" aria-label="back">
          <ChevronLeft size={22} />
        </Link>
        <div className="exercises__heading">
          <p className="page__kicker">library</p>
          <h1 className="page__title">exercises</h1>
        </div>
        <button
          type="button"
          className="exercises__add"
          onClick={() => setSheetOpen(true)}
          aria-label="add custom exercise"
        >
          <Plus size={20} />
        </button>
      </header>

      <input
        type="search"
        className="exercises__search"
        placeholder="search bench, squat, curl..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="exercises__chips" role="tablist" aria-label="muscle filter">
        <button
          type="button"
          role="tab"
          aria-selected={muscle === 'all'}
          className={`chip ${muscle === 'all' ? 'is-active' : ''}`}
          onClick={() => setMuscle('all')}
        >
          all
        </button>
        {MUSCLE_GROUPS.map((m) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={muscle === m}
            className={`chip ${muscle === m ? 'is-active' : ''}`}
            onClick={() => setMuscle(m)}
          >
            {m}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="exercises__empty">loading...</p>
      ) : filtered.length === 0 ? (
        <div className="exercises__empty">
          <p>no exercises match.</p>
          <button
            type="button"
            className="exercises__cta"
            onClick={() => setSheetOpen(true)}
          >
            add a custom one →
          </button>
        </div>
      ) : (
        <ul className="exercises__list">
          {filtered.map((ex) => (
            <li key={ex.id} className="ex-row">
              <div className="ex-row__main">
                <p className="ex-row__name">{ex.name}</p>
                <p className="ex-row__meta">
                  <span>{ex.muscleGroup}</span>
                  <span>·</span>
                  <span>{ex.equipment}</span>
                  {ex.isCustom ? (
                    <>
                      <span>·</span>
                      <span className="ex-row__custom">custom</span>
                    </>
                  ) : null}
                </p>
              </div>
              {ex.isCustom ? (
                <button
                  type="button"
                  className="ex-row__delete"
                  aria-label={`remove ${ex.name}`}
                  onClick={() => onDelete(ex.id)}
                >
                  <Trash2 size={16} />
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      )}

      <AddCustomExerciseSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />
    </div>
  )
}
