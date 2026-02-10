import { BasicCalculator } from 'src/logic/BasicCalculator'
import { Calculator } from 'src/logic/interfaces/Calculator'
import { InputFields } from 'components/maternityBenefit/interfaces/InputFields'
import { Result } from 'components/maternityBenefit/interfaces/Result'
import { storeToRefs } from 'pinia'
import { useConstantsStore } from 'stores/constantsStore'
import {
  maternityLeaveWeeks as maternityLeaveWeeksConfig,
  parentalLeaveWeeks as parentalLeaveWeeksConfig,
  secondParentLeaveWeeks,
  variantARate,
  variantBMaternityRate,
  variantBParentalRate,
  secondParentRate,
  daysPerWeek,
  daysInMonth,
} from 'components/maternityBenefit/logic/leavePeriodsConfig'
import helpers from 'src/logic/helpers'

export class MaternityBenefitCalculator
  extends BasicCalculator<InputFields, Result>
  implements Calculator<InputFields, Result>
{
  constructor() {
    super()
  }

  public calculate(): this {
    const { zusConstants } = storeToRefs(useConstantsStore())

    const socialContributionRate =
      zusConstants.value.employee.rates.pensionContribution +
      zusConstants.value.employee.rates.disabilityContribution +
      zusConstants.value.employee.rates.sickContribution

    const benefitBasis = helpers.round(
      this.getInputData().averageBasis * (1 - socialContributionRate),
      2,
    )
    const dailyRate = helpers.round(benefitBasis / daysInMonth, 2)

    const maternityLeaveWeeks =
      maternityLeaveWeeksConfig[this.getInputData().childrenCount]
    const parentalLeaveWeeks =
      parentalLeaveWeeksConfig[this.getInputData().childrenCount]
    const maternityLeaveDays = maternityLeaveWeeks * daysPerWeek
    const parentalLeaveDays = parentalLeaveWeeks * daysPerWeek
    const totalWeeks = maternityLeaveWeeks + parentalLeaveWeeks
    const totalDays = maternityLeaveDays + parentalLeaveDays

    const variantADailyRate = helpers.round(dailyRate * variantARate, 2)
    const variantAMaternityMonthly = helpers.round(
      variantADailyRate * daysInMonth,
      2,
    )
    const variantAMaternityAmount = helpers.round(
      variantADailyRate * maternityLeaveDays,
      2,
    )
    const variantAParentalMonthly = helpers.round(
      variantADailyRate * daysInMonth,
      2,
    )
    const variantAParentalAmount = helpers.round(
      variantADailyRate * parentalLeaveDays,
      2,
    )
    const variantATotalAmount = helpers.round(
      variantAMaternityAmount + variantAParentalAmount,
      2,
    )

    const variantBMaternityDailyRate = helpers.round(
      dailyRate * variantBMaternityRate,
      2,
    )
    const variantBMaternityMonthly = helpers.round(
      variantBMaternityDailyRate * daysInMonth,
      2,
    )
    const variantBMaternityAmount = helpers.round(
      variantBMaternityDailyRate * maternityLeaveDays,
      2,
    )
    const variantBParentalDailyRate = helpers.round(
      dailyRate * variantBParentalRate,
      2,
    )
    const variantBParentalMonthly = helpers.round(
      variantBParentalDailyRate * daysInMonth,
      2,
    )
    const variantBParentalAmount = helpers.round(
      variantBParentalDailyRate * parentalLeaveDays,
      2,
    )
    const variantBTotalAmount = helpers.round(
      variantBMaternityAmount + variantBParentalAmount,
      2,
    )

    const secondParentDailyRate = helpers.round(dailyRate * secondParentRate, 2)
    const secondParentMonthlyAmount = helpers.round(
      secondParentDailyRate * daysInMonth,
      2,
    )
    const secondParentDays = secondParentLeaveWeeks * daysPerWeek
    const secondParentBenefit = helpers.round(
      secondParentDailyRate * secondParentDays,
      2,
    )

    this.result = {
      benefitBasis,
      dailyRate,
      leavePeriods: {
        maternityLeaveWeeks,
        maternityLeaveDays,
        parentalLeaveWeeks,
        parentalLeaveDays,
        totalWeeks,
        totalDays,
      },
      variantA: {
        maternityDailyRate: variantADailyRate,
        maternityMonthlyAmount: variantAMaternityMonthly,
        maternityLeaveAmount: variantAMaternityAmount,
        parentalDailyRate: variantADailyRate,
        parentalMonthlyAmount: variantAParentalMonthly,
        parentalLeaveAmount: variantAParentalAmount,
        totalAmount: variantATotalAmount,
      },
      variantB: {
        maternityDailyRate: variantBMaternityDailyRate,
        maternityMonthlyAmount: variantBMaternityMonthly,
        maternityLeaveAmount: variantBMaternityAmount,
        parentalDailyRate: variantBParentalDailyRate,
        parentalMonthlyAmount: variantBParentalMonthly,
        parentalLeaveAmount: variantBParentalAmount,
        totalAmount: variantBTotalAmount,
      },
      secondParentDailyRate,
      secondParentMonthlyAmount,
      secondParentDays,
      secondParentBenefit,
    }

    return this
  }
}
