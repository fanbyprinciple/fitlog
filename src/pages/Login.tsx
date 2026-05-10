import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../state/useAuthStore'
import { signInWithGoogle } from '../hooks/useAuth'
import './Login.css'

export function Login() {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)
  const [signingIn, setSigningIn] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  async function onSignIn() {
    setError(null)
    setSigningIn(true)
    try {
      await signInWithGoogle()
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'sign-in failed. try again.',
      )
    } finally {
      setSigningIn(false)
    }
  }

  return (
    <div className="login">
      <div className="login__hero">
        <h1>fitlog</h1>
        <p>solo workout tracker. no feed. ever.</p>
      </div>

      <button
        className="login__cta"
        onClick={onSignIn}
        disabled={signingIn}
        type="button"
      >
        {signingIn ? 'signing in...' : 'continue with google'}
      </button>

      {error ? (
        <p className="login__error" role="alert">
          {error}
        </p>
      ) : null}

      <p className="login__legal">
        no photos, no posts, no public profile. your data, your firestore.
      </p>
    </div>
  )
}
