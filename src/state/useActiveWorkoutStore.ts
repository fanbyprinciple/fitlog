import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Exercise } from '../lib/exerciseTypes'

export type SetType = 'normal' | 'warmup' | 'drop' | 'failure'

export type LoggedSet = {
  id: string
  reps: number
  weightKg: number
  type: SetType
  completedAt: number | null
  notes?: string
}

export type LoggedExercise = {
  id: string
  exerciseId: string
  exerciseName: string
  muscleGroup: string
  defaultRestSec: number
  sets: LoggedSet[]
  notes?: string
  /** group number; same group = superset */
  group?: number
}

export type ActiveWorkout = {
  id: string
  startedAt: number
  routineId?: string
  routineName?: string
  exercises: LoggedExercise[]
}

type Store = {
  workout: ActiveWorkout | null
  start: (opts?: { routineId?: string; routineName?: string }) => void
  cancel: () => void
  addExercise: (ex: Exercise) => void
  removeExercise: (loggedExerciseId: string) => void
  reorderExercises: (ids: string[]) => void
  addSet: (loggedExerciseId: string, opts?: { type?: SetType }) => void
  updateSet: (
    loggedExerciseId: string,
    setId: string,
    patch: Partial<Omit<LoggedSet, 'id'>>,
  ) => void
  completeSet: (loggedExerciseId: string, setId: string) => void
  uncompleteSet: (loggedExerciseId: string, setId: string) => void
  removeSet: (loggedExerciseId: string, setId: string) => void
  setExerciseNotes: (loggedExerciseId: string, notes: string) => void
  setExerciseGroup: (loggedExerciseId: string, group: number | undefined) => void
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

export const useActiveWorkoutStore = create<Store>()(
  persist(
    (set) => ({
      workout: null,
      start: (opts) =>
        set({
          workout: {
            id: newId('w'),
            startedAt: Date.now(),
            routineId: opts?.routineId,
            routineName: opts?.routineName,
            exercises: [],
          },
        }),
      cancel: () => set({ workout: null }),
      addExercise: (ex) =>
        set((s) => {
          if (!s.workout) return s
          const last = s.workout.exercises.find(
            (e) => e.exerciseId === ex.id,
          )
          // If exercise already in workout, no-op (user can scroll to it)
          if (last) return s
          return {
            workout: {
              ...s.workout,
              exercises: [
                ...s.workout.exercises,
                {
                  id: newId('le'),
                  exerciseId: ex.id,
                  exerciseName: ex.name,
                  muscleGroup: ex.muscleGroup,
                  defaultRestSec: ex.defaultRestSec,
                  sets: [
                    {
                      id: newId('s'),
                      reps: 0,
                      weightKg: 0,
                      type: 'normal',
                      completedAt: null,
                    },
                  ],
                },
              ],
            },
          }
        }),
      removeExercise: (id) =>
        set((s) => {
          if (!s.workout) return s
          return {
            workout: {
              ...s.workout,
              exercises: s.workout.exercises.filter((e) => e.id !== id),
            },
          }
        }),
      reorderExercises: (ids) =>
        set((s) => {
          if (!s.workout) return s
          const byId = new Map(s.workout.exercises.map((e) => [e.id, e]))
          const next = ids
            .map((id) => byId.get(id))
            .filter((e): e is LoggedExercise => Boolean(e))
          return { workout: { ...s.workout, exercises: next } }
        }),
      addSet: (leId, opts) =>
        set((s) => {
          if (!s.workout) return s
          return {
            workout: {
              ...s.workout,
              exercises: s.workout.exercises.map((e) => {
                if (e.id !== leId) return e
                const last = [...e.sets].reverse().find((x) => x.type === 'normal')
                return {
                  ...e,
                  sets: [
                    ...e.sets,
                    {
                      id: newId('s'),
                      reps: last?.reps ?? 0,
                      weightKg: last?.weightKg ?? 0,
                      type: opts?.type ?? 'normal',
                      completedAt: null,
                    },
                  ],
                }
              }),
            },
          }
        }),
      updateSet: (leId, setId, patch) =>
        set((s) => {
          if (!s.workout) return s
          return {
            workout: {
              ...s.workout,
              exercises: s.workout.exercises.map((e) =>
                e.id !== leId
                  ? e
                  : {
                      ...e,
                      sets: e.sets.map((x) =>
                        x.id === setId ? { ...x, ...patch } : x,
                      ),
                    },
              ),
            },
          }
        }),
      completeSet: (leId, setId) =>
        set((s) => {
          if (!s.workout) return s
          return {
            workout: {
              ...s.workout,
              exercises: s.workout.exercises.map((e) =>
                e.id !== leId
                  ? e
                  : {
                      ...e,
                      sets: e.sets.map((x) =>
                        x.id === setId
                          ? { ...x, completedAt: Date.now() }
                          : x,
                      ),
                    },
              ),
            },
          }
        }),
      uncompleteSet: (leId, setId) =>
        set((s) => {
          if (!s.workout) return s
          return {
            workout: {
              ...s.workout,
              exercises: s.workout.exercises.map((e) =>
                e.id !== leId
                  ? e
                  : {
                      ...e,
                      sets: e.sets.map((x) =>
                        x.id === setId ? { ...x, completedAt: null } : x,
                      ),
                    },
              ),
            },
          }
        }),
      removeSet: (leId, setId) =>
        set((s) => {
          if (!s.workout) return s
          return {
            workout: {
              ...s.workout,
              exercises: s.workout.exercises.map((e) =>
                e.id !== leId
                  ? e
                  : { ...e, sets: e.sets.filter((x) => x.id !== setId) },
              ),
            },
          }
        }),
      setExerciseNotes: (leId, notes) =>
        set((s) => {
          if (!s.workout) return s
          return {
            workout: {
              ...s.workout,
              exercises: s.workout.exercises.map((e) =>
                e.id !== leId ? e : { ...e, notes },
              ),
            },
          }
        }),
      setExerciseGroup: (leId, group) =>
        set((s) => {
          if (!s.workout) return s
          return {
            workout: {
              ...s.workout,
              exercises: s.workout.exercises.map((e) =>
                e.id !== leId ? e : { ...e, group },
              ),
            },
          }
        }),
    }),
    { name: 'fitlog-active-workout' },
  ),
)
