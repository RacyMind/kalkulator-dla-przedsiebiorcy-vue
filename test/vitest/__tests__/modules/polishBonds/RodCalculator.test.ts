import {Result} from 'components/polishBonds/interfaces/Result'
import {RodCalculator} from 'components/polishBonds/logic/RodCalculator'
import {RodInputFields} from 'components/polishBonds/interfaces/RodInputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

describe('Calculator for ROD bonds', () => {
  const defaultInput: RodInputFields = {
    boughtBondCount: 10,
    yearlyInflationRate: 0.03,
    belkaTax: true,
    initialInterestRate: 0.068, // 6.8% (March 2025 emission)
  }

  const getResult = (input: RodInputFields): Result => {
    return new RodCalculator().setInputData(input).calculate().getResult()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2025, 0, 1)
  })

  it('should calculate first year with Belka tax', () => {
    const result = getResult(defaultInput)
    
    // First month
    expect(result.monthlyResults[0].interestRate).toBe(0.068)
    expect(result.monthlyResults[0].interest).toBe(5.67)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(5.67)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(5.67)
    expect(result.monthlyResults[0].payout).toBe(0)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(3.17)
    
    // Month 12
    expect(result.monthlyResults[11].interestRate).toBe(0.068)
    expect(result.monthlyResults[11].interest).toBe(5.67)
    expect(result.monthlyResults[11].taxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(68.04)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(68.04)
    expect(result.monthlyResults[11].payout).toBe(0)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(38.04)
  })

  it('should calculate second year with Belka tax', () => {
    const result = getResult(defaultInput)
    
    // Month 13 (first month of second year)
    expect(result.monthlyResults[12].interestRate).toBe(0.055)
    expect(result.monthlyResults[12].interest).toBe(4.9)
    expect(result.monthlyResults[12].taxAmount).toBe(0)
    expect(result.monthlyResults[12].accumulatedInterest).toBe(72.94)
    expect(result.monthlyResults[12].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[12].accumulatedProfit).toBe(72.94)
    expect(result.monthlyResults[12].payout).toBe(0)
    expect(result.monthlyResults[12].accumulatedRealProfit).toBe(40.44)
    
    // Month 24 (end of second year)
    expect(result.monthlyResults[23].interestRate).toBe(0.055)
    expect(result.monthlyResults[23].interest).toBe(4.9)
    expect(result.monthlyResults[23].taxAmount).toBe(0)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(126.84)
    expect(result.monthlyResults[23].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[23].accumulatedProfit).toBe(126.84)
    expect(result.monthlyResults[23].payout).toBe(0)
    expect(result.monthlyResults[23].accumulatedRealProfit).toBe(66.84)
  })

  it('should calculate final month with Belka tax', () => {
    const result = getResult(defaultInput)
    
    // Month 144 (final month)
    expect(result.monthlyResults[143].interestRate).toBe(0.055)
    expect(result.monthlyResults[143].interest).toBe(8.36)
    expect(result.monthlyResults[143].taxAmount).toBe(175.7)
    expect(result.monthlyResults[143].accumulatedInterest).toBe(924.72)
    expect(result.monthlyResults[143].accumulatedTaxAmount).toBe(175.7)
    expect(result.monthlyResults[143].accumulatedProfit).toBe(749.02)
    expect(result.monthlyResults[143].payout).toBe(1749.02)
    expect(result.monthlyResults[143].accumulatedRealProfit).toBe(389.02)
  })

  it('should calculate final month without Belka tax', () => {
    const result = getResult({
      ...defaultInput,
      belkaTax: false,
    })
    
    // Month 144 (final month)
    expect(result.monthlyResults[143].interestRate).toBe(0.055)
    expect(result.monthlyResults[143].interest).toBe(8.36)
    expect(result.monthlyResults[143].taxAmount).toBe(0)
    expect(result.monthlyResults[143].accumulatedInterest).toBe(924.72)
    expect(result.monthlyResults[143].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[143].accumulatedProfit).toBe(924.72)
    expect(result.monthlyResults[143].payout).toBe(1924.72)
    expect(result.monthlyResults[143].accumulatedRealProfit).toBe(564.72)
  })

  it('should calculate with negative inflation rate', () => {
    const result = getResult({
      ...defaultInput,
      yearlyInflationRate: -0.02,
    })
    
    // Month 144 (final month)
    expect(result.monthlyResults[143].interestRate).toBe(0.025)
    expect(result.monthlyResults[143].interest).toBe(2.85)
    expect(result.monthlyResults[143].taxAmount).toBe(76.31)
    expect(result.monthlyResults[143].accumulatedInterest).toBe(401.64)
    expect(result.monthlyResults[143].accumulatedTaxAmount).toBe(76.31)
    expect(result.monthlyResults[143].accumulatedProfit).toBe(325.33)
    expect(result.monthlyResults[143].payout).toBe(1325.33)
    expect(result.monthlyResults[143].accumulatedRealProfit).toBe(565.33)
    
    // Since inflation is negative, real profit should be higher than nominal profit
    expect(result.monthlyResults[143].accumulatedRealProfit).toBeGreaterThan(result.monthlyResults[143].accumulatedProfit)
  })

  it('should calculate with zero inflation rate', () => {
    const result = getResult({
      ...defaultInput,
      yearlyInflationRate: 0,
    })
    
    // Month 144 (final month)
    expect(result.monthlyResults[143].interestRate).toBe(0.025)
    expect(result.monthlyResults[143].interest).toBe(2.85)
    expect(result.monthlyResults[143].taxAmount).toBe(76.31)
    expect(result.monthlyResults[143].accumulatedInterest).toBe(401.64)
    expect(result.monthlyResults[143].accumulatedTaxAmount).toBe(76.31)
    expect(result.monthlyResults[143].accumulatedProfit).toBe(325.33)
    expect(result.monthlyResults[143].payout).toBe(1325.33)
    expect(result.monthlyResults[143].accumulatedRealProfit).toBe(325.33)
    
    // Since inflation is zero, real profit should be higher than nominal profit
    expect(result.monthlyResults[143].accumulatedRealProfit).toBe(result.monthlyResults[143].accumulatedProfit)
  })
})
