import {EntrepreneurTaxSystem, useConstants} from 'src/composables/constants'
import {EntrepreneurZusContribution} from 'src/logic/zus/EntrepreneurZusContribution'
import {createPinia, setActivePinia} from 'pinia'
import {describe, expect, it } from 'vitest'
import {useSettingStore} from 'stores/settingStore'

describe('ZUS contributions for an entrepreneur in 2023.12', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const { zusConstants} = useConstants()
  const entrepreneurZusContribution = new EntrepreneurZusContribution()

  it('the disability contibution', () => {
    expect(entrepreneurZusContribution.geDisabilityContribution(zusConstants.entrepreneur.basises.big)).toBe(332.88)
    expect(entrepreneurZusContribution.geDisabilityContribution(zusConstants.entrepreneur.basises.small())).toBe(86.40)
    expect(entrepreneurZusContribution.geDisabilityContribution(zusConstants.entrepreneur.basises.startRelief)).toBe(0)
  })

  it('the pension contibution', () => {
    expect(entrepreneurZusContribution.gePensionContribution(zusConstants.entrepreneur.basises.big)).toBe(812.23)
    expect(entrepreneurZusContribution.gePensionContribution(zusConstants.entrepreneur.basises.small())).toBe(210.82)
    expect(entrepreneurZusContribution.gePensionContribution(zusConstants.entrepreneur.basises.startRelief)).toBe(0)
  })

  it('the sick contibution', () => {
    expect(entrepreneurZusContribution.getSickContribution(zusConstants.entrepreneur.basises.big)).toBe(101.94)
    expect(entrepreneurZusContribution.getSickContribution(zusConstants.entrepreneur.basises.small())).toBe(26.46)
    expect(entrepreneurZusContribution.getSickContribution(zusConstants.entrepreneur.basises.startRelief)).toBe(0)
  })

  it('the accident contibution', () => {
    expect(entrepreneurZusContribution.getAccidentContribution(zusConstants.entrepreneur.basises.big, 0.0167)).toBe(69.49)
    expect(entrepreneurZusContribution.getAccidentContribution(zusConstants.entrepreneur.basises.small(), 0.0167)).toBe(18.04)
    expect(entrepreneurZusContribution.getAccidentContribution(zusConstants.entrepreneur.basises.startRelief, 0.0167)).toBe(0)
  })

  it('the FP contibution', () => {
    expect(entrepreneurZusContribution.getFPContribution(zusConstants.entrepreneur.basises.big)).toBe(41.61)
    expect(entrepreneurZusContribution.getFPContribution(0)).toBe(0)
  })

  it('the FPGSP contibution', () => {
    expect(entrepreneurZusContribution.getFGSPContribution(zusConstants.entrepreneur.basises.big)).toBe(4.16)
    expect(entrepreneurZusContribution.getFGSPContribution(0)).toBe(0)
  })

  it('the FS contibution', () => {
    expect(entrepreneurZusContribution.getFSContribution(zusConstants.entrepreneur.basises.big)).toBe(60.33)
    expect(entrepreneurZusContribution.getFSContribution(0)).toBe(0)
  })

  describe('the helth contibution', () => {
    it('the general rules', () => {
      expect(entrepreneurZusContribution.getHealthContribution(10000, EntrepreneurTaxSystem.GeneralRules)).toBe(900)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.GeneralRules)).toBe(314.1)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.GeneralRules, 0)).toBe(270.9)
    })

    it('the flat tax', () => {
      expect(entrepreneurZusContribution.getHealthContribution(10000, EntrepreneurTaxSystem.FlatTax)).toBe(490)
      expect(entrepreneurZusContribution.getHealthContribution(6410.10, EntrepreneurTaxSystem.FlatTax)).toBe(314.1)
      expect(entrepreneurZusContribution.getHealthContribution(6510.10, EntrepreneurTaxSystem.FlatTax)).toBe(318.99)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.FlatTax)).toBe(314.1)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.FlatTax, 0)).toBe(270.9)
    })

    it('the lump sum tax', () => {
      expect(entrepreneurZusContribution.getHealthContribution(10000, EntrepreneurTaxSystem.LumpSumTax)).toBe(376.16)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.LumpSumTax, 0, 60000)).toBe(626.93)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.LumpSumTax, 0, 300000)).toBe(1128.48)
    })
  })
})

describe('ZUS contribution basises in 2023', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const { zusConstants} = useConstants()

  it('1.2023', () => {
    expect(zusConstants.entrepreneur.basises.big).toBe(4161)
    expect(zusConstants.entrepreneur.basises.small(0)).toBe(1047)
  })

  it('7.2023', () => {
    expect(zusConstants.entrepreneur.basises.small(6)).toBe(1080)
  })
})

describe('ZUS contribution basises in 2024', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2024,1,1)

  const { zusConstants} = useConstants()

  it('1.2024', () => {
    expect(zusConstants.entrepreneur.basises.big).toBe(4694.40)
    expect(zusConstants.entrepreneur.basises.small(0)).toBe(1272.60)
  })

  it('7.2024', () => {
    expect(zusConstants.entrepreneur.basises.small(6)).toBe(1290)
  })
})
