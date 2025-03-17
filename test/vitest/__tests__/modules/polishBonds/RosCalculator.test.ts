import {Result} from 'components/polishBonds/interfaces/Result'
import {RosCalculator} from 'components/polishBonds/logic/RosCalculator'
import {RosInputFields} from 'components/polishBonds/interfaces/RosInputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

describe('Calculator for ROS bonds', () => {
  const defaultInput: RosInputFields = {
    boughtBondCount: 10,
    yearlyInflationRate: 0.03,
    belkaTax: true,
    initialInterestRate: 0.065, // 6.5% (March 2025 emission)
  }

  const getResult = (input: RosInputFields): Result => {
    return new RosCalculator().setInputData(input).calculate().getResult()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2025, 0, 1)
  })

  it('should calculate first year with Belka tax', () => {
    const result = getResult(defaultInput)
    
    // First month
    expect(result.monthlyResults[0].interestRate).toBe(0.065)
    expect(result.monthlyResults[0].interest).toBe(5.42)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(5.42)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(5.42)
    expect(result.monthlyResults[0].payout).toBe(0)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(2.92)
    
    // Month 12
    expect(result.monthlyResults[11].interestRate).toBe(0.065)
    expect(result.monthlyResults[11].interest).toBe(5.42)
    expect(result.monthlyResults[11].taxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(65.04)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(65.04)
    expect(result.monthlyResults[11].payout).toBe(0)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(35.04)
  })

  it('should calculate second year with Belka tax', () => {
    const result = getResult(defaultInput)
    
    // Month 13 (first month of second year)
    expect(result.monthlyResults[12].interestRate).toBe(0.05)
    expect(result.monthlyResults[12].interest).toBe(4.44)
    expect(result.monthlyResults[12].taxAmount).toBe(0)
    expect(result.monthlyResults[12].accumulatedInterest).toBe(69.48)
    expect(result.monthlyResults[12].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[12].accumulatedProfit).toBe(69.48)
    expect(result.monthlyResults[12].payout).toBe(0)
    expect(result.monthlyResults[12].accumulatedRealProfit).toBe(36.98)
    
    // Month 24 (end of second year)
    expect(result.monthlyResults[23].interestRate).toBe(0.05)
    expect(result.monthlyResults[23].interest).toBe(4.44)
    expect(result.monthlyResults[23].taxAmount).toBe(0)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(118.32)
    expect(result.monthlyResults[23].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[23].accumulatedProfit).toBe(118.32)
    expect(result.monthlyResults[23].payout).toBe(0)
    expect(result.monthlyResults[23].accumulatedRealProfit).toBe(58.32)
  })

  it('should calculate final month with Belka tax', () => {
    const result = getResult(defaultInput)
    
    // Month 72 (final month)
    expect(result.monthlyResults[71].interestRate).toBe(0.05)
    expect(result.monthlyResults[71].interest).toBe(5.39)
    expect(result.monthlyResults[71].taxAmount).toBe(68.26)
    expect(result.monthlyResults[71].accumulatedInterest).toBe(359.28)
    expect(result.monthlyResults[71].accumulatedTaxAmount).toBe(68.26)
    expect(result.monthlyResults[71].accumulatedProfit).toBe(291.02)
    expect(result.monthlyResults[71].payout).toBe(1291.02)
    expect(result.monthlyResults[71].accumulatedRealProfit).toBe(111.02)
  })

  it('should calculate final month without Belka tax', () => {
    const result = getResult({
      ...defaultInput,
      belkaTax: false,
    })
    
    // Month 72 (final month)
    expect(result.monthlyResults[71].interestRate).toBe(0.05)
    expect(result.monthlyResults[71].interest).toBe(5.39)
    expect(result.monthlyResults[71].taxAmount).toBe(0)
    expect(result.monthlyResults[71].accumulatedInterest).toBe(359.28)
    expect(result.monthlyResults[71].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[71].accumulatedProfit).toBe(359.28)
    expect(result.monthlyResults[71].payout).toBe(1359.28)
    expect(result.monthlyResults[71].accumulatedRealProfit).toBe(179.28)
  })

  it('should calculate with negative inflation rate', () => {
    const result = getResult({
      ...defaultInput,
      yearlyInflationRate: -0.02,
    })
    
    // Month 72 (final month)
    expect(result.monthlyResults[71].interestRate).toBe(0.02)
    expect(result.monthlyResults[71].interest).toBe(1.92)
    expect(result.monthlyResults[71].taxAmount).toBe(33.42)
    expect(result.monthlyResults[71].accumulatedInterest).toBe(175.92)
    expect(result.monthlyResults[71].accumulatedTaxAmount).toBe(33.42)
    expect(result.monthlyResults[71].accumulatedProfit).toBe(142.5)
    expect(result.monthlyResults[71].payout).toBe(1142.5)
    expect(result.monthlyResults[71].accumulatedRealProfit).toBe(262.5)
    
    // Since inflation is negative, real profit should be higher than nominal profit
    expect(result.monthlyResults[71].accumulatedRealProfit).toBeGreaterThan(result.monthlyResults[71].accumulatedProfit)
  })

  it('should calculate with zero inflation rate', () => {
    const result = getResult({
      ...defaultInput,
      yearlyInflationRate: 0,
    })
    
    // Month 72 (final month)
    expect(result.monthlyResults[71].interestRate).toBe(0.02)
    expect(result.monthlyResults[71].interest).toBe(1.92)
    expect(result.monthlyResults[71].taxAmount).toBe(33.42)
    expect(result.monthlyResults[71].accumulatedInterest).toBe(175.92)
    expect(result.monthlyResults[71].accumulatedTaxAmount).toBe(33.42)
    expect(result.monthlyResults[71].accumulatedProfit).toBe(142.5)
    expect(result.monthlyResults[71].payout).toBe(1142.5)
    expect(result.monthlyResults[71].accumulatedRealProfit).toBe(142.5)
    
    // Since inflation is zero, real profit should equal nominal profit
    expect(result.monthlyResults[71].accumulatedRealProfit).toBe(result.monthlyResults[71].accumulatedProfit)
  })
})
