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
    initialInterestRate: 0.0515,
  }

  const getResult = (input: RodInputFields): Result => {
    return new RodCalculator().setInputData(input).calculate().getResult()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('Should return 144 monthly results for ROD bonds', () => {
    const result = getResult(defaultInput)
    expect(result.monthlyResults.length).toBe(144)
  })

  it('Verify all years with Belka tax', () => {
    const input = {
      ...defaultInput,
    }
    
    const result = getResult(input)
    
    // Month 1 (first month of first year - fixed rate 5.15%)
    expect(result.monthlyResults[0].interestRate).toBe(0.0515)
    expect(result.monthlyResults[0].interest).toBe(4.29)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.29)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(4.29)
    expect(result.monthlyResults[0].payout).toBe(0)
    
    // Month 12 (end of first year - fixed rate)
    expect(result.monthlyResults[11].interestRate).toBe(0.0515)
    expect(result.monthlyResults[11].interest).toBe(4.29)
    expect(result.monthlyResults[11].taxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(51.48)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(51.48)
    expect(result.monthlyResults[11].payout).toBe(0)
    
    // Month 13 (first month of second year - inflation 3% + margin 1.75% = 4.75%)
    expect(result.monthlyResults[12].interestRate).toBe(0.0475)
    expect(result.monthlyResults[12].interest).toBe(4.16)
    expect(result.monthlyResults[12].taxAmount).toBe(0)
    expect(result.monthlyResults[12].accumulatedInterest).toBe(55.64)
    expect(result.monthlyResults[12].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[12].accumulatedProfit).toBe(55.64)
    expect(result.monthlyResults[12].payout).toBe(0)
    
    // Month 144 (final month with principal repayment and tax application)
    expect(result.monthlyResults[143].interestRate).toBe(0.0475)
    expect(result.monthlyResults[143].taxAmount).toBeGreaterThan(0)
    expect(result.monthlyResults[143].payout).toBeGreaterThan(1000)
  })

  it('Verify all years without Belka Tax', () => {
    const input = {
      ...defaultInput,
      belkaTax: false,
    }
    
    const result = getResult(input)
    
    // Month 1
    expect(result.monthlyResults[0].interestRate).toBe(0.0515)
    expect(result.monthlyResults[0].interest).toBe(4.29)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    
    // Month 144 (final month - no tax)
    expect(result.monthlyResults[143].taxAmount).toBe(0)
    expect(result.monthlyResults[143].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[143].payout).toBeGreaterThan(1000)
  })

  it('Verify handling of negative inflation rate', () => {
    const input = {
      ...defaultInput,
      yearlyInflationRate: -0.02,
    }
    
    const result = getResult(input)
    
    // Month 1 (first year - fixed rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.0515)
    
    // Month 13 (second year - should use max(0, -0.02) + 0.0175 = 0.0175)
    expect(result.monthlyResults[12].interestRate).toBe(0.0175)
    
    // With negative inflation, real profit should be higher than nominal profit
    expect(result.monthlyResults[143].accumulatedRealProfit).toBeGreaterThan(result.monthlyResults[143].accumulatedProfit)
  })

  it('Verify handling of zero inflation rate', () => {
    const input = {
      ...defaultInput,
      yearlyInflationRate: 0,
    }
    
    const result = getResult(input)
    
    // Month 13 (second year - should use 0 + margin = 0.0175)
    expect(result.monthlyResults[12].interestRate).toBe(0.0175)
    
    // With zero inflation, real profit should equal nominal profit
    expect(result.monthlyResults[143].accumulatedRealProfit).toBe(result.monthlyResults[143].accumulatedProfit)
  })

  it('ROD result length should be 144 months (12 years)', () => {
    const result = getResult(defaultInput)
    expect(result.monthlyResults.length).toBe(144)
  })
})
