import { useEffect, useMemo, useState } from 'react'
import {
  addDoc,
  deleteDoc,
  onSnapshot,
  query,
  serverTimestamp,
} from 'firebase/firestore'
import { useAuthStore } from '../state/useAuthStore'
import { exerciseDoc, exercisesCol } from '../lib/firestore'
import { SEED_EXERCISES } from '../lib/exerciseSeed'
import type { Exercise } from '../lib/exerciseTypes'

type CustomExerciseDoc = Omit<Exercise, 'id' | 'isCustom'> & {
  isCustom: true
}

type State = { loading: boolean; custom: Exercise[] }

export function useExercises() {
  const user = useAuthStore((s) => s.user)
  const [state, setState] = useState<State>(() => ({
    loading: Boolean(user),
    custom: [],
  }))

  useEffect(() => {
    if (!user) return
    return onSnapshot(query(exercisesCol(user.uid)), (snap) => {
      const next: Exercise[] = []
      snap.forEach((d) => {
        const data = d.data() as CustomExerciseDoc
        next.push({ ...data, id: d.id, isCustom: true })
      })
      setState({ loading: false, custom: next })
    })
  }, [user])

  const all = useMemo<Exercise[]>(
    () => [...state.custom, ...SEED_EXERCISES],
    [state.custom],
  )

  return { all, custom: state.custom, loading: state.loading }
}

export async function addCustomExercise(
  uid: string,
  data: Omit<CustomExerciseDoc, 'createdAt' | 'isCustom'>,
) {
  await addDoc(exercisesCol(uid), {
    ...data,
    isCustom: true,
    createdAt: serverTimestamp(),
  })
}

export async function deleteCustomExercise(uid: string, id: string) {
  await deleteDoc(exerciseDoc(uid, id))
}
