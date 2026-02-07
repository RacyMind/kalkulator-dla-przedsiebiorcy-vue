import {EntrepreneurCalculator} from 'components/accountingWithSpouse/logic/EntrepreneurCalculator'
import {EntrepreneurInputFields} from 'components/accountingWithSpouse/interfaces/EntrepreneurInputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia, storeToRefs} from 'pinia'
import {useConstantsStore} from 'stores/constantsStore'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

describe('Entrepreneur Calculator in the module "Accounting with Spouse" on 1.1.20024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,0,1)
  })

  const getDefaultInput = (revenue:number, expenses: number):EntrepreneurInputFields => {
    const revenues:number[] = []
    const expensesAmounts:number[] = []
    const contributionBasises:number[] = []

    const {  zusConstants} = storeToRefs(useConstantsStore())

    for(let i = 0; i < 12; i++) {
      revenues.push(revenue)
    }
    for(let i = 0; i < 12; i++) {
      expensesAmounts.push(expenses)
    }
    for(let i = 0; i < 12; i++) {
      contributionBasises.push(zusConstants.value.entrepreneur.basises.big)
    }
    return {
      revenues,
      expenses: expensesAmounts,
      isSickContribution: true,
      hasTaxRelief: false,
      accidentContributionRate: 0.0167,
      isFpContribution: true,
      hasEmploymentContract: false,
      previousMonthHealthContributionBasis: 0,
      contributionBasises,
    }
  }

  it('The invalid data', () => {
    expect(() => new EntrepreneurCalculator().getResult()).toThrowError('undefined')
    expect(() => new EntrepreneurCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test ZUS contributions', () => {

    it('The health contribution', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult().healthContribution).toBe(7639.77)
      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000, 1000),
        previousMonthHealthContributionBasis: 5000,
      }).calculate().getResult().healthContribution).toBe(7775.67)
    })

    it('The sick contribution', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult().sickContribution).toBe(1380.12)

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000, 1000),
        isSickContribution: false,
      }).calculate().getResult().sickContribution).toBe(0)
    })

    it('The disability contribution', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult().disabilityContribution).toBe(4506.6)
    })

    it('The pension contribution', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult().pensionContribution).toBe(10996.2)
    })

    it('The accident contribution', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult().accidentContribution).toBe(940.8)

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000, 1000),
        accidentContributionRate: 0,
      }).calculate().getResult().accidentContribution).toBe(0)
    })

    it('The FP and FS contribution', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult().fpAndFsContribution).toBe(1380.12)

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000, 1000),
        isFpContribution: false,
      }).calculate().getResult().fpAndFsContribution).toBe(0)
    })
  })

  describe('Test basis for tax', () => {
    it('Standard cases', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult().taxBasis).toBe(88796)
    })

    it('The tax relief is active', () => {
      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(3000, 0),
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(0)

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000, 0),
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(15268)

    })
  })

  describe('Test the full result', () => {
    it('Within the first tax rate', () => {
      const result  = new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult()

      expect(result.revenue).toBe(120000)
      expect(result.totalContributions).toBe(26843.61)
      expect(result.healthContribution).toBe(7639.77)
      expect(result.disabilityContribution).toBe(4506.6)
      expect(result.pensionContribution).toBe(10996.2)
      expect(result.sickContribution).toBe(1380.12)
      expect(result.accidentContribution).toBe(940.8)
      expect(result.fpAndFsContribution).toBe(1380.12)
      expect(result.taxAmount).toBe(7056)
      expect(result.income).toBe(74100.39)
    })

    it('Within the second tax rate', () => {
      const result  = new EntrepreneurCalculator().setInputData(getDefaultInput(20000, 1000)).calculate().getResult()

      expect(result.revenue).toBe(240000)
      expect(result.totalContributions).toBe(36743.61)
      expect(result.healthContribution).toBe(17539.77)
      expect(result.disabilityContribution).toBe(4506.6)
      expect(result.pensionContribution).toBe(10996.2)
      expect(result.sickContribution).toBe(1380.12)
      expect(result.accidentContribution).toBe(940.8)
      expect(result.fpAndFsContribution).toBe(1380.12)
      expect(result.taxAmount).toBe(39215)
      expect(result.income).toBe(152041.39)
    })

    it('With the employment contract', () => {
      const result  = new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000, 1000),
        hasEmploymentContract: true,
      }).calculate().getResult()

      expect(result.revenue).toBe(120000)
      expect(result.totalContributions).toBe(9224.1)
      expect(result.healthContribution).toBe(9224.1)
      expect(result.disabilityContribution).toBe(0)
      expect(result.pensionContribution).toBe(0)
      expect(result.sickContribution).toBe(0)
      expect(result.accidentContribution).toBe(0)
      expect(result.fpAndFsContribution).toBe(0)
      expect(result.taxAmount).toBe(9360)
      expect(result.income).toBe(89415.9)
    })

    it('with the tax relief', () => {
      const result  = new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000, 1000),
        hasTaxRelief: true,
      }).calculate().getResult()

      expect(result.revenue).toBe(120000)
      expect(result.totalContributions).toBe(26843.61)
      expect(result.healthContribution).toBe(7639.77)
      expect(result.disabilityContribution).toBe(4506.6)
      expect(result.pensionContribution).toBe(10996.2)
      expect(result.sickContribution).toBe(1380.12)
      expect(result.accidentContribution).toBe(940.8)
      expect(result.fpAndFsContribution).toBe(1380.12)
      expect(result.taxAmount).toBe(0)
      expect(result.income).toBe(81156.39)
    })
  })
})
