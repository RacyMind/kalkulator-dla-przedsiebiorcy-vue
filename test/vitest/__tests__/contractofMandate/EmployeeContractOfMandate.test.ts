import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {EmployeeContractOfMandate} from 'components/contractOfMandate/EmployeeContractOfMandate'
import {EmployeeZusContribution} from 'src/logic/EmployeeZusContribution'
import {TaxSystem} from 'src/logic/TaxSystem'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'
import contractWork from 'components/contractWork/contractWork'
import helpers from 'src/logic/helpers'

const defaultInput:ContractOfMandateInputFields = {
  accidentContributionRate: 0.0167,
  employeePpkContributionRate: 0.02,
  employerPpkContributionRate: 0.015,
  grossAmount: 1000,
  isDisabilityContribution: true,
  isFpContribution: true,
  isFreeAmount: false,
  isHealthContribution: true,
  isPensionContribution: true,
  isReliefForYoung: false,
  isSickContribution: true,
  partOfWorkWithAuthorExpenses: 0,
  year: helpers.getDefaultYear(),
}

const annualInput = (monthlyInput:ContractOfMandateInputFields):ContractOfMandateInputFields[] => {
  const input:ContractOfMandateInputFields[] = []

  for(let i = 0; i < 12; i++) {
    input.push(monthlyInput)
  }

  return input
}

describe('Contract of Mandate in 2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)
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
      year: helpers.getDefaultYear(),
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
})
