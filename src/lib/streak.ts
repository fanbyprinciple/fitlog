import {
  differenceInCalendarDays,
  startOfDay,
} from 'date-fns'

export type StreakState = {
  count: number
  longest: number
  lastWorkoutAt: number | null
}

export const EMPTY_STREAK: StreakState = {
  count: 0,
  longest: 0,
  lastWorkoutAt: null,
}

/**
 * Update streak when a workout finishes. User-local "day" boundaries.
 *  - same calendar day as previous: streak unchanged
 *  - exactly +1 day: streak +1
 *  - +2 or more: streak resets to 1
 *  - first ever: streak = 1
 */
export function bumpStreak(
  prev: StreakState,
  workoutAt: Date = new Date(),
): StreakState {
  const today = startOfDay(workoutAt).getTime()
  if (prev.lastWorkoutAt === null) {
    return { count: 1, longest: Math.max(1, prev.longest), lastWorkoutAt: today }
  }
  const last = startOfDay(new Date(prev.lastWorkoutAt))
  const diff = differenceInCalendarDays(workoutAt, last)
  if (diff === 0) return prev
  if (diff === 1) {
    const next = prev.count + 1
    return {
      count: next,
      longest: Math.max(prev.longest, next),
      lastWorkoutAt: today,
    }
  }
  return { count: 1, longest: Math.max(1, prev.longest), lastWorkoutAt: today }
}

/** how many days ago was the last workout (calendar days). null if never. */
export function daysSinceLastWorkout(
  state: StreakState,
  now: Date = new Date(),
): number | null {
  if (state.lastWorkoutAt === null) return null
  return differenceInCalendarDays(now, new Date(state.lastWorkoutAt))
}
