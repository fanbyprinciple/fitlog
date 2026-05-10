import { useState } from 'react'
import { useAuthStore } from '../state/useAuthStore'
import { signOutUser } from '../hooks/useAuth'
import './Page.css'
import './Settings.css'

export function Settings() {
  const user = useAuthStore((s) => s.user)
  const [signingOut, setSigningOut] = useState(false)

  async function onSignOut() {
    setSigningOut(true)
    try {
      await signOutUser()
    } catch {
      setSigningOut(false)
    }
  }

  return (
    <div className="page">
      <header className="page__head">
        <p className="page__kicker">settings</p>
        <h1 className="page__title">account</h1>
      </header>

      <section className="settings__row">
        <div>
          <p className="settings__label">signed in as</p>
          <p className="settings__value">{user?.email ?? '—'}</p>
        </div>
      </section>

      <section className="settings__row">
        <div>
          <p className="settings__label">units, theme, export</p>
          <p className="settings__value settings__value--mute">land in P8.</p>
        </div>
      </section>

      <button
        className="settings__signout"
        onClick={onSignOut}
        disabled={signingOut}
        type="button"
      >
        {signingOut ? 'signing out...' : 'sign out'}
      </button>
    </div>
  )
}
