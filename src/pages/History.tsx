import { Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { format } from 'date-fns'
import { useRecentWorkouts } from '../hooks/useWorkouts'
import { useSettingsStore } from '../state/useSettingsStore'
import { fromKg, roundForUnit } from '../lib/units'
import './Page.css'
import './History.css'

function fmtDuration(sec: number): string {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

export function History() {
  const { workouts, loading } = useRecentWorkouts(50)
  const unit = useSettingsStore((s) => s.unit)

  return (
    <div className="page">
      <header className="history__head">
        <Link to="/workouts" className="history__back" aria-label="back">
          <ChevronLeft size={22} />
        </Link>
        <div>
          <p className="page__kicker">workouts</p>
          <h1 className="page__title">history</h1>
        </div>
      </header>

      {loading ? (
        <p className="history__empty">loading...</p>
      ) : workouts.length === 0 ? (
        <section className="page__placeholder">
          <p>no logged workouts yet.</p>
          <p className="page__hint">finish your first to see it here.</p>
        </section>
      ) : (
        <ul className="history__list">
          {workouts.map((w) => {
            const vol = roundForUnit(fromKg(w.totalVolumeKg, unit), unit)
            return (
              <li key={w.id} className="history-row">
                <div className="history-row__date">
                  <p className="history-row__day tnum">
                    {format(new Date(w.startedAt), 'd MMM')}
                  </p>
                  <p className="history-row__weekday">
                    {format(new Date(w.startedAt), 'EEE')}
                  </p>
                </div>
                <div className="history-row__main">
                  <p className="history-row__name">
                    {w.routineName ?? 'quick workout'}
                  </p>
                  <p className="history-row__meta tnum">
                    {fmtDuration(w.durationSec)} · {w.totalSets} sets · {vol}
                    {unit}
                  </p>
                  <p className="history-row__exercises">
                    {w.exercises
                      .slice(0, 3)
                      .map((e) => e.name)
                      .join(' · ')}
                    {w.exercises.length > 3
                      ? ` · +${w.exercises.length - 3}`
                      : ''}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
