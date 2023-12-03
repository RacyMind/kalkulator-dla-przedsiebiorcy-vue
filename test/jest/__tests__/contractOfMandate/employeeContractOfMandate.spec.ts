import {ContractOfMandateEmployeeSingleResult} from '../../../../src/components/contractOfMandate/interfaces/ContractOfMandateEmployeeSingleResult'
import {ContractOfMandateEmployeeYearlyResult} from '../../../../src/components/contractOfMandate/interfaces/ContractOfMandateEmployeeYearlyResult'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import { describe, expect, it } from '@jest/globals'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import constants from '../../../../src/logic/constants'
import employeeContractOfMandate from 'components/contractOfMandate/logic/EmployeeCalculator'
import helpers from '../../../../src/logic/helpers'

installQuasarPlugin()

const defaultInput:InputFields = {
  accidentContributionRate: 0.0167,
  employeePpkContributionRate: 0.02,
  employerPpkContributionRate: 0.015,
  grossAmount: 1000,
  isDisabilityContribution: true,
  isFpContribution: true,
  isFreeAmount: false,
  isHealthContribution: true,
  isPensionContribution: true,
  hasTaxRelief: false,
  isSickContribution: true,
  partOfWorkWithAuthorExpenses: 0,
  year: helpers.getDefaultYear(),
}

const yearlyInput = (monthlyInput:InputFields):InputFields[] => {
  const inputs:InputFields[] = []
  for(let i = 0; i < 12; i++) {
    inputs.push(monthlyInput)
  }

  return inputs
}

const yearlyResult = (input:InputFields[]):ContractOfMandateEmployeeYearlyResult => {
  employeeContractOfMandate.setParams(input[0].year)
  return employeeContractOfMandate.getYearlyResult(input)
}

const monthlyResult = (input:InputFields):ContractOfMandateEmployeeSingleResult => {
  employeeContractOfMandate.setParams(input.year)
  return employeeContractOfMandate.getMonthlyResult(input)
}

