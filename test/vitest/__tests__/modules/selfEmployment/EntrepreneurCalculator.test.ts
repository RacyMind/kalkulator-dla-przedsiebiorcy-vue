import {EntrepreneurCalculator} from 'components/selfEmployment/logic/EntrepreneurCalculator'
import {EntrepreneurTaxSystem, useConstants} from 'src/composables/constants'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {createPinia, setActivePinia} from 'pinia'
import {describe, expect, it} from 'vitest'
import {useSettingStore} from 'stores/settingStore'

describe('Entrepreneur Calculator of Selfemployment on 1.11.2023', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const { incomeTaxConstnts, zusConstants} = useConstants()

  it('The invalid data', () => {
    expect(() => new EntrepreneurCalculator().getResult()).toThrowError('undefined')
    expect(() => new EntrepreneurCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test general rules', () => {
    const input: InputFields = {
      revenue: 10000,
      expenses:0,
      taxSystem: EntrepreneurTaxSystem.GeneralRules,
      monthIndex: 10,
      previousMonthHealthContributionBasis: 10000,
      accidentContributionRate: 0.0167,
      isFpContribution: true,
      isSickContribution: true,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      yearlyIncome: 0,
      hasEmploymentContract: false,
      contributionBasis: zusConstants.entrepreneur.basises.big,
    }

    it('The "big" zus contribution basis"', () => {
      const result = new EntrepreneurCalculator().setInputData(input).calculate().getResult()

      expect(result.healthContribution).toBe(900)
      expect(result.disabilityContribution).toBe(332.88)
      expect(result.pensionContribution).toBe(812.23)
      expect(result.accidentContribution).toBe(69.49)
      expect(result.sickContribution).toBe(101.94)
      expect(result.fpContribution).toBe(41.61)
      expect(result.fsContribution).toBe(60.33)
      expect(result.healthContributionBasis).toBe(8581.52)
      expect(result.taxBasis).toBe(8582)
      expect(result.taxAmount).toBe(1030)
      expect(result.netAmount).toBe(6651.52)
    })
  })
})
