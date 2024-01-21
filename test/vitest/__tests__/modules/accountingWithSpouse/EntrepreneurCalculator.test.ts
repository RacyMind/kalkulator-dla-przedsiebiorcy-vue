import {EntrepreneurCalculator} from 'components/accountingWithSpouse/logic/EntrepreneurCalculator'
import {EntrepreneurInputFields} from 'components/accountingWithSpouse/interfaces/EntrepreneurInputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useConstants} from 'src/composables/constants'
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

    const {  zusConstants} = useConstants()

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

    it('The FP contribution', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult().fpContribution).toBe(563.28)

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000, 1000),
        isFpContribution: false,
      }).calculate().getResult().fpContribution).toBe(0)
    })

    it('The FS contribution', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000, 1000)).calculate().getResult().fsContribution).toBe(816.84)

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000, 1000),
        isFpContribution: false,
      }).calculate().getResult().fsContribution).toBe(0)
    })
  })


  describe('Test expenses', () => {
    it('Standard cases', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000)).calculate().getResult().expenses).toBe(3000)

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000),
        workInLivePlace: false,
      }).calculate().getResult().expenses).toBe(3600)
    })

    it('without salary in 1 month', () => {
      const grossAmounts:number[] = []

      for(let i = 0; i < 12; i++) {
        grossAmounts.push(10000)
      }
      grossAmounts[1] = 0

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000),
        grossAmounts,
      }).calculate().getResult().expenses).toBe(2750)

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000),
        grossAmounts,
        workInLivePlace: false,
      }).calculate().getResult().expenses).toBe(3300)
    })
  })

  describe('Test basis for tax', () => {
    it('Standard cases', () => {
      expect(new EntrepreneurCalculator().setInputData(getDefaultInput(10000)).calculate().getResult().taxBasis).toBe(100548)
    })

    it('The tax relief is active', () => {
      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(3000),
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(0)

      expect(new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000),
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(15020)

    })
  })

  describe('Test the full result', () => {

    it('The standard cases', () => {
      const result  = new EntrepreneurCalculator().setInputData(getDefaultInput(10000)).calculate().getResult()

      expect(result.grossAmount).toBe(120000)
      expect(result.revenue).toBe(120000)
      expect(result.healthContribution).toBe(9319.32)
      expect(result.ppkContribution).toBe(0)
      expect(result.ppkIncomeFromEmployer).toBe(0)
      expect(result.disabilityContribution).toBe(1800)
      expect(result.pensionContribution).toBe(11712)
      expect(result.sickContribution).toBe(2940)
      expect(result.taxAmount).toBe(8466)
      expect(result.netAmount).toBe(85762.68)
      expect(result.expensesToReduceTaxBasis).toBe(19452)
    })

    it('With PPK', () => {
      const result  = new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000),
        employeePpkContributionRate: 0.02,
        employerPpkContributionRate: 0.015,
      }).calculate().getResult()

      expect(result.grossAmount).toBe(120000)
      expect(result.revenue).toBe(121800)
      expect(result.healthContribution).toBe(9319.32)
      expect(result.ppkContribution).toBe(2400)
      expect(result.ppkIncomeFromEmployer).toBe(1800)
      expect(result.disabilityContribution).toBe(1800)
      expect(result.pensionContribution).toBe(11712)
      expect(result.sickContribution).toBe(2940)
      expect(result.taxAmount).toBe(8682)
      expect(result.netAmount).toBe(83146.68)
      expect(result.expensesToReduceTaxBasis).toBe(19452)
    })

    it('with the tax relief', () => {
      const result  = new EntrepreneurCalculator().setInputData({
        ...getDefaultInput(10000),
        hasTaxRelief: true,
      }).calculate().getResult()

      expect(result.grossAmount).toBe(120000)
      expect(result.revenue).toBe(120000)
      expect(result.healthContribution).toBe(9319.32)
      expect(result.ppkContribution).toBe(0)
      expect(result.disabilityContribution).toBe(1800)
      expect(result.pensionContribution).toBe(11712)
      expect(result.sickContribution).toBe(2940)
      expect(result.taxAmount).toBe(0)
      expect(result.netAmount).toBe(94228.68)
      expect(result.expensesToReduceTaxBasis).toBe(19452)
    })
  })
})
