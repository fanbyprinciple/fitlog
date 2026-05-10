import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { useActiveWorkoutStore } from '../state/useActiveWorkoutStore'
import { useAuthStore } from '../state/useAuthStore'
import { useSettingsStore } from '../state/useSettingsStore'
import { ExerciseBlock } from '../components/ExerciseBlock'
import { ExercisePicker } from '../components/ExercisePicker'
import { RestTimer } from '../components/RestTimer'
import { finishWorkout, usePreviousByExerciseId } from '../hooks/useWorkouts'
import './Logger.css'

function fmtDuration(ms: number): string {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const r = s % 60
  if (h > 0) {
    return `${h}:${m.toString().padStart(2, '0')}:${r.toString().padStart(2, '0')}`
  }
  return `${m}:${r.toString().padStart(2, '0')}`
}

export function Logger() {
  const user = useAuthStore((s) => s.user)
  const workout = useActiveWorkoutStore((s) => s.workout)
  const cancel = useActiveWorkoutStore((s) => s.cancel)
  const addExercise = useActiveWorkoutStore((s) => s.addExercise)
  const unit = useSettingsStore((s) => s.unit)
  const previousByEx = usePreviousByExerciseId(unit)
  const nav = useNavigate()

  const [pickerOpen, setPickerOpen] = useState(false)
  const [now, setNow] = useState(() => Date.now())
  const [finishing, setFinishing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showFinish, setShowFinish] = useState(false)

  useEffect(() => {
    if (!workout) return
    const t = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(t)
  }, [workout])

  if (!workout) return <Navigate to="/" replace />

  const completedSets = workout.exercises.reduce(
    (acc, ex) => acc + ex.sets.filter((s) => s.completedAt !== null).length,
    0,
  )
  const canFinish = completedSets > 0

  async function onCancel() {
    if (
      !confirm('cancel this workout? logged sets will not be saved.')
    ) {
      return
    }
    cancel()
    nav('/')
  }

  async function onFinish() {
    if (!user || !workout) return
    if (!canFinish) {
      setError('log at least one set first.')
      setShowFinish(true)
      return
    }
    setFinishing(true)
    setError(null)
    try {
      const result = await finishWorkout(user.uid, workout)
      cancel()
      nav('/', { state: { justFinished: result } })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'save failed')
      setFinishing(false)
    }
  }

  return (
    <div className="logger">
      <header className="logger__head">
        <button
          type="button"
          className="logger__cancel"
          onClick={onCancel}
          aria-label="cancel workout"
        >
          <X size={20} />
        </button>
        <div className="logger__heading">
          <p className="logger__kicker">
            {workout.routineName ?? 'quick workout'}
          </p>
          <p className="logger__duration tnum">
            {fmtDuration(now - workout.startedAt)} · {completedSets} set
            {completedSets === 1 ? '' : 's'}
          </p>
        </div>
        <button
          type="button"
          className="logger__finish"
          onClick={onFinish}
          disabled={finishing}
        >
          {finishing ? 'saving...' : 'finish'}
        </button>
      </header>

      <RestTimer />

      <div className="logger__body">
        {workout.exercises.length === 0 ? (
          <div className="logger__empty">
            <p>no exercises yet.</p>
            <button
              type="button"
              className="logger__empty-cta"
              onClick={() => setPickerOpen(true)}
            >
              + pick first exercise
            </button>
          </div>
        ) : (
          workout.exercises.map((ex) => (
            <ExerciseBlock
              key={ex.id}
              exercise={ex}
              previousByExerciseId={previousByEx}
            />
          ))
        )}

        {workout.exercises.length > 0 ? (
          <button
            type="button"
            className="logger__add-exercise"
            onClick={() => setPickerOpen(true)}
          >
            <Plus size={18} /> add exercise
          </button>
        ) : null}

        {error ? (
          <p className="logger__error" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(ex) => addExercise(ex)}
      />

      {showFinish && error ? (
        <div className="logger__toast">{error}</div>
      ) : null}
    </div>
  )
}
