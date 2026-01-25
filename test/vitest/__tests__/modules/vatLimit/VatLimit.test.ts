import { VatLimitInputFields } from 'components/vatLimit/interfaces/VatLimitInputFields'
import { describe, expect, it } from 'vitest'
import vatLimit from 'components/vatLimit/vatLimit'

describe('vatLimit', () => {
  it('should throw error when startDate is null', () => {
    const input: VatLimitInputFields = {
      startDate: null,
    }

    expect(() => vatLimit.getResult(input)).toThrow('Date can not be null')
  })

  it('should calculate full year limit for January 1, 2026', () => {
    const input: VatLimitInputFields = {
      startDate: new Date(2026, 0, 1),
    }

    const result = vatLimit.getResult(input)

    expect(result.daysToEndYear).toBe(365)
    expect(result.amount).toBe(200000)
    expect(result.startDate).toEqual(new Date(2026, 0, 1))
  })

  it('should calculate proportional limit for July 1, 2026', () => {
    const input: VatLimitInputFields = {
      startDate: new Date(2026, 6, 1),
    }

    const result = vatLimit.getResult(input)

    expect(result.daysToEndYear).toBe(184)
    expect(result.amount).toBe(100821.92)
  })

  it('should calculate minimal limit for December 31, 2026', () => {
    const input: VatLimitInputFields = {
      startDate: new Date(2026, 11, 31),
    }

    const result = vatLimit.getResult(input)

    expect(result.daysToEndYear).toBe(1)
    expect(result.amount).toBe(547.95)
  })

  it('should handle leap year (2024) correctly', () => {
    const input: VatLimitInputFields = {
      startDate: new Date(2024, 0, 1),
    }

    const result = vatLimit.getResult(input)

    expect(result.daysToEndYear).toBe(366)
    expect(result.amount).toBe(200000)
  })

  it('should calculate proportional limit for mid-year in leap year', () => {
    const input: VatLimitInputFields = {
      startDate: new Date(2024, 6, 1),
    }

    const result = vatLimit.getResult(input)

    expect(result.daysToEndYear).toBe(184)
    expect(result.amount).toBe(100546.45)
  })
})
