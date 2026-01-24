import { BasicCalculator } from 'src/logic/BasicCalculator'
import { ContributionType } from '../types/ContributionType'
import { InputFields } from '../interfaces/InputFields'
import { Result } from '../interfaces/Result'
import { getIkeLimit } from 'src/logic/ikeLimits'
import helpers from 'src/logic/helpers'

export class IkeSavingsCalculator extends BasicCalculator<InputFields, Result> {
  public calculate(): this {
    const input = this.getInputData()

    const savingsPeriodYears = input.withdrawalAge - input.currentAge
    const yearlyContribution = input.contributionType === ContributionType.Monthly
      ? input.contributionAmount * 12
      : input.contributionAmount

    const totalContributions = helpers.round(
      yearlyContribution * savingsPeriodYears + input.initialCapital,
      2,
    )

    const finalCapital = this.calculateFinalCapital(
      input.initialCapital,
      yearlyContribution,
      input.expectedReturnRate / 100,
      savingsPeriodYears,
    )

    const investmentGain = Math.max(0, helpers.round(finalCapital - totalContributions, 2))

    const taxSaving = helpers.round(investmentGain * 0.19, 2)

    const withdrawalMonths = input.withdrawalPeriod * 12
    const monthlyPension = withdrawalMonths > 0
      ? helpers.round(finalCapital / withdrawalMonths, 2)
      : 0

    const ikeLimit = getIkeLimit(new Date(2026, 0, 1))
    const exceedsIkeLimit = yearlyContribution > ikeLimit

    this.result = {
      savingsPeriodYears,
      yearlyContribution,
      totalContributions,
      finalCapital,
      investmentGain,
      taxSaving,
      monthlyPension,
      exceedsIkeLimit,
      ikeLimit,
    }

    return this
  }

  private calculateFinalCapital(
    principal: number,
    yearlyContribution: number,
    annualRate: number,
    years: number,
  ): number {
    if (annualRate === 0) {
      return helpers.round(principal + yearlyContribution * years, 2)
    }

    const compoundFactor = Math.pow(1 + annualRate, years)
    const principalFV = principal * compoundFactor
    const annuityFV = yearlyContribution * ((compoundFactor - 1) / annualRate)

    return helpers.round(principalFV + annuityFV, 2)
  }
}
