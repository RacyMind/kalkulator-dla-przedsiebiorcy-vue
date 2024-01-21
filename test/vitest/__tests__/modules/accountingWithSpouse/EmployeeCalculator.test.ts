import {EmployeeCalculator} from 'components/accountingWithSpouse/logic/EmployeeCalculator'
import {EmployeeInputFields} from 'components/accountingWithSpouse/interfaces/EmployeeInputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

describe('Employee Calculator in the module "Accounting with Spouse" on 1.1.20024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,0,1)
  })

  const getDefaultInput = (grossAmount:number):EmployeeInputFields => {
    const grossAmounts:number[] = []

    for(let i = 0; i < 12; i++) {
      grossAmounts.push(grossAmount)
    }
    return {
      grossAmounts: grossAmounts,
      isDisabilityContribution: true,
      isSickContribution: true,
      isHealthContribution: true,
      isPensionContribution: true,
      hasTaxRelief: false,
      workInLivePlace: true,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
    }
  }

  it('The invalid data', () => {
    expect(() => new EmployeeCalculator().getResult()).toThrowError('undefined')
    expect(() => new EmployeeCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test ZUS contributions', () => {

    it('The health contribution', () => {
      expect(new EmployeeCalculator().setInputData(getDefaultInput(10000)).calculate().getResult().healthContribution).toBe(9319.32)

      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        isHealthContribution: false,
      }).calculate().getResult().healthContribution).toBe(0)
    })

    it('The sick contribution', () => {
      expect(new EmployeeCalculator().setInputData(getDefaultInput(10000)).calculate().getResult().sickContribution).toBe(2940)

      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        isSickContribution: false,
      }).calculate().getResult().sickContribution).toBe(0)
    })

    it('The disability contribution', () => {
      expect(new EmployeeCalculator().setInputData(getDefaultInput(10000)).calculate().getResult().disabilityContribution).toBe(1800)

      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        isDisabilityContribution: false,
      }).calculate().getResult().disabilityContribution).toBe(0)
    })

    it('The pension contribution', () => {
      expect(new EmployeeCalculator().setInputData(getDefaultInput(10000)).calculate().getResult().pensionContribution).toBe(11712)

      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        isPensionContribution: false,
      }).calculate().getResult().pensionContribution).toBe(0)
    })

    it('The PPK contribution', () => {
      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        employeePpkContributionRate: 0.02,
      }).calculate().getResult().ppkContribution).toBe(2400)

      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        employeePpkContributionRate: 0,
      }).calculate().getResult().ppkContribution).toBe(0)
    })
  })


  describe('Test expenses', () => {
    it('Standard cases', () => {
      expect(new EmployeeCalculator().setInputData(getDefaultInput(10000)).calculate().getResult().expenses).toBe(3000)

      expect(new EmployeeCalculator().setInputData({
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

      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        grossAmounts,
      }).calculate().getResult().expenses).toBe(2750)

      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        grossAmounts,
        workInLivePlace: false,
      }).calculate().getResult().expenses).toBe(3300)
    })
  })

  describe('Test basis for tax', () => {
    it('Standard cases', () => {
      expect(new EmployeeCalculator().setInputData(getDefaultInput(10000)).calculate().getResult().taxBasis).toBe(100548)
    })

    it('The tax relief is active', () => {
      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(3000),
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(0)

      expect(new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(15020)

    })
  })

  describe('Test the full result', () => {

    it('The standard cases', () => {
      const result  = new EmployeeCalculator().setInputData(getDefaultInput(10000)).calculate().getResult()

      expect(result.grossAmount).toBe(120000)
      expect(result.revenue).toBe(120000)
      expect(result.totalZuSContributions).toBe(25771.32)
      expect(result.healthContribution).toBe(9319.32)
      expect(result.ppkContribution).toBe(0)
      expect(result.ppkIncomeFromEmployer).toBe(0)
      expect(result.disabilityContribution).toBe(1800)
      expect(result.pensionContribution).toBe(11712)
      expect(result.sickContribution).toBe(2940)
      expect(result.taxAmount).toBe(8466)
      expect(result.netAmount).toBe(85762.68)
    })

    it('With PPK', () => {
      const result  = new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        employeePpkContributionRate: 0.02,
        employerPpkContributionRate: 0.015,
      }).calculate().getResult()

      expect(result.grossAmount).toBe(120000)
      expect(result.revenue).toBe(121800)
      expect(result.totalZuSContributions).toBe(28171.32)
      expect(result.healthContribution).toBe(9319.32)
      expect(result.ppkContribution).toBe(2400)
      expect(result.ppkIncomeFromEmployer).toBe(1800)
      expect(result.disabilityContribution).toBe(1800)
      expect(result.pensionContribution).toBe(11712)
      expect(result.sickContribution).toBe(2940)
      expect(result.taxAmount).toBe(8682)
      expect(result.netAmount).toBe(83146.68)
    })

    it('with the tax relief', () => {
      const result  = new EmployeeCalculator().setInputData({
        ...getDefaultInput(10000),
        hasTaxRelief: true,
      }).calculate().getResult()

      expect(result.grossAmount).toBe(120000)
      expect(result.revenue).toBe(120000)
      expect(result.totalZuSContributions).toBe(25771.32)
      expect(result.healthContribution).toBe(9319.32)
      expect(result.ppkContribution).toBe(0)
      expect(result.disabilityContribution).toBe(1800)
      expect(result.pensionContribution).toBe(11712)
      expect(result.sickContribution).toBe(2940)
      expect(result.taxAmount).toBe(0)
      expect(result.netAmount).toBe(94228.68)
    })
  })
})
