import {InputFields} from 'components/realBoughtCosts/interfaces/InputFields'
import {RealBoughtCostCalculator} from 'components/realBoughtCosts/logic/RealBoughtCostCalculator'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

describe('Calculator for real bought costs on 1.01.2024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,0,1)
  })

  const getDefaultInput = ():InputFields => {
    return {
      price: 123,
      vatTaxRate: 0.23,
      deductedVatTaxPart: 1,
      incomeTaxRate: 0.12,
    }
  }

  it('The invalid data', () => {
    expect(() => new RealBoughtCostCalculator().getResult()).toThrowError('undefined')
    expect(() => new RealBoughtCostCalculator().calculate().getResult()).toThrowError('undefined')
  })

  it('with the deducted vat and income taxes', () => {
    const result = new RealBoughtCostCalculator().setInputData(getDefaultInput()).calculate().getResult()

    expect(result.price).toBe(123)
    expect(result.vatTaxAmount).toBe(23)
    expect(result.deductedVatTaxAmount).toBe(23)
    expect(result.deductedIncomeTaxAmount).toBe(12)
    expect(result.healthContribution).toBe(9)
    expect(result.savedAmount).toBe(44)
  })

  it('with the deducted vat tax', () => {
    const result = new RealBoughtCostCalculator().setInputData({
      ...getDefaultInput(),
      incomeTaxRate: 0,
    }).calculate().getResult()

    expect(result.price).toBe(123)
    expect(result.vatTaxAmount).toBe(23)
    expect(result.deductedVatTaxAmount).toBe(23)
    expect(result.deductedIncomeTaxAmount).toBe(0)
    expect(result.savedAmount).toBe(23)
  })

  it('with the deducted income tax', () => {
    const result = new RealBoughtCostCalculator().setInputData({
      ...getDefaultInput(),
      deductedVatTaxPart: 0,
      incomeTaxRate: 0.32,
    }).calculate().getResult()

    expect(result.price).toBe(123)
    expect(result.vatTaxAmount).toBe(23)
    expect(result.deductedVatTaxAmount).toBe(0)
    expect(result.deductedIncomeTaxAmount).toBe(32)
    expect(result.healthContribution).toBe(9)
    expect(result.savedAmount).toBe(41)
  })

  it('with the deducted income flat tax', () => {
    const result = new RealBoughtCostCalculator().setInputData({
      ...getDefaultInput(),
      deductedVatTaxPart: 0,
      incomeTaxRate: 0.19,
    }).calculate().getResult()

    expect(result.price).toBe(123)
    expect(result.vatTaxAmount).toBe(23)
    expect(result.deductedVatTaxAmount).toBe(0)
    expect(result.deductedIncomeTaxAmount).toBe(19)
    expect(result.healthContribution).toBe(4.9)
    expect(result.savedAmount).toBe(23.9)
  })
})
