import {InputFields} from 'components/unregisteredCompany/interfaces/InputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'
import {UnregisteredCompanyCalculator} from "components/unregisteredCompany/logic/UnregisteredCompanyCalculator"

setActivePinia(createPinia())

describe('Calculator for UnregisteredCompany on 1.01.2024', () => {
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

  it('The invalid data', () => {
    expect(() => new UnregisteredCompanyCalculator().getResult()).toThrowError('undefined')
    expect(() => new UnregisteredCompanyCalculator().calculate().getResult()).toThrowError('undefined')
  })

  it('without the tax free amount', () => {
    const result = new UnregisteredCompanyCalculator().setInputData(getDefaultInput()).calculate().getResult()

    expect(result.revenue).toBe(1000)
    expect(result.expenses).toBe(200)
    expect(result.taxBasis).toBe(800)
    expect(result.taxAmount).toBe(96)
    expect(result.income).toBe(704)
  })

  it('with the tax free amount', () => {
    const result = new UnregisteredCompanyCalculator().setInputData({
      ...getDefaultInput(),
      partTaxReducingAmount: 12,
    }).calculate().getResult()

    expect(result.revenue).toBe(1000)
    expect(result.expenses).toBe(200)
    expect(result.taxBasis).toBe(800)
    expect(result.taxAmount).toBe(0)
    expect(result.income).toBe(800)
  })
})
