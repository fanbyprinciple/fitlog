import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type RestTimerStore = {
  /** unix ms when the timer should fire 0 */
  endsAt: number | null
  /** original duration in seconds, for display */
  durationSec: number
  start: (sec: number) => void
  stop: () => void
  add: (sec: number) => void
}

export const useRestTimerStore = create<RestTimerStore>()(
  persist(
    (set, get) => ({
      endsAt: null,
      durationSec: 0,
      start: (sec) =>
        set({ endsAt: Date.now() + sec * 1000, durationSec: sec }),
      stop: () => set({ endsAt: null, durationSec: 0 }),
      add: (sec) => {
        const cur = get().endsAt
        if (cur === null) return
        set({
          endsAt: cur + sec * 1000,
          durationSec: get().durationSec + sec,
        })
      },
    }),
    { name: 'fitlog-rest-timer' },
  ),
)
