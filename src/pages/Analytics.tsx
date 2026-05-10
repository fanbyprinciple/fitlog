import './Page.css'

export function Analytics() {
  return (
    <div className="page">
      <header className="page__head">
        <p className="page__kicker">analytics</p>
        <h1 className="page__title">progress</h1>
      </header>

      <section className="page__placeholder">
        <p>charts ship in P6.</p>
        <p className="page__hint">need ≥3 logged workouts before they fill in.</p>
      </section>
    </div>
  )
}
