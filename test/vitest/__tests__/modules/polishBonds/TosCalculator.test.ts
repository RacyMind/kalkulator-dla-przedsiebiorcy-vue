import {Result} from 'components/polishBonds/interfaces/Result'
import {TosCalculator} from 'components/polishBonds/logic/TosCalculator'
import {TosInputFields} from 'components/polishBonds/interfaces/TosInputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

describe('Calculator for TOS bonds', () => {
  const defaultInput: TosInputFields = {
    boughtBondCount: 10,
    yearlyInflationRate: 0.03,
    belkaTax: true,
    interestRate: 0.0595, // 5.95% fixed interest rate for TOS bonds (March 2025 emission TOS0328)
  }

  const getResult = (input: TosInputFields): Result => {
    return new TosCalculator().setInputData(input).calculate().getResult()
  }

  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2025, 0, 1)
  })

  it('Verify all months with Belka Tax', () => {
    const input = {
      ...defaultInput,
    }
    
    const result = getResult(input)
    
    // Month 1 (first month)
    expect(result.monthlyResults[0].interestRate).toBe(0.0595)
    expect(result.monthlyResults[0].interest).toBe(4.96)
    expect(result.monthlyResults[0].taxAmount).toBe(0.94)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.96)
    expect(result.monthlyResults[0].payout).toBe(0)
    
    // Month 12 (end of first year)
    expect(result.monthlyResults[11].interestRate).toBe(0.0595)
    expect(result.monthlyResults[11].interest).toBe(4.96)
    expect(result.monthlyResults[11].taxAmount).toBe(0.94)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(59.52)
    expect(result.monthlyResults[11].payout).toBe(0)
    
    // Month 24 (end of second year)
    expect(result.monthlyResults[23].interestRate).toBe(0.0595)
    expect(result.monthlyResults[23].interest).toBe(5.25)
    expect(result.monthlyResults[23].taxAmount).toBe(1)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(122.52)
    expect(result.monthlyResults[23].payout).toBe(0)
    
    // Month 36 (final month with principal repayment)
    expect(result.monthlyResults[35].interestRate).toBe(0.0595)
    expect(result.monthlyResults[35].interest).toBe(5.57)
    expect(result.monthlyResults[35].taxAmount).toBe(1.06)
    expect(result.monthlyResults[35].accumulatedInterest).toBe(189.36)
    expect(result.monthlyResults[35].payout).toBe(1153.36) // Principal (1000) + accumulated profit (153.36)
    
    // Verify total accumulated values
    expect(result.monthlyResults[35].accumulatedTaxAmount).toBe(36) // Total tax paid
    expect(result.monthlyResults[35].accumulatedProfit).toBe(153.36) // Total interest after tax
  })

  it('Verify all months without Belka Tax', () => {
    const input = {
      ...defaultInput,
      belkaTax: false,
    }
    
    const result = getResult(input)
    
    // Month 1 (first month)
    expect(result.monthlyResults[0].interestRate).toBe(0.0595)
    expect(result.monthlyResults[0].interest).toBe(4.96)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.96)
    expect(result.monthlyResults[0].payout).toBe(0)
    
    // Month 12 (end of first year)
    expect(result.monthlyResults[11].interestRate).toBe(0.0595)
    expect(result.monthlyResults[11].interest).toBe(4.96)
    expect(result.monthlyResults[11].taxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(59.52)
    expect(result.monthlyResults[11].payout).toBe(0)
    
    // Month 24 (end of second year)
    expect(result.monthlyResults[23].interestRate).toBe(0.0595)
    expect(result.monthlyResults[23].interest).toBe(5.25)
    expect(result.monthlyResults[23].taxAmount).toBe(0)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(122.52)
    expect(result.monthlyResults[23].payout).toBe(0)
    
    // Month 36 (final month with principal repayment)
    expect(result.monthlyResults[35].interestRate).toBe(0.0595)
    expect(result.monthlyResults[35].interest).toBe(5.57)
    expect(result.monthlyResults[35].taxAmount).toBe(0)
    expect(result.monthlyResults[35].accumulatedInterest).toBe(189.36)
    expect(result.monthlyResults[35].payout).toBe(1189.36) // Principal (1000) + accumulated interest (189.36)
    
    // Verify total accumulated values
    expect(result.monthlyResults[35].accumulatedTaxAmount).toBe(0) // No tax paid
    expect(result.monthlyResults[35].accumulatedProfit).toBe(189.36) // Total interest (no tax)
  })
})
