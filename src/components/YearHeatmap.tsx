import { useMemo } from 'react'
import { format, startOfWeek, subWeeks, addDays } from 'date-fns'
import './YearHeatmap.css'

type Props = {
  workoutDates: number[]
  weeks?: number
}

export function YearHeatmap({ workoutDates, weeks = 26 }: Props) {
  const cells = useMemo(() => {
    const hits = new Set(
      workoutDates.map((t) => format(new Date(t), 'yyyy-MM-dd')),
    )
    const today = new Date()
    const start = subWeeks(startOfWeek(today, { weekStartsOn: 1 }), weeks - 1)
    const cols: { weekStart: string; days: { key: string; hit: boolean }[] }[] = []
    for (let w = 0; w < weeks; w++) {
      const weekStart = addDays(start, w * 7)
      const days = Array.from({ length: 7 }, (_, d) => {
        const date = addDays(weekStart, d)
        const key = format(date, 'yyyy-MM-dd')
        return {
          key,
          hit: hits.has(key) && date <= today,
        }
      })
      cols.push({ weekStart: format(weekStart, 'd MMM'), days })
    }
    return cols
  }, [workoutDates, weeks])

  return (
    <div className="year-heatmap" aria-label={`${weeks}-week consistency`}>
      <div className="year-heatmap__grid">
        {cells.map((col) => (
          <div key={col.weekStart} className="year-heatmap__col">
            {col.days.map((d) => (
              <div
                key={d.key}
                className={`year-heatmap__cell ${d.hit ? 'is-hit' : ''}`}
                title={`${d.key}${d.hit ? ' — logged' : ''}`}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
