import {EmployeeCalculator} from 'components/contractOfMandate/logic/EmployeeCalculator'
import {GeneraLRule} from 'src/logic/taxes/GeneraLRule'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

describe('Employee Calculator of Contract of Mandate on 1.11.2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)
  })

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
      isDisabilityContribution: true,
      isFpContribution: true,
      partTaxReducingAmount: 0,
      isHealthContribution: true,
      isPensionContribution: true,
      hasTaxRelief: false,
      isSickContribution: true,
      partOfWorkWithAuthorExpenses: 0,
      canLumpSumTaxBe: true,
    }

    it('The health contribution', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().healthContribution).toBe(77.66)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        isHealthContribution: false,
      }).calculate().getResult().healthContribution).toBe(0)
    })

    it('The sick contribution', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().sickContribution).toBe(24.50)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        isSickContribution: false,
      }).calculate().getResult().sickContribution).toBe(0)
    })

    it('The disability contribution', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().disabilityContribution).toBe(15)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        isDisabilityContribution: false,
      }).calculate().getResult().disabilityContribution).toBe(0)
    })

    it('The pension contribution', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().pensionContribution).toBe(97.6)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        isPensionContribution: false,
      }).calculate().getResult().pensionContribution).toBe(0)
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
      isDisabilityContribution: false,
      isFpContribution: false,
      partTaxReducingAmount: 0,
      isHealthContribution: false,
      isPensionContribution: false,
      hasTaxRelief: false,
      isSickContribution: false,
      partOfWorkWithAuthorExpenses: 0,
      canLumpSumTaxBe: true,
    }

    it('Standard cases', () => {
      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().expenses).toBe(200)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().expenses).toBe(500)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        partOfWorkWithAuthorExpenses: 0.5,
      }).calculate().getResult().expenses).toBe(250 + 100)
    })

    it('The gross amount is <= 200', () => {
      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: 200,
      }).calculate().getResult().expenses).toBe(0)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: 200,
        canLumpSumTaxBe: false,
      }).calculate().getResult().expenses).toBe(40)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: 200,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().expenses).toBe(100)
    })

    it('The expenses are over limit of author expenses', () => {
      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 2 + 1,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().expenses).toBe(GeneraLRule.taxThreshold)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 5 + 1,
        partOfWorkWithAuthorExpenses: 0,
      }).calculate().getResult().expenses).toBe(GeneraLRule.taxThreshold + 0.2)

      const simulateMultipleMonthsWithAuthorExpenses = new EmployeeCalculator(true).setInputData({
        ...input,
        grossAmount: GeneraLRule.taxThreshold,
        partOfWorkWithAuthorExpenses: 1,
      })

      simulateMultipleMonthsWithAuthorExpenses.calculate().getResult()
      simulateMultipleMonthsWithAuthorExpenses.calculate().getResult()

      expect(simulateMultipleMonthsWithAuthorExpenses.calculate().getResult().expenses).toBe(0)

      const simulateMultipleMonthsWithoutAuthorExpenses = new EmployeeCalculator(true).setInputData({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 5,
        partOfWorkWithAuthorExpenses: 0,
      })

      simulateMultipleMonthsWithoutAuthorExpenses.calculate().getResult()
      simulateMultipleMonthsWithoutAuthorExpenses.calculate().getResult()

      expect(simulateMultipleMonthsWithoutAuthorExpenses.calculate().getResult().expenses).toBe(GeneraLRule.taxThreshold)
    })

    it('The expenses with the tax relief and the author expenses', () => {
      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).calculate().getResult().expenses).toBe(0)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit + 1,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).calculate().getResult().expenses).toBe(0.5)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxThreshold,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).calculate().getResult().expenses).toBe((GeneraLRule.taxThreshold - GeneraLRule.taxReliefLimit) / 2)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: 2 * GeneraLRule.taxThreshold + 1,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).calculate().getResult().expenses).toBe(GeneraLRule.taxThreshold - GeneraLRule.taxReliefLimit)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 10,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).calculate().getResult().expenses).toBe(GeneraLRule.taxThreshold - GeneraLRule.taxReliefLimit)
    })
  })

  describe('Test basis for tax', () => {
    const input: InputFields = {
      accidentContributionRate: 0,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      grossAmount: 1000,
      isDisabilityContribution: false,
      isFpContribution: false,
      partTaxReducingAmount: 0,
      isHealthContribution: false,
      isPensionContribution: false,
      hasTaxRelief: false,
      isSickContribution: false,
      partOfWorkWithAuthorExpenses: 0,
      canLumpSumTaxBe: true,
    }

    it('Standard cases', () => {

      expect(new EmployeeCalculator().setInputData(input).calculate().getResult().taxBasis).toBe(800)
      expect(new EmployeeCalculator().setInputData({
        ...input,
        isDisabilityContribution: true,
        isHealthContribution: true,
        isPensionContribution: true,
        isSickContribution: true,
      }).calculate().getResult().taxBasis).toBe(690)
    })

    it('The gross amount is <= 200', () => {
      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: 200,
      }).calculate().getResult().taxBasis).toBe(200)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: 200,
        canLumpSumTaxBe: false,
      }).calculate().getResult().taxBasis).toBe(160)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: 200,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().taxBasis).toBe(100)
    })

    it('The expenses are over limit of author expenses', () => {
      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 2,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().taxBasis).toBe(GeneraLRule.taxThreshold)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 2 + 1,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().taxBasis).toBe(GeneraLRule.taxThreshold + 1)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 2 + 10,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().taxBasis).toBe(GeneraLRule.taxThreshold + 10)
    })

    it('The tax relief is active', () => {
      expect(new EmployeeCalculator().setInputData({
        ...input,
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(0)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit,
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(0)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit + 100,
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(80)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit + 100.1,
        hasTaxRelief: true,
      }).calculate().getResult().taxBasis).toBe(80)

      expect(new EmployeeCalculator().setInputData({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit + 100,
        hasTaxRelief: true,
        partOfWorkWithAuthorExpenses: 1,
      }).calculate().getResult().taxBasis).toBe(50)

    })
  })

  describe('Test the full result', () => {
    const input: InputFields = {
      accidentContributionRate: 0,
      employeePpkContributionRate: 0.02,
      employerPpkContributionRate: 0,
      grossAmount: 5000,
      isDisabilityContribution: true,
      isFpContribution: true,
      partTaxReducingAmount: 12,
      isHealthContribution: true,
      isPensionContribution: true,
      hasTaxRelief: false,
      isSickContribution: true,
      partOfWorkWithAuthorExpenses: 0,
      canLumpSumTaxBe: true,
    }

    it('The standard cases', () => {
      const result  = new EmployeeCalculator().setInputData(input).calculate().getResult()

      expect(result.healthContribution).toBe(388.31)
      expect(result.ppkContribution).toBe(100)
      expect(result.disabilityContribution).toBe(75)
      expect(result.pensionContribution).toBe(488)
      expect(result.sickContribution).toBe(122.5)
      expect(result.taxAmount).toBe(114)
      expect(result.netAmount).toBe(3712.19)
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
      expect(result.taxAmount).toBe(121)
      expect(result.netAmount).toBe(3705.19)
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

    it('without ZUS contributions', () => {
      const result  = new EmployeeCalculator().setInputData({
        ...input,
        isDisabilityContribution: false,
        isFpContribution: false,
        partTaxReducingAmount: 12,
        isHealthContribution: false,
        isPensionContribution: false,
        isSickContribution: false,
        employeePpkContributionRate: 0,
      }).calculate().getResult()

      expect(result.healthContribution).toBe(0)
      expect(result.ppkContribution).toBe(0)
      expect(result.disabilityContribution).toBe(0)
      expect(result.pensionContribution).toBe(0)
      expect(result.sickContribution).toBe(0)
      expect(result.taxAmount).toBe(180)
      expect(result.netAmount).toBe(4820)
    })
  })
})
