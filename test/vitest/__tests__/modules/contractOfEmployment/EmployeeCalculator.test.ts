import {EmployeeCalculator} from 'components/contractOfEmployment/logic/EmployeeCalculator'
import {InputFields} from 'components/contractOfEmployment/interfaces/InputFields'
import {createPinia, setActivePinia} from 'pinia'
import {describe, expect, it } from 'vitest'
import {useConstants} from 'src/composables/constants'
import {useSettingStore} from 'stores/settingStore'

describe('Employee Calculator of Contract of Employment on 1.11.2023', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const { incomeTaxConstnts} = useConstants()

  it('The invalid data', () => {
    expect(() => new EmployeeCalculator().getResult()).toThrowError('undefined')
    expect(() => new EmployeeCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test ZUS contributions', () => {
    const input: InputFields = {
      accidentContributionRate: 0,
      employeePpkContributionRate: 0.02,
      employerPpkContributionRate: 0,
      grossAmount: 1000,
      isFpContribution: true,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      partOfWorkWithAuthorExpenses: 0,
      workInLivePlace: true,
    }

    it('The health contribution', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().healthContribution).toBe(77.66)
    })

    it('The sick contribution', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().sickContribution).toBe(24.50)
    })

    it('The disability contribution', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().disabilityContribution).toBe(15)
    })

    it('The pension contribution', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().pensionContribution).toBe(97.6)
    })

    it('The PPK contribution', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().ppkContribution).toBe(20)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        employeePpkContributionRate: 0,
      }).calculate().getResult().ppkContribution).toBe(0)
    })
  })

  describe('Test expenses', () => {
    const input:InputFields = {
      accidentContributionRate: 0,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      grossAmount: 1000,
      isFpContribution: true,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      partOfWorkWithAuthorExpenses: 0,
      workInLivePlace: true,
    }

    it('Standard cases', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().expenses).toBe(250)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        workInLivePlace: false,
      }).calculate().getResult().expenses).toBe(300)
    })

    it('With only author expenses', () => {

      expect(new EmployeeCalculator().setInputData({
        ...input,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().expenses).toBe(431.45)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        partOfWorkWithAuthorExpenses: 0.5,
      }).calculate().getResult().expenses).toBe(465.72)
    })

    it('The expenses are over limit of author expenses', () => {
      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: incomeTaxConstnts.generalRule.taxThreshold * 3 + 1,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().expenses).toBe(incomeTaxConstnts.generalRule.taxThreshold)

      const simulateMultipleMonthsWithAuthorExpenses = new EmployeeCalculator(true).setInputData({
        ...input,
        grossAmount: incomeTaxConstnts.generalRule.taxThreshold * 2,
        partOfWorkWithAuthorExpenses: 1,
      })

      simulateMultipleMonthsWithAuthorExpenses.calculate().getResult()
      simulateMultipleMonthsWithAuthorExpenses.calculate().getResult()

      expect(simulateMultipleMonthsWithAuthorExpenses.calculate().getResult().expenses).toBe(0)
    })

    it('The expenses with the tax relief and the author expenses', () => {
      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: incomeTaxConstnts.generalRule.taxReliefLimit,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).calculate().getResult().expenses).toBe(0)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: incomeTaxConstnts.generalRule.taxThreshold * 10,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).calculate().getResult().expenses).toBe(incomeTaxConstnts.generalRule.taxThreshold - incomeTaxConstnts.generalRule.taxReliefLimit)
    })
  })

  describe('Test basis for tax', () => {
    const input: InputFields = {
      accidentContributionRate: 0,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      grossAmount: 1000,
      isFpContribution: false,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      partOfWorkWithAuthorExpenses: 0,
      workInLivePlace: true,
    }

    it('Standard cases', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().taxBasis).toBe(613)
    })

    it('The tax relief is active', () => {
      expect(new EmployeeCalculator().setInputData({
        ...input,
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(0)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: incomeTaxConstnts.generalRule.taxReliefLimit,
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(0)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: incomeTaxConstnts.generalRule.taxReliefLimit * 1.2,
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(2785)

    })
  })

  describe('Test the full result', () => {
    const input: InputFields = {
      accidentContributionRate: 0,
      employeePpkContributionRate: 0.02,
      employerPpkContributionRate: 0,
      grossAmount: 5000,
      isFpContribution: true,
      partTaxReducingAmount: 12,
      hasTaxRelief: false,
      partOfWorkWithAuthorExpenses: 0,
      workInLivePlace: true,
    }

    it('The standard cases', () => {
      const result  = new EmployeeCalculator().setInputData(input).calculate().getResult()

      expect(result.healthContribution).toBe(388.31)
      expect(result.ppkContribution).toBe(100)
      expect(result.disabilityContribution).toBe(75)
      expect(result.pensionContribution).toBe(488)
      expect(result.sickContribution).toBe(122.5)
      expect(result.taxAmount).toBe(188)
      expect(result.netAmount).toBe(3638.19)
    })


    it('With the employer\'s PPK contribution', () => {
      const result  = new EmployeeCalculator().setInputData({
        ...input,
        employerPpkContributionRate: 0.015,
      }).calculate().getResult()

      expect(result.healthContribution).toBe(388.31)
      expect(result.ppkContribution).toBe(100)
      expect(result.disabilityContribution).toBe(75)
      expect(result.pensionContribution).toBe(488)
      expect(result.sickContribution).toBe(122.5)
      expect(result.taxAmount).toBe(197)
      expect(result.netAmount).toBe(3629.19)
    })
    it('with the tax relief', () => {
      const result  = new EmployeeCalculator().setInputData({
        ...input,
        hasTaxRelief: true,
      }).calculate().getResult()

      expect(result.healthContribution).toBe(388.31)
      expect(result.ppkContribution).toBe(100)
      expect(result.disabilityContribution).toBe(75)
      expect(result.pensionContribution).toBe(488)
      expect(result.sickContribution).toBe(122.5)
      expect(result.taxAmount).toBe(0)
      expect(result.netAmount).toBe(3826.19)
    })
  })
})
