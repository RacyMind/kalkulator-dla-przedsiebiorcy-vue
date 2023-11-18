import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {EmployeeContractOfMandate} from 'components/contractOfMandate/EmployeeContractOfMandate'
import {EmployeeZusContribution} from 'src/logic/EmployeeZusContribution'
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
  it('Test expenses', () => {
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

    expect(new EmployeeContractOfMandate(input).getMonthlyResult().expenses).toBe(200)

    expect(new EmployeeContractOfMandate({
      ...input,
      partOfWorkWithAuthorExpenses: 1,
    }).getMonthlyResult().expenses).toBe(500)

    expect(new EmployeeContractOfMandate({
      ...input,
      partOfWorkWithAuthorExpenses: 0.5,
    }).getMonthlyResult().expenses).toBe(250 + 100)

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
})
