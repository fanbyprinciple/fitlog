import { useEffect, useState } from 'react'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from '../state/useAuthStore'
import type { AchievementKind } from '../lib/achievements'

export type UnlockedAchievement = {
  kind: AchievementKind
  unlockedAt: number
}

export function useAchievements() {
  const user = useAuthStore((s) => s.user)
  const [state, setState] = useState<{
    loading: boolean
    unlocked: Map<AchievementKind, UnlockedAchievement>
  }>(() => ({ loading: Boolean(user), unlocked: new Map() }))

  useEffect(() => {
    if (!user) return
    return onSnapshot(
      collection(db, 'users', user.uid, 'achievements'),
      (snap) => {
        const next = new Map<AchievementKind, UnlockedAchievement>()
        snap.forEach((d) => {
          const data = d.data() as UnlockedAchievement
          next.set(d.id as AchievementKind, data)
        })
        setState({ loading: false, unlocked: next })
      },
    )
  }, [user])

  return state
}
