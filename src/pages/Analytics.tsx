import { useMemo, useState } from 'react'
import { Trophy } from 'lucide-react'
import { useRecentWorkouts } from '../hooks/useWorkouts'
import { useSettingsStore } from '../state/useSettingsStore'
import { StrengthChart } from '../components/StrengthChart'
import { VolumeBars } from '../components/VolumeBars'
import { MuscleVolumePie } from '../components/MuscleVolumePie'
import { YearHeatmap } from '../components/YearHeatmap'
import { fromKg, roundForUnit } from '../lib/units'
import './Page.css'
import './Analytics.css'

export function Analytics() {
  const { workouts, loading } = useRecentWorkouts(200)
  const unit = useSettingsStore((s) => s.unit)

  const exerciseOptions = useMemo(() => {
    const map = new Map<string, { id: string; name: string; count: number }>()
    for (const w of workouts) {
      for (const ex of w.exercises) {
        if (ex.sets.every((s) => s.type === 'warmup')) continue
        const cur = map.get(ex.exerciseId) ?? {
          id: ex.exerciseId,
          name: ex.name,
          count: 0,
        }
        cur.count += 1
        map.set(ex.exerciseId, cur)
      }
    }
    return [...map.values()].sort((a, b) => b.count - a.count)
  }, [workouts])

  const [selectedExId, setSelectedExId] = useState<string | null>(null)
  const activeEx =
    selectedExId ?? exerciseOptions[0]?.id ?? null

  const prSummary = useMemo(() => {
    let prCount = 0
    let lastPRAt: number | null = null
    let lastPRName: string | null = null
    for (const w of workouts) {
      for (const ex of w.exercises) {
        for (const s of ex.sets) {
          if (s.isPR) {
            prCount++
            if (!lastPRAt || w.startedAt > lastPRAt) {
              lastPRAt = w.startedAt
              lastPRName = ex.name
            }
          }
        }
      }
    }
    return { prCount, lastPRAt, lastPRName }
  }, [workouts])

  const dates = workouts.map((w) => w.startedAt)
  const totalVolKg = workouts.reduce((acc, w) => acc + (w.totalVolumeKg ?? 0), 0)
  const totalVol = roundForUnit(fromKg(totalVolKg, unit), unit)

  if (loading) {
    return <div className="page">loading...</div>
  }

  return (
    <div className="page analytics">
      <header className="page__head">
        <p className="page__kicker">analytics</p>
        <h1 className="page__title">progress</h1>
      </header>

      {workouts.length === 0 ? (
        <section className="page__placeholder">
          <p>no logged workouts yet.</p>
          <p className="page__hint">finish your first to see charts here.</p>
        </section>
      ) : (
        <>
          <section className="analytics__totals">
            <div className="analytics__stat">
              <p className="analytics__stat-kicker">workouts</p>
              <p className="analytics__stat-value tnum">{workouts.length}</p>
            </div>
            <div className="analytics__stat">
              <p className="analytics__stat-kicker">total volume</p>
              <p className="analytics__stat-value tnum">
                {totalVol}
                <span className="analytics__stat-unit">{unit}</span>
              </p>
            </div>
            <div className="analytics__stat">
              <p className="analytics__stat-kicker">PRs</p>
              <p className="analytics__stat-value tnum">{prSummary.prCount}</p>
            </div>
          </section>

          <section className="analytics__card">
            <header className="analytics__card-head">
              <h2 className="analytics__card-title">strength progression</h2>
              {exerciseOptions.length > 0 ? (
                <select
                  className="analytics__select"
                  value={activeEx ?? ''}
                  onChange={(e) => setSelectedExId(e.target.value)}
                >
                  {exerciseOptions.map((ex) => (
                    <option key={ex.id} value={ex.id}>
                      {ex.name}
                    </option>
                  ))}
                </select>
              ) : null}
            </header>
            <p className="analytics__card-sub">
              estimated 1RM (Epley), per session
            </p>
            {activeEx ? (
              <StrengthChart
                workouts={workouts}
                exerciseId={activeEx}
                unit={unit}
              />
            ) : null}
          </section>

          <section className="analytics__card">
            <header className="analytics__card-head">
              <h2 className="analytics__card-title">weekly volume</h2>
            </header>
            <p className="analytics__card-sub">last 12 weeks</p>
            <VolumeBars workouts={workouts} unit={unit} />
          </section>

          <section className="analytics__card">
            <header className="analytics__card-head">
              <h2 className="analytics__card-title">consistency</h2>
            </header>
            <p className="analytics__card-sub">last 26 weeks · weeks → top-down</p>
            <YearHeatmap workoutDates={dates} />
          </section>

          <section className="analytics__card">
            <header className="analytics__card-head">
              <h2 className="analytics__card-title">muscle split</h2>
            </header>
            <p className="analytics__card-sub">last 28 days · volume share</p>
            <MuscleVolumePie workouts={workouts} />
          </section>

          {prSummary.prCount > 0 ? (
            <section className="analytics__pr">
              <Trophy size={18} />
              <div>
                <p className="analytics__pr-title">
                  {prSummary.prCount} all-time PR{prSummary.prCount === 1 ? '' : 's'}
                </p>
                {prSummary.lastPRName ? (
                  <p className="analytics__pr-meta">
                    most recent · {prSummary.lastPRName}
                  </p>
                ) : null}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  )
}

export default Analytics
