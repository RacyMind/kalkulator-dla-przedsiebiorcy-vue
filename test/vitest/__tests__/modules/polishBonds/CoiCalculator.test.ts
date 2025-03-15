import {CoiCalculator} from 'components/polishBonds/logic/CoiCalculator'
import {CoiInputFields} from 'components/polishBonds/interfaces/CoiInputFields'
import {Result} from 'components/polishBonds/interfaces/Result'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

describe('Calculator for COI bonds', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2025, 0, 1)
  })

  const defaultInput: CoiInputFields = {
    boughtBondCount: 10,
    yearlyInflationRate: 0.03,
    belkaTax: true,
    initialInterestRate: 0.0655, // 6.55% initial interest rate for COI bonds (July 2025 emission COI0728)
  }

  const getResult = (input: CoiInputFields): Result => {
    return new CoiCalculator().setInputData(input).calculate().getResult()
  }

  it('Verify all years with Belka Tax', () => {
    const input = {
      ...defaultInput,
      belkaTax: true,
    }

    const result = getResult(input)
    
    // Verify first month (month 0)
    expect(result.monthlyResults[0].interestRate).toBe(0.0655)
    expect(result.monthlyResults[0].interest).toBe(5.46)
    expect(result.monthlyResults[0].payout).toBe(0)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(5.46)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(4.42)
    expect(result.monthlyResults[0].taxAmount).toBe(1.04)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(1.04)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(1.92)

    // Verify middle of first year (month 5)
    expect(result.monthlyResults[5].interestRate).toBe(0.0655)
    expect(result.monthlyResults[5].interest).toBe(5.46)
    expect(result.monthlyResults[5].payout).toBe(0)
    expect(result.monthlyResults[5].accumulatedInterest).toBe(32.76)
    expect(result.monthlyResults[5].accumulatedProfit).toBe(26.52)
    expect(result.monthlyResults[5].taxAmount).toBe(1.04)
    expect(result.monthlyResults[5].accumulatedTaxAmount).toBe(6.24)
    expect(result.monthlyResults[5].accumulatedRealProfit).toBe(11.52)

    // Verify first year (month 11)
    expect(result.monthlyResults[11].interestRate).toBe(0.0655)
    expect(result.monthlyResults[11].interest).toBe(5.46)
    expect(result.monthlyResults[11].payout).toBe(53.04)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(65.52)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(53.04)
    expect(result.monthlyResults[11].taxAmount).toBe(1.04)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(12.48)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(23.04)

    // Verify middle of second year (month 17)
    expect(result.monthlyResults[17].interestRate).toBe(0.045)
    expect(result.monthlyResults[17].interest).toBe(3.75)
    expect(result.monthlyResults[17].payout).toBe(0)
    expect(result.monthlyResults[17].accumulatedInterest).toBe(88.02)
    expect(result.monthlyResults[17].accumulatedProfit).toBe(71.28)
    expect(result.monthlyResults[17].taxAmount).toBe(0.71)
    expect(result.monthlyResults[17].accumulatedTaxAmount).toBe(16.74)
    expect(result.monthlyResults[17].accumulatedRealProfit).toBe(26.28)

    // Verify second year (month 23)
    expect(result.monthlyResults[23].interestRate).toBe(0.045)
    expect(result.monthlyResults[23].interest).toBe(3.75)
    expect(result.monthlyResults[23].payout).toBe(36.48)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(110.52)
    expect(result.monthlyResults[23].accumulatedProfit).toBe(89.52)
    expect(result.monthlyResults[23].taxAmount).toBe(0.71)
    expect(result.monthlyResults[23].accumulatedTaxAmount).toBe(21)
    expect(result.monthlyResults[23].accumulatedRealProfit).toBe(29.52)

    // Verify middle of third year (month 29)
    expect(result.monthlyResults[29].interestRate).toBe(0.045)
    expect(result.monthlyResults[29].interest).toBe(3.75)
    expect(result.monthlyResults[29].payout).toBe(0)
    expect(result.monthlyResults[29].accumulatedInterest).toBe(133.02)
    expect(result.monthlyResults[29].accumulatedProfit).toBe(107.76)
    expect(result.monthlyResults[29].taxAmount).toBe(0.71)
    expect(result.monthlyResults[29].accumulatedTaxAmount).toBe(25.26)
    expect(result.monthlyResults[29].accumulatedRealProfit).toBe(32.76)

    // Verify third year (month 35)
    expect(result.monthlyResults[35].interestRate).toBe(0.045)
    expect(result.monthlyResults[35].interest).toBe(3.75)
    expect(result.monthlyResults[35].payout).toBe(36.48)
    expect(result.monthlyResults[35].accumulatedInterest).toBe(155.52)
    expect(result.monthlyResults[35].accumulatedProfit).toBe(126)
    expect(result.monthlyResults[35].taxAmount).toBe(0.71)
    expect(result.monthlyResults[35].accumulatedTaxAmount).toBe(29.52)
    expect(result.monthlyResults[35].accumulatedRealProfit).toBe(36)

    // Verify middle of fourth year (month 41)
    expect(result.monthlyResults[41].interestRate).toBe(0.045)
    expect(result.monthlyResults[41].interest).toBe(3.75)
    expect(result.monthlyResults[41].payout).toBe(0)
    expect(result.monthlyResults[41].accumulatedInterest).toBe(178.02)
    expect(result.monthlyResults[41].accumulatedProfit).toBe(144.24)
    expect(result.monthlyResults[41].taxAmount).toBe(0.71)
    expect(result.monthlyResults[41].accumulatedTaxAmount).toBe(33.78)
    expect(result.monthlyResults[41].accumulatedRealProfit).toBe(39.24)

    // Verify fourth year (month 47)
    expect(result.monthlyResults[47].interestRate).toBe(0.045)
    expect(result.monthlyResults[47].interest).toBe(3.75)
    expect(result.monthlyResults[47].payout).toBe(1036.48)
    expect(result.monthlyResults[47].accumulatedInterest).toBe(200.52)
    expect(result.monthlyResults[47].accumulatedProfit).toBe(162.48)
    expect(result.monthlyResults[47].taxAmount).toBe(0.71)
    expect(result.monthlyResults[47].accumulatedTaxAmount).toBe(38.04)
    expect(result.monthlyResults[47].accumulatedRealProfit).toBe(42.48)
  })

  it('Verify all years without Belka Tax', () => {
    const input = {
      ...defaultInput,
      belkaTax: false,
    }

    const result = getResult(input)

    // Verify first month (month 0)
    expect(result.monthlyResults[0].interestRate).toBe(0.0655)
    expect(result.monthlyResults[0].interest).toBe(5.46)
    expect(result.monthlyResults[0].payout).toBe(0)
    expect(result.monthlyResults[0].accumulatedInterest).toBe(5.46)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(5.46)
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(2.96)

    // Verify middle of first year (month 5)
    expect(result.monthlyResults[5].interestRate).toBe(0.0655)
    expect(result.monthlyResults[5].interest).toBe(5.46)
    expect(result.monthlyResults[5].payout).toBe(0)
    expect(result.monthlyResults[5].accumulatedInterest).toBe(32.76)
    expect(result.monthlyResults[5].accumulatedProfit).toBe(32.76)
    expect(result.monthlyResults[5].taxAmount).toBe(0)
    expect(result.monthlyResults[5].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[5].accumulatedRealProfit).toBe(17.76)

    // Verify first year (month 11)
    expect(result.monthlyResults[11].interestRate).toBe(0.0655)
    expect(result.monthlyResults[11].interest).toBe(5.46)
    expect(result.monthlyResults[11].payout).toBe(65.52)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(65.52)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(65.52)
    expect(result.monthlyResults[11].taxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(35.52)

    // Verify middle of second year (month 17)
    expect(result.monthlyResults[17].interestRate).toBe(0.045)
    expect(result.monthlyResults[17].interest).toBe(3.75)
    expect(result.monthlyResults[17].payout).toBe(0)
    expect(result.monthlyResults[17].accumulatedInterest).toBe(88.02)
    expect(result.monthlyResults[17].accumulatedProfit).toBe(88.02)
    expect(result.monthlyResults[17].taxAmount).toBe(0)
    expect(result.monthlyResults[17].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[17].accumulatedRealProfit).toBe(43.02)

    // Verify second year (month 23)
    expect(result.monthlyResults[23].interestRate).toBe(0.045)
    expect(result.monthlyResults[23].interest).toBe(3.75)
    expect(result.monthlyResults[23].payout).toBe(45)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(110.52)
    expect(result.monthlyResults[23].accumulatedProfit).toBe(110.52)
    expect(result.monthlyResults[23].taxAmount).toBe(0)
    expect(result.monthlyResults[23].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[23].accumulatedRealProfit).toBe(50.52)

    // Verify middle of third year (month 29)
    expect(result.monthlyResults[29].interestRate).toBe(0.045)
    expect(result.monthlyResults[29].interest).toBe(3.75)
    expect(result.monthlyResults[29].payout).toBe(0)
    expect(result.monthlyResults[29].accumulatedInterest).toBe(133.02)
    expect(result.monthlyResults[29].accumulatedProfit).toBe(133.02)
    expect(result.monthlyResults[29].taxAmount).toBe(0)
    expect(result.monthlyResults[29].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[29].accumulatedRealProfit).toBe(58.02)

    // Verify third year (month 35)
    expect(result.monthlyResults[35].interestRate).toBe(0.045)
    expect(result.monthlyResults[35].interest).toBe(3.75)
    expect(result.monthlyResults[35].payout).toBe(45)
    expect(result.monthlyResults[35].accumulatedInterest).toBe(155.52)
    expect(result.monthlyResults[35].accumulatedProfit).toBe(155.52)
    expect(result.monthlyResults[35].taxAmount).toBe(0)
    expect(result.monthlyResults[35].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[35].accumulatedRealProfit).toBe(65.52)

    // Verify middle of fourth year (month 41)
    expect(result.monthlyResults[41].interestRate).toBe(0.045)
    expect(result.monthlyResults[41].interest).toBe(3.75)
    expect(result.monthlyResults[41].payout).toBe(0)
    expect(result.monthlyResults[41].accumulatedInterest).toBe(178.02)
    expect(result.monthlyResults[41].accumulatedProfit).toBe(178.02)
    expect(result.monthlyResults[41].taxAmount).toBe(0)
    expect(result.monthlyResults[41].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[41].accumulatedRealProfit).toBe(73.02)

    // Verify fourth year (month 47)
    expect(result.monthlyResults[47].interestRate).toBe(0.045)
    expect(result.monthlyResults[47].interest).toBe(3.75)
    expect(result.monthlyResults[47].payout).toBe(1045)
    expect(result.monthlyResults[47].accumulatedInterest).toBe(200.52)
    expect(result.monthlyResults[47].accumulatedProfit).toBe(200.52)
    expect(result.monthlyResults[47].taxAmount).toBe(0)
    expect(result.monthlyResults[47].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[47].accumulatedRealProfit).toBe(80.52)
  })

  it('Verify handling of negative inflation rate', () => {
    const input = {
      ...defaultInput,
      yearlyInflationRate: -0.02, // Negative inflation rate
      belkaTax: true,
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
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(6.09)
    
    // Month 12 (end of first year - fixed rate)
    expect(result.monthlyResults[11].interestRate).toBe(0.0655)
    expect(result.monthlyResults[11].interest).toBe(5.46)
    expect(result.monthlyResults[11].taxAmount).toBe(1.04)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(65.52)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(12.48)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(53.04)
    expect(result.monthlyResults[11].payout).toBe(53.04)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(73.08)
    
    // Month 13 (first month of second year - should use 0 inflation + margin)
    expect(result.monthlyResults[12].interestRate).toBe(0.015)
    expect(result.monthlyResults[12].interest).toBe(1.25)
    expect(result.monthlyResults[12].taxAmount).toBe(0.24)
    expect(result.monthlyResults[12].accumulatedInterest).toBe(66.77)
    expect(result.monthlyResults[12].accumulatedTaxAmount).toBe(12.72)
    expect(result.monthlyResults[12].accumulatedProfit).toBe(54.05)
    expect(result.monthlyResults[12].payout).toBe(0)
    expect(result.monthlyResults[12].accumulatedRealProfit).toBe(75.76)
    
    // Month 24 (end of second year - should use 0 inflation + margin)
    expect(result.monthlyResults[23].interestRate).toBe(0.015)
    expect(result.monthlyResults[23].interest).toBe(1.25)
    expect(result.monthlyResults[23].taxAmount).toBe(0.24)
    expect(result.monthlyResults[23].accumulatedInterest).toBe(80.52)
    expect(result.monthlyResults[23].accumulatedTaxAmount).toBe(15.36)
    expect(result.monthlyResults[23].accumulatedProfit).toBe(65.16)
    expect(result.monthlyResults[23].payout).toBe(12.12)
    expect(result.monthlyResults[23].accumulatedRealProfit).toBe(105.24)
    
    // Month 36 (end of third year - should use 0 inflation + margin)
    expect(result.monthlyResults[35].interestRate).toBe(0.015)
    expect(result.monthlyResults[35].interest).toBe(1.25)
    expect(result.monthlyResults[35].taxAmount).toBe(0.24)
    expect(result.monthlyResults[35].accumulatedInterest).toBe(95.52)
    expect(result.monthlyResults[35].accumulatedTaxAmount).toBe(18.24)
    expect(result.monthlyResults[35].accumulatedProfit).toBe(77.28)
    expect(result.monthlyResults[35].payout).toBe(12.12)
    expect(result.monthlyResults[35].accumulatedRealProfit).toBe(137.4)
    
    // Month 48 (final month with principal repayment)
    expect(result.monthlyResults[47].interestRate).toBe(0.015)
    expect(result.monthlyResults[47].interest).toBe(1.25)
    expect(result.monthlyResults[47].taxAmount).toBe(0.24)
    expect(result.monthlyResults[47].accumulatedInterest).toBe(110.52)
    expect(result.monthlyResults[47].accumulatedTaxAmount).toBe(21.12)
    expect(result.monthlyResults[47].accumulatedProfit).toBe(89.4)
    expect(result.monthlyResults[47].payout).toBe(1012.12)
    expect(result.monthlyResults[47].accumulatedRealProfit).toBe(169.56)
    
    // Since inflation is negative, real profit should be higher than nominal profit
    expect(result.monthlyResults[47].accumulatedRealProfit).toBeGreaterThan(result.monthlyResults[47].accumulatedProfit)
  })

  it('Verify handling of zero inflation rate', () => {
    const input = {
      ...defaultInput,
      yearlyInflationRate: 0, // Zero inflation rate
      belkaTax: true,
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
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(4.42)
    
    // Month 12 (end of first year - fixed rate)
    expect(result.monthlyResults[11].interestRate).toBe(0.0655)
    expect(result.monthlyResults[11].interest).toBe(5.46)
    expect(result.monthlyResults[11].taxAmount).toBe(1.04)
    expect(result.monthlyResults[11].accumulatedInterest).toBe(65.52)
    expect(result.monthlyResults[11].accumulatedTaxAmount).toBe(12.48)
    expect(result.monthlyResults[11].accumulatedProfit).toBe(53.04)
    expect(result.monthlyResults[11].payout).toBe(53.04)
    expect(result.monthlyResults[11].accumulatedRealProfit).toBe(53.04)
    
    // Month 13 (first month of second year - should use 0 inflation + margin)
    expect(result.monthlyResults[12].interestRate).toBe(0.015)
    expect(result.monthlyResults[12].interest).toBe(1.25)
    expect(result.monthlyResults[12].taxAmount).toBe(0.24)
    expect(result.monthlyResults[12].accumulatedInterest).toBe(66.77)
    expect(result.monthlyResults[12].accumulatedTaxAmount).toBe(12.72)
    expect(result.monthlyResults[12].accumulatedProfit).toBe(54.05)
    expect(result.monthlyResults[12].payout).toBe(0)
    expect(result.monthlyResults[12].accumulatedRealProfit).toBe(54.05)
    
    // Month 48 (final month with principal repayment)
    expect(result.monthlyResults[47].interestRate).toBe(0.015)
    expect(result.monthlyResults[47].interest).toBe(1.25)
    expect(result.monthlyResults[47].taxAmount).toBe(0.24)
    expect(result.monthlyResults[47].accumulatedInterest).toBe(110.52)
    expect(result.monthlyResults[47].accumulatedTaxAmount).toBe(21.12)
    expect(result.monthlyResults[47].accumulatedProfit).toBe(89.4)
    expect(result.monthlyResults[47].payout).toBe(1012.12)
    expect(result.monthlyResults[47].accumulatedRealProfit).toBe(89.4)
    
    // With zero inflation, real profit should equal nominal profit
    expect(result.monthlyResults[47].accumulatedRealProfit).toBe(result.monthlyResults[47].accumulatedProfit)
  })
})
