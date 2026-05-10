import { useState } from 'react'
import { Sheet } from './Sheet'
import { addCustomExercise } from '../hooks/useExercises'
import { useAuthStore } from '../state/useAuthStore'
import {
  EQUIPMENT_LIST,
  MUSCLE_GROUPS,
  type Equipment,
  type ExerciseType,
  type MuscleGroup,
} from '../lib/exerciseTypes'
import './AddCustomExerciseSheet.css'

type Props = {
  open: boolean
  onClose: () => void
}

export function AddCustomExerciseSheet({ open, onClose }: Props) {
  const user = useAuthStore((s) => s.user)
  const [name, setName] = useState('')
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>('chest')
  const [equipment, setEquipment] = useState<Equipment>('barbell')
  const [type, setType] = useState<ExerciseType>('compound')
  const [restSec, setRestSec] = useState(90)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function reset() {
    setName('')
    setMuscleGroup('chest')
    setEquipment('barbell')
    setType('compound')
    setRestSec(90)
    setError(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!name.trim()) {
      setError('name required')
      return
    }
    setSaving(true)
    setError(null)
    try {
      await addCustomExercise(user.uid, {
        name: name.trim(),
        muscleGroup,
        equipment,
        type,
        defaultRestSec: restSec,
      })
      reset()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onClose={onClose} title="new exercise">
      <form className="custom-form" onSubmit={onSubmit}>
        <label className="field">
          <span className="field__label">name</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. cable pullover"
            autoFocus
            maxLength={60}
          />
        </label>

        <label className="field">
          <span className="field__label">muscle</span>
          <select
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value as MuscleGroup)}
          >
            {MUSCLE_GROUPS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">equipment</span>
          <select
            value={equipment}
            onChange={(e) => setEquipment(e.target.value as Equipment)}
          >
            {EQUIPMENT_LIST.map((eq) => (
              <option key={eq} value={eq}>
                {eq}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as ExerciseType)}
          >
            <option value="compound">compound</option>
            <option value="isolation">isolation</option>
            <option value="cardio">cardio</option>
          </select>
        </label>

        <label className="field">
          <span className="field__label">rest (sec)</span>
          <input
            type="number"
            inputMode="numeric"
            min={0}
            max={600}
            value={restSec}
            onChange={(e) => setRestSec(Number(e.target.value))}
          />
        </label>

        {error ? (
          <p className="custom-form__error" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="custom-form__submit"
          disabled={saving}
        >
          {saving ? 'saving...' : 'add exercise'}
        </button>
      </form>
    </Sheet>
  )
}
