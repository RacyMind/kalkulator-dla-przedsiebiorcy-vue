import {ContractWorkCalculator} from 'components/contractWork/logic/ContractWorkCalculator'
import {InputFields} from 'components/contractWork/interfaces/InputFields'
import {Result} from 'components/contractWork/interfaces/Result'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

const defaultInput:InputFields = {
  grossAmount: 1000,
  expenseRate: 0.2,
  canLumpSumTaxBe: true,
}

const getResult = (input:InputFields):Result => {
  return new ContractWorkCalculator().setInputData(input).calculate().getResult()
}

describe('Calculator for ContractWork on 1.01.2024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,0,1)
  })

  it('The invalid data', () => {
    expect(() => new ContractWorkCalculator().getResult()).toThrowError('undefined')
    expect(() => new ContractWorkCalculator().calculate().getResult()).toThrowError('undefined')
  })

  it('20% expenses', () => {
    const result = getResult(defaultInput)

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(200)
    expect(result.taxBasis).toBe(800)
    expect(result.taxAmount).toBe(96)
    expect(result.netAmount).toBe(904)
  })

  it('50% expenses', () => {
    const result = getResult({
      ...defaultInput,
      expenseRate: 0.5,
    })

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(500)
    expect(result.taxBasis).toBe(500)
    expect(result.taxAmount).toBe(60)
    expect(result.netAmount).toBe(940)
  })

  it('Gross amount - 200, 20% expenses', () => {
    const result = getResult({
      ...defaultInput,
      grossAmount: 200,
    })

    expect(result.grossAmount).toBe(200)
    expect(result.expenses).toBe(0)
    expect(result.taxBasis).toBe(200)
    expect(result.taxAmount).toBe(24)
    expect(result.netAmount).toBe(176)
  })

  it('Gross amount - 300 000, 50% expenses', () => {
    const result = getResult({
      ...defaultInput,
      grossAmount: 300000,
      expenseRate: 0.5,
    })

    expect(result.grossAmount).toBe(300000)
    expect(result.expenses).toBe(120000)
    expect(result.taxBasis).toBe(180000)
    expect(result.taxAmount).toBe(33600)
    expect(result.netAmount).toBe(266400)
  })
})
