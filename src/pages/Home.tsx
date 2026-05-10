import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Play, Trophy, Zap } from 'lucide-react'
import { useEffect } from 'react'
import { useAuthStore } from '../state/useAuthStore'
import { useActiveWorkoutStore } from '../state/useActiveWorkoutStore'
import './Page.css'
import './Home.css'

type Flash = { workoutId: string; prCount: number }

export function Home() {
  const user = useAuthStore((s) => s.user)
  const workout = useActiveWorkoutStore((s) => s.workout)
  const start = useActiveWorkoutStore((s) => s.start)
  const nav = useNavigate()
  const location = useLocation()
  const flash = (location.state as { justFinished?: Flash } | null)
    ?.justFinished

  useEffect(() => {
    if (flash) {
      const t = setTimeout(() => {
        nav('.', { replace: true, state: null })
      }, 4500)
      return () => clearTimeout(t)
    }
  }, [flash, nav])

  const name = user?.displayName?.split(' ')[0]?.toLowerCase() ?? 'lifter'

  function quickStart() {
    if (!workout) start()
    nav('/logger')
  }

  return (
    <div className="page">
      <header className="page__head">
        <p className="page__kicker">today</p>
        <h1 className="page__title">hey {name}.</h1>
      </header>

      {flash ? (
        <div className="home__flash" role="status">
          <Trophy size={18} />
          <span>
            workout saved
            {flash.prCount > 0
              ? ` · ${flash.prCount} new PR${flash.prCount === 1 ? '' : 's'}`
              : ''}
          </span>
        </div>
      ) : null}

      {workout ? (
        <Link to="/logger" className="home__resume">
          <span className="home__resume-dot" />
          <div>
            <p className="home__resume-title">workout in progress</p>
            <p className="home__resume-sub">
              {workout.exercises.length} exercise
              {workout.exercises.length === 1 ? '' : 's'} · tap to resume
            </p>
          </div>
        </Link>
      ) : (
        <button
          type="button"
          className="home__start"
          onClick={quickStart}
        >
          <Play size={20} fill="currentColor" />
          quick start workout
        </button>
      )}

      <section className="home__cards">
        <div className="home__card home__card--placeholder">
          <p className="home__card-kicker">streak</p>
          <p className="home__card-value tnum">—</p>
          <p className="home__card-meta">P7 wires the streak math.</p>
        </div>
        <div className="home__card home__card--placeholder">
          <p className="home__card-kicker">this week</p>
          <p className="home__card-value tnum">—</p>
          <p className="home__card-meta">
            <Zap size={12} /> P5 lights up the heatmap.
          </p>
        </div>
      </section>
    </div>
  )
}
