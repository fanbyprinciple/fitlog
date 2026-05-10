import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Flame, Play, Trophy, TrendingUp } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { startOfWeek, isAfter } from 'date-fns'
import { useAuthStore } from '../state/useAuthStore'
import { useActiveWorkoutStore } from '../state/useActiveWorkoutStore'
import { useUserDoc } from '../hooks/useUser'
import { useRecentWorkouts } from '../hooks/useWorkouts'
import { useSettingsStore } from '../state/useSettingsStore'
import { WeeklyHeatmap } from '../components/WeeklyHeatmap'
import { fromKg, roundForUnit } from '../lib/units'
import { daysSinceLastWorkout } from '../lib/streak'
import './Page.css'
import './Home.css'

import type { AchievementKind } from '../lib/achievements'
import { ACHIEVEMENTS } from '../lib/achievements'

type Flash = {
  workoutId: string
  prCount: number
  newAchievements?: AchievementKind[]
}

export function Home() {
  const user = useAuthStore((s) => s.user)
  const workout = useActiveWorkoutStore((s) => s.workout)
  const start = useActiveWorkoutStore((s) => s.start)
  const { doc: userDoc } = useUserDoc()
  const { workouts } = useRecentWorkouts(20)
  const unit = useSettingsStore((s) => s.unit)
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

  // Streak rendering: derive freshness; if user hasn't logged in N+1
  // calendar days, the displayed count "stale" (visually muted).
  const streakState = useMemo(() => {
    if (!userDoc) return null
    return {
      count: userDoc.streakCount,
      longest: userDoc.longestStreak,
      lastWorkoutAt: userDoc.lastWorkoutAt,
    }
  }, [userDoc])

  const streakStale = useMemo(() => {
    if (!streakState) return false
    const days = daysSinceLastWorkout(streakState)
    return days !== null && days > 1
  }, [streakState])

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const thisWeekDates = workouts
    .filter((w) => isAfter(new Date(w.startedAt), weekStart))
    .map((w) => w.startedAt)
  const thisWeekVolKg = workouts
    .filter((w) => isAfter(new Date(w.startedAt), weekStart))
    .reduce((acc, w) => acc + (w.totalVolumeKg ?? 0), 0)
  const thisWeekVol = roundForUnit(fromKg(thisWeekVolKg, unit), unit)
  const goal = userDoc?.weeklyGoalWorkouts ?? 4
  const sessionsThisWeek = thisWeekDates.length

  const lastWorkout = workouts[0]
  const lastVol = lastWorkout
    ? roundForUnit(fromKg(lastWorkout.totalVolumeKg, unit), unit)
    : 0

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
            {flash.newAchievements && flash.newAchievements.length > 0
              ? ` · unlocked ${flash.newAchievements
                  .map((k) => ACHIEVEMENTS.find((a) => a.kind === k)?.title ?? k)
                  .join(', ')}`
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

      <section className="home__week">
        <div className="home__week-head">
          <p className="page__kicker">this week</p>
          <p className="home__week-progress tnum">
            {sessionsThisWeek} / {goal}
          </p>
        </div>
        <WeeklyHeatmap workoutDates={thisWeekDates} />
      </section>

      <section className="home__cards">
        <div
          className={`home__card ${streakStale ? 'is-stale' : ''}`}
        >
          <p className="home__card-kicker">
            <Flame size={12} /> streak
          </p>
          <p className="home__card-value tnum">
            {streakState?.count ?? 0}
          </p>
          <p className="home__card-meta">
            {streakStale
              ? 'stale — log today'
              : streakState && streakState.longest > streakState.count
              ? `longest ${streakState.longest}`
              : 'days in a row'}
          </p>
        </div>
        <div className="home__card">
          <p className="home__card-kicker">
            <TrendingUp size={12} /> volume
          </p>
          <p className="home__card-value tnum">
            {thisWeekVol}
            <span className="home__card-unit">{unit}</span>
          </p>
          <p className="home__card-meta">this week</p>
        </div>
      </section>

      {lastWorkout ? (
        <section className="home__last">
          <p className="page__kicker">last session</p>
          <Link to="/history" className="home__last-card">
            <p className="home__last-name">
              {lastWorkout.routineName ?? 'quick workout'}
            </p>
            <p className="home__last-meta tnum">
              {lastWorkout.totalSets} sets · {lastVol}
              {unit} · {lastWorkout.exercises.length} exercise
              {lastWorkout.exercises.length === 1 ? '' : 's'}
            </p>
          </Link>
        </section>
      ) : null}
    </div>
  )
}
