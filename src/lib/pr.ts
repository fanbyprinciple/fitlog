// Epley estimated 1RM. Standard formula across most lifting apps.
// Returns 0 for empty / failed sets.
export function epley1RM(weightKg: number, reps: number): number {
  if (!weightKg || !reps) return 0
  if (reps === 1) return weightKg
  return weightKg * (1 + reps / 30)
}

export function bestE1RM(
  sets: { weightKg: number; reps: number; type?: string }[],
): number {
  let best = 0
  for (const s of sets) {
    if (s.type === 'warmup') continue
    const e = epley1RM(s.weightKg, s.reps)
    if (e > best) best = e
  }
  return best
}

export type SimplePR = {
  bestE1RM: number
  bestVolumeKg: number
  /** map from weight key (kg, integer) -> reps achieved */
  bestRepsAtWeight: Record<string, number>
}

export const EMPTY_PR: SimplePR = {
  bestE1RM: 0,
  bestVolumeKg: 0,
  bestRepsAtWeight: {},
}

/**
 * Determine which sets in a finished workout count as PRs.
 * A set is a PR if (a) its e1RM beats the prior best, OR
 * (b) at the same nearest-kg weight, it beat the prior best reps.
 */
export function markPRsForExercise(
  sets: { weightKg: number; reps: number; type?: string }[],
  prior: SimplePR,
): { sets: boolean[]; updated: SimplePR } {
  const updated: SimplePR = {
    bestE1RM: prior.bestE1RM,
    bestVolumeKg: prior.bestVolumeKg,
    bestRepsAtWeight: { ...prior.bestRepsAtWeight },
  }
  const flags: boolean[] = []
  for (const s of sets) {
    if (s.type === 'warmup' || !s.weightKg || !s.reps) {
      flags.push(false)
      continue
    }
    let isPR = false
    const e = epley1RM(s.weightKg, s.reps)
    if (e > updated.bestE1RM) {
      updated.bestE1RM = e
      isPR = true
    }
    const wKey = String(Math.round(s.weightKg))
    const priorRepsAtW = updated.bestRepsAtWeight[wKey] ?? 0
    if (s.reps > priorRepsAtW) {
      updated.bestRepsAtWeight[wKey] = s.reps
      isPR = true
    }
    flags.push(isPR)
  }
  return { sets: flags, updated }
}

export function totalVolumeKg(
  sets: { weightKg: number; reps: number; type?: string }[],
): number {
  let total = 0
  for (const s of sets) {
    if (s.type === 'warmup') continue
    total += (s.weightKg || 0) * (s.reps || 0)
  }
  return total
}
