import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, startOfWeek } from 'date-fns'
import type { SavedWorkout } from '../hooks/useWorkouts'
import { fromKg, roundForUnit, type Unit } from '../lib/units'

type Props = {
  workouts: SavedWorkout[]
  unit: Unit
  weeks?: number
}

export function VolumeBars({ workouts, unit, weeks = 12 }: Props) {
  const data = useMemo(() => {
    const map = new Map<string, number>()
    for (const w of workouts) {
      const wStart = startOfWeek(new Date(w.startedAt), { weekStartsOn: 1 })
      const key = format(wStart, 'yyyy-MM-dd')
      map.set(key, (map.get(key) ?? 0) + w.totalVolumeKg)
    }
    const entries = [...map.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-weeks)
    return entries.map(([key, volKg]) => ({
      week: format(new Date(key), 'd MMM'),
      volume: roundForUnit(fromKg(volKg, unit), unit),
    }))
  }, [workouts, unit, weeks])

  if (data.length === 0) {
    return <div className="chart-empty">no workouts yet.</div>
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 8, bottom: 8, left: -8 }}>
        <CartesianGrid stroke="var(--border)" strokeDasharray="2 6" vertical={false} />
        <XAxis
          dataKey="week"
          stroke="var(--text-dim)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          stroke="var(--text-dim)"
          fontSize={11}
          tickLine={false}
          axisLine={false}
          width={48}
        />
        <Tooltip
          contentStyle={{
            background: 'var(--bg-elev-2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--text)',
            fontSize: 12,
          }}
          formatter={(v) => [`${v} ${unit}`, 'volume']}
          cursor={{ fill: 'oklch(0.86 0.20 130 / 0.06)' }}
        />
        <Bar
          dataKey="volume"
          fill="oklch(0.86 0.20 130)"
          radius={[6, 6, 0, 0]}
          maxBarSize={28}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
