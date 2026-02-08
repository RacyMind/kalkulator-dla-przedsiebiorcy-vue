import {EmployeeCalculator} from 'components/contractOfMandate/logic/EmployeeCalculator'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {findGrossAmountUsingNetAmount} from 'src/logic/findGrossAmountUsingNetAmount'
import {useSettingStore} from 'stores/settingStore'

describe('Find the gross amount using net amount on 1.11.2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)
  })

  const defaultInput: InputFields = {
    accidentContributionRate: 0,
    employeePpkContributionRate:0,
    employerPpkContributionRate: 0,
    grossAmount: 1000,
    isDisabilityContribution: true,
    isFpContribution: true,
    isFgspContribution: true,
    partTaxReducingAmount: 12,
    isHealthContribution: true,
    isPensionContribution: true,
    hasTaxRelief: false,
    isSickContribution: true,
    partOfWorkWithAuthorExpenses: 0,
    canLumpSumTaxBe: true,
  }

  it('The test with ZUS contributions', () => {
    const amount = 1000

    const sumUpAmounts = {
      sumUpTaxBasis: 0,
      sumUpContributionBasis: 0,
      sumUpAuthorExpenses: 0,
      sumUpGrossAmount: 0,
    }

    const calculator = new EmployeeCalculator()
    expect(findGrossAmountUsingNetAmount(
      (grossAmount) => {
        defaultInput.grossAmount = grossAmount
        return calculator.setSumUpAmounts(sumUpAmounts).setInputData(defaultInput).calculate().getResult()
      },
      amount * 0.5, amount * 2, amount,
    )).toBe(1273.49)
  })

  it('The test without ZUS contributions', () => {
    const amount = 1000
    const input = {
      ...defaultInput,
      isDisabilityContribution: false,
      isFpContribution: false,
      isHealthContribution: false,
      isPensionContribution: false,
      isSickContribution: false,
    }

    const sumUpAmounts = {
      sumUpTaxBasis: 0,
      sumUpContributionBasis: 0,
      sumUpAuthorExpenses: 0,
      sumUpGrossAmount: 0,
    }

    const calculator = new EmployeeCalculator()
    expect(findGrossAmountUsingNetAmount(
      (grossAmount) => {
        input.grossAmount = grossAmount
        return calculator.setSumUpAmounts(sumUpAmounts).setInputData(input).calculate().getResult()
      },
      amount * 0.5, amount * 2, amount,
    )).toBe(1000)
  })
})
