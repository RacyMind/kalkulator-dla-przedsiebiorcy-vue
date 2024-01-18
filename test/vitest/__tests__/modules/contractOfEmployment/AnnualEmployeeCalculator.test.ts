import {AnnualEmployeeCalculator} from 'components/contractOfEmployment/logic/AnnualEmployeeCalculator'
import {InputFields} from 'components/contractOfEmployment/interfaces/InputFields'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

const annualInput = (monthlyInput:InputFields):InputFields[] => {
  const input:InputFields[] = []

  for(let i = 0; i < 12; i++) {
    input.push(monthlyInput)
  }

  return input
}

describe('Annual Employee Calculator of Contract of Employment on 1.11.2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)
  })

  it('The invalid data', () => {
    expect(() => new AnnualEmployeeCalculator().getResult()).toThrowError('undefined')
    expect(() => new AnnualEmployeeCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test ZUS contributions', () => {
    const input: InputFields = {
      accidentContributionRate: 0,
      employeePpkContributionRate: 0.02,
      employerPpkContributionRate: 0,
      grossAmount: 1000,
      isFpContribution: true,
      isFgspContribution: true,
      isDisabilityContribution: true,
      isSickContribution: true,
      isHealthContribution: true,
      isPensionContribution: true,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      partOfWorkWithAuthorExpenses: 0,
      workInLivePlace: true,
    }

    it('The health contribution', () => {
      expect(new AnnualEmployeeCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.healthContribution).toBe(931.92)
    })

    it('The sick contribution', () => {
      expect(new AnnualEmployeeCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.sickContribution).toBe(294)
    })

    it('The disability contribution', () => {
      expect(new AnnualEmployeeCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.disabilityContribution).toBe(180)
    })

    it('The pension contribution', () => {
      expect(new AnnualEmployeeCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.pensionContribution).toBe(1171.2)
    })

    it('The PPK contribution', () => {
      expect(new AnnualEmployeeCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.ppkContribution).toBe(240)

      expect(new AnnualEmployeeCalculator().setInputData(annualInput({
        ...input,
        employeePpkContributionRate: 0,
      })).calculate().getResult().annualResult.ppkContribution).toBe(0)
    })

    it('Over the zus contribution limit', () => {
      const result = new AnnualEmployeeCalculator().setInputData(annualInput({
        ...input,
        grossAmount: 50000,
      })).calculate().getResult().annualResult

      expect(result.disabilityContribution).toBe(3120.75)
      expect(result.pensionContribution).toBe(20305.68)
      expect(result.sickContribution).toBe(14700)
      expect(result.ppkContribution).toBe(12000)
      expect(result.healthContribution).toBe(50568.62)
    })
  })

  describe('Test the tax', () => {
    const input: InputFields = {
      accidentContributionRate: 0,
      employeePpkContributionRate: 0.02,
      employerPpkContributionRate: 0,
      grossAmount: 1000,
      isFpContribution: true,
      isFgspContribution: true,
      isDisabilityContribution: true,
      isSickContribution: true,
      isHealthContribution: true,
      isPensionContribution: true,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      partOfWorkWithAuthorExpenses: 0,
      workInLivePlace: true,
    }

    it('The first rate', () => {
      expect(new AnnualEmployeeCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.taxAmount).toBe(888)

      expect(new AnnualEmployeeCalculator().setInputData(annualInput({
        ...input,
        partTaxReducingAmount: 12,
      })).calculate().getResult().annualResult.taxAmount).toBe(0)

      expect(new AnnualEmployeeCalculator().setInputData(annualInput({
        ...input,
        employerPpkContributionRate: 0.015,
      })).calculate().getResult().annualResult.taxAmount).toBe(900)
    })

    it('The second rate', () => {
      expect(new AnnualEmployeeCalculator().setInputData(annualInput({
        ...input,
        grossAmount: 15000,
      })).calculate().getResult().annualResult.taxAmount).toBe(24742)

      expect(new AnnualEmployeeCalculator().setInputData(annualInput({
        ...input,
        grossAmount: 15000,
        partTaxReducingAmount: 12,
      })).calculate().getResult().annualResult.taxAmount).toBe(21142)
    })

    it('With the tax relief', () => {
      expect(new AnnualEmployeeCalculator().setInputData(annualInput({
        ...input,
        hasTaxRelief: true,
      })).calculate().getResult().annualResult.taxAmount).toBe(0)

      expect(new AnnualEmployeeCalculator().setInputData(annualInput({
        ...input,
        hasTaxRelief: true,
        grossAmount: 15000,
      })).calculate().getResult().annualResult.taxAmount).toBe(9398)
    })
  })

  describe('Test the net and gross amount', () => {
    const input: InputFields = {
      accidentContributionRate: 0,
      employeePpkContributionRate: 0.02,
      employerPpkContributionRate: 0,
      grossAmount: 1000,
      isFpContribution: true,
      isFgspContribution: true,
      isDisabilityContribution: true,
      isSickContribution: true,
      isHealthContribution: true,
      isPensionContribution: true,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      partOfWorkWithAuthorExpenses: 0,
      workInLivePlace: true,
    }

    it('The standard cases', () => {
      const result = new AnnualEmployeeCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult
      expect(result.grossAmount).toBe(12000)
      expect(result.netAmount).toBe(8294.88)
    })
  })
})
