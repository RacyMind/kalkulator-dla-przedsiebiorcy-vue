import {ContractOfEmploymentEmployeeSingleResult} from '../../../../src/components/contractOfEmployment/interfaces/ContractOfEmploymentEmployeeSingleResult'
import {ContractOfEmploymentEmployeeYearlyResult} from '../../../../src/components/contractOfEmployment/interfaces/ContractOfEmploymentEmployeeYearlyResult'
import {ContractOfEmploymentInputFields} from '../../../../src/components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'
import { describe, expect, it } from '@jest/globals'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import employeeContractOfEmployment from '../../../../src/components/contractOfEmployment/employeeContractOfEmployment'
import helpers from '../../../../src/logic/helpers'

installQuasarPlugin()

const defaultInput:ContractOfEmploymentInputFields = {
  accidentContributionRate: 0.0167,
  employeePpkContributionRate: 0.02,
  employerPpkContributionRate: 0.015,
  grossAmount: 4000,
  isFpContribution: true,
  isFreeAmount: true,
  isReliefForBigFamily: false,
  isReliefForMiddleClass: true,
  isReliefForSenior: false,
  isReliefForYoung: false,
  partOfWorkWithAuthorExpenses: 0,
  workInLivePlace: true,
  year: helpers.getDefaultYear(),
}

const yearlyInput = (monthlyInput:ContractOfEmploymentInputFields):ContractOfEmploymentInputFields[] => {
  const inputs:ContractOfEmploymentInputFields[] = []
  for(let i = 0; i < 12; i++) {
    inputs.push(monthlyInput)
  }

  return inputs
}

const yearlyResult = (input:ContractOfEmploymentInputFields[]):ContractOfEmploymentEmployeeYearlyResult => {
  employeeContractOfEmployment.setParams(input[0].year)
  return employeeContractOfEmployment.getYearlyResult(input)
}

const monthlyResult = (input:ContractOfEmploymentInputFields):ContractOfEmploymentEmployeeSingleResult => {
  employeeContractOfEmployment.setParams(input.year)
  return employeeContractOfEmployment.getMonthlyResult(input)
}

