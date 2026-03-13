import { describe, expect, it } from 'vitest'
import {
  findGrossAmountUsingNetAmount,
  findGrossAmountUsingTargetAmount,
} from 'src/logic/findGrossAmountUsingNetAmount'

describe('findGrossAmountUsingTargetAmount', () => {
  it('keeps net wrapper behavior unchanged', () => {
    const targetNetAmount = 1000

    const grossAmount = findGrossAmountUsingNetAmount(
      (grossCandidate) => ({
        grossAmount: grossCandidate,
        netAmount: grossCandidate * 0.8,
      }),
      targetNetAmount * 0.5,
      targetNetAmount * 2,
      targetNetAmount,
    )

    expect(grossAmount).toBe(1250)
  })

  it('finds gross amount with a custom target selector', () => {
    const targetEmployerCostAmount = 1200

    const grossAmount = findGrossAmountUsingTargetAmount(
      (grossCandidate) => ({
        grossAmount: grossCandidate,
        totalAmount: grossCandidate * 1.2,
      }),
      targetEmployerCostAmount * 0.5,
      targetEmployerCostAmount * 2,
      targetEmployerCostAmount,
      (result) => result.totalAmount,
    )

    expect(grossAmount).toBe(1000)
  })
})
