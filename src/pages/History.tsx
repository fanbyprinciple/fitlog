import { Link } from 'react-router-dom'
import { Library } from 'lucide-react'
import './Page.css'
import './History.css'

export function History() {
  return (
    <div className="page">
      <header className="page__head">
        <p className="page__kicker">workouts</p>
        <h1 className="page__title">history</h1>
      </header>

      <Link to="/exercises" className="history__library-link">
        <span className="history__library-link-icon">
          <Library size={18} />
        </span>
        <div>
          <p className="history__library-link-title">exercise library</p>
          <p className="history__library-link-sub">
            search 80 system + your customs
          </p>
        </div>
      </Link>

      <section className="page__placeholder">
        <p>no logged workouts yet.</p>
        <p className="page__hint">P3 lands the logger.</p>
      </section>
    </div>
  )
}