describe('employeeContractOfMandate', () => {
  it('the monthly calculation, with all contributions, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(172.58)
    expect(result.basisForTax).toBe(690)
    expect(result.taxAmount).toBe(117)
    expect(result.contributionTotal).toBe(234.76)
    expect(result.healthContribution).toBe(77.66)
    expect(result.sickContribution).toBe(24.50)
    expect(result.disabilityContribution).toBe(15)
    expect(result.pensionContribution).toBe(97.60)
    expect(result.ppkContribution).toBe(20)
    expect(result.netAmount).toBe(648.24)
  })

  it('the monthly calculation, with all contributions and the relief for young, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
      hasTaxRelief: true,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(172.58)
    expect(result.basisForTax).toBe(0)
    expect(result.taxAmount).toBe(0)
    expect(result.contributionTotal).toBe(234.76)
    expect(result.healthContribution).toBe(77.66)
    expect(result.sickContribution).toBe(24.50)
    expect(result.disabilityContribution).toBe(15)
    expect(result.pensionContribution).toBe(97.60)
    expect(result.ppkContribution).toBe(20)
    expect(result.netAmount).toBe(765.24)
  })

  it('the monthly calculation, using the gross amount equals the lump sum amount, with all contributions, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
      grossAmount: constants.PARAMS[helpers.getDefaultYear()].LUMP_SUM_UP_TO_AMOUNT,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(200)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(200)
    expect(result.taxAmount).toBe(34)
    expect(result.contributionTotal).toBe(46.95)
    expect(result.healthContribution).toBe(15.53)
    expect(result.sickContribution).toBe(4.9)
    expect(result.disabilityContribution).toBe(3)
    expect(result.pensionContribution).toBe(19.52)
    expect(result.ppkContribution).toBe(4)
    expect(result.netAmount).toBe(119.05)
  })

  it('the monthly calculation, without contributions, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
      accidentContributionRate: 0,
      employeePpkContributionRate: 0,
      isDisabilityContribution: false,
      isHealthContribution: false,
      isPensionContribution: false,
      isSickContribution: false,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(200)
    expect(result.basisForTax).toBe(800)
    expect(result.taxAmount).toBe(136)
    expect(result.contributionTotal).toBe(0)
    expect(result.healthContribution).toBe(0)
    expect(result.sickContribution).toBe(0)
    expect(result.disabilityContribution).toBe(0)
    expect(result.pensionContribution).toBe(0)
    expect(result.ppkContribution).toBe(0)
    expect(result.netAmount).toBe(864)
  })

  it('the monthly calculation, with all contributions and the author expenses, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
      partOfWorkWithAuthorExpenses: 0.75,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(1000)
    expect(result.expenses).toBe(366.73)
    expect(result.basisForTax).toBe(496)
    expect(result.taxAmount).toBe(84)
    expect(result.contributionTotal).toBe(234.76)
    expect(result.healthContribution).toBe(77.66)
    expect(result.sickContribution).toBe(24.50)
    expect(result.disabilityContribution).toBe(15)
    expect(result.pensionContribution).toBe(97.60)
    expect(result.ppkContribution).toBe(20)
    expect(result.netAmount).toBe(681.24)
  })
  it('the monthly calculation, with all contributions and 150 gross amount, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
      grossAmount: 150,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(150)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(150)
    expect(result.taxAmount).toBe(26)
    expect(result.contributionTotal).toBe(35.22)
    expect(result.healthContribution).toBe(11.65)
    expect(result.sickContribution).toBe(3.68)
    expect(result.disabilityContribution).toBe(2.25)
    expect(result.pensionContribution).toBe(14.64)
    expect(result.ppkContribution).toBe(3)
    expect(result.netAmount).toBe(88.78)
  })

  it('the yearly calculation, with all contributions, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(12000)
    expect(result.yearlyResult.taxAmount).toBe(1437)
    expect(result.yearlyResult.healthContribution).toBe(931.92)
    expect(result.yearlyResult.sickContribution).toBe(294)
    expect(result.yearlyResult.disabilityContribution).toBe(180)
    expect(result.yearlyResult.pensionContribution).toBe(1171.20)
    expect(result.yearlyResult.ppkContribution).toBe(240)
    expect(result.yearlyResult.netAmount).toBe(7745.88)
  })

  it('the yearly calculation, with all contributions and 15 000 gross amount, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
      grossAmount: 15000,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(180000)
    expect(result.yearlyResult.taxAmount).toBe(22626)
    expect(result.yearlyResult.healthContribution).toBe(14002.64)
    expect(result.yearlyResult.sickContribution).toBe(4410)
    expect(result.yearlyResult.disabilityContribution).toBe(2664.90)
    expect(result.yearlyResult.pensionContribution).toBe(17339.62)
    expect(result.yearlyResult.ppkContribution).toBe(3600)
    expect(result.yearlyResult.netAmount).toBe(115356.84)
  })

  it('the yearly calculation, without contributions, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
      accidentContributionRate: 0,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0,
      isDisabilityContribution: false,
      isHealthContribution: false,
      isPensionContribution: false,
      isSickContribution: false,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(12000)
    expect(result.yearlyResult.taxAmount).toBe(1632)
    expect(result.yearlyResult.healthContribution).toBe(0)
    expect(result.yearlyResult.sickContribution).toBe(0)
    expect(result.yearlyResult.disabilityContribution).toBe(0)
    expect(result.yearlyResult.pensionContribution).toBe(0)
    expect(result.yearlyResult.ppkContribution).toBe(0)
    expect(result.yearlyResult.netAmount).toBe(10368)
  })

  it('the yearly calculation, with all contributions and the relief for young, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
      hasTaxRelief: true,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(12000)
    expect(result.yearlyResult.taxAmount).toBe(0)
    expect(result.yearlyResult.healthContribution).toBe(931.92)
    expect(result.yearlyResult.sickContribution).toBe(294)
    expect(result.yearlyResult.disabilityContribution).toBe(180)
    expect(result.yearlyResult.pensionContribution).toBe(1171.20)
    expect(result.yearlyResult.ppkContribution).toBe(240)
    expect(result.yearlyResult.netAmount).toBe(9182.88)
  })

  it('the yearly calculation, with all contributions and the free amount, for the default year', () => {
    const input:InputFields = {
      ...defaultInput,
      isFreeAmount: true,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(12000)
    expect(result.yearlyResult.taxAmount).toBe(0)
    expect(result.yearlyResult.healthContribution).toBe(931.92)
    expect(result.yearlyResult.sickContribution).toBe(294)
    expect(result.yearlyResult.disabilityContribution).toBe(180)
    expect(result.yearlyResult.pensionContribution).toBe(1171.20)
    expect(result.yearlyResult.ppkContribution).toBe(240)
    expect(result.yearlyResult.netAmount).toBe(9182.88)
  })
})
