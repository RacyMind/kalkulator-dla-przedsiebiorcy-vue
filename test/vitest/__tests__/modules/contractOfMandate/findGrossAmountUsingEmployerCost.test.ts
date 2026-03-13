import { beforeAll, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { EmployerCalculator } from 'components/contractOfMandate/logic/EmployerCalculator'
import { InputFields } from 'components/contractOfMandate/interfaces/InputFields'
import { findGrossAmountUsingTargetAmount } from 'src/logic/findGrossAmountUsingNetAmount'
import { useSettingStore } from 'stores/settingStore'

describe('Find gross amount using employer cost in contract of mandate on 1.11.2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023, 11, 1)
  })

  const defaultInput: InputFields = {
    accidentContributionRate: 0.0167,
    employeePpkContributionRate: 0,
    employerPpkContributionRate: 0.015,
    grossAmount: 1000,
    isDisabilityContribution: true,
    isFpContribution: true,
    isFgspContribution: true,
    partTaxReducingAmount: 0,
    isHealthContribution: true,
    isPensionContribution: true,
    hasTaxRelief: false,
    isSickContribution: true,
    partOfWorkWithAuthorExpenses: 0,
    canLumpSumTaxBe: true,
  }

  it('matches employer total amount for a monthly input', () => {
    const expectedGrossAmount = 5000
    const input = {
      ...defaultInput,
      grossAmount: expectedGrossAmount,
    }

    const employerCostAmount = new EmployerCalculator()
      .setInputData(input)
      .calculate()
      .getResult().totalAmount

    const grossAmount = findGrossAmountUsingTargetAmount(
      (grossCandidate) => {
        input.grossAmount = grossCandidate
        return new EmployerCalculator().setInputData(input).calculate().getResult()
      },
      employerCostAmount * 0.5,
      employerCostAmount * 2,
      employerCostAmount,
      (result) => result.totalAmount,
    )

    const result = new EmployerCalculator()
      .setInputData({
        ...input,
        grossAmount,
      })
      .calculate()
      .getResult()

    expect(grossAmount).toBe(expectedGrossAmount)
    expect(result.totalAmount).toBe(employerCostAmount)
  })

  it('matches employer total amount with carried contribution basis', () => {
    const firstMonthInput = {
      ...defaultInput,
      grossAmount: 300000,
    }
    const carriedContributionBasis = new EmployerCalculator()
      .setInputData(firstMonthInput)
      .calculate()
      .getSumUpContributionBasis()

    const expectedGrossAmount = 5000
    const secondMonthInput = {
      ...defaultInput,
      grossAmount: expectedGrossAmount,
    }
    const employerCostAmount = new EmployerCalculator()
      .setSumUpContributionBasis(carriedContributionBasis)
      .setInputData(secondMonthInput)
      .calculate()
      .getResult().totalAmount

    const grossAmount = findGrossAmountUsingTargetAmount(
      (grossCandidate) => {
        secondMonthInput.grossAmount = grossCandidate
        return new EmployerCalculator()
          .setSumUpContributionBasis(carriedContributionBasis)
          .setInputData(secondMonthInput)
          .calculate()
          .getResult()
      },
      employerCostAmount * 0.5,
      employerCostAmount * 2,
      employerCostAmount,
      (result) => result.totalAmount,
    )

    const result = new EmployerCalculator()
      .setSumUpContributionBasis(carriedContributionBasis)
      .setInputData({
        ...secondMonthInput,
        grossAmount,
      })
      .calculate()
      .getResult()

    expect(grossAmount).toBe(expectedGrossAmount)
    expect(result.totalAmount).toBe(employerCostAmount)
  })
})
