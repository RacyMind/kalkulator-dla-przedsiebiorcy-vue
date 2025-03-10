import {EdoCalculator} from 'components/polishBonds/logic/EdoCalculator'
import {EdoInputFields} from 'components/polishBonds/interfaces/EdoInputFields'
import {Result} from 'components/polishBonds/interfaces/Result'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

describe('Calculator for EDO bonds', () => {
  const defaultInput: EdoInputFields = {
    boughtBondCount: 10,
    yearlyInflationRate: 0.03,
    belkaTax: true,
    initialInterestRate: 0.0655, // 6.55% for the first year (March 2025 emission EDO0335)
  }

  const getResult = (input: EdoInputFields): Result => {
    return new EdoCalculator().setInputData(input).calculate().getResult()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2025, 0, 1)
  })

  it('Verify all years with Belka tax', () => {
    const input = {
      ...defaultInput,
    }
    
    const result = getResult(input)
    
    // Month 1 (first month of first year - fixed rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.0655)
    expect(result.monthlyResults[0].interest).toBe(5.46)
    expect(result.monthlyResults[0].taxAmount).toBe(1.04)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(5.46)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(1.04)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(4.42)
    expect(result.monthlyResults[0].payout).toBe(0)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(1.92)
    
    // Month 12 (end of first year - fixed rate)
    expect(result.monthlyResults[11].interestRate).toBe(0.0655)
    expect(result.monthlyResults[11].interest).toBe(5.46)
    expect(result.monthlyResults[11].taxAmount).toBe(1.04)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(65.52)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(12.48)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(53.04)
    expect(result.monthlyResults[11].payout).toBe(0)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(23.04)
    
    // Month 13 (first month of second year - inflation + margin)
    expect(result.monthlyResults[12].interestRate).toBe(0.05)
    expect(result.monthlyResults[12].interest).toBe(4.39)
    expect(result.monthlyResults[12].taxAmount).toBe(0.83)
    expect(result.monthlyResults[12].accumulatedInterest).toBe(69.91)
    expect(result.monthlyResults[12].accumulatedTaxAmount).toBe(13.31)
    expect(result.monthlyResults[12].accumulatedProfit).toBe(56.6)
    expect(result.monthlyResults[12].payout).toBe(0)
    expect(result.monthlyResults[12].accumulatedRealProfit).toBe(24.1)
    
    // Month 24 (end of second year - inflation + margin)
    expect(result.monthlyResults[23].interestRate).toBe(0.05)
    expect(result.monthlyResults[23].interest).toBe(4.39)
    expect(result.monthlyResults[23].taxAmount).toBe(0.83)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(118.2)
    expect(result.monthlyResults[23].accumulatedTaxAmount).toBe(22.44)
    expect(result.monthlyResults[23].accumulatedProfit).toBe(95.76)
    expect(result.monthlyResults[23].payout).toBe(0)
    expect(result.monthlyResults[23].accumulatedRealProfit).toBe(35.76)
    
    // Month 60 (end of fifth year)
    expect(result.monthlyResults[59].interestRate).toBe(0.05)
    expect(result.monthlyResults[59].interest).toBe(4.94)
    expect(result.monthlyResults[59].taxAmount).toBe(0.94)
    expect(result.monthlyResults[59].accumulatedInterest).toBe(289.32)
    expect(result.monthlyResults[59].accumulatedTaxAmount).toBe(54.96)
    expect(result.monthlyResults[59].accumulatedProfit).toBe(234.36)
    expect(result.monthlyResults[59].payout).toBe(0)
    expect(result.monthlyResults[59].accumulatedRealProfit).toBe(84.36)
    
    // Month 120 (final month with principal repayment)
    expect(result.monthlyResults[119].interestRate).toBe(0.05)
    expect(result.monthlyResults[119].interest).toBe(6.03)
    expect(result.monthlyResults[119].taxAmount).toBe(1.15)
    expect(result.monthlyResults[119].accumulatedInterest).toBe(623.88)
    expect(result.monthlyResults[119].accumulatedTaxAmount).toBe(118.68)
    expect(result.monthlyResults[119].accumulatedProfit).toBe(505.2)
    expect(result.monthlyResults[119].payout).toBe(1451.52)
    expect(result.monthlyResults[119].accumulatedRealProfit).toBe(205.2)
  })

  it('Verify all years without Belka Tax', () => {
    const input = {
      ...defaultInput,
      belkaTax: false,
    }
    
    const result = getResult(input)
    
    // Month 1 (first month of first year - fixed rate)
    expect(result.monthlyResults[0].interestRate).toBe(0.0655)
    expect(result.monthlyResults[0].interest).toBe(5.46)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(5.46)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(5.46)
    expect(result.monthlyResults[0].payout).toBe(0)
    
    // Month 120 (final month with principal repayment)
    expect(result.monthlyResults[119].interestRate).toBe(0.05)
    expect(result.monthlyResults[119].interest).toBe(6.56)
    expect(result.monthlyResults[119].taxAmount).toBe(0)
    expect(result.monthlyResults[119].accumulatedInterest).toBe(653.04)
    expect(result.monthlyResults[119].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[119].accumulatedProfit).toBe(653.04)
    expect(result.monthlyResults[119].payout).toBe(1580.88)
    expect(result.monthlyResults[119].accumulatedRealProfit).toBe(353.04)
  })
})
