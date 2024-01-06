import {
  AnnualUnregisteredCompanyCalculator,
} from 'components/unregisteredCompany/logic/AnnualUnregisteredCompanyCalculator'
import {InputFields} from 'components/unregisteredCompany/interfaces/InputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

describe('Annual Calculator for UnregisteredCompany on 1.01.2024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,0,1)
  })

  const getDefaultInput = ():InputFields => {
    return {
      revenue: 1000,
      expenses:200,
      partTaxReducingAmount: 0,
    }
  }

  const annualInput = (monthlyInput:InputFields):InputFields[] => {
    const input:InputFields[] = []

    for(let i = 0; i < 12; i++) {
      input.push(monthlyInput)
    }

    return input
  }

  it('The invalid data', () => {
    expect(() => new AnnualUnregisteredCompanyCalculator().getResult()).toThrowError('undefined')
    expect(() => new AnnualUnregisteredCompanyCalculator().calculate().getResult()).toThrowError('undefined')
  })

  it('without the tax free amount', () => {
    const result = new AnnualUnregisteredCompanyCalculator().setInputData(annualInput(getDefaultInput())).calculate().getResult().annualResult

    expect(result.revenue).toBe(12000)
    expect(result.expenses).toBe(2400)
    expect(result.taxBasis).toBe(9600)
    expect(result.taxAmount).toBe(1152)
    expect(result.income).toBe(8448)
  })

  it('with the tax free amount', () => {
    const result = new AnnualUnregisteredCompanyCalculator().setInputData(annualInput({
      ...getDefaultInput(),
      partTaxReducingAmount: 12,
    })).calculate().getResult().annualResult

    expect(result.revenue).toBe(12000)
    expect(result.expenses).toBe(2400)
    expect(result.taxBasis).toBe(9600)
    expect(result.taxAmount).toBe(0)
    expect(result.income).toBe(9600)
  })
})
