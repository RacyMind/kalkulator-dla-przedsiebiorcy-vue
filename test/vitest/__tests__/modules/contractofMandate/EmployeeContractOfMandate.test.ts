import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {EmployeeContractOfMandate} from 'components/contractOfMandate/logic/EmployeeContractOfMandate'
import {GeneraLRule} from 'src/logic/taxes/GeneraLRule'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

const annualInput = (monthlyInput:ContractOfMandateInputFields):ContractOfMandateInputFields[] => {
  const input:ContractOfMandateInputFields[] = []

  for(let i = 0; i < 12; i++) {
    input.push(monthlyInput)
  }

  return input
}

describe('Contract of Mandate on 1.11.2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)
  })

  describe('Test ZUS contributions', () => {
    const input: ContractOfMandateInputFields = {
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
      expect(new EmployeeContractOfMandate(input).getMonthlyResult().healthContribution).toBe(77.66)

      expect(new EmployeeContractOfMandate({
        ...input,
        isHealthContribution: false,
      }).getMonthlyResult().healthContribution).toBe(0)
    })

    it('The sick contribution', () => {
      expect(new EmployeeContractOfMandate(input).getMonthlyResult().sickContribution).toBe(24.50)

      expect(new EmployeeContractOfMandate({
        ...input,
        isSickContribution: false,
      }).getMonthlyResult().sickContribution).toBe(0)
    })

    it('The disability contribution', () => {
      expect(new EmployeeContractOfMandate(input).getMonthlyResult().disabilityContribution).toBe(15)

      expect(new EmployeeContractOfMandate({
        ...input,
        isDisabilityContribution: false,
      }).getMonthlyResult().disabilityContribution).toBe(0)
    })

    it('The pension contribution', () => {
      expect(new EmployeeContractOfMandate(input).getMonthlyResult().pensionContribution).toBe(97.6)

      expect(new EmployeeContractOfMandate({
        ...input,
        isPensionContribution: false,
      }).getMonthlyResult().pensionContribution).toBe(0)
    })

    it('The ppk contribution', () => {
      expect(new EmployeeContractOfMandate(input).getMonthlyResult().ppkContribution).toBe(20)

      expect(new EmployeeContractOfMandate({
        ...input,
        employeePpkContributionRate: 0,
      }).getMonthlyResult().ppkContribution).toBe(0)
    })
  })

  describe('Test expenses', () => {
    const input:ContractOfMandateInputFields = {
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
      expect(new EmployeeContractOfMandate(input).getMonthlyResult().expenses).toBe(200)

      expect(new EmployeeContractOfMandate({
        ...input,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().expenses).toBe(500)

      expect(new EmployeeContractOfMandate({
        ...input,
        partOfWorkWithAuthorExpenses: 0.5,
      }).getMonthlyResult().expenses).toBe(250 + 100)
    })

    it('The gross amount is <= 200', () => {
      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 200,
      }).getMonthlyResult().expenses).toBe(0)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 200,
        canLumpSumTaxBe: false,
      }).getMonthlyResult().expenses).toBe(40)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 200,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().expenses).toBe(100)
    })

    it('The expenses are over limit of author expenses', () => {
      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 2 + 1,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().expenses).toBe(GeneraLRule.taxThreshold)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 5 + 1,
        partOfWorkWithAuthorExpenses: 0,
      }).getMonthlyResult().expenses).toBe(GeneraLRule.taxThreshold + 0.2)

      const simulateMultipleMonthsWithAuthorExpenses = new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxThreshold,
        partOfWorkWithAuthorExpenses: 1,
      })

      simulateMultipleMonthsWithAuthorExpenses.getMonthlyResult(0, true)
      simulateMultipleMonthsWithAuthorExpenses.getMonthlyResult(1, true)

      expect(simulateMultipleMonthsWithAuthorExpenses.getMonthlyResult(2, true).expenses).toBe(0)

      const simulateMultipleMonthsWithoutAuthorExpenses = new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 5,
        partOfWorkWithAuthorExpenses: 0,
      })

      simulateMultipleMonthsWithoutAuthorExpenses.getMonthlyResult(0, true)
      simulateMultipleMonthsWithoutAuthorExpenses.getMonthlyResult(1, true)

      expect(simulateMultipleMonthsWithoutAuthorExpenses.getMonthlyResult(2, true).expenses).toBe(GeneraLRule.taxThreshold)
    })

    it('The expenses with the tax relief and the author expenses', () => {
      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).getMonthlyResult().expenses).toBe(0)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit + 1,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).getMonthlyResult().expenses).toBe(0.5)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxThreshold,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).getMonthlyResult().expenses).toBe((GeneraLRule.taxThreshold - GeneraLRule.taxReliefLimit) / 2)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 2 * GeneraLRule.taxThreshold + 1,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).getMonthlyResult().expenses).toBe(GeneraLRule.taxThreshold - GeneraLRule.taxReliefLimit)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 10,
        partOfWorkWithAuthorExpenses: 1,
        hasTaxRelief: true,
      }).getMonthlyResult().expenses).toBe(GeneraLRule.taxThreshold - GeneraLRule.taxReliefLimit)
    })
  })

  describe('Test basis for tax', () => {
    const input: ContractOfMandateInputFields = {
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

      expect(new EmployeeContractOfMandate(input).getMonthlyResult().taxBasis).toBe(800)
      expect(new EmployeeContractOfMandate({
        ...input,
        isDisabilityContribution: true,
        isHealthContribution: true,
        isPensionContribution: true,
        isSickContribution: true,
      }).getMonthlyResult().taxBasis).toBe(690)
    })

    it('The gross amount is <= 200', () => {
      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 200,
      }).getMonthlyResult().taxBasis).toBe(200)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 200,
        canLumpSumTaxBe: false,
      }).getMonthlyResult().taxBasis).toBe(160)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 200,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().taxBasis).toBe(100)
    })

    it('The expenses are over limit of author expenses', () => {
      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 2,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().taxBasis).toBe(GeneraLRule.taxThreshold)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 2 + 1,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().taxBasis).toBe(GeneraLRule.taxThreshold + 1)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxThreshold * 2 + 10,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().taxBasis).toBe(GeneraLRule.taxThreshold + 10)
    })

    it('The tax relief is active', () => {
      expect(new EmployeeContractOfMandate({
        ...input,
        hasTaxRelief: true,
      }).getMonthlyResult().taxBasis).toBe(0)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit,
        hasTaxRelief: true,
      }).getMonthlyResult().taxBasis).toBe(0)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit + 100,
        hasTaxRelief: true,
      }).getMonthlyResult().taxBasis).toBe(80)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit + 100.1,
        hasTaxRelief: true,
      }).getMonthlyResult().taxBasis).toBe(80)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: GeneraLRule.taxReliefLimit + 100,
        hasTaxRelief: true,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().taxBasis).toBe(50)

    })
  })

  describe('Test the full result', () => {
    const input: ContractOfMandateInputFields = {
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
      const result  = new EmployeeContractOfMandate(input).getMonthlyResult()

      expect(result.healthContribution).toBe(388.31)
      expect(result.ppkContribution).toBe(100)
      expect(result.disabilityContribution).toBe(75)
      expect(result.pensionContribution).toBe(488)
      expect(result.sickContribution).toBe(122.5)
      expect(result.taxAmount).toBe(114)
      expect(result.netAmount).toBe(3712.19)
    })

    it('with the tax relief', () => {
      const result  = new EmployeeContractOfMandate({
        ...input,
        hasTaxRelief: true,
      }).getMonthlyResult()

      expect(result.healthContribution).toBe(388.31)
      expect(result.ppkContribution).toBe(100)
      expect(result.disabilityContribution).toBe(75)
      expect(result.pensionContribution).toBe(488)
      expect(result.sickContribution).toBe(122.5)
      expect(result.taxAmount).toBe(0)
      expect(result.netAmount).toBe(3826.19)
    })

    it('without ZUS contributions', () => {
      const result  = new EmployeeContractOfMandate({
        ...input,
        isDisabilityContribution: false,
        isFpContribution: false,
        partTaxReducingAmount: 12,
        isHealthContribution: false,
        isPensionContribution: false,
        isSickContribution: false,
        employeePpkContributionRate: 0,
      }).getMonthlyResult()

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
