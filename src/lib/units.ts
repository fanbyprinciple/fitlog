export type Unit = 'kg' | 'lbs'

const KG_PER_LB = 0.45359237

export function toKg(value: number, unit: Unit): number {
  return unit === 'kg' ? value : value * KG_PER_LB
}

export function fromKg(valueKg: number, unit: Unit): number {
  return unit === 'kg' ? valueKg : valueKg / KG_PER_LB
}

/** rounds to nearest 0.5 in kg, nearest 1 in lbs (typical plate granularity). */
export function roundForUnit(value: number, unit: Unit): number {
  return unit === 'kg' ? Math.round(value * 2) / 2 : Math.round(value)
}

export function formatWeight(valueKg: number, unit: Unit): string {
  const v = fromKg(valueKg, unit)
  const rounded = roundForUnit(v, unit)
  return `${rounded.toString()} ${unit}`
}

export function plateStep(unit: Unit): number {
  return unit === 'kg' ? 2.5 : 5
}
