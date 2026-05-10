import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Copy, Play, Plus, Trash2 } from 'lucide-react'
import {
  createRoutine,
  deleteRoutine,
  duplicateRoutine,
  maybeSeedRoutines,
  markRoutineUsed,
  useRoutines,
  type Routine,
} from '../hooks/useRoutines'
import { useAuthStore } from '../state/useAuthStore'
import { useActiveWorkoutStore } from '../state/useActiveWorkoutStore'
import { SEED_EXERCISES } from '../lib/exerciseSeed'
import './Page.css'
import './Routines.css'

export function Routines() {
  const user = useAuthStore((s) => s.user)
  const { routines, loading } = useRoutines()
  const startWorkout = useActiveWorkoutStore((s) => s.start)
  const addExercise = useActiveWorkoutStore((s) => s.addExercise)
  const nav = useNavigate()
  const [seeded, setSeeded] = useState(false)

  // First-time users get the PPL templates seeded.
  // Run once per session, gated by a ref-equivalent boolean to avoid
  // triggering during sign-in transitions.
  useEffect(() => {
    if (!user || loading || seeded) return
    let cancelled = false
    if (routines.length > 0) {
      queueMicrotask(() => {
        if (!cancelled) setSeeded(true)
      })
      return () => {
        cancelled = true
      }
    }
    void maybeSeedRoutines(user.uid, SEED_EXERCISES).finally(() => {
      if (!cancelled) setSeeded(true)
    })
    return () => {
      cancelled = true
    }
  }, [user, routines.length, loading, seeded])

  const grouped = useMemo(() => {
    const map = new Map<string, Routine[]>()
    for (const r of routines) {
      const list = map.get(r.folder) ?? []
      list.push(r)
      map.set(r.folder, list)
    }
    return [...map.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [routines])

  async function start(routine: Routine) {
    if (!user) return
    startWorkout({ routineId: routine.id, routineName: routine.name })
    for (const re of routine.exercises) {
      const ex = SEED_EXERCISES.find((e) => e.id === re.exerciseId)
      if (ex) addExercise(ex)
    }
    void markRoutineUsed(user.uid, routine.id)
    nav('/logger')
  }

  async function onDuplicate(r: Routine) {
    if (!user) return
    await duplicateRoutine(user.uid, r)
  }

  async function onDelete(r: Routine) {
    if (!user) return
    if (!confirm(`delete "${r.name}"?`)) return
    await deleteRoutine(user.uid, r.id)
  }

  async function onCreate() {
    if (!user) return
    const id = await createRoutine(user.uid, {
      name: 'untitled routine',
      folder: 'Custom',
      order: routines.length,
      exercises: [],
      lastUsedAt: null,
    })
    nav(`/routines/${id}`)
  }

  return (
    <div className="page routines">
      <header className="page__head routines__head">
        <div>
          <p className="page__kicker">workouts</p>
          <h1 className="page__title">routines</h1>
        </div>
        <button
          type="button"
          className="routines__add"
          onClick={onCreate}
          aria-label="new routine"
        >
          <Plus size={20} />
        </button>
      </header>

      <nav className="routines__nav">
        <Link to="/history" className="routines__nav-link">
          history
        </Link>
        <Link to="/exercises" className="routines__nav-link">
          exercise library
        </Link>
      </nav>

      {loading || !seeded ? (
        <p className="routines__empty">loading...</p>
      ) : routines.length === 0 ? (
        <div className="routines__empty">
          <p>no routines.</p>
          <button
            type="button"
            className="routines__create"
            onClick={onCreate}
          >
            create your first →
          </button>
        </div>
      ) : (
        grouped.map(([folder, list]) => (
          <section key={folder} className="routines__group">
            <h2 className="routines__group-title">{folder}</h2>
            <ul className="routines__list">
              {list.map((r) => (
                <li key={r.id} className="routine-card">
                  <Link to={`/routines/${r.id}`} className="routine-card__main">
                    <p className="routine-card__name">{r.name}</p>
                    <p className="routine-card__meta">
                      {r.exercises.length} exercise
                      {r.exercises.length === 1 ? '' : 's'}
                    </p>
                  </Link>
                  <div className="routine-card__actions">
                    <button
                      type="button"
                      className="routine-card__action"
                      aria-label={`duplicate ${r.name}`}
                      onClick={() => onDuplicate(r)}
                    >
                      <Copy size={16} />
                    </button>
                    <button
                      type="button"
                      className="routine-card__action routine-card__action--danger"
                      aria-label={`delete ${r.name}`}
                      onClick={() => onDelete(r)}
                    >
                      <Trash2 size={16} />
                    </button>
                    <button
                      type="button"
                      className="routine-card__start"
                      onClick={() => start(r)}
                      aria-label={`start ${r.name}`}
                    >
                      <Play size={14} fill="currentColor" />
                      start
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  )
}
