import { useEffect, useState } from 'react'
import {
  addDoc,
  deleteDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from '../state/useAuthStore'
import { routineDoc, routinesCol } from '../lib/firestore'
import { SEED_ROUTINES } from '../lib/routineSeed'

export type RoutineExercise = {
  exerciseId: string
  exerciseName: string
  muscleGroup: string
  defaultRestSec: number
  targetSets: number
  targetReps: number
  targetRestSec: number
  notes?: string
}

export type Routine = {
  id: string
  name: string
  folder: string
  order: number
  exercises: RoutineExercise[]
  createdAt?: number
  updatedAt?: number
  lastUsedAt?: number | null
}

export function useRoutines() {
  const user = useAuthStore((s) => s.user)
  const [state, setState] = useState<{
    loading: boolean
    routines: Routine[]
  }>(() => ({ loading: Boolean(user), routines: [] }))

  useEffect(() => {
    if (!user) return
    const q = query(routinesCol(user.uid), orderBy('order', 'asc'))
    return onSnapshot(q, (snap) => {
      const next: Routine[] = []
      snap.forEach((d) => {
        const data = d.data() as Omit<Routine, 'id'>
        next.push({ ...data, id: d.id })
      })
      setState({ loading: false, routines: next })
    })
  }, [user])

  return state
}

export async function createRoutine(
  uid: string,
  data: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>,
) {
  const ref = await addDoc(routinesCol(uid), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastUsedAt: null,
  })
  return ref.id
}

export async function updateRoutine(
  uid: string,
  id: string,
  patch: Partial<Routine>,
) {
  await updateDoc(routineDoc(uid, id), {
    ...patch,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteRoutine(uid: string, id: string) {
  await deleteDoc(routineDoc(uid, id))
}

export async function duplicateRoutine(uid: string, source: Routine) {
  return createRoutine(uid, {
    name: `${source.name} (copy)`,
    folder: source.folder,
    order: source.order + 0.5,
    exercises: source.exercises,
    lastUsedAt: null,
  })
}

export async function markRoutineUsed(uid: string, id: string) {
  await updateDoc(routineDoc(uid, id), {
    lastUsedAt: Date.now(),
  })
}

/**
 * On first sign-in (no routines yet), seed PPL templates so the
 * user has something to start a workout with. Idempotent — guards
 * against re-seeding by checking the current count.
 */
export async function maybeSeedRoutines(
  uid: string,
  seedExercises: readonly {
    id: string
    name: string
    muscleGroup: string
    defaultRestSec: number
  }[],
): Promise<boolean> {
  const existing = await getDocs(routinesCol(uid))
  if (!existing.empty) return false

  const batch = writeBatch(db)
  SEED_ROUTINES.forEach((seed, order) => {
    const id = `seed-${seed.folder.toLowerCase()}-${order}`
    const exercises: RoutineExercise[] = seed.exercises
      .map((s) => {
        const ex = seedExercises.find((e) => e.id === s.exerciseId)
        if (!ex) return null
        return {
          exerciseId: ex.id,
          exerciseName: ex.name,
          muscleGroup: ex.muscleGroup,
          defaultRestSec: ex.defaultRestSec,
          targetSets: s.targetSets,
          targetReps: s.targetReps,
          targetRestSec: s.targetRestSec,
        }
      })
      .filter((x): x is RoutineExercise => Boolean(x))
    batch.set(routineDoc(uid, id), {
      name: seed.name,
      folder: seed.folder,
      order,
      exercises,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      lastUsedAt: null,
    })
  })

  // Use single setDoc fallback if Firestore batch errors out — but
  // writeBatch shouldn't reject for legal docs.
  void setDoc
  await batch.commit()
  return true
}
