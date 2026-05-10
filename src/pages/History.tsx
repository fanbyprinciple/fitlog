import './Page.css'

export function History() {
  return (
    <div className="page">
      <header className="page__head">
        <p className="page__kicker">workouts</p>
        <h1 className="page__title">history</h1>
      </header>

      <section className="page__placeholder">
        <p>no workouts yet.</p>
        <p className="page__hint">P3 lands the logger.</p>
      </section>
    </div>
  )
}
