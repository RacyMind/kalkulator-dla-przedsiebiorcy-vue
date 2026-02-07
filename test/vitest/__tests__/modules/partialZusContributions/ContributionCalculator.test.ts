import {ContributionCalculator} from 'components/partialZusContributions/logic/ContributionCalculator'
import {InputFields} from 'components/partialZusContributions/interfaces/InputFields'
import {createPinia, setActivePinia, storeToRefs} from 'pinia'
import { describe, expect, it } from 'vitest'
import {useConstantsStore} from 'stores/constantsStore'
import {useSettingStore} from 'stores/settingStore'

describe('The partial zus contribution basises', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)
  const { zusConstants } = storeToRefs(useConstantsStore())

  const input: InputFields = {
    contributionBasis: zusConstants.value.entrepreneur.basises.big,
    accidentContributionRate: 0.0167,
    daysOfRunningBusiness: 31,
    monthIndex: 0,
    isFpContribution: true,
    isSickContribution: true,
  }

  it('The invalid data', () => {
    expect(() => new ContributionCalculator().getResult()).toThrowError('undefined')
    expect(() => new ContributionCalculator().calculate().getResult()).toThrowError('undefined')
  })

  it('The full month', () => {
    const result = new ContributionCalculator().setInputData(input).calculate().getResult()

    expect(result.contributionBasis).toBe(zusConstants.value.entrepreneur.basises.big)
    expect(result.pensionContribution).toBe(812.23)
    expect(result.disabilityContribution).toBe(332.88)
    expect(result.accidentContribution).toBe(69.49)
    expect(result.sickContribution).toBe(101.94)
    expect(result.fpAndFsContribution).toBe(101.94)
  })

  it('0 days', () => {
    const result = new ContributionCalculator().setInputData({
      ...input,
      daysOfRunningBusiness: 0,
    }).calculate().getResult()

    expect(result.contributionBasis).toBe(0)
    expect(result.pensionContribution).toBe(0)
    expect(result.disabilityContribution).toBe(0)
    expect(result.accidentContribution).toBe(0)
    expect(result.sickContribution).toBe(0)
    expect(result.fpAndFsContribution).toBe(0)
  })

  it('15 days', () => {
    const result = new ContributionCalculator().setInputData({
      ...input,
      daysOfRunningBusiness: 15,
    }).calculate().getResult()

    expect(result.contributionBasis).toBe(2013.39)
    expect(result.pensionContribution).toBe(393.01)
    expect(result.disabilityContribution).toBe(161.07)
    expect(result.accidentContribution).toBe(33.62)
    expect(result.sickContribution).toBe(49.33)
    expect(result.fpAndFsContribution).toBe(49.33)
  })
})
