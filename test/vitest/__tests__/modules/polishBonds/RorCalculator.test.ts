import {Result} from 'components/polishBonds/interfaces/Result'
import {RorCalculator} from 'components/polishBonds/logic/RorCalculator'
import {RorInputFields} from 'components/polishBonds/interfaces/RorInputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

describe('Calculator for ROR bonds on 1.01.2025', () => {
  const defaultInput: RorInputFields = {
    boughtBondCount: 10,
    yearlyInflationRate: 0.03,
    belkaTax: true,
    initialInterestRate: 0.0575, // 5.75% for the first month
    nbpReferenceRates: [0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06, 0.06],
  }

  const getResult = (input: RorInputFields): Result => {
    return new RorCalculator().setInputData(input).calculate().getResult()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2025, 0, 1)
  })

  it('Verify all months with varying NBP rates', () => {
    const input = {
      ...defaultInput,
      nbpReferenceRates: [0.045, 0.05, 0.055, 0.06, 0.065, 0.07, 0.075, 0.08, 0.085, 0.09, 0.095],
    }
    
    const result = getResult(input)
    
    // Month 1 (initial interest rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.0575)
    expect(result.monthlyResults[0].interest).toBe(4.79)
    expect(result.monthlyResults[0].taxAmount).toBe(0.91)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.79)
    expect(result.monthlyResults[0].payout).toBe(3.88)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(1.38)
    
    // Month 2 (first NBP rate)
    expect(result.monthlyResults[1].interestRate).toBe(0.045)
    expect(result.monthlyResults[1].interest).toBe(3.75)
    expect(result.monthlyResults[1].taxAmount).toBe(0.71)
    expect(result.monthlyResults[1].accumulatedInterest).toBe(8.54)
    expect(result.monthlyResults[1].payout).toBe(3.04)
    expect(result.monthlyResults[1].accumulatedRealProfit).toBe(1.92)
    
    // Month 3
    expect(result.monthlyResults[2].interestRate).toBe(0.05)
    expect(result.monthlyResults[2].interest).toBe(4.17)
    expect(result.monthlyResults[2].taxAmount).toBe(0.79)
    expect(result.monthlyResults[2].accumulatedInterest).toBe(12.71)
    expect(result.monthlyResults[2].payout).toBe(3.38)
    expect(result.monthlyResults[2].accumulatedRealProfit).toBe(2.80)
    
    // Month 4
    expect(result.monthlyResults[3].interestRate).toBe(0.055)
    expect(result.monthlyResults[3].interest).toBe(4.58)
    expect(result.monthlyResults[3].taxAmount).toBe(0.87)
    expect(result.monthlyResults[3].accumulatedInterest).toBe(17.29)
    expect(result.monthlyResults[3].payout).toBe(3.71)
    expect(result.monthlyResults[3].accumulatedRealProfit).toBe(4.01)
    
    // Month 5
    expect(result.monthlyResults[4].interestRate).toBe(0.06)
    expect(result.monthlyResults[4].interest).toBe(5.00)
    expect(result.monthlyResults[4].taxAmount).toBe(0.95)
    expect(result.monthlyResults[4].accumulatedInterest).toBe(22.29)
    expect(result.monthlyResults[4].payout).toBe(4.05)
    expect(result.monthlyResults[4].accumulatedRealProfit).toBe(5.56)
    
    // Month 6
    expect(result.monthlyResults[5].interestRate).toBe(0.065)
    expect(result.monthlyResults[5].interest).toBe(5.42)
    expect(result.monthlyResults[5].taxAmount).toBe(1.03)
    expect(result.monthlyResults[5].accumulatedInterest).toBe(27.71)
    expect(result.monthlyResults[5].payout).toBe(4.39)
    expect(result.monthlyResults[5].accumulatedRealProfit).toBe(7.45)
    
    // Month 7
    expect(result.monthlyResults[6].interestRate).toBe(0.07)
    expect(result.monthlyResults[6].interest).toBe(5.83)
    expect(result.monthlyResults[6].taxAmount).toBe(1.11)
    expect(result.monthlyResults[6].accumulatedInterest).toBe(33.54)
    expect(result.monthlyResults[6].payout).toBe(4.72)
    expect(result.monthlyResults[6].accumulatedRealProfit).toBe(9.67)
    
    // Month 8
    expect(result.monthlyResults[7].interestRate).toBe(0.075)
    expect(result.monthlyResults[7].interest).toBe(6.25)
    expect(result.monthlyResults[7].taxAmount).toBe(1.19)
    expect(result.monthlyResults[7].accumulatedInterest).toBe(39.79)
    expect(result.monthlyResults[7].payout).toBe(5.06)
    expect(result.monthlyResults[7].accumulatedRealProfit).toBe(12.23)
    
    // Month 9
    expect(result.monthlyResults[8].interestRate).toBe(0.08)
    expect(result.monthlyResults[8].interest).toBe(6.67)
    expect(result.monthlyResults[8].taxAmount).toBe(1.27)
    expect(result.monthlyResults[8].accumulatedInterest).toBe(46.46)
    expect(result.monthlyResults[8].payout).toBe(5.40)
    expect(result.monthlyResults[8].accumulatedRealProfit).toBe(15.13)
    
    // Month 10
    expect(result.monthlyResults[9].interestRate).toBe(0.085)
    expect(result.monthlyResults[9].interest).toBe(7.08)
    expect(result.monthlyResults[9].taxAmount).toBe(1.35)
    expect(result.monthlyResults[9].accumulatedInterest).toBe(53.54)
    expect(result.monthlyResults[9].payout).toBe(5.73)
    expect(result.monthlyResults[9].accumulatedRealProfit).toBe(18.36)
    
    // Month 11
    expect(result.monthlyResults[10].interestRate).toBe(0.09)
    expect(result.monthlyResults[10].interest).toBe(7.50)
    expect(result.monthlyResults[10].taxAmount).toBe(1.43)
    expect(result.monthlyResults[10].accumulatedInterest).toBe(61.04)
    expect(result.monthlyResults[10].payout).toBe(6.07)
    expect(result.monthlyResults[10].accumulatedRealProfit).toBe(21.93)
    
    // Month 12 (final month with principal repayment)
    expect(result.monthlyResults[11].interestRate).toBe(0.095)
    expect(result.monthlyResults[11].interest).toBe(7.92)
    expect(result.monthlyResults[11].taxAmount).toBe(1.50)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(68.96)
    expect(result.monthlyResults[11].payout).toBe(1006.42) // Principal (1000) + last month interest (7.92) - tax (1.50)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(25.85)
    
    // Verify total accumulated values
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(13.11) // Total tax paid
    expect(result.monthlyResults[11].accumulatedProfit).toBe(55.85) // Total interest after tax
  })

  it('Verify all months with static NBP reference rate', () => {
    const input = {
      ...defaultInput,
    }
    
    const result = getResult(input)
    
    // Month 1 (initial interest rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.0575)
    expect(result.monthlyResults[0].interest).toBe(4.79)
    expect(result.monthlyResults[0].taxAmount).toBe(0.91)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.79)
    expect(result.monthlyResults[0].payout).toBe(3.88)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(1.38)
    
    // Month 2 (first NBP rate)
    expect(result.monthlyResults[1].interestRate).toBe(0.06)
    expect(result.monthlyResults[1].interest).toBe(5.00)
    expect(result.monthlyResults[1].taxAmount).toBe(0.95)
    expect(result.monthlyResults[1].accumulatedInterest).toBe(9.79)
    expect(result.monthlyResults[1].payout).toBe(4.05)
    expect(result.monthlyResults[1].accumulatedRealProfit).toBe(2.93)
    
    // Month 3
    expect(result.monthlyResults[2].interestRate).toBe(0.06)
    expect(result.monthlyResults[2].interest).toBe(5.00)
    expect(result.monthlyResults[2].taxAmount).toBe(0.95)
    expect(result.monthlyResults[2].accumulatedInterest).toBe(14.79)
    expect(result.monthlyResults[2].payout).toBe(4.05)
    expect(result.monthlyResults[2].accumulatedRealProfit).toBe(4.48)
    
    // Month 4
    expect(result.monthlyResults[3].interestRate).toBe(0.06)
    expect(result.monthlyResults[3].interest).toBe(5.00)
    expect(result.monthlyResults[3].taxAmount).toBe(0.95)
    expect(result.monthlyResults[3].accumulatedInterest).toBe(19.79)
    expect(result.monthlyResults[3].payout).toBe(4.05)
    expect(result.monthlyResults[3].accumulatedRealProfit).toBe(6.03)
    
    // Month 5
    expect(result.monthlyResults[4].interestRate).toBe(0.06)
    expect(result.monthlyResults[4].interest).toBe(5.00)
    expect(result.monthlyResults[4].taxAmount).toBe(0.95)
    expect(result.monthlyResults[4].accumulatedInterest).toBe(24.79)
    expect(result.monthlyResults[4].payout).toBe(4.05)
    expect(result.monthlyResults[4].accumulatedRealProfit).toBe(7.58)
    
    // Month 6
    expect(result.monthlyResults[5].interestRate).toBe(0.06)
    expect(result.monthlyResults[5].interest).toBe(5.00)
    expect(result.monthlyResults[5].taxAmount).toBe(0.95)
    expect(result.monthlyResults[5].accumulatedInterest).toBe(29.79)
    expect(result.monthlyResults[5].payout).toBe(4.05)
    expect(result.monthlyResults[5].accumulatedRealProfit).toBe(9.13)
    
    // Month 7
    expect(result.monthlyResults[6].interestRate).toBe(0.06)
    expect(result.monthlyResults[6].interest).toBe(5.00)
    expect(result.monthlyResults[6].taxAmount).toBe(0.95)
    expect(result.monthlyResults[6].accumulatedInterest).toBe(34.79)
    expect(result.monthlyResults[6].payout).toBe(4.05)
    expect(result.monthlyResults[6].accumulatedRealProfit).toBe(10.68)
    
    // Month 8
    expect(result.monthlyResults[7].interestRate).toBe(0.06)
    expect(result.monthlyResults[7].interest).toBe(5.00)
    expect(result.monthlyResults[7].taxAmount).toBe(0.95)
    expect(result.monthlyResults[7].accumulatedInterest).toBe(39.79)
    expect(result.monthlyResults[7].payout).toBe(4.05)
    expect(result.monthlyResults[7].accumulatedRealProfit).toBe(12.23)
    
    // Month 9
    expect(result.monthlyResults[8].interestRate).toBe(0.06)
    expect(result.monthlyResults[8].interest).toBe(5.00)
    expect(result.monthlyResults[8].taxAmount).toBe(0.95)
    expect(result.monthlyResults[8].accumulatedInterest).toBe(44.79)
    expect(result.monthlyResults[8].payout).toBe(4.05)
    expect(result.monthlyResults[8].accumulatedRealProfit).toBe(13.78)
    
    // Month 10
    expect(result.monthlyResults[9].interestRate).toBe(0.06)
    expect(result.monthlyResults[9].interest).toBe(5.00)
    expect(result.monthlyResults[9].taxAmount).toBe(0.95)
    expect(result.monthlyResults[9].accumulatedInterest).toBe(49.79)
    expect(result.monthlyResults[9].payout).toBe(4.05)
    expect(result.monthlyResults[9].accumulatedRealProfit).toBe(15.33)
    
    // Month 11
    expect(result.monthlyResults[10].interestRate).toBe(0.06)
    expect(result.monthlyResults[10].interest).toBe(5.00)
    expect(result.monthlyResults[10].taxAmount).toBe(0.95)
    expect(result.monthlyResults[10].accumulatedInterest).toBe(54.79)
    expect(result.monthlyResults[10].payout).toBe(4.05)
    expect(result.monthlyResults[10].accumulatedRealProfit).toBe(16.88)
    
    // Month 12 (final month with principal repayment)
    expect(result.monthlyResults[11].interestRate).toBe(0.06)
    expect(result.monthlyResults[11].interest).toBe(5.00)
    expect(result.monthlyResults[11].taxAmount).toBe(0.95)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(59.79)
    expect(result.monthlyResults[11].payout).toBe(1004.05) // Principal (1000) + last month interest (5.00) - tax (0.95)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(18.43)
    
    // Verify total accumulated values
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(11.36) // Total tax paid
    expect(result.monthlyResults[11].accumulatedProfit).toBe(48.43) // Total interest after tax
  })

  it('Verify all months without Belka Tax', () => {
    const input = {
      ...defaultInput,
      belkaTax: false,
    }
    
    const result = getResult(input)
    
    // Month 1 (initial interest rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.0575)
    expect(result.monthlyResults[0].interest).toBe(4.79)
    expect(result.monthlyResults[0].taxAmount).toBe(0) // No tax
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.79)
    expect(result.monthlyResults[0].payout).toBe(4.79) // Full interest amount
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(2.29) // Real profit after inflation
    
    // Month 2 (first NBP rate)
    expect(result.monthlyResults[1].interestRate).toBe(0.06)
    expect(result.monthlyResults[1].interest).toBe(5.00)
    expect(result.monthlyResults[1].taxAmount).toBe(0) // No tax
    expect(result.monthlyResults[1].accumulatedInterest).toBe(9.79)
    expect(result.monthlyResults[1].payout).toBe(5.00) // Full interest amount
    expect(result.monthlyResults[1].accumulatedRealProfit).toBe(4.79) // Real profit after inflation
    
    // Month 6
    expect(result.monthlyResults[5].interestRate).toBe(0.06)
    expect(result.monthlyResults[5].interest).toBe(5.00)
    expect(result.monthlyResults[5].taxAmount).toBe(0) // No tax
    expect(result.monthlyResults[5].accumulatedInterest).toBe(29.79)
    expect(result.monthlyResults[5].payout).toBe(5.00) // Full interest amount
    expect(result.monthlyResults[5].accumulatedRealProfit).toBe(14.79) // Real profit after inflation
    
    // Month 12 (final month with principal repayment)
    expect(result.monthlyResults[11].interestRate).toBe(0.06)
    expect(result.monthlyResults[11].interest).toBe(5.00)
    expect(result.monthlyResults[11].taxAmount).toBe(0) // No tax
    expect(result.monthlyResults[11].accumulatedInterest).toBe(59.79)
    expect(result.monthlyResults[11].payout).toBe(1005.00) // Principal (1000) + last month interest (5.00) with no tax
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(29.79) // Real profit after inflation
    
    // Verify total accumulated values
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(0) // No tax paid
    expect(result.monthlyResults[11].accumulatedProfit).toBe(59.79) // Total interest (no tax deduction)
  })

  it('Verify all months with higher inflation rate (5%)', () => {
    const input = {
      ...defaultInput,
      yearlyInflationRate: 0.05, // 5% inflation instead of 3%
    }
    
    const result = getResult(input)
    
    // Month 1 (initial interest rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.0575)
    expect(result.monthlyResults[0].interest).toBe(4.79)
    expect(result.monthlyResults[0].taxAmount).toBe(0.91)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.79)
    expect(result.monthlyResults[0].payout).toBe(3.88)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(-0.29) // Real profit after inflation
    
    // Month 3
    expect(result.monthlyResults[2].interestRate).toBe(0.06)
    expect(result.monthlyResults[2].interest).toBe(5.00)
    expect(result.monthlyResults[2].taxAmount).toBe(0.95)
    expect(result.monthlyResults[2].accumulatedInterest).toBe(14.79)
    
    // Real profit calculation for month 3
    // Post-tax interest: 5.00 - 0.95 = 4.05
    // Inflation cost: 1000 * 0.05 / 12 = 4.17
    // Real profit: 4.05 - 4.17 = -0.12 (negative due to high inflation)
    expect(result.monthlyResults[2].accumulatedRealProfit).toBeCloseTo(-0.53, 1) // Accumulated negative real profit
    
    // Month 6
    expect(result.monthlyResults[5].interestRate).toBe(0.06)
    expect(result.monthlyResults[5].interest).toBe(5.00)
    expect(result.monthlyResults[5].taxAmount).toBe(0.95)
    expect(result.monthlyResults[5].accumulatedInterest).toBe(29.79)
    expect(result.monthlyResults[5].payout).toBe(4.05)
    expect(result.monthlyResults[5].accumulatedRealProfit).toBeCloseTo(-0.89, 1)
    
    // Month 12 (final month with principal repayment)
    expect(result.monthlyResults[11].interestRate).toBe(0.06)
    expect(result.monthlyResults[11].interest).toBe(5.00)
    expect(result.monthlyResults[11].taxAmount).toBe(0.95)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(59.79)
    expect(result.monthlyResults[11].payout).toBe(1004.05) // Principal (1000) + last month interest (5.00) - tax (0.95)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBeCloseTo(-1.61, 1) // Accumulated negative real profit
    
    // Verify total accumulated values
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(11.36) // Total tax paid
    expect(result.monthlyResults[11].accumulatedProfit).toBe(48.43) // Total interest after tax
  })
})
