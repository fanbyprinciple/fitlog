import { collection, doc } from 'firebase/firestore'
import { db } from '../firebase'

// All fitlog data lives under users/{uid}/... — we never read or
// write any path outside this subtree (see firestore.rules).
export const userDoc = (uid: string) => doc(db, 'users', uid)
export const exercisesCol = (uid: string) =>
  collection(db, 'users', uid, 'exercises')
export const exerciseDoc = (uid: string, id: string) =>
  doc(db, 'users', uid, 'exercises', id)
export const routinesCol = (uid: string) =>
  collection(db, 'users', uid, 'routines')
export const routineDoc = (uid: string, id: string) =>
  doc(db, 'users', uid, 'routines', id)
export const workoutsCol = (uid: string) =>
  collection(db, 'users', uid, 'workouts')
export const workoutDoc = (uid: string, id: string) =>
  doc(db, 'users', uid, 'workouts', id)
export const exercisePRsCol = (uid: string) =>
  collection(db, 'users', uid, 'exercisePRs')
export const exercisePRDoc = (uid: string, exerciseId: string) =>
  doc(db, 'users', uid, 'exercisePRs', exerciseId)
