import {EntrepreneurTaxSystem, useConstants} from 'src/composables/constants'
import {EntrepreneurZusContribution} from 'src/logic/zus/EntrepreneurZusContribution'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

describe('ZUS contributions for an entrepreneur in 2023.12', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)
  })


  it('the disability contibution', () => {
    const { zusConstants} = useConstants()
    const entrepreneurZusContribution = new EntrepreneurZusContribution()

    expect(entrepreneurZusContribution.geDisabilityContribution(zusConstants.value.entrepreneur.basises.big)).toBe(332.88)
    expect(entrepreneurZusContribution.geDisabilityContribution(zusConstants.value.entrepreneur.basises.small())).toBe(86.40)
    expect(entrepreneurZusContribution.geDisabilityContribution(zusConstants.value.entrepreneur.basises.startRelief)).toBe(0)
  })

  it('the pension contibution', () => {
    const { zusConstants} = useConstants()
    const entrepreneurZusContribution = new EntrepreneurZusContribution()

    expect(entrepreneurZusContribution.gePensionContribution(zusConstants.value.entrepreneur.basises.big)).toBe(812.23)
    expect(entrepreneurZusContribution.gePensionContribution(zusConstants.value.entrepreneur.basises.small())).toBe(210.82)
    expect(entrepreneurZusContribution.gePensionContribution(zusConstants.value.entrepreneur.basises.startRelief)).toBe(0)
  })

  it('the sick contibution', () => {
    const { zusConstants} = useConstants()
    const entrepreneurZusContribution = new EntrepreneurZusContribution()

    expect(entrepreneurZusContribution.getSickContribution(zusConstants.value.entrepreneur.basises.big)).toBe(101.94)
    expect(entrepreneurZusContribution.getSickContribution(zusConstants.value.entrepreneur.basises.small())).toBe(26.46)
    expect(entrepreneurZusContribution.getSickContribution(zusConstants.value.entrepreneur.basises.startRelief)).toBe(0)
  })

  it('the accident contibution', () => {
    const { zusConstants} = useConstants()
    const entrepreneurZusContribution = new EntrepreneurZusContribution()

    expect(entrepreneurZusContribution.getAccidentContribution(zusConstants.value.entrepreneur.basises.big, 0.0167)).toBe(69.49)
    expect(entrepreneurZusContribution.getAccidentContribution(zusConstants.value.entrepreneur.basises.small(), 0.0167)).toBe(18.04)
    expect(entrepreneurZusContribution.getAccidentContribution(zusConstants.value.entrepreneur.basises.startRelief, 0.0167)).toBe(0)
  })

  it('the FP contibution', () => {
    const { zusConstants} = useConstants()
    const entrepreneurZusContribution = new EntrepreneurZusContribution()

    expect(entrepreneurZusContribution.getFPContribution(zusConstants.value.entrepreneur.basises.big)).toBe(41.61)
    expect(entrepreneurZusContribution.getFPContribution(0)).toBe(0)
  })

  it('the FPGSP contibution', () => {
    const { zusConstants} = useConstants()
    const entrepreneurZusContribution = new EntrepreneurZusContribution()

    expect(entrepreneurZusContribution.getFGSPContribution(zusConstants.value.entrepreneur.basises.big)).toBe(4.16)
    expect(entrepreneurZusContribution.getFGSPContribution(0)).toBe(0)
  })

  it('the FS contibution', () => {
    const { zusConstants} = useConstants()
    const entrepreneurZusContribution = new EntrepreneurZusContribution()

    expect(entrepreneurZusContribution.getFSContribution(zusConstants.value.entrepreneur.basises.big)).toBe(60.33)
    expect(entrepreneurZusContribution.getFSContribution(0)).toBe(0)
  })

  describe('the helth contibution', () => {
    it('the tax scales', () => {
      const entrepreneurZusContribution = new EntrepreneurZusContribution()

      expect(entrepreneurZusContribution.getHealthContribution(10000, EntrepreneurTaxSystem.TaxScale)).toBe(900)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.TaxScale)).toBe(314.1)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.TaxScale, 0)).toBe(270.9)
    })

    it('the flat tax', () => {
      const entrepreneurZusContribution = new EntrepreneurZusContribution()

      expect(entrepreneurZusContribution.getHealthContribution(10000, EntrepreneurTaxSystem.FlatTax)).toBe(490)
      expect(entrepreneurZusContribution.getHealthContribution(6410.10, EntrepreneurTaxSystem.FlatTax)).toBe(314.1)
      expect(entrepreneurZusContribution.getHealthContribution(6510.10, EntrepreneurTaxSystem.FlatTax)).toBe(318.99)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.FlatTax)).toBe(314.1)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.FlatTax, 0)).toBe(270.9)
    })

    it('the lump sum tax', () => {
      const entrepreneurZusContribution = new EntrepreneurZusContribution()

      expect(entrepreneurZusContribution.getHealthContribution(10000, EntrepreneurTaxSystem.LumpSumTax)).toBe(376.16)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.LumpSumTax, 0, 60001)).toBe(626.93)
      expect(entrepreneurZusContribution.getHealthContribution(1000, EntrepreneurTaxSystem.LumpSumTax, 0, 300001)).toBe(1128.48)
    })
  })

  describe('the deductible helth contibution', () => {
    it('the tax scales', () => {
      const entrepreneurZusContribution = new EntrepreneurZusContribution()

      expect(entrepreneurZusContribution.getDeductibleHealthContribution(100, EntrepreneurTaxSystem.TaxScale)).toBe(0)
    })

    it('the flat tax', () => {
      const { incomeTaxConstnts} = useConstants()
      const entrepreneurZusContribution = new EntrepreneurZusContribution()

      expect(incomeTaxConstnts.value.flatTax.deductibleHealthContributionLimit).toBe(10200)
      expect(entrepreneurZusContribution.getDeductibleHealthContribution(100, EntrepreneurTaxSystem.FlatTax)).toBe(100)
      expect(entrepreneurZusContribution.getDeductibleHealthContribution(100, EntrepreneurTaxSystem.FlatTax, incomeTaxConstnts.value.flatTax.deductibleHealthContributionLimit)).toBe(0)
      expect(entrepreneurZusContribution.getDeductibleHealthContribution(200, EntrepreneurTaxSystem.FlatTax, incomeTaxConstnts.value.flatTax.deductibleHealthContributionLimit - 100)).toBe(100)
    })

    it('the lump sum tax', () => {
      const entrepreneurZusContribution = new EntrepreneurZusContribution()

      expect(entrepreneurZusContribution.getDeductibleHealthContribution(100, EntrepreneurTaxSystem.LumpSumTax)).toBe(50)
    })
  })
})

