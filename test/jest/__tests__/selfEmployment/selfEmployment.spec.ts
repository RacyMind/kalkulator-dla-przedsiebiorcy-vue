import {SelfEmploymentInputFields} from '../../../../src/components/selfEmployment/interfaces/SelfEmploymentInputFields'
import {SelfEmploymentSingleResult} from '../../../../src/components/selfEmployment/interfaces/SelfEmploymentSingleResult'
import {SelfEmploymentYearlyResult} from '../../../../src/components/selfEmployment/interfaces/SelfEmploymentYearlyResult'
import { describe, expect, it } from '@jest/globals'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import constants from '../../../../src/logic/constants'
import helpers from '../../../../src/logic/helpers'
import selfEmployment from '../../../../src/components/selfEmployment/selfEmployment'

installQuasarPlugin()

const defaultInputForGeneral:SelfEmploymentInputFields = {
  accidentContributionRate: 0.0167,
  amount: 7000,
  customBasisForZus: 0,
  expenses: 0,
  incomeTaxType: constants.TAX_TYPES.GENERAL,
  isFpContribution: true,
  isFreeAmount: true,
  isFullTimeJob: false,
  isReliefForBigFamily: false,
  isReliefForCompanyStart: false,
  isReliefForMiddleClass: false,
  isReliefForSenior: false,
  isSickContribution: true,
  isSmallZus: false,
  taxRateForLumpSum: 0,
  year: helpers.getDefaultYear(),
}

const defaultInputForLinear:SelfEmploymentInputFields = {
  accidentContributionRate: 0.0167,
  amount: 7000,
  customBasisForZus: 0,
  expenses: 0,
  incomeTaxType: constants.TAX_TYPES.LINEAR,
  isFpContribution: true,
  isFreeAmount: true,
  isFullTimeJob: false,
  isReliefForBigFamily: false,
  isReliefForCompanyStart: false,
  isReliefForMiddleClass: false,
  isReliefForSenior: false,
  isSickContribution: true,
  isSmallZus: false,
  taxRateForLumpSum: 0,
  year: helpers.getDefaultYear(),
}

const defaultInputForLLumpSum:SelfEmploymentInputFields = {
  accidentContributionRate: 0.0167,
  amount: 7000,
  customBasisForZus: 0,
  expenses: 0,
  incomeTaxType: constants.TAX_TYPES.LUMP_SUM,
  isFpContribution: true,
  isFreeAmount: false,
  isFullTimeJob: false,
  isReliefForBigFamily: false,
  isReliefForCompanyStart: false,
  isReliefForMiddleClass: false,
  isReliefForSenior: false,
  isSickContribution: true,
  isSmallZus: false,
  taxRateForLumpSum: 0.15,
  year: helpers.getDefaultYear(),
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
    expect(result.contributionTotal).toBe(1732.26)
    expect(result.healthContribution).toBe(520.98)
    expect(result.sickContribution).toBe(87.05)
    expect(result.disabilityContribution).toBe(284.26)
    expect(result.pensionContribution).toBe(693.58)
    expect(result.accidentContribution).toBe(59.34)
    expect(result.fpContribution).toBe(87.05)
    expect(result.netAmount).toBe(4708.74)
  })

  it('the monthly calculation, with the 2000 amount, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      amount: 2000,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(2000)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(789)
    expect(result.taxAmount).toBe(0)
    expect(result.contributionTotal).toBe(1482.18)
    expect(result.healthContribution).toBe(270.90)
    expect(result.sickContribution).toBe(87.05)
    expect(result.disabilityContribution).toBe(284.26)
    expect(result.pensionContribution).toBe(693.58)
    expect(result.accidentContribution).toBe(59.34)
    expect(result.fpContribution).toBe(87.05)
    expect(result.netAmount).toBe(517.82)
  })

  it('the monthly calculation, without free amount, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      isFreeAmount: false,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(7000)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(5789)
    expect(result.taxAmount).toBe(984)
    expect(result.contributionTotal).toBe(1732.26)
    expect(result.healthContribution).toBe(520.98)
    expect(result.sickContribution).toBe(87.05)
    expect(result.disabilityContribution).toBe(284.26)
    expect(result.pensionContribution).toBe(693.58)
    expect(result.accidentContribution).toBe(59.34)
    expect(result.fpContribution).toBe(87.05)
    expect(result.netAmount).toBe(4283.74)
  })

  it('the monthly calculation, with small ZUS, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      isSmallZus: true,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(7000)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(6714)
    expect(result.taxAmount).toBe(716)
    expect(result.contributionTotal).toBe(890)
    expect(result.healthContribution).toBe(604.29)
    expect(result.sickContribution).toBe(22.12)
    expect(result.disabilityContribution).toBe(72.24)
    expect(result.pensionContribution).toBe(176.27)
    expect(result.accidentContribution).toBe(15.08)
    expect(result.fpContribution).toBe(0)
    expect(result.netAmount).toBe(5394)
  })

  it('the monthly calculation, with a full time job, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      isFullTimeJob: true,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(7000)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(7000)
    expect(result.taxAmount).toBe(765)
    expect(result.contributionTotal).toBe(630)
    expect(result.healthContribution).toBe(630)
    expect(result.sickContribution).toBe(0)
    expect(result.disabilityContribution).toBe(0)
    expect(result.pensionContribution).toBe(0)
    expect(result.accidentContribution).toBe(0)
    expect(result.fpContribution).toBe(0)
    expect(result.netAmount).toBe(5605)
  })

  it('the monthly calculation, with the relief for middle class, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      isReliefForMiddleClass: true,
    }

    const result = monthlyResult(input)

    expect(result.grossAmount).toBe(7000)
    expect(result.expenses).toBe(0)
    expect(result.basisForTax).toBe(5789)
    expect(result.taxAmount).toBe(472)
    expect(result.contributionTotal).toBe(1732.26)
    expect(result.healthContribution).toBe(520.98)
    expect(result.sickContribution).toBe(87.05)
    expect(result.disabilityContribution).toBe(284.26)
    expect(result.pensionContribution).toBe(693.58)
    expect(result.accidentContribution).toBe(59.34)
    expect(result.fpContribution).toBe(87.05)
    expect(result.netAmount).toBe(4795.74)
  })

  it('the yearly calculation for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(84000)
    expect(result.yearlyResult.taxAmount).toBe(6708)
    expect(result.yearlyResult.healthContribution).toBe(6251.76)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(1044.60)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(56504.88)
  })

  it('the yearly calculation, with the 18 000 amount, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      amount: 18000,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(216000)
    expect(result.yearlyResult.taxAmount).toBe(43067)
    expect(result.yearlyResult.healthContribution).toBe(18131.76)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(1044.60)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(140265.88)
  })

  it('the yearly calculation, with the relief for company start, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      isFpContribution: false,
      isReliefForCompanyStart: true,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(84000)
    expect(result.yearlyResult.taxAmount).toBe(8886)
    expect(result.yearlyResult.healthContribution).toBe(7405.74)
    expect(result.yearlyResult.sickContribution).toBe(132.72)
    expect(result.yearlyResult.disabilityContribution).toBe(433.44)
    expect(result.yearlyResult.pensionContribution).toBe(1057.62)
    expect(result.yearlyResult.fpContribution).toBe(0)
    expect(result.yearlyResult.accidentContribution).toBe(90.48)
    expect(result.yearlyResult.netAmount).toBe(65994)
  })

  it('the yearly calculation, with the relief for middle class, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      isReliefForMiddleClass: true,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(84000)
    expect(result.yearlyResult.taxAmount).toBe(5664)
    expect(result.yearlyResult.healthContribution).toBe(6251.76)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(1044.60)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(57548.88)
  })

  it('the yearly calculation, with the relief for a senior, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      isReliefForSenior: true,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(84000)
    expect(result.yearlyResult.taxAmount).toBe(0)
    expect(result.yearlyResult.healthContribution).toBe(6251.76)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(1044.60)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(63212.88)
  })

  it('the yearly calculation, with the relief for a big family, for the default year', () => {
    const input:SelfEmploymentInputFields = {
      ...defaultInputForGeneral,
      isReliefForBigFamily: true,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(84000)
    expect(result.yearlyResult.taxAmount).toBe(0)
    expect(result.yearlyResult.healthContribution).toBe(6251.76)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(1044.60)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(63212.88)
  })
})

