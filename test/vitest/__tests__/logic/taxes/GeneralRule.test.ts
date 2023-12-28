import {TaxScale} from 'src/logic/taxes/TaxScale'
import {createPinia, setActivePinia} from 'pinia'
import { describe, expect, it } from 'vitest'
import {useConstants} from 'src/composables/constants'
import {useSettingStore} from 'stores/settingStore'


describe('Income tax using General Rules in 2023', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const taxScale = new TaxScale()

  const { incomeTaxConstnts} = useConstants()

  it('the tax relief limit', () => {
    expect(taxScale.geRevenueOverTaxReliefLimit(incomeTaxConstnts.taxReliefLimit, 0, true)).toBe(0)
    expect(taxScale.geRevenueOverTaxReliefLimit(incomeTaxConstnts.taxReliefLimit + 0.01, 0, true)).toBe(0.01)

    expect(taxScale.geRevenueOverTaxReliefLimit(0, incomeTaxConstnts.taxReliefLimit, true)).toBe(0)
    expect(taxScale.geRevenueOverTaxReliefLimit(0.01, incomeTaxConstnts.taxReliefLimit + 0.01, true)).toBe(0.01)
    expect(taxScale.geRevenueOverTaxReliefLimit(0.01, incomeTaxConstnts.taxReliefLimit + 100, true)).toBe(0.01)
    expect(taxScale.geRevenueOverTaxReliefLimit(0, incomeTaxConstnts.taxReliefLimit + 0.01, true)).toBe(0)

    expect(taxScale.geRevenueOverTaxReliefLimit(incomeTaxConstnts.taxReliefLimit, 0, false)).toBe(incomeTaxConstnts.taxReliefLimit)
  })

  it('The income tax without the tax free amount', () => {
    expect(taxScale.getIncomeTax(100, 0, 0)).toBe(12)
    expect(taxScale.getIncomeTax(100.1, 0, 0)).toBe(12)
    expect(taxScale.getIncomeTax(100, incomeTaxConstnts.taxScale.taxThreshold - 100, 0)).toBe(12)

    expect(taxScale.getIncomeTax(100, incomeTaxConstnts.taxScale.taxThreshold, 0)).toBe(32)
    expect(taxScale.getIncomeTax(200, incomeTaxConstnts.taxScale.taxThreshold - 100, 0)).toBe(44)
  })

  it('The income tax with the tax free amount', () => {
    expect(taxScale.getIncomeTax(100, 0, 12)).toBe(0)
    expect(taxScale.getIncomeTax(2500, 0, 12)).toBe(0)
    expect(taxScale.getIncomeTax(2600, 0, 12)).toBe(12)
  })
})
