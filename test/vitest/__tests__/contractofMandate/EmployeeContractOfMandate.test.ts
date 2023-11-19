import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {EmployeeContractOfMandate} from 'components/contractOfMandate/EmployeeContractOfMandate'
import {TaxSystem} from 'src/logic/TaxSystem'
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
      isFreeAmount: false,
      isHealthContribution: true,
      isPensionContribution: true,
      isReliefForYoung: false,
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
      isFreeAmount: false,
      isHealthContribution: false,
      isPensionContribution: false,
      isReliefForYoung: false,
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
        grossAmount: TaxSystem.taxThreshold * 2 + 1,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().expenses).toBe(TaxSystem.taxThreshold)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: TaxSystem.taxThreshold * 5 + 1,
        partOfWorkWithAuthorExpenses: 0,
      }).getMonthlyResult().expenses).toBe(TaxSystem.taxThreshold + 0.2)

      const simulateMultipleMonthsWithAuthorExpenses = new EmployeeContractOfMandate({
        ...input,
        grossAmount: TaxSystem.taxThreshold,
        partOfWorkWithAuthorExpenses: 1,
      })

      simulateMultipleMonthsWithAuthorExpenses.getMonthlyResult(0, true)
      simulateMultipleMonthsWithAuthorExpenses.getMonthlyResult(1, true)

      expect(simulateMultipleMonthsWithAuthorExpenses.getMonthlyResult(2, true).expenses).toBe(0)

      const simulateMultipleMonthsWithoutAuthorExpenses = new EmployeeContractOfMandate({
        ...input,
        grossAmount: TaxSystem.taxThreshold * 5,
        partOfWorkWithAuthorExpenses: 0,
      })

      simulateMultipleMonthsWithoutAuthorExpenses.getMonthlyResult(0, true)
      simulateMultipleMonthsWithoutAuthorExpenses.getMonthlyResult(1, true)

      expect(simulateMultipleMonthsWithoutAuthorExpenses.getMonthlyResult(2, true).expenses).toBe(TaxSystem.taxThreshold)
    })

    it('The expenses with the young aid and the author expenses', () => {
      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: TaxSystem.aidThreshold,
        partOfWorkWithAuthorExpenses: 1,
        isReliefForYoung: true,
      }).getMonthlyResult().expenses).toBe(0)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: TaxSystem.aidThreshold + 1,
        partOfWorkWithAuthorExpenses: 1,
        isReliefForYoung: true,
      }).getMonthlyResult().expenses).toBe(0.5)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: TaxSystem.taxThreshold,
        partOfWorkWithAuthorExpenses: 1,
        isReliefForYoung: true,
      }).getMonthlyResult().expenses).toBe((TaxSystem.taxThreshold - TaxSystem.aidThreshold) / 2)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: TaxSystem.taxThreshold + 1,
        partOfWorkWithAuthorExpenses: 1,
        isReliefForYoung: true,
      }).getMonthlyResult().expenses).toBe((TaxSystem.taxThreshold - TaxSystem.aidThreshold) / 2)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: TaxSystem.taxThreshold * 10,
        partOfWorkWithAuthorExpenses: 1,
        isReliefForYoung: true,
      }).getMonthlyResult().expenses).toBe((TaxSystem.taxThreshold - TaxSystem.aidThreshold) / 2)
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
      isFreeAmount: false,
      isHealthContribution: false,
      isPensionContribution: false,
      isReliefForYoung: false,
      isSickContribution: false,
      partOfWorkWithAuthorExpenses: 0,
      canLumpSumTaxBe: true,
    }

    it('Standard cases', () => {

      expect(new EmployeeContractOfMandate(input).getMonthlyResult().basisForTax).toBe(800)
      expect(new EmployeeContractOfMandate({
        ...input,
        isDisabilityContribution: true,
        isHealthContribution: true,
        isPensionContribution: true,
        isSickContribution: true,
      }).getMonthlyResult().basisForTax).toBe(690)
    })

    it('The gross amount is <= 200', () => {
      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 200,
      }).getMonthlyResult().basisForTax).toBe(200)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 200,
        canLumpSumTaxBe: false,
      }).getMonthlyResult().basisForTax).toBe(160)

      expect(new EmployeeContractOfMandate({
        ...input,
        grossAmount: 200,
        partOfWorkWithAuthorExpenses: 1,
      }).getMonthlyResult().basisForTax).toBe(100)
    })
  })
})