describe('selfEmployment - income tax rule: LINEAR', () => {

  it('the yearly calculation for the default year', () => {
    const input: SelfEmploymentInputFields = {
      ...defaultInputForLinear,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(84000)
    expect(result.yearlyResult.taxAmount).toBe(13200)
    expect(result.yearlyResult.healthContribution).toBe(3403.80)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(1044.60)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(52860.84)
  })
})

describe('selfEmployment - income tax rule: LUMP SUM', () => {
  it('the yearly calculation for the default year', () => {
    const input: SelfEmploymentInputFields = {
      ...defaultInputForLLumpSum,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(84000)
    expect(result.yearlyResult.taxAmount).toBe(10572)
    expect(result.yearlyResult.healthContribution).toBe(6718.68)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(1044.60)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(	52173.96)
  })
  it('the yearly calculation, without FP contribution, for the default year', () => {
    const input: SelfEmploymentInputFields = {
      ...defaultInputForLLumpSum,
      isFpContribution: false,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(84000)
    expect(result.yearlyResult.taxAmount).toBe(10572)
    expect(result.yearlyResult.healthContribution).toBe(6718.68)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(0)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(	53218.56)
  })

  it('the yearly calculation, with the 18 000 amount, for the default year', () => {
    const input: SelfEmploymentInputFields = {
      ...defaultInputForLLumpSum,
      amount: 18000,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(216000)
    expect(result.yearlyResult.taxAmount).toBe(	30372)
    expect(result.yearlyResult.healthContribution).toBe(6718.68)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(1044.60)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(	164373.96)
  })

  it('the yearly calculation, with the 29 000 amount, for the default year', () => {
    const input: SelfEmploymentInputFields = {
      ...defaultInputForLLumpSum,
      amount: 29000,
    }

    const result = yearlyResult(yearlyInput(input))

    expect(result.yearlyResult.grossAmount).toBe(348000)
    expect(result.yearlyResult.taxAmount).toBe(50172)
    expect(result.yearlyResult.healthContribution).toBe(12093.72)
    expect(result.yearlyResult.sickContribution).toBe(1044.60)
    expect(result.yearlyResult.disabilityContribution).toBe(3411.12)
    expect(result.yearlyResult.pensionContribution).toBe(8322.96)
    expect(result.yearlyResult.fpContribution).toBe(1044.60)
    expect(result.yearlyResult.accidentContribution).toBe(712.08)
    expect(result.yearlyResult.netAmount).toBe(271198.92)
  })
})
