import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useB2BComparatorStore} from 'components/b2bComparator/store'
import {useConstants} from 'src/composables/constants'
import {useSettingStore} from 'stores/settingStore'

import {InputFields} from 'components/b2bComparator/interfaces/InputFields'
import {LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'

const createMonthlyInput = (input: InputFields): InputFields[] => {
  const monthly: InputFields[] = []
  for (let i = 0; i < 12; i++) {
    monthly.push({...input})
  }
  return monthly
}

describe('B2B Comparator store in 2026', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(new Date().getFullYear(), 0, 1)
  })

  it('returns undefined results when monthlyInputFields is undefined', () => {
    const store = useB2BComparatorStore()
    store.monthlyInputFields = undefined

    expect(store.taxScaleResult).toBe(undefined)
    expect(store.flatTaxResult).toBe(undefined)
    expect(store.lumpSUmTaxResult).toBe(undefined)
  })

  it('calculates results for all tax systems', () => {
    const store = useB2BComparatorStore()
    const {zusConstants} = useConstants()

    store.monthlyInputFields = createMonthlyInput({
      revenue: 10000,
      expenses: 0,
      contributionBasis: zusConstants.value.entrepreneur.basises.big,
      isFpContribution: true,
      isSickContribution: true,
      hasEmploymentContract: false,
      accidentContributionRate: 0.0167,
      hasTaxRelief: false,
      hasTaxFreeAmount: true,
      lumpSumTaxRate: 0.02 as LumpSumTaxRate,
      previousMonthHealthContributionBasis: 0,
    })

    expect(store.taxScaleResult?.monthlyResults.length).toBe(12)
    expect(store.flatTaxResult?.monthlyResults.length).toBe(12)
    expect(store.lumpSUmTaxResult?.monthlyResults.length).toBe(12)

    expect(store.taxScaleResult?.annualResult).toEqual({
      revenue: 120000,
      expenses: 0,
      income: 80543.43,
      taxBasis: 96876,
      taxAmount: 8028,
      healthContribution: 8307.45,
      disabilityContribution: 5425.92,
      pensionContribution: 13239.24,
      sickContribution: 1661.64,
      accidentContribution: 1132.68,
      fpAndFsContribution: 1661.64,
    })

    expect(store.flatTaxResult?.annualResult).toEqual({
      revenue: 120000,
      expenses: 0,
      income: 74359.98,
      taxBasis: 91809,
      taxAmount: 17446,
      healthContribution: 5072.9,
      disabilityContribution: 5425.92,
      pensionContribution: 13239.24,
      sickContribution: 1661.64,
      accidentContribution: 1132.68,
      fpAndFsContribution: 1661.64,
    })

    expect(store.lumpSUmTaxResult?.annualResult).toEqual({
      revenue: 120000,
      expenses: 0,
      income: 85039.92,
      taxBasis: 93552,
      taxAmount: 1872,
      healthContribution: 9966.96,
      disabilityContribution: 5425.92,
      pensionContribution: 13239.24,
      sickContribution: 1661.64,
      accidentContribution: 1132.68,
      fpAndFsContribution: 1661.64,
    })
  })
})
