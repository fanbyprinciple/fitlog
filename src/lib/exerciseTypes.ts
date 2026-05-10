export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'legs'
  | 'shoulders'
  | 'arms'
  | 'core'
  | 'cardio'

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'machine'
  | 'cable'
  | 'bodyweight'
  | 'kettlebell'
  | 'other'

export type ExerciseType = 'compound' | 'isolation' | 'cardio'

export type Exercise = {
  id: string
  name: string
  muscleGroup: MuscleGroup
  type: ExerciseType
  equipment: Equipment
  isCustom: boolean
  defaultRestSec: number
  /** present only on custom exercises */
  createdAt?: number
}

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest',
  'back',
  'legs',
  'shoulders',
  'arms',
  'core',
  'cardio',
]

export const EQUIPMENT_LIST: Equipment[] = [
  'barbell',
  'dumbbell',
  'machine',
  'cable',
  'bodyweight',
  'kettlebell',
  'other',
]
