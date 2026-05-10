import { Link } from 'react-router-dom'
import { ChevronLeft, Lock, Trophy } from 'lucide-react'
import { format } from 'date-fns'
import { ACHIEVEMENTS } from '../lib/achievements'
import { useAchievements } from '../hooks/useAchievements'
import './Page.css'
import './Achievements.css'

export function Achievements() {
  const { unlocked, loading } = useAchievements()
  const total = ACHIEVEMENTS.length
  const earned = unlocked.size

  return (
    <div className="page achievements">
      <header className="achievements__head">
        <Link to="/settings" className="achievements__back" aria-label="back">
          <ChevronLeft size={22} />
        </Link>
        <div className="achievements__heading">
          <p className="page__kicker">milestones</p>
          <h1 className="page__title">achievements</h1>
        </div>
        <div className="achievements__count tnum">
          {earned} / {total}
        </div>
      </header>

      {loading ? (
        <p className="achievements__empty">loading...</p>
      ) : (
        <ul className="achievements__list">
          {ACHIEVEMENTS.map((def) => {
            const u = unlocked.get(def.kind)
            const got = Boolean(u)
            return (
              <li
                key={def.kind}
                className={`ach-row ${got ? 'is-unlocked' : ''}`}
              >
                <span className="ach-row__icon">
                  {got ? <Trophy size={18} /> : <Lock size={16} />}
                </span>
                <div className="ach-row__main">
                  <p className="ach-row__title">{def.title}</p>
                  <p className="ach-row__desc">{def.description}</p>
                </div>
                {got ? (
                  <p className="ach-row__date tnum">
                    {format(new Date(u!.unlockedAt), 'd MMM')}
                  </p>
                ) : null}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
