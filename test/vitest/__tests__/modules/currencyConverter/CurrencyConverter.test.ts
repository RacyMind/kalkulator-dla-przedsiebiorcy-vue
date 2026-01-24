import { describe, expect, it } from 'vitest'
import currencyConverter from 'components/currencyConverter/currencyConverter'

describe('currencyConverter', () => {
  it('should convert 1 unit with equal rates', () => {
    const result = currencyConverter.convert(1, 4.5, 4.5)

    expect(result).toBe(1)
  })

  it('should convert 100 EUR to PLN (rate 4.5)', () => {
    const result = currencyConverter.convert(100, 4.5, 1)

    expect(result).toBe(450)
  })

  it('should convert 100 PLN to EUR (rate 4.5)', () => {
    const result = currencyConverter.convert(100, 1, 4.5)

    expect(result).toBeCloseTo(22.22, 2)
  })

  it('should handle fractional amounts', () => {
    const result = currencyConverter.convert(123.45, 4.2, 1)

    expect(result).toBeCloseTo(518.49, 2)
  })

  it('should convert between two foreign currencies', () => {
    const result = currencyConverter.convert(100, 4.5, 4.2)

    expect(result).toBeCloseTo(107.14, 2)
  })

  it('should handle zero amount', () => {
    const result = currencyConverter.convert(0, 4.5, 4.2)

    expect(result).toBe(0)
  })
})
