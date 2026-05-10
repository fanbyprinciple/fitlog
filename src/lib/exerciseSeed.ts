import type { Exercise } from './exerciseTypes'

// curated 80 most-logged exercises across the major movement patterns.
// kept as a static constant rather than written into firestore on
// first sign-in so we don't blow 80 doc-writes on every new account.
// custom user exercises live in firestore alongside.
const seed: Omit<Exercise, 'isCustom'>[] = [
  // chest
  { id: 'bench-press', name: 'Bench Press', muscleGroup: 'chest', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },
  { id: 'incline-bench-press', name: 'Incline Bench Press', muscleGroup: 'chest', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },
  { id: 'decline-bench-press', name: 'Decline Bench Press', muscleGroup: 'chest', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },
  { id: 'dumbbell-bench-press', name: 'Dumbbell Bench Press', muscleGroup: 'chest', type: 'compound', equipment: 'dumbbell', defaultRestSec: 90 },
  { id: 'dumbbell-incline-press', name: 'Dumbbell Incline Press', muscleGroup: 'chest', type: 'compound', equipment: 'dumbbell', defaultRestSec: 90 },
  { id: 'dumbbell-decline-press', name: 'Dumbbell Decline Press', muscleGroup: 'chest', type: 'compound', equipment: 'dumbbell', defaultRestSec: 90 },
  { id: 'dumbbell-flye', name: 'Dumbbell Flye', muscleGroup: 'chest', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 75 },
  { id: 'cable-flye', name: 'Cable Flye', muscleGroup: 'chest', type: 'isolation', equipment: 'cable', defaultRestSec: 75 },
  { id: 'pec-deck', name: 'Pec Deck', muscleGroup: 'chest', type: 'isolation', equipment: 'machine', defaultRestSec: 75 },
  { id: 'push-up', name: 'Push-Up', muscleGroup: 'chest', type: 'compound', equipment: 'bodyweight', defaultRestSec: 60 },
  { id: 'dips-chest', name: 'Chest Dips', muscleGroup: 'chest', type: 'compound', equipment: 'bodyweight', defaultRestSec: 90 },
  { id: 'machine-chest-press', name: 'Machine Chest Press', muscleGroup: 'chest', type: 'compound', equipment: 'machine', defaultRestSec: 90 },

  // back
  { id: 'deadlift', name: 'Deadlift', muscleGroup: 'back', type: 'compound', equipment: 'barbell', defaultRestSec: 180 },
  { id: 'romanian-deadlift', name: 'Romanian Deadlift', muscleGroup: 'back', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },
  { id: 'sumo-deadlift', name: 'Sumo Deadlift', muscleGroup: 'back', type: 'compound', equipment: 'barbell', defaultRestSec: 180 },
  { id: 'barbell-row', name: 'Barbell Row', muscleGroup: 'back', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },
  { id: 'pendlay-row', name: 'Pendlay Row', muscleGroup: 'back', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },
  { id: 'dumbbell-row', name: 'Dumbbell Row', muscleGroup: 'back', type: 'compound', equipment: 'dumbbell', defaultRestSec: 90 },
  { id: 't-bar-row', name: 'T-Bar Row', muscleGroup: 'back', type: 'compound', equipment: 'machine', defaultRestSec: 120 },
  { id: 'seated-cable-row', name: 'Seated Cable Row', muscleGroup: 'back', type: 'compound', equipment: 'cable', defaultRestSec: 90 },
  { id: 'lat-pulldown', name: 'Lat Pulldown', muscleGroup: 'back', type: 'compound', equipment: 'cable', defaultRestSec: 90 },
  { id: 'pull-up', name: 'Pull-Up', muscleGroup: 'back', type: 'compound', equipment: 'bodyweight', defaultRestSec: 120 },
  { id: 'chin-up', name: 'Chin-Up', muscleGroup: 'back', type: 'compound', equipment: 'bodyweight', defaultRestSec: 120 },
  { id: 'face-pull', name: 'Face Pull', muscleGroup: 'back', type: 'isolation', equipment: 'cable', defaultRestSec: 60 },
  { id: 'shrug-barbell', name: 'Barbell Shrug', muscleGroup: 'back', type: 'isolation', equipment: 'barbell', defaultRestSec: 75 },
  { id: 'shrug-dumbbell', name: 'Dumbbell Shrug', muscleGroup: 'back', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 75 },
  { id: 'rack-pull', name: 'Rack Pull', muscleGroup: 'back', type: 'compound', equipment: 'barbell', defaultRestSec: 150 },

  // legs
  { id: 'back-squat', name: 'Back Squat', muscleGroup: 'legs', type: 'compound', equipment: 'barbell', defaultRestSec: 180 },
  { id: 'front-squat', name: 'Front Squat', muscleGroup: 'legs', type: 'compound', equipment: 'barbell', defaultRestSec: 150 },
  { id: 'leg-press', name: 'Leg Press', muscleGroup: 'legs', type: 'compound', equipment: 'machine', defaultRestSec: 120 },
  { id: 'hack-squat', name: 'Hack Squat', muscleGroup: 'legs', type: 'compound', equipment: 'machine', defaultRestSec: 120 },
  { id: 'bulgarian-split-squat', name: 'Bulgarian Split Squat', muscleGroup: 'legs', type: 'compound', equipment: 'dumbbell', defaultRestSec: 90 },
  { id: 'walking-lunge', name: 'Walking Lunge', muscleGroup: 'legs', type: 'compound', equipment: 'dumbbell', defaultRestSec: 90 },
  { id: 'leg-extension', name: 'Leg Extension', muscleGroup: 'legs', type: 'isolation', equipment: 'machine', defaultRestSec: 75 },
  { id: 'leg-curl-lying', name: 'Lying Leg Curl', muscleGroup: 'legs', type: 'isolation', equipment: 'machine', defaultRestSec: 75 },
  { id: 'leg-curl-seated', name: 'Seated Leg Curl', muscleGroup: 'legs', type: 'isolation', equipment: 'machine', defaultRestSec: 75 },
  { id: 'hip-thrust', name: 'Hip Thrust', muscleGroup: 'legs', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },
  { id: 'glute-bridge', name: 'Glute Bridge', muscleGroup: 'legs', type: 'compound', equipment: 'bodyweight', defaultRestSec: 60 },
  { id: 'calf-raise-standing', name: 'Standing Calf Raise', muscleGroup: 'legs', type: 'isolation', equipment: 'machine', defaultRestSec: 60 },
  { id: 'calf-raise-seated', name: 'Seated Calf Raise', muscleGroup: 'legs', type: 'isolation', equipment: 'machine', defaultRestSec: 60 },
  { id: 'calf-raise-leg-press', name: 'Leg Press Calf Raise', muscleGroup: 'legs', type: 'isolation', equipment: 'machine', defaultRestSec: 60 },
  { id: 'goblet-squat', name: 'Goblet Squat', muscleGroup: 'legs', type: 'compound', equipment: 'dumbbell', defaultRestSec: 90 },
  { id: 'good-morning', name: 'Good Morning', muscleGroup: 'legs', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },

  // shoulders
  { id: 'overhead-press', name: 'Overhead Press', muscleGroup: 'shoulders', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },
  { id: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', type: 'compound', equipment: 'dumbbell', defaultRestSec: 90 },
  { id: 'arnold-press', name: 'Arnold Press', muscleGroup: 'shoulders', type: 'compound', equipment: 'dumbbell', defaultRestSec: 90 },
  { id: 'lateral-raise', name: 'Lateral Raise', muscleGroup: 'shoulders', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 60 },
  { id: 'front-raise', name: 'Front Raise', muscleGroup: 'shoulders', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 60 },
  { id: 'rear-delt-flye', name: 'Rear Delt Flye', muscleGroup: 'shoulders', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 60 },
  { id: 'cable-lateral-raise', name: 'Cable Lateral Raise', muscleGroup: 'shoulders', type: 'isolation', equipment: 'cable', defaultRestSec: 60 },
  { id: 'machine-shoulder-press', name: 'Machine Shoulder Press', muscleGroup: 'shoulders', type: 'compound', equipment: 'machine', defaultRestSec: 90 },
  { id: 'upright-row', name: 'Upright Row', muscleGroup: 'shoulders', type: 'compound', equipment: 'barbell', defaultRestSec: 75 },
  { id: 'reverse-pec-deck', name: 'Reverse Pec Deck', muscleGroup: 'shoulders', type: 'isolation', equipment: 'machine', defaultRestSec: 60 },

  // arms
  { id: 'barbell-curl', name: 'Barbell Curl', muscleGroup: 'arms', type: 'isolation', equipment: 'barbell', defaultRestSec: 75 },
  { id: 'dumbbell-curl', name: 'Dumbbell Curl', muscleGroup: 'arms', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 60 },
  { id: 'hammer-curl', name: 'Hammer Curl', muscleGroup: 'arms', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 60 },
  { id: 'preacher-curl', name: 'Preacher Curl', muscleGroup: 'arms', type: 'isolation', equipment: 'machine', defaultRestSec: 75 },
  { id: 'ez-bar-curl', name: 'EZ-Bar Curl', muscleGroup: 'arms', type: 'isolation', equipment: 'barbell', defaultRestSec: 75 },
  { id: 'cable-curl', name: 'Cable Curl', muscleGroup: 'arms', type: 'isolation', equipment: 'cable', defaultRestSec: 60 },
  { id: 'concentration-curl', name: 'Concentration Curl', muscleGroup: 'arms', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 60 },
  { id: 'incline-curl', name: 'Incline Dumbbell Curl', muscleGroup: 'arms', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 60 },
  { id: 'tricep-pushdown', name: 'Tricep Pushdown', muscleGroup: 'arms', type: 'isolation', equipment: 'cable', defaultRestSec: 60 },
  { id: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', muscleGroup: 'arms', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 60 },
  { id: 'skullcrusher', name: 'Skullcrusher', muscleGroup: 'arms', type: 'isolation', equipment: 'barbell', defaultRestSec: 75 },
  { id: 'dips-tricep', name: 'Tricep Dips', muscleGroup: 'arms', type: 'compound', equipment: 'bodyweight', defaultRestSec: 90 },
  { id: 'close-grip-bench', name: 'Close-Grip Bench Press', muscleGroup: 'arms', type: 'compound', equipment: 'barbell', defaultRestSec: 120 },
  { id: 'tricep-kickback', name: 'Tricep Kickback', muscleGroup: 'arms', type: 'isolation', equipment: 'dumbbell', defaultRestSec: 60 },
  { id: 'rope-pushdown', name: 'Rope Pushdown', muscleGroup: 'arms', type: 'isolation', equipment: 'cable', defaultRestSec: 60 },
  { id: 'wrist-curl', name: 'Wrist Curl', muscleGroup: 'arms', type: 'isolation', equipment: 'barbell', defaultRestSec: 45 },

  // core
  { id: 'plank', name: 'Plank', muscleGroup: 'core', type: 'isolation', equipment: 'bodyweight', defaultRestSec: 60 },
  { id: 'side-plank', name: 'Side Plank', muscleGroup: 'core', type: 'isolation', equipment: 'bodyweight', defaultRestSec: 45 },
  { id: 'hanging-leg-raise', name: 'Hanging Leg Raise', muscleGroup: 'core', type: 'isolation', equipment: 'bodyweight', defaultRestSec: 60 },
  { id: 'cable-crunch', name: 'Cable Crunch', muscleGroup: 'core', type: 'isolation', equipment: 'cable', defaultRestSec: 60 },
  { id: 'decline-sit-up', name: 'Decline Sit-Up', muscleGroup: 'core', type: 'isolation', equipment: 'bodyweight', defaultRestSec: 60 },
  { id: 'ab-wheel', name: 'Ab Wheel Rollout', muscleGroup: 'core', type: 'isolation', equipment: 'other', defaultRestSec: 60 },
  { id: 'russian-twist', name: 'Russian Twist', muscleGroup: 'core', type: 'isolation', equipment: 'bodyweight', defaultRestSec: 45 },
  { id: 'bird-dog', name: 'Bird Dog', muscleGroup: 'core', type: 'isolation', equipment: 'bodyweight', defaultRestSec: 30 },

  // cardio
  { id: 'treadmill', name: 'Treadmill Run', muscleGroup: 'cardio', type: 'cardio', equipment: 'machine', defaultRestSec: 0 },
  { id: 'cycling', name: 'Cycling', muscleGroup: 'cardio', type: 'cardio', equipment: 'machine', defaultRestSec: 0 },
  { id: 'rowing', name: 'Rowing', muscleGroup: 'cardio', type: 'cardio', equipment: 'machine', defaultRestSec: 0 },
  { id: 'stairmaster', name: 'StairMaster', muscleGroup: 'cardio', type: 'cardio', equipment: 'machine', defaultRestSec: 0 },
  { id: 'elliptical', name: 'Elliptical', muscleGroup: 'cardio', type: 'cardio', equipment: 'machine', defaultRestSec: 0 },
  { id: 'jump-rope', name: 'Jump Rope', muscleGroup: 'cardio', type: 'cardio', equipment: 'other', defaultRestSec: 0 },
]

export const SEED_EXERCISES: readonly Exercise[] = seed.map((e) => ({
  ...e,
  isCustom: false,
}))
