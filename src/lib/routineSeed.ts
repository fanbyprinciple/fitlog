// PPL templates seeded as routines on first sign-in if the user
// has zero routines. Just suggestions — entirely customizable.
import type { Exercise } from './exerciseTypes'

export type SeededRoutine = {
  name: string
  folder: 'Push' | 'Pull' | 'Legs' | 'Custom'
  exercises: {
    exerciseId: string
    targetSets: number
    targetReps: number
    targetRestSec: number
  }[]
}

export const SEED_ROUTINES: SeededRoutine[] = [
  {
    name: 'Push',
    folder: 'Push',
    exercises: [
      { exerciseId: 'bench-press', targetSets: 4, targetReps: 6, targetRestSec: 150 },
      { exerciseId: 'overhead-press', targetSets: 3, targetReps: 8, targetRestSec: 120 },
      { exerciseId: 'dumbbell-incline-press', targetSets: 3, targetReps: 10, targetRestSec: 90 },
      { exerciseId: 'lateral-raise', targetSets: 4, targetReps: 12, targetRestSec: 60 },
      { exerciseId: 'tricep-pushdown', targetSets: 3, targetReps: 12, targetRestSec: 60 },
    ],
  },
  {
    name: 'Pull',
    folder: 'Pull',
    exercises: [
      { exerciseId: 'deadlift', targetSets: 3, targetReps: 5, targetRestSec: 180 },
      { exerciseId: 'pull-up', targetSets: 4, targetReps: 6, targetRestSec: 120 },
      { exerciseId: 'barbell-row', targetSets: 3, targetReps: 8, targetRestSec: 120 },
      { exerciseId: 'face-pull', targetSets: 3, targetReps: 15, targetRestSec: 60 },
      { exerciseId: 'barbell-curl', targetSets: 3, targetReps: 10, targetRestSec: 75 },
    ],
  },
  {
    name: 'Legs',
    folder: 'Legs',
    exercises: [
      { exerciseId: 'back-squat', targetSets: 4, targetReps: 6, targetRestSec: 180 },
      { exerciseId: 'romanian-deadlift', targetSets: 3, targetReps: 8, targetRestSec: 120 },
      { exerciseId: 'leg-press', targetSets: 3, targetReps: 10, targetRestSec: 120 },
      { exerciseId: 'leg-curl-lying', targetSets: 3, targetReps: 12, targetRestSec: 75 },
      { exerciseId: 'calf-raise-standing', targetSets: 4, targetReps: 12, targetRestSec: 60 },
    ],
  },
]

export function findSeedExercise(
  exerciseId: string,
  seedExercises: readonly Exercise[],
): Exercise | undefined {
  return seedExercises.find((e) => e.id === exerciseId)
}
