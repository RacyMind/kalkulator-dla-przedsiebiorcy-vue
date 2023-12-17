import {EntrepreneurCalculator} from 'components/selfEmployment/logic/EntrepreneurCalculator'
import {EntrepreneurTaxSystem, useConstants} from 'src/composables/constants'
import {InputFields} from 'components/selfEmployment/interfaces/InputFields'
import {createPinia, setActivePinia} from 'pinia'
import {describe, expect, it} from 'vitest'
import {useSettingStore} from 'stores/settingStore'

describe('Entrepreneur Calculator of Selfemployment on 1.11.2023', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const { incomeTaxConstnts, zusConstants} = useConstants()

  it('The invalid data', () => {
    expect(() => new EntrepreneurCalculator().getResult()).toThrowError('undefined')
    expect(() => new EntrepreneurCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test general rules', () => {
    const input: InputFields = {
      revenue: 10000,
      expenses:0,
      taxSystem: EntrepreneurTaxSystem.GeneralRules,
      monthIndex: 10,
      previousMonthHealthContributionBasis: 10000,
      accidentContributionRate: 0.0167,
      isFpContribution: true,
      isSickContribution: true,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      yearlyIncome: 0,
      hasEmploymentContract: false,
      contributionBasis: zusConstants.entrepreneur.basises.big,
    }

    describe('The "big" zus contribution basis', () => {
      it('all contributions', () => {
        const result = new EntrepreneurCalculator().setInputData(input).calculate().getResult()

        expect(result.healthContribution).toBe(900)
        expect(result.disabilityContribution).toBe(332.88)
        expect(result.pensionContribution).toBe(812.23)
        expect(result.accidentContribution).toBe(69.49)
        expect(result.sickContribution).toBe(101.94)
        expect(result.fpContribution).toBe(41.61)
        expect(result.fsContribution).toBe(60.33)
        expect(result.healthContributionBasis).toBe(8581.52)
        expect(result.taxBasis).toBe(8582)
        expect(result.taxAmount).toBe(1030)
        expect(result.income).toBe(6651.52)
      })

      it('is also an employee', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          hasEmploymentContract: true,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(900)
        expect(result.disabilityContribution).toBe(0)
        expect(result.pensionContribution).toBe(0)
        expect(result.accidentContribution).toBe(0)
        expect(result.sickContribution).toBe(0)
        expect(result.fpContribution).toBe(0)
        expect(result.fsContribution).toBe(0)
        expect(result.healthContributionBasis).toBe(10000)
        expect(result.taxBasis).toBe(10000)
        expect(result.taxAmount).toBe(1200)
        expect(result.income).toBe(7900)
      })
    })

    describe('The "small" zus contribution basis', () => {
      it('the first half year', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          contributionBasis: zusConstants.entrepreneur.basises.small(0),
          isFpContribution: false,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(900)
        expect(result.disabilityContribution).toBe(83.76)
        expect(result.pensionContribution).toBe(204.37)
        expect(result.accidentContribution).toBe(17.48)
        expect(result.sickContribution).toBe(25.65)
        expect(result.fpContribution).toBe(0)
        expect(result.fsContribution).toBe(0)
        expect(result.healthContributionBasis).toBe(9668.74)
        expect(result.taxBasis).toBe(9669)
        expect(result.taxAmount).toBe(1160)
        expect(result.income).toBe(7608.74)
      })

      it('the second half year', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          contributionBasis: zusConstants.entrepreneur.basises.small(),
          isFpContribution: false,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(900)
        expect(result.disabilityContribution).toBe(86.40)
        expect(result.pensionContribution).toBe(210.82)
        expect(result.accidentContribution).toBe(18.04)
        expect(result.sickContribution).toBe(26.46)
        expect(result.fpContribution).toBe(0)
        expect(result.fsContribution).toBe(0)
        expect(result.healthContributionBasis).toBe(9658.28)
        expect(result.taxBasis).toBe(9658)
        expect(result.taxAmount).toBe(1159)
        expect(result.income).toBe(7599.28)
      })
    })

    describe('the minimum health contribution', () => {
      it('January', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          previousMonthHealthContributionBasis: 100,
          monthIndex: 0,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(270.9)
      })

      it('the rest of year', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          previousMonthHealthContributionBasis: 100,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(314.1)
      })
    })

    describe('with the tax free amoount', () => {
      it('with the 1/12 amount', () => {
      const result = new EntrepreneurCalculator().setInputData({
        ...input,
        partTaxReducingAmount: 12,
      }).calculate().getResult()
      expect(result.taxBasis).toBe(8582)
      expect(result.taxAmount).toBe(730)
      })

      it('with the 1/24 amount', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          partTaxReducingAmount: 24,
        }).calculate().getResult()
        expect(result.taxBasis).toBe(8582)
        expect(result.taxAmount).toBe(880)
      })

      it('with the 1/36 amount', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          partTaxReducingAmount: 36,
        }).calculate().getResult()
        expect(result.taxBasis).toBe(8582)
        expect(result.taxAmount).toBe(930)
      })
    })

    describe('with the tax relief', () => {
      it('with the revenue within the tax relief limit', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          hasTaxRelief: true,
        }).calculate().getResult()
        expect(result.healthContributionBasis).toBe(8581.52)
        expect(result.taxBasis).toBe(0)
        expect(result.taxAmount).toBe(0)
      })

      it('with the revenue over the tax relief limit', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          revenue: incomeTaxConstnts.taxReliefLimit + 10000,
          hasTaxRelief: true,
        }).calculate().getResult()
        expect(result.healthContributionBasis).toBe(94109.52)
        expect(result.taxBasis).toBe(8582)
        expect(result.taxAmount).toBe(1030)
      })

      it('with the revenue over the tax relief limit and expenses', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          revenue: incomeTaxConstnts.taxReliefLimit + 20000,
          expenses: 10000,
          hasTaxRelief: true,
        }).calculate().getResult()
        expect(result.healthContributionBasis).toBe(94109.52)
        expect(result.taxBasis).toBe(8582)
        expect(result.taxAmount).toBe(1030)
      })
    })

    describe('over the tax threshold', () => {
      it('the standard case', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          revenue: incomeTaxConstnts.generalRule.taxThreshold + 10000,
        }).calculate().getResult()
        expect(result.taxBasis).toBe(128582)
        expect(result.taxAmount).toBe(17146)
      })

      it('with the tax free amount', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          revenue: incomeTaxConstnts.generalRule.taxThreshold + 10000,
          partTaxReducingAmount: 12,
        }).calculate().getResult()
        expect(result.taxBasis).toBe(128582)
        expect(result.taxAmount).toBe(16846)
      })

      it('with the tax relief', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          revenue: incomeTaxConstnts.generalRule.taxThreshold + 10000,
          hasTaxRelief: true,
        }).calculate().getResult()
        expect(result.taxBasis).toBe(43054)
        expect(result.taxAmount).toBe(5166)
      })
    })

    describe('with expenses', () => {
      it('the tax basis over 0', () => {
      const result = new EntrepreneurCalculator().setInputData({
        ...input,
        revenue: 12000,
        expenses: 2000,
      }).calculate().getResult()

        expect(result.deductibleExpenses).toBe(0)
      expect(result.taxBasis).toBe(8582)
      expect(result.taxAmount).toBe(1030)
      expect(result.income).toBe(6651.52)
      })

      it('with deductible expenses', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          expenses: 10000,
        }).calculate().getResult()

        expect(result.deductibleExpenses).toBe(1418)
        expect(result.taxBasis).toBe(0)
        expect(result.taxAmount).toBe(0)
        expect(result.income).toBe(-2318.48)
      })
    })
  })

  describe('Tests with the flat tax rate', () => {
    const input: InputFields = {
      revenue: 10000,
      expenses: 0,
      taxSystem: EntrepreneurTaxSystem.FlatTax,
      monthIndex: 10,
      previousMonthHealthContributionBasis: 10000,
      accidentContributionRate: 0.0167,
      isFpContribution: true,
      isSickContribution: true,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      yearlyIncome: 0,
      hasEmploymentContract: false,
      contributionBasis: zusConstants.entrepreneur.basises.big,
    }

    describe('The "big" zus contribution basis', () => {
      it('all contributions', () => {
        const result = new EntrepreneurCalculator().setInputData(input).calculate().getResult()

        expect(result.healthContribution).toBe(490)
        expect(result.disabilityContribution).toBe(332.88)
        expect(result.pensionContribution).toBe(812.23)
        expect(result.accidentContribution).toBe(69.49)
        expect(result.sickContribution).toBe(101.94)
        expect(result.fpContribution).toBe(41.61)
        expect(result.fsContribution).toBe(60.33)
        expect(result.healthContributionBasis).toBe(8581.52)
        expect(result.taxBasis).toBe(8092)
        expect(result.taxAmount).toBe(1537)
        expect(result.income).toBe(6554.52)
      })

      it('over the deductible health contribution limit', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          previousMonthHealthContributionBasis: 250000,
        }).calculate().getResult()
        expect(result.healthContribution).toBe(12250)
        expect(result.deductibleExpenses).toBe(1618)
        expect(result.taxBasis).toBe(0)
        expect(result.taxAmount).toBe(0)
      })

      it('is also an employee', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          hasEmploymentContract: true,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(490)
        expect(result.disabilityContribution).toBe(0)
        expect(result.pensionContribution).toBe(0)
        expect(result.accidentContribution).toBe(0)
        expect(result.sickContribution).toBe(0)
        expect(result.fpContribution).toBe(0)
        expect(result.fsContribution).toBe(0)
        expect(result.healthContributionBasis).toBe(10000)
        expect(result.taxBasis).toBe(9510)
        expect(result.taxAmount).toBe(1807)
        expect(result.income).toBe(7703)
      })
    })

    describe('the minimum health contribution', () => {
      it('January', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          previousMonthHealthContributionBasis: 100,
          monthIndex: 0,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(270.9)
      })

      it('the rest of year', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          previousMonthHealthContributionBasis: 100,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(314.1)
      })
    })

    describe('with the tax relief', () => {
      it('with the revenue within the tax relief limit', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          hasTaxRelief: true,
        }).calculate().getResult()
        expect(result.healthContributionBasis).toBe(8581.52)
        expect(result.taxBasis).toBe(0)
        expect(result.taxAmount).toBe(0)
      })

      it('with the revenue over the tax relief limit', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          revenue: incomeTaxConstnts.taxReliefLimit + 10000,
          hasTaxRelief: true,
        }).calculate().getResult()
        expect(result.healthContributionBasis).toBe(94109.52)
        expect(result.taxBasis).toBe(8092)
        expect(result.taxAmount).toBe(1537)
      })
    })

    describe('with expenses', () => {
      it('the tax basis over 0', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          revenue: 12000,
          expenses: 2000,
        }).calculate().getResult()

        expect(result.deductibleExpenses).toBe(0)
        expect(result.taxBasis).toBe(8092)
        expect(result.taxAmount).toBe(1537)
        expect(result.income).toBe(6554.52)
      })

      it('with deductible expenses', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          expenses: 10000,
        }).calculate().getResult()

        expect(result.deductibleExpenses).toBe(1908)
        expect(result.taxBasis).toBe(0)
        expect(result.taxAmount).toBe(0)
        expect(result.income).toBe(-1908.48)
      })
    })
  })

  describe('Tests with the flat tax rate', () => {
    const input: InputFields = {
      revenue: 10000,
      expenses: 0,
      taxSystem: EntrepreneurTaxSystem.LumpSumTax,
      lumpSumTaxRate: 0.1,
      monthIndex: 10,
      previousMonthHealthContributionBasis: 10000,
      accidentContributionRate: 0.0167,
      isFpContribution: true,
      isSickContribution: true,
      partTaxReducingAmount: 0,
      hasTaxRelief: false,
      yearlyIncome: 0,
      hasEmploymentContract: false,
      contributionBasis: zusConstants.entrepreneur.basises.big,
    }

    describe('The "big" zus contribution basis', () => {
      it('all contributions', () => {
        const result = new EntrepreneurCalculator().setInputData(input).calculate().getResult()

        expect(result.healthContribution).toBe(376.16)
        expect(result.disabilityContribution).toBe(332.88)
        expect(result.pensionContribution).toBe(812.23)
        expect(result.accidentContribution).toBe(69.49)
        expect(result.sickContribution).toBe(101.94)
        expect(result.fpContribution).toBe(41.61)
        expect(result.fsContribution).toBe(60.33)
        expect(result.taxBasis).toBe(8495)
        expect(result.taxAmount).toBe(850)
        expect(result.income).toBe(7355.36)
      })

      it('over 60 000 zł of the yearly income', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          yearlyIncome: 60001,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(626.93)
        expect(result.disabilityContribution).toBe(332.88)
        expect(result.pensionContribution).toBe(812.23)
        expect(result.accidentContribution).toBe(69.49)
        expect(result.sickContribution).toBe(101.94)
        expect(result.fpContribution).toBe(41.61)
        expect(result.fsContribution).toBe(60.33)
        expect(result.taxBasis).toBe(8370)
        expect(result.taxAmount).toBe(837)
        expect(result.income).toBe(7117.59)
      })

      it('over 300 000 zł of the yearly income', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          yearlyIncome: 300001,
        }).calculate().getResult()

        expect(result.healthContribution).toBe(1128.48)
        expect(result.disabilityContribution).toBe(332.88)
        expect(result.pensionContribution).toBe(812.23)
        expect(result.accidentContribution).toBe(69.49)
        expect(result.sickContribution).toBe(101.94)
        expect(result.fpContribution).toBe(41.61)
        expect(result.fsContribution).toBe(60.33)
        expect(result.taxBasis).toBe(8119)
        expect(result.taxAmount).toBe(812)
        expect(result.income).toBe(6641.04)
      })
    })

    describe('with the tax relief', () => {
      it('with the revenue within the tax relief limit', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          hasTaxRelief: true,
        }).calculate().getResult()
        expect(result.taxBasis).toBe(0)
        expect(result.taxAmount).toBe(0)
      })

      it('with the revenue over the tax relief limit', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          revenue: incomeTaxConstnts.taxReliefLimit + 10000,
          hasTaxRelief: true,
        }).calculate().getResult()
        expect(result.taxBasis).toBe(8495)
        expect(result.taxAmount).toBe(850)
      })
    })

    describe('with expenses', () => {
      it('the tax basis over 0', () => {
        const result = new EntrepreneurCalculator().setInputData({
          ...input,
          revenue: 12000,
          expenses: 2000,
        }).calculate().getResult()

        expect(result.taxBasis).toBe(10495)
        expect(result.taxAmount).toBe(1050)
        expect(result.income).toBe(7155.36)
      })
    })
  })
})
