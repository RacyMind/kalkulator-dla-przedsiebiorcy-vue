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
    initialInterestRate: 0.052,
  }

  const getResult = (input: RosInputFields): Result => {
    return new RosCalculator().setInputData(input).calculate().getResult()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('Should return 72 monthly results for ROS bonds', () => {
    const result = getResult(defaultInput)
    expect(result.monthlyResults.length).toBe(72)
  })

  it('Verify all years with Belka tax', () => {
    const input = {
      ...defaultInput,
    }
    
    const result = getResult(input)
    
    // Month 1 (first month of first year - fixed rate 5.2%)
    expect(result.monthlyResults[0].interestRate).toBe(0.052)
    expect(result.monthlyResults[0].interest).toBe(4.33)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.33)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(4.33)
    expect(result.monthlyResults[0].payout).toBe(0)
    
    // Month 12 (end of first year - fixed rate)
    expect(result.monthlyResults[11].interestRate).toBe(0.052)
    expect(result.monthlyResults[11].interest).toBe(4.33)
    expect(result.monthlyResults[11].taxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(51.96)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(51.96)
    expect(result.monthlyResults[11].payout).toBe(0)
    
    // Month 13 (first month of second year - inflation 3% + margin 2% = 5%)
    expect(result.monthlyResults[12].interestRate).toBe(0.05)
    expect(result.monthlyResults[12].interest).toBe(4.38)
    expect(result.monthlyResults[12].taxAmount).toBe(0)
    expect(result.monthlyResults[12].accumulatedInterest).toBe(56.34)
    expect(result.monthlyResults[12].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[12].accumulatedProfit).toBe(56.34)
    expect(result.monthlyResults[12].payout).toBe(0)
    
    // Month 72 (final month with principal repayment and tax application)
    expect(result.monthlyResults[71].interestRate).toBe(0.05)
    expect(result.monthlyResults[71].taxAmount).toBeGreaterThan(0)
    expect(result.monthlyResults[71].payout).toBeGreaterThan(1000)
  })

  it('Verify all years without Belka Tax', () => {
    const input = {
      ...defaultInput,
      belkaTax: false,
    }
    
    const result = getResult(input)
    
    // Month 1
    expect(result.monthlyResults[0].interestRate).toBe(0.052)
    expect(result.monthlyResults[0].interest).toBe(4.33)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    
    // Month 72 (final month - no tax)
    expect(result.monthlyResults[71].taxAmount).toBe(0)
    expect(result.monthlyResults[71].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[71].payout).toBeGreaterThan(1000)
  })

  it('Verify handling of negative inflation rate', () => {
    const input = {
      ...defaultInput,
      yearlyInflationRate: -0.02,
    }
    
    const result = getResult(input)
    
    // Month 1 (first year - fixed rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.052)
    
    // Month 13 (second year - should use max(0, -0.02) + 0.02 = 0.02)
    expect(result.monthlyResults[12].interestRate).toBe(0.02)
    
    // With negative inflation, real profit should be higher than nominal profit
    expect(result.monthlyResults[71].accumulatedRealProfit).toBeGreaterThan(result.monthlyResults[71].accumulatedProfit)
  })

  it('Verify handling of zero inflation rate', () => {
    const input = {
      ...defaultInput,
      yearlyInflationRate: 0,
    }
    
    const result = getResult(input)
    
    // Month 13 (second year - should use 0 + margin = 0.02)
    expect(result.monthlyResults[12].interestRate).toBe(0.02)
    
    // With zero inflation, real profit should equal nominal profit
    expect(result.monthlyResults[71].accumulatedRealProfit).toBe(result.monthlyResults[71].accumulatedProfit)
  })

  it('ROS result length should be 72 months (6 years)', () => {
    const result = getResult(defaultInput)
    expect(result.monthlyResults.length).toBe(72)
  })
})
