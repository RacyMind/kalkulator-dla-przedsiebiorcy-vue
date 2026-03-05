import { describe, expect, it } from 'vitest'
import {
  getIkeLimitDetails,
  getIkzeLimitDetails,
} from 'src/logic/savingsLimits'

describe('savings limits', () => {
  it('returns exact year limit when year exists in map', () => {
    const ikeLimit = getIkeLimitDetails(new Date(2026, 0, 1))
    const ikzeLimit = getIkzeLimitDetails(
      new Date(2026, 0, 1),
      'self_employment',
    )

    expect(ikeLimit.limit).toBe(28308)
    expect(ikeLimit.selectedYear).toBe(2026)
    expect(ikeLimit.isFallback).toBe(false)

    expect(ikzeLimit.limit).toBe(16956)
    expect(ikzeLimit.selectedYear).toBe(2026)
    expect(ikzeLimit.isFallback).toBe(false)
  })

  it('falls back to the latest known year for future dates', () => {
    const ikeLimit = getIkeLimitDetails(new Date(2030, 0, 1))
    const ikzeLimit = getIkzeLimitDetails(
      new Date(2030, 0, 1),
      'employment_contract',
    )

    expect(ikeLimit.limit).toBe(28308)
    expect(ikeLimit.selectedYear).toBe(2026)
    expect(ikeLimit.isFallback).toBe(true)

    expect(ikzeLimit.limit).toBe(11304)
    expect(ikzeLimit.selectedYear).toBe(2026)
    expect(ikzeLimit.isFallback).toBe(true)
  })
})
