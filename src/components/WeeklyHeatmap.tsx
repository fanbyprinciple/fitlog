import { startOfWeek, addDays, isSameDay, format } from 'date-fns'
import './WeeklyHeatmap.css'

type Props = {
  workoutDates: number[]
  /** which day to highlight as today, default = now */
  today?: Date
}

export function WeeklyHeatmap({ workoutDates, today = new Date() }: Props) {
  const start = startOfWeek(today, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(start, i))
  const hits = new Set(
    workoutDates.map((t) =>
      format(new Date(t), 'yyyy-MM-dd'),
    ),
  )

  return (
    <div className="heatmap" role="list" aria-label="this week">
      {days.map((d) => {
        const key = format(d, 'yyyy-MM-dd')
        const isToday = isSameDay(d, today)
        const isHit = hits.has(key)
        return (
          <div
            key={key}
            role="listitem"
            className={`heatmap__day ${isHit ? 'is-hit' : ''} ${isToday ? 'is-today' : ''}`}
            aria-label={`${format(d, 'EEEE')} ${isHit ? 'logged' : 'rest'}`}
          >
            <span className="heatmap__letter">{format(d, 'EEEEE')}</span>
            <span className="heatmap__dot" />
          </div>
        )
      })}
    </div>
  )
}