describe('employeeContractOfEmployment', () => {
  it('the monthly calculation for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(4000)
    expect(result.expenses).toBe(250)
    expect(result.basisForTax).toBe(3202)
    expect(result.taxAmount).toBe(119)
    expect(result.contributionTotal).toBe(939.04)
    expect(result.healthContribution).toBe(310.64)
    expect(result.sickContribution).toBe(98)
    expect(result.disabilityContribution).toBe(60)
    expect(result.pensionContribution).toBe(390.40)
    expect(result.ppkContribution).toBe(80)
    expect(result.netAmount).toBe(2941.96)
  })

  it('the monthly calculation, without PPK contributions, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(4000)
    expect(result.expenses).toBe(250)
    expect(result.basisForTax).toBe(3202)
    expect(result.taxAmount).toBe(119)
    expect(result.contributionTotal).toBe(859.04)
    expect(result.healthContribution).toBe(310.64)
    expect(result.sickContribution).toBe(98)
    expect(result.disabilityContribution).toBe(60)
    expect(result.pensionContribution).toBe(390.40)
    expect(result.ppkContribution).toBe(0)
    expect(result.netAmount).toBe(3021.96)
  })

  it('the monthly calculation, without PPK contributions, 7 000 gross amount and the relief for the middle class, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      grossAmount: 7000,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(7000)
    expect(result.expenses).toBe(250)
    expect(result.basisForTax).toBe(5790)
    expect(result.taxAmount).toBe(472)
    expect(result.contributionTotal).toBe(1503.33)
    expect(result.healthContribution).toBe(543.63)
    expect(result.sickContribution).toBe(171.50)
    expect(result.disabilityContribution).toBe(105)
    expect(result.pensionContribution).toBe(683.20)
    expect(result.ppkContribution).toBe(0)
    expect(result.netAmount).toBe(5024.67)
  })

  it('the monthly calculation, without PPK contributions, 7 000 gross amount and without the relief for the middle class, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      grossAmount: 7000,
      isReliefForMiddleClass: false,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(7000)
    expect(result.expenses).toBe(250)
    expect(result.basisForTax).toBe(5790)
    expect(result.taxAmount).toBe(559)
    expect(result.contributionTotal).toBe(1503.33)
    expect(result.healthContribution).toBe(543.63)
    expect(result.sickContribution).toBe(171.50)
    expect(result.disabilityContribution).toBe(105)
    expect(result.pensionContribution).toBe(683.20)
    expect(result.ppkContribution).toBe(0)
    expect(result.netAmount).toBe(4937.67)
  })

  it('the monthly calculation, without the free amount, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      isFreeAmount: false,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(4000)
    expect(result.expenses).toBe(250)
    expect(result.basisForTax).toBe(3202)
    expect(result.taxAmount).toBe(544)
    expect(result.contributionTotal).toBe(939.04)
    expect(result.healthContribution).toBe(310.64)
    expect(result.sickContribution).toBe(98)
    expect(result.disabilityContribution).toBe(60)
    expect(result.pensionContribution).toBe(390.40)
    expect(result.ppkContribution).toBe(80)
    expect(result.netAmount).toBe(2516.96)
  })

  it('the monthly calculation, with all contributions and the author expenses, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      partOfWorkWithAuthorExpenses: 0.75,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(4000)
    expect(result.expenses).toBe(1544.35)
    expect(result.basisForTax).toBe(1907)
    expect(result.taxAmount).toBe(0)
    expect(result.contributionTotal).toBe(939.04)
    expect(result.healthContribution).toBe(310.64)
    expect(result.sickContribution).toBe(98)
    expect(result.disabilityContribution).toBe(60)
    expect(result.pensionContribution).toBe(390.40)
    expect(result.ppkContribution).toBe(80)
    expect(result.netAmount).toBe(3060.96)
  })

  it('the yearly calculation, with all contributions, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(48000)
    expect(result.yearlyResult.taxAmount).toBe(1549)
    expect(result.yearlyResult.healthContribution).toBe(3727.68)
    expect(result.yearlyResult.sickContribution).toBe(1176)
    expect(result.yearlyResult.disabilityContribution).toBe(720)
    expect(result.yearlyResult.pensionContribution).toBe(4684.80)
    expect(result.yearlyResult.ppkContribution).toBe(960)
    expect(result.yearlyResult.netAmount).toBe(35182.52)
  })

  it('the yearly calculation, with all contributions, 15 000 gross amount, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      grossAmount: 15000,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(180000)
    expect(result.yearlyResult.taxAmount).toBe(27369)
    expect(result.yearlyResult.healthContribution).toBe(14002.64)
    expect(result.yearlyResult.sickContribution).toBe(4410)
    expect(result.yearlyResult.disabilityContribution).toBe(2664.90)
    expect(result.yearlyResult.pensionContribution).toBe(17339.62)
    expect(result.yearlyResult.ppkContribution).toBe(3600)
    expect(result.yearlyResult.netAmount).toBe(110613.84)
  })

  it('the yearly calculation, without PPK contribution, 15 000 gross amount and the relief for young, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      grossAmount: 15000,
      isReliefForYoung: true,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(180000)
    expect(result.yearlyResult.taxAmount).toBe(10736)
    expect(result.yearlyResult.healthContribution).toBe(14002.64)
    expect(result.yearlyResult.sickContribution).toBe(4410)
    expect(result.yearlyResult.disabilityContribution).toBe(2664.90)
    expect(result.yearlyResult.pensionContribution).toBe(17339.62)
    expect(result.yearlyResult.ppkContribution).toBe(0)
    expect(result.yearlyResult.netAmount).toBe(130846.84)
  })

  it('the yearly calculation, without PPK contribution, 15 000 gross amount and the relief for the big family, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      grossAmount: 15000,
      isReliefForBigFamily: true,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(180000)
    expect(result.yearlyResult.taxAmount).toBe(9585)
    expect(result.yearlyResult.healthContribution).toBe(14002.64)
    expect(result.yearlyResult.sickContribution).toBe(4410)
    expect(result.yearlyResult.disabilityContribution).toBe(2664.90)
    expect(result.yearlyResult.pensionContribution).toBe(17339.62)
    expect(result.yearlyResult.ppkContribution).toBe(0)
    expect(result.yearlyResult.netAmount).toBe(132187.84)
  })

  it('the yearly calculation, without PPK contribution, 15 000 gross amount and the relief for senior, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      grossAmount: 15000,
      isReliefForSenior: true,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(180000)
    expect(result.yearlyResult.taxAmount).toBe(9585)
    expect(result.yearlyResult.healthContribution).toBe(14002.64)
    expect(result.yearlyResult.sickContribution).toBe(4410)
    expect(result.yearlyResult.disabilityContribution).toBe(2664.90)
    expect(result.yearlyResult.pensionContribution).toBe(17339.62)
    expect(result.yearlyResult.ppkContribution).toBe(0)
    expect(result.yearlyResult.netAmount).toBe(132187.84)
  })
})
