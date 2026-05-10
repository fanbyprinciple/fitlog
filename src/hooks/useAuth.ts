import { useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import { useAuthStore } from '../state/useAuthStore'

// Subscribe to Firebase auth state once at app boot. Pushes the user
// (or null) into the zustand store so components can read sync.
export function useAuthBootstrap() {
  const setUser = useAuthStore((s) => s.setUser)
  useEffect(() => onAuthStateChanged(auth, setUser), [setUser])
}

export async function signInWithGoogle() {
  await signInWithPopup(auth, googleProvider)
}

export async function signOutUser() {
  await signOut(auth)
}
