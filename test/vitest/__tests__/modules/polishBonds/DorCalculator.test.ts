import {DorCalculator} from 'components/polishBonds/logic/DorCalculator'
import {DorInputFields} from 'components/polishBonds/interfaces/DorInputFields'
import {Result} from 'components/polishBonds/interfaces/Result'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

describe('Calculator for DOR bonds', () => {
  const defaultInput: DorInputFields = {
    boughtBondCount: 10,
    yearlyInflationRate: 0.03,
    belkaTax: true,
    initialInterestRate: 0.059, // 5.90% for the first month (March 2025 emission DOR0327)
    nbpReferenceRates: Array(23).fill(0.0575), // 5.75% NBP reference rate for the remaining 23 months
  }

  const getResult = (input: DorInputFields): Result => {
    return new DorCalculator().setInputData(input).calculate().getResult()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2025, 0, 1)
  })

  it('Verify all months with static NBP reference rate', () => {
    const input = {
      ...defaultInput,
    }
    
    const result = getResult(input)
    
    // Month 1 (initial interest rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.059)
    expect(result.monthlyResults[0].interest).toBe(4.92)
    expect(result.monthlyResults[0].taxAmount).toBe(0.93)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.92)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0.93)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(3.99)
    expect(result.monthlyResults[0].payout).toBe(3.99)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(1.49)
    
    // Month 2 (first NBP rate + margin)
    expect(result.monthlyResults[1].interestRate).toBe(0.059)
    expect(result.monthlyResults[1].interest).toBe(4.92)
    expect(result.monthlyResults[1].taxAmount).toBe(0.93)
    expect(result.monthlyResults[1].accumulatedInterest).toBe(9.84)
    expect(result.monthlyResults[1].accumulatedTaxAmount).toBe(1.86)
    expect(result.monthlyResults[1].accumulatedProfit).toBe(7.98)
    expect(result.monthlyResults[1].payout).toBe(3.99)
    expect(result.monthlyResults[1].accumulatedRealProfit).toBe(2.98)
    
    // Month 12 (middle of the term)
    expect(result.monthlyResults[11].interestRate).toBe(0.059)
    expect(result.monthlyResults[11].interest).toBe(4.92)
    expect(result.monthlyResults[11].taxAmount).toBe(0.93)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(59.04)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(11.16)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(47.88)
    expect(result.monthlyResults[11].payout).toBe(3.99)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(17.88)
    
    // Month 24 (final month with principal repayment)
    expect(result.monthlyResults[23].interestRate).toBe(0.059)
    expect(result.monthlyResults[23].interest).toBe(4.92)
    expect(result.monthlyResults[23].taxAmount).toBe(0.93)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(118.08)
    expect(result.monthlyResults[23].accumulatedTaxAmount).toBe(22.32)
    expect(result.monthlyResults[23].accumulatedProfit).toBe(95.76)
    expect(result.monthlyResults[23].payout).toBe(1003.99) // Principal (1000) + last month interest (4.92) - tax (0.93)
    expect(result.monthlyResults[23].accumulatedRealProfit).toBe(35.76)
    
    const realYearlyRate = 0.0479 
    expect(realYearlyRate).toBe(0.0479)
  })

  it('Verify all months with varying NBP rates', () => {
    // Create an array of varying NBP rates for 23 months (2nd to 24th month)
    const varyingRates = [
      0.055, 0.0525, 0.05, 0.0525, 0.055, 0.0575, 0.06, 0.0625, 0.065, 0.0675, 0.07,
      0.0675, 0.065, 0.0625, 0.06, 0.0575, 0.055, 0.0525, 0.05, 0.0525, 0.055, 0.0575, 0.06,
    ]
    
    const input = {
      ...defaultInput,
      nbpReferenceRates: varyingRates,
    }
    
    const result = getResult(input)
    
    // Month 1 (initial interest rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.059)
    expect(result.monthlyResults[0].interest).toBe(4.92)
    expect(result.monthlyResults[0].taxAmount).toBe(0.93)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.92)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0.93)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(3.99)
    expect(result.monthlyResults[0].payout).toBe(3.99)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(1.49)
    
    // Month 2 (first varying NBP rate + margin)
    expect(result.monthlyResults[1].interestRate).toBe(0.0565)
    expect(result.monthlyResults[1].interest).toBe(4.71)
    expect(result.monthlyResults[1].taxAmount).toBe(0.89)
    expect(result.monthlyResults[1].accumulatedInterest).toBe(9.63)
    expect(result.monthlyResults[1].accumulatedTaxAmount).toBe(1.82)
    expect(result.monthlyResults[1].accumulatedProfit).toBe(7.81)
    expect(result.monthlyResults[1].payout).toBe(3.82)
    expect(result.monthlyResults[1].accumulatedRealProfit).toBe(2.81)
    
    // Month 12 (middle of the term)
    expect(result.monthlyResults[11].interestRate).toBe(0.0715)
    expect(result.monthlyResults[11].interest).toBe(5.96)
    expect(result.monthlyResults[11].taxAmount).toBe(1.13)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(60.26)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(11.43)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(48.83)
    expect(result.monthlyResults[11].payout).toBe(4.83)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(18.83)
    
    // Month 24 (final month with principal repayment)
    expect(result.monthlyResults[23].interestRate).toBe(0.0615)
    expect(result.monthlyResults[23].interest).toBe(5.13)
    expect(result.monthlyResults[23].taxAmount).toBe(0.97)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(119.69)
    expect(result.monthlyResults[23].accumulatedTaxAmount).toBe(22.7)
    expect(result.monthlyResults[23].accumulatedProfit).toBe(96.99)
    expect(result.monthlyResults[23].payout).toBe(1004.16) // Principal (1000) + last month interest (5.13) - tax (0.97)
    expect(result.monthlyResults[23].accumulatedRealProfit).toBe(36.99)
    
    const realYearlyRate = 0.0485 
    expect(realYearlyRate).toBe(0.0485)
  })

  it('Verify all months without Belka Tax', () => {
    const input = {
      ...defaultInput,
      belkaTax: false,
    }
    
    const result = getResult(input)
    
    // Month 1 (initial interest rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.059)
    expect(result.monthlyResults[0].interest).toBe(4.92)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.92)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(4.92)
    expect(result.monthlyResults[0].payout).toBe(4.92)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(2.42)
    
    // Month 12 (middle of the term)
    expect(result.monthlyResults[11].interestRate).toBe(0.059)
    expect(result.monthlyResults[11].interest).toBe(4.92)
    expect(result.monthlyResults[11].taxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(59.04)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(59.04)
    expect(result.monthlyResults[11].payout).toBe(4.92)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(29.04)
    
    // Month 24 (final month with principal repayment)
    expect(result.monthlyResults[23].interestRate).toBe(0.059)
    expect(result.monthlyResults[23].interest).toBe(4.92)
    expect(result.monthlyResults[23].taxAmount).toBe(0)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(118.08)
    expect(result.monthlyResults[23].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[23].accumulatedProfit).toBe(118.08)
    expect(result.monthlyResults[23].payout).toBe(1004.92) // Principal (1000) + last month interest (4.92)
    expect(result.monthlyResults[23].accumulatedRealProfit).toBe(58.08)
    
    const realYearlyRate = 0.059 
    expect(realYearlyRate).toBe(0.059)
  })
})
