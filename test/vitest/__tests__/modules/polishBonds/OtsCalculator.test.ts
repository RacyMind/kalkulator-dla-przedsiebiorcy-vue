import {OtsCalculator} from 'components/polishBonds/logic/OtsCalculator'
import {OtsInputFields} from 'components/polishBonds/interfaces/OtsInputFields'
import {Result} from 'components/polishBonds/interfaces/Result'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

const defaultInput: OtsInputFields = {
  boughtBondCount: 10,
  belkaTax: true,
  yearlyInflationRate: 0.03,
  interestRate: 0.03,
}

const getResult = (input: OtsInputFields): Result => {
  return new OtsCalculator().setInputData(input).calculate().getResult()
}

describe('Calculator for OTS bonds on 1.01.2025', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2025, 0, 1)
  })

  it('The invalid data', () => {
    expect(() => new OtsCalculator().getResult()).toThrowError('undefined')
    expect(() => new OtsCalculator().calculate().getResult()).toThrowError('undefined')
  })

  it('Default input values', () => {
    const result = getResult(defaultInput)

    expect(result.monthlyResults.length).toBe(3)

    // First month
    expect(result.monthlyResults[0].interestRate).toBe(0.03)
    expect(result.monthlyResults[0].interest).toBe(2.5) // 1000 * 0.03 / 12
    expect(result.monthlyResults[0].accumulatedInterest).toBe(2.5)
    expect(result.monthlyResults[0].taxAmount).toBe(0.48) // 2.5 * 0.19
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0.48)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(2.02) // 2.5 - 0.48
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(-0.48) // 2.02 - 2.5
    expect(result.monthlyResults[0].payout).toBe(0)

    // Last month (third month)
    expect(result.monthlyResults[2].interestRate).toBe(0.03)
    expect(result.monthlyResults[2].interest).toBe(2.5)
    expect(result.monthlyResults[2].accumulatedInterest).toBe(7.5) // 2.5 * 3
    expect(result.monthlyResults[2].taxAmount).toBe(0.48)
    expect(result.monthlyResults[2].accumulatedTaxAmount).toBe(1.44) // 0.48 * 3
    expect(result.monthlyResults[2].accumulatedProfit).toBe(6.06) // 7.5 - 1.44
    expect(result.monthlyResults[2].accumulatedRealProfit).toBe(-1.44) // 6.06 - 7.5
    expect(result.monthlyResults[2].payout).toBe(1006.06) // 1000 + 6.06
  })

  it('Without belka tax', () => {
    const result = getResult({
      ...defaultInput,
      belkaTax: false,
    })

    expect(result.monthlyResults.length).toBe(3)

    // First month
    expect(result.monthlyResults[0].taxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(2.5) // 2.5 - 0
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(0) // 2.5 - 2.5

    // Last month (third month)
    expect(result.monthlyResults[2].taxAmount).toBe(0)
    expect(result.monthlyResults[2].accumulatedTaxAmount).toBe(0)
    expect(result.monthlyResults[2].accumulatedProfit).toBe(7.5) // 7.5 - 0
    expect(result.monthlyResults[2].accumulatedRealProfit).toBe(0) // 7.5 - 7.5
    expect(result.monthlyResults[2].payout).toBe(1007.5) // 1000 + 7.5
  })

  it('Different interest rate', () => {
    const result = getResult({
      ...defaultInput,
      interestRate: 0.05,
    })

    expect(result.monthlyResults.length).toBe(3)

    // First month
    expect(result.monthlyResults[0].interestRate).toBe(0.05)
    expect(result.monthlyResults[0].interest).toBe(4.17) // 1000 * 0.05 / 12
    expect(result.monthlyResults[0].accumulatedInterest).toBe(4.17)
    expect(result.monthlyResults[0].taxAmount).toBe(0.79) // 4.17 * 0.19
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0.79)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(3.38) // 4.17 - 0.79
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(0.88) // 3.38 - 2.5

    // Last month (third month)
    expect(result.monthlyResults[2].interestRate).toBe(0.05)
    expect(result.monthlyResults[2].interest).toBe(4.17)
    expect(result.monthlyResults[2].accumulatedInterest).toBe(12.51) // 4.17 * 3
    expect(result.monthlyResults[2].taxAmount).toBe(0.79)
    expect(result.monthlyResults[2].accumulatedTaxAmount).toBe(2.37) // 0.79 * 3
    expect(result.monthlyResults[2].accumulatedProfit).toBe(10.14) // 12.51 - 2.37
    expect(result.monthlyResults[2].accumulatedRealProfit).toBe(2.64) // 10.14 - 7.5
    expect(result.monthlyResults[2].payout).toBe(1010.14) // 1000 + 10.14
  })

  it('Different bond count', () => {
    const result = getResult({
      ...defaultInput,
      boughtBondCount: 20,
    })

    expect(result.monthlyResults.length).toBe(3)

    // First month
    expect(result.monthlyResults[0].interest).toBe(5) // 2000 * 0.03 / 12
    expect(result.monthlyResults[0].accumulatedInterest).toBe(5)
    expect(result.monthlyResults[0].taxAmount).toBe(0.95) // 5 * 0.19
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0.95)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(4.05) // 5 - 0.95
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(-0.95) // 4.05 - 5

    // Last month (third month)
    expect(result.monthlyResults[2].interest).toBe(5)
    expect(result.monthlyResults[2].accumulatedInterest).toBe(15) // 5 * 3
    expect(result.monthlyResults[2].taxAmount).toBe(0.95)
    expect(result.monthlyResults[2].accumulatedTaxAmount).toBe(2.85) // 0.95 * 3
    expect(result.monthlyResults[2].accumulatedProfit).toBe(12.15) // 15 - 2.85
    expect(result.monthlyResults[2].accumulatedRealProfit).toBe(-2.85) // 12.15 - 15
    expect(result.monthlyResults[2].payout).toBe(2012.15) // 2000 + 12.15
  })

  it('Different inflation rate', () => {
    const result = getResult({
      ...defaultInput,
      yearlyInflationRate: 0.05,
    })

    expect(result.monthlyResults.length).toBe(3)

    // First month
    expect(result.monthlyResults[0].interest).toBe(2.5) // 1000 * 0.03 / 12
    expect(result.monthlyResults[0].accumulatedInterest).toBe(2.5)
    expect(result.monthlyResults[0].taxAmount).toBe(0.48) // 2.5 * 0.19
    expect(result.monthlyResults[0].accumulatedTaxAmount).toBe(0.48)
    expect(result.monthlyResults[0].accumulatedProfit).toBe(2.02) // 2.5 - 0.48
    expect(result.monthlyResults[0].accumulatedRealProfit).toBe(-2.15) // 2.02 - 4.17

    // Last month (third month)
    expect(result.monthlyResults[2].interest).toBe(2.5)
    expect(result.monthlyResults[2].accumulatedInterest).toBe(7.5) // 2.5 * 3
    expect(result.monthlyResults[2].taxAmount).toBe(0.48)
    expect(result.monthlyResults[2].accumulatedTaxAmount).toBe(1.44) // 0.48 * 3
    expect(result.monthlyResults[2].accumulatedProfit).toBe(6.06) // 7.5 - 1.44
    expect(result.monthlyResults[2].accumulatedRealProfit).toBe(-6.45) // 6.06 - 12.51
    expect(result.monthlyResults[2].payout).toBe(1006.06) // 1000 + 6.06
  })
})
