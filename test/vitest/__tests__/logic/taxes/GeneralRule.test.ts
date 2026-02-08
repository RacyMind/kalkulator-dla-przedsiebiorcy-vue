import {TaxScale} from 'src/logic/taxes/TaxScale'
import {createPinia, setActivePinia, storeToRefs} from 'pinia'
import { describe, expect, it } from 'vitest'
import {useConstantsStore} from 'stores/constantsStore'
import {useSettingStore} from 'stores/settingStore'


describe('Income tax using General Rules in 2023', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const taxScale = new TaxScale()

  const { incomeTaxConstants} = storeToRefs(useConstantsStore())

  it('the tax relief limit', () => {
    expect(taxScale.geRevenueOverTaxReliefLimit(incomeTaxConstants.value.taxReliefLimit, 0, true)).toBe(0)
    expect(taxScale.geRevenueOverTaxReliefLimit(incomeTaxConstants.value.taxReliefLimit + 0.01, 0, true)).toBe(0.01)

    expect(taxScale.geRevenueOverTaxReliefLimit(0, incomeTaxConstants.value.taxReliefLimit, true)).toBe(0)
    expect(taxScale.geRevenueOverTaxReliefLimit(0.01, incomeTaxConstants.value.taxReliefLimit + 0.01, true)).toBe(0.01)
    expect(taxScale.geRevenueOverTaxReliefLimit(0.01, incomeTaxConstants.value.taxReliefLimit + 100, true)).toBe(0.01)
    expect(taxScale.geRevenueOverTaxReliefLimit(0, incomeTaxConstants.value.taxReliefLimit + 0.01, true)).toBe(0)

    expect(taxScale.geRevenueOverTaxReliefLimit(incomeTaxConstants.value.taxReliefLimit, 0, false)).toBe(incomeTaxConstants.value.taxReliefLimit)
  })

  it('The income tax without the tax free amount', () => {
    expect(taxScale.getIncomeTax(100, 0, 0)).toBe(12)
    expect(taxScale.getIncomeTax(100.1, 0, 0)).toBe(12)
    expect(taxScale.getIncomeTax(100, incomeTaxConstants.value.taxScale.taxThreshold - 100, 0)).toBe(12)

    expect(taxScale.getIncomeTax(100, incomeTaxConstants.value.taxScale.taxThreshold, 0)).toBe(32)
    expect(taxScale.getIncomeTax(200, incomeTaxConstants.value.taxScale.taxThreshold - 100, 0)).toBe(44)
  })

  it('The income tax with the tax free amount', () => {
    expect(taxScale.getIncomeTax(100, 0, 12)).toBe(0)
    expect(taxScale.getIncomeTax(2500, 0, 12)).toBe(0)
    expect(taxScale.getIncomeTax(2600, 0, 12)).toBe(12)
  })

  it('the tax free amount limit', () => {
    expect(taxScale.getTaxFreeAmount(0, 0)).toBe(0)
    expect(taxScale.getTaxFreeAmount(-5, 0)).toBe(0)
    expect(taxScale.getTaxFreeAmount(10, 0)).toBe(10)
    expect(taxScale.getTaxFreeAmount(3601, 0)).toBe(3600)
    expect(taxScale.getTaxFreeAmount(1, 3600)).toBe(0)
    expect(taxScale.getTaxFreeAmount(700, 3000)).toBe(600)
    expect(taxScale.getTaxFreeAmount(0, 3600)).toBe(0)
  })
})
