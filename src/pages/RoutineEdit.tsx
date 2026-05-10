import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  Plus,
  Trash2,
} from 'lucide-react'
import {
  useRoutines,
  updateRoutine,
  type Routine,
  type RoutineExercise,
} from '../hooks/useRoutines'
import { ExercisePicker } from '../components/ExercisePicker'
import { useAuthStore } from '../state/useAuthStore'
import './Page.css'
import './RoutineEdit.css'

const FOLDERS = ['Push', 'Pull', 'Legs', 'Custom', 'Upper', 'Lower'] as const

export function RoutineEdit() {
  const { id } = useParams()
  const user = useAuthStore((s) => s.user)
  const { routines, loading } = useRoutines()
  const nav = useNavigate()
  const routine = routines.find((r) => r.id === id)
  const [draft, setDraft] = useState<Routine | null>(null)
  const [draftSourceId, setDraftSourceId] = useState<string | null>(null)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  // Sync server routine -> local draft on first arrival or when the
  // routine id changes. setState during render is React-canonical for
  // "reset state on prop change" — avoids the useEffect-setState lint.
  if (routine && routine.id !== draftSourceId) {
    setDraftSourceId(routine.id)
    setDraft(routine)
  }

  if (loading) return <div className="page">loading...</div>
  if (!routine) return <Navigate to="/routines" replace />
  if (!draft) return null

  const dirty =
    draft.name !== routine.name ||
    draft.folder !== routine.folder ||
    JSON.stringify(draft.exercises) !== JSON.stringify(routine.exercises)

  function move(idx: number, dir: -1 | 1) {
    if (!draft) return
    const next = [...draft.exercises]
    const j = idx + dir
    if (j < 0 || j >= next.length) return
    const tmp = next[idx]
    next[idx] = next[j]
    next[j] = tmp
    setDraft({ ...draft, exercises: next })
  }

  function removeExercise(idx: number) {
    if (!draft) return
    setDraft({
      ...draft,
      exercises: draft.exercises.filter((_, i) => i !== idx),
    })
  }

  function patchExercise(idx: number, patch: Partial<RoutineExercise>) {
    if (!draft) return
    setDraft({
      ...draft,
      exercises: draft.exercises.map((e, i) =>
        i === idx ? { ...e, ...patch } : e,
      ),
    })
  }

  async function save() {
    if (!user || !draft) return
    setSaving(true)
    try {
      await updateRoutine(user.uid, draft.id, {
        name: draft.name.trim() || 'untitled routine',
        folder: draft.folder,
        exercises: draft.exercises,
      })
      nav('/routines')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page routine-edit">
      <header className="routine-edit__head">
        <Link to="/routines" className="routine-edit__back" aria-label="back">
          <ChevronLeft size={22} />
        </Link>
        <input
          className="routine-edit__name"
          type="text"
          value={draft.name}
          maxLength={50}
          onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          placeholder="routine name"
        />
        <button
          type="button"
          className="routine-edit__save"
          onClick={save}
          disabled={!dirty || saving}
        >
          {saving ? 'saving...' : 'save'}
        </button>
      </header>

      <label className="routine-edit__folder">
        <span className="routine-edit__folder-label">folder</span>
        <select
          value={draft.folder}
          onChange={(e) => setDraft({ ...draft, folder: e.target.value })}
        >
          {FOLDERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
      </label>

      <ul className="routine-edit__list">
        {draft.exercises.map((ex, i) => (
          <li key={`${ex.exerciseId}-${i}`} className="re-row">
            <div className="re-row__handle">
              <button
                type="button"
                className="re-row__handle-btn"
                aria-label="move up"
                onClick={() => move(i, -1)}
                disabled={i === 0}
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                className="re-row__handle-btn"
                aria-label="move down"
                onClick={() => move(i, 1)}
                disabled={i === draft.exercises.length - 1}
              >
                <ArrowDown size={14} />
              </button>
            </div>
            <div className="re-row__main">
              <p className="re-row__name">{ex.exerciseName}</p>
              <p className="re-row__meta">{ex.muscleGroup}</p>
            </div>
            <label className="re-row__field">
              <span>sets</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={20}
                value={ex.targetSets}
                onChange={(e) =>
                  patchExercise(i, {
                    targetSets: Math.max(1, Number(e.target.value)),
                  })
                }
              />
            </label>
            <label className="re-row__field">
              <span>reps</span>
              <input
                type="number"
                inputMode="numeric"
                min={1}
                max={50}
                value={ex.targetReps}
                onChange={(e) =>
                  patchExercise(i, {
                    targetReps: Math.max(1, Number(e.target.value)),
                  })
                }
              />
            </label>
            <button
              type="button"
              className="re-row__remove"
              aria-label={`remove ${ex.exerciseName}`}
              onClick={() => removeExercise(i)}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="routine-edit__add"
        onClick={() => setPickerOpen(true)}
      >
        <Plus size={18} /> add exercise
      </button>

      <ExercisePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(ex) =>
          setDraft({
            ...draft,
            exercises: [
              ...draft.exercises,
              {
                exerciseId: ex.id,
                exerciseName: ex.name,
                muscleGroup: ex.muscleGroup,
                defaultRestSec: ex.defaultRestSec,
                targetSets: 3,
                targetReps: 8,
                targetRestSec: ex.defaultRestSec,
              },
            ],
          })
        }
      />
    </div>
  )
}
