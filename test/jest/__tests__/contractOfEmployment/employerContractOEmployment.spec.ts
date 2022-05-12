import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { describe, expect, it } from '@jest/globals'
import employerContractOfEmployment from '../../../../src/components/contractOfEmployment/employerContractOfEmployment'
import {ContractOfEmploymentInputFields} from '../../../../src/components/contractOfEmployment/interfaces/ContractOfEmploymentInputFields'
import helpers from '../../../../src/logic/helpers'
import {ContractOfEmploymentEmployerYearlyResult} from '../../../../src/components/contractOfEmployment/interfaces/ContractOfEmploymentEmployerYearlyResult'
import {ContractOfEmploymentEmployerSingleResult} from '../../../../src/components/contractOfEmployment/interfaces/ContractOfEmploymentEmployerSingleResult'

installQuasarPlugin()

const defaultInput:ContractOfEmploymentInputFields = {
  year: helpers.getDefaultYear(),
  grossAmount: 4000,
  accidentContributionRate: 0.0167,
  employeePpkContributionRate: 0.02,
  employerPpkContributionRate: 0.015,
  workInLivePlace: true,
  isFreeAmount: true,
  isReliefForYoung: false,
  isReliefForSenior: false,
  isReliefForBigFamily: false,
  isReliefForMiddleClass: true,
  isFpContribution: true,
  partOfWorkWithAuthorExpenses: 0,
}

const yearlyInput = (monthlyInput:ContractOfEmploymentInputFields):ContractOfEmploymentInputFields[] => {
  const inputs:ContractOfEmploymentInputFields[] = []
  for(let i = 0; i < 12; i++) {
    inputs.push(monthlyInput)
  }

  return inputs
}

const yearlyResult = (input:ContractOfEmploymentInputFields[]):ContractOfEmploymentEmployerYearlyResult => {
  employerContractOfEmployment.setParams(input[0].year)
  return employerContractOfEmployment.getYearlyResult(input)
}

const monthlyResult = (input:ContractOfEmploymentInputFields):ContractOfEmploymentEmployerSingleResult => {
  employerContractOfEmployment.setParams(input.year)
  return employerContractOfEmployment.getMonthlyResult(input)
}

describe('employerContractOfEmployment', () => {
  it('the monthly calculation, with all contributions, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(4000)
    expect(result.contributionTotal).toBe(879.20)
    expect(result.accidentContribution).toBe(66.80)
    expect(result.disabilityContribution).toBe(260)
    expect(result.pensionContribution).toBe(390.4)
    expect(result.fpContribution).toBe(98)
    expect(result.fgspContribution).toBe(4)
    expect(result.ppkContribution).toBe(60)
    expect(result.totalAmount).toBe(4879.20)
  })
  it('the monthly calculation, without PPK contribution, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(4000)
    expect(result.contributionTotal).toBe(819.20)
    expect(result.accidentContribution).toBe(66.80)
    expect(result.disabilityContribution).toBe(260)
    expect(result.pensionContribution).toBe(390.4)
    expect(result.fpContribution).toBe(98)
    expect(result.fgspContribution).toBe(4)
    expect(result.ppkContribution).toBe(0)
    expect(result.totalAmount).toBe(4819.20)
  })

  it('the yearly calculation, with all contributions, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(48000)
    expect(result.yearlyResult.accidentContribution).toBe(801.6)
    expect(result.yearlyResult.disabilityContribution).toBe(3120)
    expect(result.yearlyResult.pensionContribution).toBe(4684.8)
    expect(result.yearlyResult.fpContribution).toBe(1176)
    expect(result.yearlyResult.fgspContribution).toBe(48)
    expect(result.yearlyResult.ppkContribution).toBe(720)
    expect(result.yearlyResult.totalAmount).toBe(58550.40)
  })

  it('the yearly calculation, with all contributions 15 000 gross amount, for the default year', () => {
    const input:ContractOfEmploymentInputFields = {
      ...defaultInput,
      grossAmount: 15000,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(180000)
    expect(result.yearlyResult.accidentContribution).toBe(3006)
    expect(result.yearlyResult.disabilityContribution).toBe(11547.90)
    expect(result.yearlyResult.pensionContribution).toBe(17339.62)
    expect(result.yearlyResult.fpContribution).toBe(4410)
    expect(result.yearlyResult.fgspContribution).toBe(180)
    expect(result.yearlyResult.ppkContribution).toBe(2700)
    expect(result.yearlyResult.totalAmount).toBe(219183.52)
  })
})
