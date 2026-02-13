export interface LeavePeriodsResult {
  readonly maternityLeaveWeeks: number
  readonly maternityLeaveDays: number
  readonly parentalLeaveWeeks: number
  readonly parentalLeaveDays: number
  readonly totalWeeks: number
  readonly totalDays: number
}

export interface VariantResult {
  readonly maternityDailyRate: number
  readonly maternityMonthlyAmount: number
  readonly maternityLeaveAmount: number
  readonly parentalDailyRate: number
  readonly parentalMonthlyAmount: number
  readonly parentalLeaveAmount: number
  readonly totalAmount: number
}

export interface Result {
  readonly benefitBasis: number
  readonly dailyRate: number
  readonly leavePeriods: LeavePeriodsResult
  readonly variantA: VariantResult
  readonly variantB: VariantResult
  readonly secondParentDailyRate: number
  readonly secondParentMonthlyAmount: number
  readonly secondParentDays: number
  readonly secondParentBenefit: number
}
