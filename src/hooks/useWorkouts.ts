import { useEffect, useState } from 'react'
import {
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'
import { useAuthStore } from '../state/useAuthStore'
import {
  exercisePRDoc,
  workoutDoc,
  workoutsCol,
} from '../lib/firestore'
import {
  EMPTY_PR,
  markPRsForExercise,
  totalVolumeKg,
  type SimplePR,
} from '../lib/pr'
import { bumpStreak, type StreakState } from '../lib/streak'
import type { ActiveWorkout } from '../state/useActiveWorkoutStore'
import { fromKg, roundForUnit, type Unit } from '../lib/units'

export type SavedSet = {
  reps: number
  weightKg: number
  type: string
  restSec: number
  completedAt: number
  isPR: boolean
  notes?: string
}

export type SavedWorkoutExercise = {
  exerciseId: string
  name: string
  muscleGroup: string
  order: number
  sets: SavedSet[]
  notes?: string
}

export type SavedWorkout = {
  id: string
  routineId?: string
  routineName?: string
  startedAt: number
  endedAt: number
  durationSec: number
  totalVolumeKg: number
  totalSets: number
  totalReps: number
  exercises: SavedWorkoutExercise[]
}

export type FinishResult = {
  workoutId: string
  prCount: number
}

export async function finishWorkout(
  uid: string,
  workout: ActiveWorkout,
): Promise<FinishResult> {
  const endedAt = Date.now()
  const startedAt = workout.startedAt
  const durationSec = Math.max(1, Math.round((endedAt - startedAt) / 1000))

  // Pull prior PRs in parallel; fall back to empty
  const exerciseIds = [...new Set(workout.exercises.map((e) => e.exerciseId))]
  const priorPRs = new Map<string, SimplePR>()
  await Promise.all(
    exerciseIds.map(async (id) => {
      const snap = await getDoc(exercisePRDoc(uid, id))
      priorPRs.set(id, snap.exists() ? (snap.data() as SimplePR) : EMPTY_PR)
    }),
  )

  let totalSets = 0
  let totalReps = 0
  let totalVolKg = 0
  let prCount = 0

  const savedExercises: SavedWorkoutExercise[] = workout.exercises
    .filter((ex) => ex.sets.some((s) => s.completedAt !== null))
    .map((ex, i) => {
      const completedSets = ex.sets.filter((s) => s.completedAt !== null)
      const prior = priorPRs.get(ex.exerciseId) ?? EMPTY_PR
      const { sets: prFlags, updated } = markPRsForExercise(
        completedSets.map((s) => ({
          weightKg: s.weightKg,
          reps: s.reps,
          type: s.type,
        })),
        prior,
      )
      priorPRs.set(ex.exerciseId, updated)
      totalVolKg += totalVolumeKg(
        completedSets.map((s) => ({
          weightKg: s.weightKg,
          reps: s.reps,
          type: s.type,
        })),
      )
      totalSets += completedSets.length
      totalReps += completedSets.reduce(
        (acc, s) => (s.type === 'warmup' ? acc : acc + (s.reps || 0)),
        0,
      )
      prCount += prFlags.filter(Boolean).length
      return {
        exerciseId: ex.exerciseId,
        name: ex.exerciseName,
        muscleGroup: ex.muscleGroup,
        order: i,
        notes: ex.notes,
        sets: completedSets.map((s, idx) => ({
          reps: s.reps,
          weightKg: s.weightKg,
          type: s.type,
          restSec: ex.defaultRestSec,
          completedAt: s.completedAt!,
          isPR: prFlags[idx] ?? false,
          notes: s.notes,
        })),
      }
    })

  const saved: SavedWorkout = {
    id: workout.id,
    routineId: workout.routineId,
    routineName: workout.routineName,
    startedAt,
    endedAt,
    durationSec,
    totalVolumeKg: totalVolKg,
    totalSets,
    totalReps,
    exercises: savedExercises,
  }

  const userRef = doc(db, 'users', uid)
  const userSnap = await getDoc(userRef)
  const userData = userSnap.exists() ? userSnap.data() : {}

  const batch = writeBatch(db)
  batch.set(workoutDoc(uid, saved.id), saved)

  for (const exId of exerciseIds) {
    const pr = priorPRs.get(exId)
    if (!pr) continue
    batch.set(
      exercisePRDoc(uid, exId),
      { ...pr, lastUpdatedAt: endedAt },
      { merge: true },
    )
  }

  const streakPrev: StreakState = {
    count: (userData.streakCount as number) ?? 0,
    longest: (userData.longestStreak as number) ?? 0,
    lastWorkoutAt: (userData.lastWorkoutAt as number | null) ?? null,
  }
  const streakNext = bumpStreak(streakPrev, new Date(endedAt))
  batch.set(
    userRef,
    {
      streakCount: streakNext.count,
      longestStreak: streakNext.longest,
      lastWorkoutAt: streakNext.lastWorkoutAt,
      totalWorkouts: ((userData.totalWorkouts as number) ?? 0) + 1,
      totalVolumeKg:
        ((userData.totalVolumeKg as number) ?? 0) + totalVolKg,
    },
    { merge: true },
  )

  await batch.commit()
  return { workoutId: saved.id, prCount }
}

export function useRecentWorkouts(max = 20) {
  const user = useAuthStore((s) => s.user)
  const [state, setState] = useState<{
    loading: boolean
    workouts: SavedWorkout[]
  }>(() => ({ loading: Boolean(user), workouts: [] }))

  useEffect(() => {
    if (!user) return
    const q = query(
      workoutsCol(user.uid),
      orderBy('startedAt', 'desc'),
      limit(max),
    )
    return onSnapshot(q, (snap) => {
      const next: SavedWorkout[] = []
      snap.forEach((d) => next.push({ ...(d.data() as SavedWorkout) }))
      setState({ loading: false, workouts: next })
    })
  }, [user, max])

  return state
}

/**
 * Build a map of exerciseId -> "previous" string (e.g. "80kg × 6")
 * from the most recent finished workout that includes that exercise.
 */
export function usePreviousByExerciseId(unit: Unit): Record<string, string> {
  const user = useAuthStore((s) => s.user)
  const [map, setMap] = useState<Record<string, string>>({})

  useEffect(() => {
    if (!user) return
    const q = query(
      workoutsCol(user.uid),
      orderBy('startedAt', 'desc'),
      limit(20),
    )
    return onSnapshot(q, (snap) => {
      const next: Record<string, string> = {}
      snap.forEach((d) => {
        const workout = d.data() as SavedWorkout
        for (const ex of workout.exercises ?? []) {
          if (next[ex.exerciseId]) continue
          const last = ex.sets[ex.sets.length - 1]
          if (!last) continue
          const w = roundForUnit(fromKg(last.weightKg, unit), unit)
          next[ex.exerciseId] = `${w}${unit} × ${last.reps}`
        }
      })
      setMap(next)
    })
  }, [user, unit])

  return map
}
