import { describe, expect, it } from 'vitest'
import cashRegisterLimit from 'components/cashRegisterLimit/cashRegisterLimit'

describe('CashRegisterLimit', () => {
  it('should throw error when startDate is null', () => {
    expect(() => {
      cashRegisterLimit.getResult({ startDate: null })
    }).toThrow('Date can not be null')
  })

  it('should return full limit for January 1st (full year)', () => {
    const result = cashRegisterLimit.getResult({
      startDate: new Date(2026, 0, 1),
    })

    expect(result.startDate).toEqual(new Date(2026, 0, 1))
    expect(result.daysToEndYear).toBe(365)
    expect(result.amount).toBe(20000)
  })

  it('should return proportional limit for July 1st', () => {
    const result = cashRegisterLimit.getResult({
      startDate: new Date(2026, 6, 1),
    })

    expect(result.startDate).toEqual(new Date(2026, 6, 1))
    expect(result.daysToEndYear).toBe(184)
    expect(result.amount).toBe(10082.19)
  })

  it('should return minimal limit for December 31st', () => {
    const result = cashRegisterLimit.getResult({
      startDate: new Date(2026, 11, 31),
    })

    expect(result.startDate).toEqual(new Date(2026, 11, 31))
    expect(result.daysToEndYear).toBe(1)
    expect(result.amount).toBe(54.79)
  })

  it('should handle leap year correctly (2024)', () => {
    const result = cashRegisterLimit.getResult({
      startDate: new Date(2024, 0, 1),
    })

    expect(result.daysToEndYear).toBe(366)
    expect(result.amount).toBe(20000)
  })

  it('should calculate proportional limit for mid-year date', () => {
    const result = cashRegisterLimit.getResult({
      startDate: new Date(2026, 3, 15),
    })

    expect(result.startDate).toEqual(new Date(2026, 3, 15))
    expect(result.daysToEndYear).toBe(261)
    expect(result.amount).toBe(14301.37)
  })
})
