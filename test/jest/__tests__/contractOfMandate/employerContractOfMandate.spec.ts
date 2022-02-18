import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { describe, expect, it } from '@jest/globals'
import employerContractOfMandate from '../../../../src/components/contractOfMandate/employerContractOfMandate'
import {ContractOfMandateInputFields} from '../../../../src/components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import helpers from '../../../../src/logic/helpers'
import {ContractOfMandateEmployerYearlyResult} from '../../../../src/components/contractOfMandate/interfaces/ContractOfMandateEmployerYearlyResult'
import {ContractOfMandateEmployerSingleResult} from '../../../../src/components/contractOfMandate/interfaces/ContractOfMandateEmployerSingleResult'

installQuasarPlugin()

const defaultInput:ContractOfMandateInputFields = {
  year: helpers.getDefaultYear(),
  grossAmount: 1000,
  isReliefForYoung: false,
  accidentContributionRate: 0.0167,
  employeePpkContributionRate: 0.02,
  employerPpkContributionRate: 0.015,
  isHealthContribution: true,
  isPensionContribution: true,
  isDisabilityContribution: true,
  isSickContribution: true,
  partOfWorkWithAuthorExpenses: 0,
}

const yearlyInput = (monthlyInput:ContractOfMandateInputFields):ContractOfMandateInputFields[] => {
  const inputs:ContractOfMandateInputFields[] = []
  for(let i = 0; i < 12; i++) {
    inputs.push(monthlyInput)
  }

  return inputs
}

const yearlyResult = (input:ContractOfMandateInputFields[]):ContractOfMandateEmployerYearlyResult => {
  employerContractOfMandate.setParams(input[0].year)
  return employerContractOfMandate.getYearlyResult(input)
}

const monthlyResult = (input:ContractOfMandateInputFields):ContractOfMandateEmployerSingleResult => {
  employerContractOfMandate.setParams(input.year)
  return employerContractOfMandate.getMonthlyResult(input)
}

describe('employerContractOfMandate', () => {
  it('the monthly calculation, with all contributions, for the default year', () => {
    const input:ContractOfMandateInputFields = {
      ...defaultInput,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.contributionTotal).toBe(194.3)
    expect(result.accidentContribution).toBe(16.7)
    expect(result.disabilityContribution).toBe(65)
    expect(result.pensionContribution).toBe(97.60)
    expect(result.ppkContribution).toBe(15)
    expect(result.totalAmount).toBe(1194.30)
  })

  it('the monthly calculation, without contributions, for the default year', () => {
    const input:ContractOfMandateInputFields = {
      ...defaultInput,
      isSickContribution: false,
      isPensionContribution: false,
      isHealthContribution: false,
      isDisabilityContribution: false,
      accidentContributionRate: 0,
      employerPpkContributionRate: 0,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.contributionTotal).toBe(0)
    expect(result.accidentContribution).toBe(0)
    expect(result.disabilityContribution).toBe(0)
    expect(result.pensionContribution).toBe(0)
    expect(result.ppkContribution).toBe(0)
    expect(result.totalAmount).toBe(1000)
  })

  it('the yearly calculation, with all contributions, for the default year', () => {
    const input:ContractOfMandateInputFields = {
      ...defaultInput,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(12000)
    expect(result.yearlyResult.contributionTotal).toBe(2331.6)
    expect(result.yearlyResult.accidentContribution).toBe(200.4)
    expect(result.yearlyResult.disabilityContribution).toBe(780)
    expect(result.yearlyResult.pensionContribution).toBe(1171.2)
    expect(result.yearlyResult.ppkContribution).toBe(180)
    expect(result.yearlyResult.totalAmount).toBe(14331.6)
  })

  it('the yearly calculation, with all contributions 15 000 gross amount, for the default year', () => {
    const input:ContractOfMandateInputFields = {
      ...defaultInput,
      grossAmount: 15000,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(180000)
    expect(result.yearlyResult.contributionTotal).toBe(34593.52)
    expect(result.yearlyResult.accidentContribution).toBe(3006)
    expect(result.yearlyResult.disabilityContribution).toBe(11547.90)
    expect(result.yearlyResult.pensionContribution).toBe(17339.62)
    expect(result.yearlyResult.ppkContribution).toBe(2700)
    expect(result.yearlyResult.totalAmount).toBe(214593.52)
  })

  it('the yearly calculation, without contributions, for the default year', () => {
    const input:ContractOfMandateInputFields = {
      ...defaultInput,
      isSickContribution: false,
      isPensionContribution: false,
      isHealthContribution: false,
      isDisabilityContribution: false,
      accidentContributionRate: 0,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(12000)
    expect(result.yearlyResult.contributionTotal).toBe(0)
    expect(result.yearlyResult.accidentContribution).toBe(0)
    expect(result.yearlyResult.disabilityContribution).toBe(0)
    expect(result.yearlyResult.pensionContribution).toBe(0)
    expect(result.yearlyResult.ppkContribution).toBe(0)
    expect(result.yearlyResult.totalAmount).toBe(12000)
  })
})
