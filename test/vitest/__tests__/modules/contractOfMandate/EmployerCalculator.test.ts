import {EmployerCalculator} from 'components/contractOfMandate/logic/EmployerCalculator'
import {InputFields} from 'components/contractOfMandate/interfaces/InputFields'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

describe('Employer Calculator of Contract of Mandate on 1.11.2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)
  })

  it('The invalid data', () => {
    expect(() => new EmployerCalculator().getResult()).toThrowError('undefined')
    expect(() => new EmployerCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test ZUS contributions', () => {
    const input: InputFields = {
      accidentContributionRate: 0.0167,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0.015,
      grossAmount: 1000,
      isDisabilityContribution: true,
      isFpContribution: true,
      partTaxReducingAmount: 0,
      isHealthContribution: true,
      isPensionContribution: true,
      hasTaxRelief: false,
      isSickContribution: true,
      partOfWorkWithAuthorExpenses: 0,
      canLumpSumTaxBe: true,
    }

    it('The accident contribution', () => {
      expect(new EmployerCalculator().setInputData(input).calculate().getResult().accidentContribution).toBe(16.70)

      expect(new EmployerCalculator().setInputData({
        ...input,
        accidentContributionRate: 0,
      }).calculate().getResult().accidentContribution).toBe(0)
    })

    it('The disability contribution', () => {
      expect(new EmployerCalculator().setInputData(input).calculate().getResult().disabilityContribution).toBe(65)

      expect(new EmployerCalculator().setInputData({
        ...input,
        isDisabilityContribution: false,
      }).calculate().getResult().disabilityContribution).toBe(0)
    })

    it('The pension contribution', () => {
      expect(new EmployerCalculator().setInputData(input).calculate().getResult().pensionContribution).toBe(97.6)

      expect(new EmployerCalculator().setInputData({
        ...input,
        isPensionContribution: false,
      }).calculate().getResult().pensionContribution).toBe(0)
    })

    it('The PPK contribution', () => {
      expect(new EmployerCalculator().setInputData(input).calculate().getResult().ppkContribution).toBe(15)

      expect(new EmployerCalculator().setInputData({
        ...input,
        employerPpkContributionRate: 0,
      }).calculate().getResult().ppkContribution).toBe(0)
    })

    it('The FP (+ all related)  contributions', () => {
      const result = new EmployerCalculator().setInputData(input).calculate().getResult()
      expect(result.fpContribution).toBe(10)
      expect(result.fgspContribution).toBe(1)
      expect(result.fsContribution).toBe(14.5)

      const resultWithoutContributions = new EmployerCalculator().setInputData({
        ...input,
        isFpContribution: false,
      }).calculate().getResult()
      expect(resultWithoutContributions.fpContribution).toBe(0)
      expect(resultWithoutContributions.fgspContribution).toBe(0)
      expect(resultWithoutContributions.fsContribution).toBe(0)
    })
  })

  describe('Test the full result', () => {
    const input: InputFields = {
      accidentContributionRate: 0.0167,
      employeePpkContributionRate: 0,
      employerPpkContributionRate: 0.015,
      grossAmount: 5000,
      isDisabilityContribution: true,
      isFpContribution: true,
      partTaxReducingAmount: 0,
      isHealthContribution: true,
      isPensionContribution: true,
      hasTaxRelief: false,
      isSickContribution: true,
      partOfWorkWithAuthorExpenses: 0,
      canLumpSumTaxBe: true,
    }

    it('The standard cases', () => {
      const result  = new EmployerCalculator().setInputData(input).calculate().getResult()

      expect(result.grossAmount).toBe(5000)
      expect(result.totalAmount).toBe(6099)
    })

    it('without ZUS contributions', () => {
      const result  = new EmployerCalculator().setInputData({
        ...input,
        employerPpkContributionRate: 0,
        accidentContributionRate: 0,
        isDisabilityContribution: false,
        isFpContribution: false,
        partTaxReducingAmount: 12,
        isPensionContribution: false,
      }).calculate().getResult()

      expect(result.grossAmount).toBe(5000)
      expect(result.totalAmount).toBe(5000)
    })
  })
})
