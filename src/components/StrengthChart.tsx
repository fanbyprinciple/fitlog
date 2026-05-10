import { useMemo } from 'react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format } from 'date-fns'
import type { SavedWorkout } from '../hooks/useWorkouts'
import { epley1RM } from '../lib/pr'
import { fromKg, roundForUnit, type Unit } from '../lib/units'

type Props = {
  workouts: SavedWorkout[]
  exerciseId: string
  unit: Unit
}

export function StrengthChart({ workouts, exerciseId, unit }: Props) {
  const data = useMemo(() => {
    const points: { date: number; e1rm: number }[] = []
    for (const w of workouts) {
      const ex = w.exercises.find((e) => e.exerciseId === exerciseId)
      if (!ex) continue
      let best = 0
      for (const s of ex.sets) {
        if (s.type === 'warmup') continue
        const e = epley1RM(s.weightKg, s.reps)
        if (e > best) best = e
      }
      if (best > 0) {
        points.push({
          date: w.startedAt,
          e1rm: roundForUnit(fromKg(best, unit), unit),
        })
      }
    }
    return points.sort((a, b) => a.date - b.date)
  }, [workouts, exerciseId, unit])

  if (data.length < 2) {
    return (
      <div className="chart-empty">
        log this exercise at least twice to see progression.
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 16, bottom: 8, left: -8 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="2 6" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(t) => format(new Date(t), 'd MMM')}
          stroke="var(--text-dim)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          minTickGap={32}
        />
        <YAxis
          stroke="var(--text-dim)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={48}
          tickFormatter={(v) => `${v}`}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-elev-2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--text)',
            fontSize: 12,
          }}
          labelFormatter={(t) => format(new Date(t as number), 'd MMM yyyy')}
          formatter={(v) => [`${v} ${unit}`, 'e1RM']}
        />
        <Line
          type="monotone"
          dataKey="e1rm"
          stroke="oklch(0.86 0.20 130)"
          strokeWidth={2.4}
          dot={{ r: 3, fill: 'oklch(0.86 0.20 130)' }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
