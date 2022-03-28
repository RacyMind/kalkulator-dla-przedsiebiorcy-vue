import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import { describe, expect, it } from '@jest/globals'
import selfEmployment from '../../../../src/components/selfEmployment/selfEmployment'
import helpers from '../../../../src/logic/helpers'
import {SelfEmploymentInputFields} from '../../../../src/components/selfEmployment/interfaces/SelfEmploymentInputFields'
import {SelfEmploymentYearlyResult} from '../../../../src/components/selfEmployment/interfaces/SelfEmploymentYearlyResult'
import {SelfEmploymentSingleResult} from '../../../../src/components/selfEmployment/interfaces/SelfEmploymentSingleResult'
import constants from '../../../../src/logic/constants'

installQuasarPlugin()

const defaultInputForGeneral:SelfEmploymentInputFields = {
  year: helpers.getDefaultYear(),
  amount: 7000,
  expenses: 0,
  incomeTaxType: constants.TAX_TYPES.GENERAL,
  taxRateForLumpSum: 0,
  isFreeAmount: true,
  isReliefForSenior: false,
  isReliefForBigFamily: false,
  isReliefForMiddleClass: false,
  isReliefForCompanyStart: false,
  isFpContribution: false,
  isSickContribution: false,
  accidentContributionRate: 0.0167,
  isSmallZus: false,
  isFullTimeJob: false,
  customBasisForZus: 0,
}

const yearlyInput = (monthlyInput:SelfEmploymentInputFields):SelfEmploymentInputFields[] => {
  const inputs:SelfEmploymentInputFields[] = []
  for(let i = 0; i < 12; i++) {
    inputs.push(monthlyInput)
  }

  return inputs
}

const yearlyResult = (input:SelfEmploymentInputFields[]):SelfEmploymentYearlyResult => {
  selfEmployment.setParams(input[0].year)
  return selfEmployment.getYearlyResult(input)
}

const monthlyResult = (input:SelfEmploymentInputFields):SelfEmploymentSingleResult => {
  selfEmployment.setParams(input.year)
  return selfEmployment.getMonthlyResult(input)
}

describe('selfEmployment - income tax rule: GENERAL', () => {
  it('the monthly calculation for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(7000)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(5789)
    expect(result.taxAmount).toBe(559)
    expect(result.contributionTotal).toBe(1653.05)
    expect(result.healthContribution).toBe(528.82)
    expect(result.sickContribution).toBe(87.05)
    expect(result.disabilityContribution).toBe(284.26)
    expect(result.pensionContribution).toBe(693.58)
    expect(result.accidentContribution).toBe(59.34)
    expect(result.fpContribution).toBe(87.05)
    expect(result.netAmount).toBe(4708.74)
  })
})
