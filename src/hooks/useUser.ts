import { useEffect, useState } from 'react'
import {
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from '../state/useAuthStore'

export type UserDoc = {
  displayName?: string | null
  email?: string | null
  units: 'kg' | 'lbs'
  theme: 'dark' | 'light' | 'auto'
  weeklyGoalWorkouts: number
  streakCount: number
  longestStreak: number
  lastWorkoutAt: number | null
  totalWorkouts: number
  totalVolumeKg: number
}

const DEFAULTS: UserDoc = {
  displayName: null,
  email: null,
  units: 'kg',
  theme: 'dark',
  weeklyGoalWorkouts: 4,
  streakCount: 0,
  longestStreak: 0,
  lastWorkoutAt: null,
  totalWorkouts: 0,
  totalVolumeKg: 0,
}

export function useUserDoc() {
  const user = useAuthStore((s) => s.user)
  const [data, setData] = useState<{ loading: boolean; doc: UserDoc | null }>(
    () => ({ loading: Boolean(user), doc: null }),
  )

  useEffect(() => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    return onSnapshot(ref, async (snap) => {
      if (!snap.exists()) {
        // first sign-in — bootstrap profile doc
        await setDoc(
          ref,
          {
            ...DEFAULTS,
            displayName: user.displayName,
            email: user.email,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        )
        return
      }
      setData({ loading: false, doc: { ...DEFAULTS, ...snap.data() } as UserDoc })
    })
  }, [user])

  return data
}
