import { describe, expect, it } from 'vitest'
import {
  calculatePieChartPercentages,
  calculatePieChartTotal,
  formatPieChartPercentage,
} from 'src/composables/usePieChartPercentages'

describe('usePieChartPercentages', () => {
  it('calculates total only from valid positive values', () => {
    const total = calculatePieChartTotal([100, 50, -20, Number.NaN, null])

    expect(total).toBe(150)
  })

  it('calculates percentages for pie chart values', () => {
    const percentages = calculatePieChartPercentages([3, 1])

    expect(percentages[0]).toBeCloseTo(75)
    expect(percentages[1]).toBeCloseTo(25)
  })

  it('returns zero percentages when total is zero', () => {
    expect(calculatePieChartPercentages([0, 0, 0])).toEqual([0, 0, 0])
  })

  it('normalizes invalid values to zero in percentages', () => {
    const percentages = calculatePieChartPercentages([100, -50, Number.NaN])

    expect(percentages).toEqual([100, 0, 0])
  })

  it('formats percentage with one fractional digit for pl-PL locale', () => {
    expect(formatPieChartPercentage(12.345)).toBe('12,3%')
  })
})
