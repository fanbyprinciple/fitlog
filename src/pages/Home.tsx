import { useAuthStore } from '../state/useAuthStore'
import './Page.css'

export function Home() {
  const user = useAuthStore((s) => s.user)
  const name = user?.displayName?.split(' ')[0] ?? 'lifter'

  return (
    <div className="page">
      <header className="page__head">
        <p className="page__kicker">today</p>
        <h1 className="page__title">hey {name.toLowerCase()}.</h1>
      </header>

      <section className="page__placeholder">
        <p>dashboard coming next phase.</p>
        <p className="page__hint">
          P3 ships the logger. tap workouts to peek the route.
        </p>
      </section>
    </div>
  )
}
