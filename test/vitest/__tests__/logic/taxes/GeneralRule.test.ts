import {GeneraLRule} from 'src/logic/taxes/GeneraLRule'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useConstants} from 'src/composables/constants'
import {useSettingStore} from 'stores/settingStore'


describe('Income tax using General Rules in 2023', () => {
  const { incomeTaxConstnts} = useConstants()
  let generalRule:GeneraLRule

  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)

    generalRule = new GeneraLRule()
  })

  it('the tax relief limit', () => {
    expect(generalRule.getSalaryAmountOverTaxReliefLimit(incomeTaxConstnts.generalRule.taxReliefLimit, 0, true)).toBe(0)
    expect(generalRule.getSalaryAmountOverTaxReliefLimit(incomeTaxConstnts.generalRule.taxReliefLimit + 0.01, 0, true)).toBe(0.01)

    expect(generalRule.getSalaryAmountOverTaxReliefLimit(0, incomeTaxConstnts.generalRule.taxReliefLimit, true)).toBe(0)
    expect(generalRule.getSalaryAmountOverTaxReliefLimit(0.01, incomeTaxConstnts.generalRule.taxReliefLimit + 0.01, true)).toBe(0.01)
    expect(generalRule.getSalaryAmountOverTaxReliefLimit(0.01, incomeTaxConstnts.generalRule.taxReliefLimit + 100, true)).toBe(0.01)
    expect(generalRule.getSalaryAmountOverTaxReliefLimit(0, incomeTaxConstnts.generalRule.taxReliefLimit + 0.01, true)).toBe(0)

    expect(generalRule.getSalaryAmountOverTaxReliefLimit(incomeTaxConstnts.generalRule.taxReliefLimit, 0, false)).toBe(incomeTaxConstnts.generalRule.taxReliefLimit)
  })

  it('The income tax without the tax free amount', () => {
    expect(generalRule.getIncomeTax(100, 0, 0)).toBe(12)
    expect(generalRule.getIncomeTax(100.1, 0, 0)).toBe(12)
    expect(generalRule.getIncomeTax(100, incomeTaxConstnts.generalRule.taxThreshold - 100, 0)).toBe(12)

    expect(generalRule.getIncomeTax(100, incomeTaxConstnts.generalRule.taxThreshold, 0)).toBe(32)
    expect(generalRule.getIncomeTax(200, incomeTaxConstnts.generalRule.taxThreshold - 100, 0)).toBe(44)
  })

  it('The income tax with the tax free amount', () => {
    expect(generalRule.getIncomeTax(100, 0, 12)).toBe(0)
    expect(generalRule.getIncomeTax(2500, 0, 12)).toBe(0)
    expect(generalRule.getIncomeTax(2600, 0, 12)).toBe(12)
  })
})