describe('ZUS contribution basises in 2023', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)
  })

  it('1.2023', () => {
    const { zusConstants} = useConstants()

    expect(zusConstants.value.entrepreneur.basises.big).toBe(4161)
    expect(zusConstants.value.entrepreneur.basises.small(0)).toBe(1047)
  })

  it('7.2023', () => {
    const { zusConstants} = useConstants()

    expect(zusConstants.value.entrepreneur.basises.small(6)).toBe(1080)
  })
})

describe('ZUS contribution basises in 2024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,1,1)
  })

  it('1.2024', () => {
    const { zusConstants} = useConstants()
    expect(zusConstants.value.entrepreneur.basises.big).toBe(4694.40)
    expect(zusConstants.value.entrepreneur.basises.small(0)).toBe(1272.60)
  })

  it('7.2024', () => {
    const { zusConstants} = useConstants()
    expect(zusConstants.value.entrepreneur.basises.small(6)).toBe(1290)
  })
})

describe('the deductible helth contibution in 2024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,1,1)
  })

  it('the flat tax', () => {
    const { incomeTaxConstnts} = useConstants()
    const entrepreneurZusContribution = new EntrepreneurZusContribution()

    expect(incomeTaxConstnts.value.flatTax.deductibleHealthContributionLimit).toBe(11600)
    expect(entrepreneurZusContribution.getDeductibleHealthContribution(100, EntrepreneurTaxSystem.FlatTax)).toBe(100)
    expect(entrepreneurZusContribution.getDeductibleHealthContribution(100, EntrepreneurTaxSystem.FlatTax, incomeTaxConstnts.value.flatTax.deductibleHealthContributionLimit)).toBe(0)
    expect(entrepreneurZusContribution.getDeductibleHealthContribution(200, EntrepreneurTaxSystem.FlatTax, incomeTaxConstnts.value.flatTax.deductibleHealthContributionLimit - 100)).toBe(100)
  })
})
