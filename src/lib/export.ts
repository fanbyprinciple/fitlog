import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'

export type ExportPayload = {
  app: 'fitlog'
  version: 1
  exportedAt: number
  user?: Record<string, unknown> | null
  exercises: Array<{ id: string } & Record<string, unknown>>
  routines: Array<{ id: string } & Record<string, unknown>>
  workouts: Array<{ id: string } & Record<string, unknown>>
  exercisePRs: Array<{ id: string } & Record<string, unknown>>
  achievements: Array<{ id: string } & Record<string, unknown>>
  measurements: Array<{ id: string } & Record<string, unknown>>
}

async function readSubcollection(
  uid: string,
  name: string,
): Promise<Array<{ id: string } & Record<string, unknown>>> {
  const snap = await getDocs(collection(db, 'users', uid, name))
  const out: Array<{ id: string } & Record<string, unknown>> = []
  snap.forEach((d) => out.push({ id: d.id, ...(d.data() as Record<string, unknown>) }))
  return out
}

export async function exportAllUserData(uid: string): Promise<ExportPayload> {
  const userSnap = await getDocs(collection(db, 'users'))
  let userData: Record<string, unknown> | null = null
  userSnap.forEach((d) => {
    if (d.id === uid) userData = d.data() as Record<string, unknown>
  })

  const [exercises, routines, workouts, exercisePRs, achievements, measurements] =
    await Promise.all([
      readSubcollection(uid, 'exercises'),
      readSubcollection(uid, 'routines'),
      readSubcollection(uid, 'workouts'),
      readSubcollection(uid, 'exercisePRs'),
      readSubcollection(uid, 'achievements'),
      readSubcollection(uid, 'measurements'),
    ])

  return {
    app: 'fitlog',
    version: 1,
    exportedAt: Date.now(),
    user: userData,
    exercises,
    routines,
    workouts,
    exercisePRs,
    achievements,
    measurements,
  }
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export async function importUserData(uid: string, payload: ExportPayload) {
  if (payload.app !== 'fitlog') {
    throw new Error('not a fitlog export file.')
  }
  const batch = writeBatch(db)
  if (payload.user) {
    batch.set(doc(db, 'users', uid), payload.user, { merge: true })
  }
  for (const e of payload.exercises ?? []) {
    const { id, ...rest } = e
    batch.set(doc(db, 'users', uid, 'exercises', id), rest, { merge: true })
  }
  for (const r of payload.routines ?? []) {
    const { id, ...rest } = r
    batch.set(doc(db, 'users', uid, 'routines', id), rest, { merge: true })
  }
  for (const w of payload.workouts ?? []) {
    const { id, ...rest } = w
    batch.set(doc(db, 'users', uid, 'workouts', id), rest, { merge: true })
  }
  for (const p of payload.exercisePRs ?? []) {
    const { id, ...rest } = p
    batch.set(doc(db, 'users', uid, 'exercisePRs', id), rest, { merge: true })
  }
  for (const a of payload.achievements ?? []) {
    const { id, ...rest } = a
    batch.set(doc(db, 'users', uid, 'achievements', id), rest, { merge: true })
  }
  for (const m of payload.measurements ?? []) {
    const { id, ...rest } = m
    batch.set(doc(db, 'users', uid, 'measurements', id), rest, { merge: true })
  }
  await batch.commit()
}

/**
 * Delete the user's entire subtree under users/{uid}/. Cascade-deletes
 * exercises, routines, workouts, PRs, achievements, measurements,
 * then the root user doc. NOT reversible.
 */
export async function deleteAllUserData(uid: string) {
  const subs = [
    'exercises',
    'routines',
    'workouts',
    'exercisePRs',
    'achievements',
    'measurements',
  ]
  for (const name of subs) {
    const snap = await getDocs(collection(db, 'users', uid, name))
    const batch = writeBatch(db)
    snap.forEach((d) => batch.delete(d.ref))
    if (!snap.empty) await batch.commit()
  }
  await deleteDoc(doc(db, 'users', uid))
}
