import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Unit } from '../lib/units'

type SettingsStore = {
  unit: Unit
  setUnit: (u: Unit) => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      unit: 'kg',
      setUnit: (unit) => set({ unit }),
    }),
    { name: 'fitlog-settings' },
  ),
)
