import { useMemo } from 'react'
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { subDays } from 'date-fns'
import type { SavedWorkout } from '../hooks/useWorkouts'

type Props = {
  workouts: SavedWorkout[]
  days?: number
}

const COLORS = [
  'oklch(0.86 0.20 130)',
  'oklch(0.78 0.18 100)',
  'oklch(0.78 0.16 145)',
  'oklch(0.74 0.14 70)',
  'oklch(0.72 0.16 240)',
  'oklch(0.74 0.16 320)',
  'oklch(0.68 0.10 200)',
]

export function MuscleVolumePie({ workouts, days = 28 }: Props) {
  const data = useMemo(() => {
    const since = subDays(new Date(), days).getTime()
    const map = new Map<string, number>()
    for (const w of workouts) {
      if (w.startedAt < since) continue
      for (const ex of w.exercises) {
        let exVol = 0
        for (const s of ex.sets) {
          if (s.type === 'warmup') continue
          exVol += (s.weightKg || 0) * (s.reps || 0)
        }
        map.set(ex.muscleGroup, (map.get(ex.muscleGroup) ?? 0) + exVol)
      }
    }
    return [...map.entries()]
      .map(([name, value]) => ({ name, value: Math.round(value) }))
      .filter((e) => e.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [workouts, days])

  if (data.length === 0) {
    return <div className="chart-empty">no completed sets in the last {days} days.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={2}
          stroke="var(--bg-elev-1)"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: 'var(--bg-elev-2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--text)',
            fontSize: 12,
          }}
        />
        <Legend
          verticalAlign="bottom"
          iconType="circle"
          formatter={(v) => (
            <span style={{ color: 'var(--text-mute)', fontSize: 12 }}>{v}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
