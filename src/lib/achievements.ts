export type AchievementKind =
  | 'first_workout'
  | 'first_pr'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'streak_100'
  | 'workouts_10'
  | 'workouts_50'
  | 'workouts_100'
  | 'workouts_365'
  | 'volume_10t'
  | 'volume_50t'
  | 'volume_100t'

export type AchievementDef = {
  kind: AchievementKind
  title: string
  description: string
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { kind: 'first_workout', title: 'first rep', description: 'logged your first workout.' },
  { kind: 'first_pr', title: 'new ground', description: 'set your first PR.' },
  { kind: 'streak_3', title: 'shown up', description: '3-day streak.' },
  { kind: 'streak_7', title: 'a week deep', description: '7-day streak.' },
  { kind: 'streak_30', title: 'month locked', description: '30-day streak.' },
  { kind: 'streak_100', title: 'triple digits', description: '100-day streak.' },
  { kind: 'workouts_10', title: 'rolling', description: '10 workouts logged.' },
  { kind: 'workouts_50', title: 'fifty in', description: '50 workouts logged.' },
  { kind: 'workouts_100', title: 'century', description: '100 workouts logged.' },
  { kind: 'workouts_365', title: 'year of work', description: '365 workouts logged.' },
  { kind: 'volume_10t', title: '10 tonnes', description: '10,000 kg lifted, lifetime.' },
  { kind: 'volume_50t', title: '50 tonnes', description: '50,000 kg lifted, lifetime.' },
  { kind: 'volume_100t', title: '100 tonnes', description: '100,000 kg lifted, lifetime.' },
]

export type AchievementSnapshotInputs = {
  /** total workouts AFTER this finish (post-increment) */
  totalWorkouts: number
  /** total volume kg AFTER this finish */
  totalVolumeKg: number
  /** streak count AFTER this finish */
  streakCount: number
  /** new PR count from this single workout */
  newPRsThisWorkout: number
  /** set of kinds already unlocked */
  alreadyUnlocked: Set<AchievementKind>
}

/**
 * Returns the kinds that became newly unlocked as a result of this
 * workout finishing. Pure function — no side effects.
 */
export function detectAchievements(
  i: AchievementSnapshotInputs,
): AchievementKind[] {
  const newly: AchievementKind[] = []
  function unlock(kind: AchievementKind) {
    if (!i.alreadyUnlocked.has(kind)) newly.push(kind)
  }

  if (i.totalWorkouts >= 1) unlock('first_workout')
  if (i.newPRsThisWorkout > 0) unlock('first_pr')

  if (i.streakCount >= 3) unlock('streak_3')
  if (i.streakCount >= 7) unlock('streak_7')
  if (i.streakCount >= 30) unlock('streak_30')
  if (i.streakCount >= 100) unlock('streak_100')

  if (i.totalWorkouts >= 10) unlock('workouts_10')
  if (i.totalWorkouts >= 50) unlock('workouts_50')
  if (i.totalWorkouts >= 100) unlock('workouts_100')
  if (i.totalWorkouts >= 365) unlock('workouts_365')

  if (i.totalVolumeKg >= 10_000) unlock('volume_10t')
  if (i.totalVolumeKg >= 50_000) unlock('volume_50t')
  if (i.totalVolumeKg >= 100_000) unlock('volume_100t')

  return newly
}
