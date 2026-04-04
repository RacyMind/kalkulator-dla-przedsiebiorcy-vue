import { ScheduleRow } from 'components/leasing/types/LeasingTypes'

export interface Result {
  readonly monthlyInstallmentNet: number
  readonly monthlyInstallmentGross: number
  readonly initialPaymentNet: number
  readonly initialPaymentGross: number
  readonly financedAmount: number
  readonly residualValueNet: number
  readonly residualValueGross: number
  readonly totalCostNet: number
  readonly totalCostGross: number
  readonly totalInterest: number
  readonly totalVat: number
  readonly deductibleVat: number
  readonly kupProportion: number
  readonly totalKup: number
  readonly schedule: ScheduleRow[]
}
