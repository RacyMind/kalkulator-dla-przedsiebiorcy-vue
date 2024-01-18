import {AnnualEmployerCalculator} from 'components/contractOfEmployment/logic/AnnualEmployerCalculator'
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

describe('Annual Employer Calculator of Contract of Employment on 1.11.2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)
  })

  it('The invalid data', () => {
    expect(() => new AnnualEmployerCalculator().getResult()).toThrowError('undefined')
    expect(() => new AnnualEmployerCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test ZUS contributions', () => {
    const input: InputFields = {
      accidentContributionRate: 0.0167,
      employeePpkContributionRate: 0.02,
      employerPpkContributionRate: 0.015,
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

    it('The accident contribution', () => {
      expect(new AnnualEmployerCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.accidentContribution).toBe(200.4)

      expect(new AnnualEmployerCalculator().setInputData(annualInput({
        ...input,
        accidentContributionRate: 0,
      })).calculate().getResult().annualResult.accidentContribution).toBe(0)
    })

    it('The disability contribution', () => {
      expect(new AnnualEmployerCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.disabilityContribution).toBe(780)
    })

    it('The pension contribution', () => {
      expect(new AnnualEmployerCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.pensionContribution).toBe(1171.2)
    })

    it('The PPK contribution', () => {
      expect(new AnnualEmployerCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult.ppkContribution).toBe(180)
    })

    it('The FP (+ all related)  contributions', () => {
      const result = new AnnualEmployerCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult
      expect(result.fpContribution).toBe(120)
      expect(result.fgspContribution).toBe(12)
      expect(result.fsContribution).toBe(174)

      const resultWithoutContributions = new AnnualEmployerCalculator().setInputData(annualInput({
        ...input,
        isFpContribution: false,
        isFgspContribution: false,
      })).calculate().getResult().annualResult
      expect(resultWithoutContributions.fpContribution).toBe(0)
      expect(resultWithoutContributions.fgspContribution).toBe(0)
      expect(resultWithoutContributions.fsContribution).toBe(0)
    })

    it('Over the zus contribution limit', () => {
      const result = new AnnualEmployerCalculator().setInputData(annualInput({
        ...input,
        grossAmount: 50000,
      })).calculate().getResult().annualResult

      expect(result.disabilityContribution).toBe(13523.25)
      expect(result.pensionContribution).toBe(20305.68)
      expect(result.accidentContribution).toBe(10020)
      expect(result.ppkContribution).toBe(9000)
      expect(result.fpContribution).toBe(6000)
      expect(result.fgspContribution).toBe(600)
      expect(result.fsContribution).toBe(8700)
    })
  })

  describe('Test the gross and total amount', () => {
    const input: InputFields = {
      accidentContributionRate: 0.0167,
      employeePpkContributionRate: 0.02,
      employerPpkContributionRate: 0.015,
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
      const result = new AnnualEmployerCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult
      expect(result.grossAmount).toBe(12000)
      expect(result.totalAmount).toBe(14637.6)
    })
  })
})
