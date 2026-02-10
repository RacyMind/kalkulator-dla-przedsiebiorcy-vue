import { ChildrenCount } from 'components/maternityBenefit/types'

export const maternityLeaveWeeks: Record<ChildrenCount, number> = {
  1: 20,
  2: 31,
  3: 33,
  4: 35,
  5: 37,
}

export const parentalLeaveWeeks: Record<ChildrenCount, number> = {
  1: 32,
  2: 34,
  3: 34,
  4: 34,
  5: 34,
}

export const secondParentLeaveWeeks = 9

export const variantARate = 0.815
export const variantBMaternityRate = 1.0
export const variantBParentalRate = 0.7
export const secondParentRate = 0.7
export const daysPerWeek = 7
export const daysInMonth = 30
