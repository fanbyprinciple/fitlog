import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Unit } from '../lib/units'

export type Theme = 'dark' | 'light' | 'auto'

type SettingsStore = {
  unit: Unit
  theme: Theme
  setUnit: (u: Unit) => void
  setTheme: (t: Theme) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      unit: 'kg',
      theme: 'dark',
      setUnit: (unit) => set({ unit }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'fitlog-settings' },
  ),
)
