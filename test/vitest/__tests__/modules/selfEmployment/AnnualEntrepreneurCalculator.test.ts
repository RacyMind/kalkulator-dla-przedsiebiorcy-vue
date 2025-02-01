import {AnnualEntrepreneurCalculator} from 'components/selfEmployment/logic/AnnualEntrepreneurCalculator'
import {EntrepreneurTaxSystem, useConstants} from 'src/composables/constants'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {createPinia, setActivePinia} from 'pinia'
import {describe, expect, it} from 'vitest'
import {useSettingStore} from 'stores/settingStore'

const annualInput = (monthlyInput:InputFields, isSMallZus = false):InputFields[] => {
  const input:InputFields[] = []
  const { zusConstants} = useConstants()

  for(let i = 0; i < 12; i++) {
    input.push({
      ...monthlyInput,
      contributionBasis: isSMallZus ? zusConstants.value.entrepreneur.basises.small(i) : monthlyInput.contributionBasis,
      monthIndex: i,
    })
  }

  return input
}

describe(' AnnualEntrepreneur Calculator of Self employment in 2023', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const { zusConstants} = useConstants()

  it('The invalid data', () => {
    expect(() => new AnnualEntrepreneurCalculator().getResult()).toThrowError('undefined')
    expect(() => new AnnualEntrepreneurCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test tax scales', () => {
    const input: InputFields = {
      revenue: 10000,
      expenses:0,
      lossFromPreviousMonth: 0,
      taxSystem: EntrepreneurTaxSystem.TaxScale,
      monthIndex: 0,
      previousMonthHealthContributionBasis: 0,
      accidentContributionRate: 0.0167,
      isFpContribution: true,
      isSickContribution: true,
      hasTaxFreeAmount: true,
      hasTaxRelief: false,
      yearlyIncome: 0,
      hasEmploymentContract: false,
      contributionBasis: zusConstants.value.entrepreneur.basises.big,
      businessIsRunning: true,
    }

    describe('The "big" zus contribution basis', () => {
      it('all contributions', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult

        expect(result.healthContribution).toBe(8766.64)
        expect(result.disabilityContribution).toBe(3994.56)
        expect(result.pensionContribution).toBe(9746.76)
        expect(result.accidentContribution).toBe(	833.88)
        expect(result.sickContribution).toBe(1223.28)
        expect(result.fpAndFsContribution).toBe(1223.28)
        expect(result.taxAmount).toBe(8760)
        expect(result.income).toBe(85451.6)
      })

      it('is also an employee', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          hasEmploymentContract: true,
        })).calculate().getResult().annualResult


        expect(result.healthContribution).toBe(10170.9)
        expect(result.disabilityContribution).toBe(0)
        expect(result.pensionContribution).toBe(0)
        expect(result.accidentContribution).toBe(0)
        expect(result.sickContribution).toBe(0)
        expect(result.fpAndFsContribution).toBe(0)
        expect(result.taxAmount).toBe(10800)
        expect(result.income).toBe(99029.1)
      })
    })

    it('The "small" zus contribution basis', () => {
      const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
        ...input,
        contributionBasis: zusConstants.value.entrepreneur.basises.small(0),
        isFpContribution: false,
      }, true)).calculate().getResult().annualResult

      expect(result.healthContribution).toBe(9838.29)
      expect(result.disabilityContribution).toBe(1020.96)
      expect(result.pensionContribution).toBe(2491.14)
      expect(result.accidentContribution).toBe(213.12)
      expect(result.sickContribution).toBe(312.66)
      expect(result.fpAndFsContribution).toBe(0)
      expect(result.taxAmount).toBe(10314)
      expect(result.income).toBe(95809.83)
    })

    it('over the tax threshold', () => {
      const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
        ...input,
        revenue: 15000,
      })).calculate().getResult().annualResult

      expect(result.taxAmount).toBe(24555)
    })
    describe('with the tax relief', () => {
      it('within the tax relief', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          revenue: 7000,
          hasTaxRelief: true,
        })).calculate().getResult().annualResult

        expect(result.taxAmount).toBe(0)
      })

      it('over the tax threshold', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          revenue: 15000,
          hasTaxRelief: true,
        })).calculate().getResult().annualResult

        expect(result.taxAmount).toBe(6546)
      })
    })
  })

  describe('Test the flat tax', () => {
    const input: InputFields = {
      revenue: 10000,
      expenses:0,
      lossFromPreviousMonth: 0,
      taxSystem: EntrepreneurTaxSystem.FlatTax,
      monthIndex: 0,
      previousMonthHealthContributionBasis: 0,
      accidentContributionRate: 0.0167,
      isFpContribution: true,
      isSickContribution: true,
      hasTaxFreeAmount: true,
      hasTaxRelief: false,
      yearlyIncome: 0,
      hasEmploymentContract: false,
      contributionBasis: zusConstants.value.entrepreneur.basises.big,
      businessIsRunning: true,
    }

    describe('The "big" zus contribution basis', () => {
      it('all contributions', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult

        expect(result.healthContribution).toBe(4896.29)
        expect(result.disabilityContribution).toBe(3994.56)
        expect(result.pensionContribution).toBe(9746.76)
        expect(result.accidentContribution).toBe(	833.88)
        expect(result.sickContribution).toBe(1223.28)
        expect(result.fpAndFsContribution).toBe(1223.28)
        expect(result.taxAmount).toBe(18640)
        expect(result.income).toBe(79441.95)
      })

      it('is also an employee', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          hasEmploymentContract: true,
        })).calculate().getResult().annualResult


        expect(result.healthContribution).toBe(5660.9)
        expect(result.disabilityContribution).toBe(0)
        expect(result.pensionContribution).toBe(0)
        expect(result.accidentContribution).toBe(0)
        expect(result.sickContribution).toBe(0)
        expect(result.fpAndFsContribution).toBe(0)
        expect(result.taxAmount).toBe(21726)
        expect(result.income).toBe(92613.1)
      })
    })

    it('The "small" zus contribution basis', () => {
      const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
        ...input,
        contributionBasis: zusConstants.value.entrepreneur.basises.small(0),
        isFpContribution: false,
      }, true)).calculate().getResult().annualResult

      expect(result.healthContribution).toBe(5479.82)
      expect(result.disabilityContribution).toBe(1020.96)
      expect(result.pensionContribution).toBe(2491.14)
      expect(result.accidentContribution).toBe(213.12)
      expect(result.sickContribution).toBe(312.66)
      expect(result.fpAndFsContribution).toBe(0)
      expect(result.taxAmount).toBe(20991)
      expect(result.income).toBe(89491.3)
    })

    describe('with the tax relief', () => {
      it('within the tax relief', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          revenue: 7000,
          hasTaxRelief: true,
        })).calculate().getResult().annualResult

        expect(result.taxAmount).toBe(0)
      })

      it('over the tax threshold', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          revenue: 15000,
          hasTaxRelief: true,
        })).calculate().getResult().annualResult

        expect(result.taxAmount).toBe(15178)
      })
    })
  })

  describe('Test the lump sum tax', () => {
    const input: InputFields = {
      revenue: 10000,
      expenses:0,
      lossFromPreviousMonth: 0,
      taxSystem: EntrepreneurTaxSystem.LumpSumTax,
      lumpSumTaxRate: 0.02,
      monthIndex: 0,
      previousMonthHealthContributionBasis: 0,
      accidentContributionRate: 0.0167,
      isFpContribution: true,
      isSickContribution: true,
      hasTaxFreeAmount: true,
      hasTaxRelief: false,
      yearlyIncome: 0,
      hasEmploymentContract: false,
      contributionBasis: zusConstants.value.entrepreneur.basises.big,
      businessIsRunning: true,
    }

    describe('The "big" zus contribution basis', () => {
      it('all contributions', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult

        expect(result.healthContribution).toBe(7523.16)
        expect(result.disabilityContribution).toBe(3994.56)
        expect(result.pensionContribution).toBe(9746.76)
        expect(result.accidentContribution).toBe(	833.88)
        expect(result.sickContribution).toBe(1223.28)
        expect(result.fpAndFsContribution).toBe(1223.28)
        expect(result.taxAmount).toBe(2004)
        expect(result.income).toBe(93451.08)
      })

      it('is also an employee', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          hasEmploymentContract: true,
        })).calculate().getResult().annualResult


        expect(result.healthContribution).toBe(7523.16)
        expect(result.disabilityContribution).toBe(0)
        expect(result.pensionContribution).toBe(0)
        expect(result.accidentContribution).toBe(0)
        expect(result.sickContribution).toBe(0)
        expect(result.fpAndFsContribution).toBe(0)
        expect(result.taxAmount).toBe(2328)
        expect(result.income).toBe(110148.84)
      })
    })

    it('The "small" zus contribution basis', () => {
      const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
        ...input,
        contributionBasis: zusConstants.value.entrepreneur.basises.small(0),
        isFpContribution: false,
      }, true)).calculate().getResult().annualResult

      expect(result.healthContribution).toBe(7523.16)
      expect(result.disabilityContribution).toBe(1020.96)
      expect(result.pensionContribution).toBe(2491.14)
      expect(result.accidentContribution).toBe(213.12)
      expect(result.sickContribution).toBe(312.66)
      expect(result.fpAndFsContribution).toBe(0)
      expect(result.taxAmount).toBe(2244)
      expect(result.income).toBe(106194.96)
    })

    describe('The different health contributions', () => {
      it('the first amount', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          revenue: 5000,
        })).calculate().getResult().annualResult

        expect(result.healthContribution).toBe(4513.92)
      })

      it('the second amount', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput(input)).calculate().getResult().annualResult

        expect(result.healthContribution).toBe(7523.16)
      })

      it('the third amount', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          revenue: 50000,
        })).calculate().getResult().annualResult

        expect(result.healthContribution).toBe(13541.76)
      })
    })

    describe('with the tax relief', () => {
      it('within the tax relief', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          revenue: 7000,
          hasTaxRelief: true,
        })).calculate().getResult().annualResult

        expect(result.taxAmount).toBe(0)
      })

      it('over the tax threshold', () => {
        const result = new AnnualEntrepreneurCalculator().setInputData(annualInput({
          ...input,
          revenue: 15000,
          hasTaxRelief: true,
        })).calculate().getResult().annualResult

        expect(result.taxAmount).toBe(1659)
      })
    })
  })
})
