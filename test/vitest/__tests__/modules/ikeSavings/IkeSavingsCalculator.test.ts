import { ContributionType } from 'src/components/ikeSavings/types/ContributionType'
import { IkeSavingsCalculator } from 'src/components/ikeSavings/logic/IkeSavingsCalculator'
import { InputFields } from 'src/components/ikeSavings/interfaces/InputFields'
import { describe, expect, it } from 'vitest'

describe('IkeSavingsCalculator', () => {
  describe('US1: Kapitał IKE (procent składany)', () => {
    it('calculates capital for 30 years of monthly saving', () => {
      const calculator = new IkeSavingsCalculator()
      const input: InputFields = {
        currentAge: 30,
        contributionType: ContributionType.Monthly,
        contributionAmount: 500,
        expectedReturnRate: 5,
        withdrawalAge: 60,
        withdrawalPeriod: 20,
        initialCapital: 0,
      }

      const result = calculator.setInputData(input).calculate().getResult()

      expect(result.savingsPeriodYears).toBe(30)
      expect(result.yearlyContribution).toBe(6000)
      expect(result.totalContributions).toBe(180000)
      expect(result.finalCapital).toBeCloseTo(398633.28, 0)
      expect(result.investmentGain).toBeCloseTo(218633.28, 0)
      expect(result.taxSaving).toBeCloseTo(41540.32, 0)
      expect(result.monthlyPension).toBeCloseTo(1661.11, 0)
      expect(result.exceedsIkeLimit).toBe(false)
      expect(result.ikeLimit).toBe(28308)
    })

    it('calculates capital for yearly contribution', () => {
      const calculator = new IkeSavingsCalculator()
      const input: InputFields = {
        currentAge: 40,
        contributionType: ContributionType.Yearly,
        contributionAmount: 10000,
        expectedReturnRate: 7,
        withdrawalAge: 65,
        withdrawalPeriod: 15,
        initialCapital: 0,
      }

      const result = calculator.setInputData(input).calculate().getResult()

      expect(result.savingsPeriodYears).toBe(25)
      expect(result.yearlyContribution).toBe(10000)
      expect(result.totalContributions).toBe(250000)
      expect(result.finalCapital).toBeCloseTo(632490.38, 0)
      expect(result.investmentGain).toBeCloseTo(382490.38, 0)
      expect(result.taxSaving).toBeCloseTo(72673.17, 0)
      expect(result.monthlyPension).toBeCloseTo(3513.84, 0)
      expect(result.exceedsIkeLimit).toBe(false)
      expect(result.ikeLimit).toBe(28308)
    })

    it('calculates capital with initial capital', () => {
      const calculator = new IkeSavingsCalculator()
      const input: InputFields = {
        currentAge: 35,
        contributionType: ContributionType.Monthly,
        contributionAmount: 300,
        expectedReturnRate: 6,
        withdrawalAge: 60,
        withdrawalPeriod: 20,
        initialCapital: 50000,
      }

      const result = calculator.setInputData(input).calculate().getResult()

      expect(result.savingsPeriodYears).toBe(25)
      expect(result.yearlyContribution).toBe(3600)
      expect(result.totalContributions).toBe(140000)
      expect(result.finalCapital).toBeCloseTo(412105.78, 0)
      expect(result.investmentGain).toBeCloseTo(272105.78, 0)
      expect(result.taxSaving).toBeCloseTo(51700.10, 0)
      expect(result.monthlyPension).toBeCloseTo(1717.11, 0)
      expect(result.exceedsIkeLimit).toBe(false)
      expect(result.ikeLimit).toBe(28308)
    })

    it('handles zero contribution correctly', () => {
      const calculator = new IkeSavingsCalculator()
      const input: InputFields = {
        currentAge: 30,
        contributionType: ContributionType.Monthly,
        contributionAmount: 0,
        expectedReturnRate: 5,
        withdrawalAge: 60,
        withdrawalPeriod: 20,
        initialCapital: 0,
      }

      const result = calculator.setInputData(input).calculate().getResult()

      expect(result.savingsPeriodYears).toBe(30)
      expect(result.yearlyContribution).toBe(0)
      expect(result.totalContributions).toBe(0)
      expect(result.finalCapital).toBe(0)
      expect(result.investmentGain).toBe(0)
      expect(result.taxSaving).toBe(0)
      expect(result.monthlyPension).toBe(0)
      expect(result.exceedsIkeLimit).toBe(false)
    })

    it('handles zero return rate correctly', () => {
      const calculator = new IkeSavingsCalculator()
      const input: InputFields = {
        currentAge: 30,
        contributionType: ContributionType.Monthly,
        contributionAmount: 500,
        expectedReturnRate: 0,
        withdrawalAge: 60,
        withdrawalPeriod: 20,
        initialCapital: 0,
      }

      const result = calculator.setInputData(input).calculate().getResult()

      expect(result.savingsPeriodYears).toBe(30)
      expect(result.yearlyContribution).toBe(6000)
      expect(result.totalContributions).toBe(180000)
      expect(result.finalCapital).toBe(180000)
      expect(result.investmentGain).toBe(0)
      expect(result.taxSaving).toBe(0)
      expect(result.monthlyPension).toBe(750)
    })

    it('handles negative return rate correctly', () => {
      const calculator = new IkeSavingsCalculator()
      const input: InputFields = {
        currentAge: 30,
        contributionType: ContributionType.Monthly,
        contributionAmount: 500,
        expectedReturnRate: -5,
        withdrawalAge: 60,
        withdrawalPeriod: 20,
        initialCapital: 0,
      }

      const result = calculator.setInputData(input).calculate().getResult()

      expect(result.savingsPeriodYears).toBe(30)
      expect(result.yearlyContribution).toBe(6000)
      expect(result.totalContributions).toBe(180000)
      expect(result.finalCapital).toBeCloseTo(94243.35, 0)
      expect(result.investmentGain).toBe(0)
      expect(result.taxSaving).toBe(0)
    })
  })

  describe('US3: Średnia miesięczna emerytura', () => {
    it('calculates monthly pension for 10 year withdrawal period', () => {
      const calculator = new IkeSavingsCalculator()
      const input: InputFields = {
        currentAge: 30,
        contributionType: ContributionType.Monthly,
        contributionAmount: 500,
        expectedReturnRate: 5,
        withdrawalAge: 60,
        withdrawalPeriod: 10,
        initialCapital: 0,
      }

      const result = calculator.setInputData(input).calculate().getResult()

      expect(result.savingsPeriodYears).toBe(30)
      expect(result.finalCapital).toBeCloseTo(398633.28, 0)
      expect(result.monthlyPension).toBeCloseTo(3322.22, 0)
    })
  })

  describe('US4: Walidacja limitu IKE', () => {
    it('detects when yearly contribution exceeds IKE limit', () => {
      const calculator = new IkeSavingsCalculator()
      const input: InputFields = {
        currentAge: 30,
        contributionType: ContributionType.Yearly,
        contributionAmount: 30000,
        expectedReturnRate: 5,
        withdrawalAge: 60,
        withdrawalPeriod: 20,
        initialCapital: 0,
      }

      const result = calculator.setInputData(input).calculate().getResult()

      expect(result.yearlyContribution).toBe(30000)
      expect(result.exceedsIkeLimit).toBe(true)
      expect(result.ikeLimit).toBe(28308)
    })

    it('does not flag when contribution is within IKE limit', () => {
      const calculator = new IkeSavingsCalculator()
      const input: InputFields = {
        currentAge: 30,
        contributionType: ContributionType.Monthly,
        contributionAmount: 2000,
        expectedReturnRate: 5,
        withdrawalAge: 60,
        withdrawalPeriod: 20,
        initialCapital: 0,
      }

      const result = calculator.setInputData(input).calculate().getResult()

      expect(result.yearlyContribution).toBe(24000)
      expect(result.exceedsIkeLimit).toBe(false)
      expect(result.ikeLimit).toBe(28308)
    })
  })
})
