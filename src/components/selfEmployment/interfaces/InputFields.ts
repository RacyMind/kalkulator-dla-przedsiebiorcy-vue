import {EntrepreneurTaxSystem} from 'src/composables/constants'
import {LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'

export enum IncomeMode {
  MonthlyRevenue = 'monthly_revenue',
  HourlyRate = 'hourly_rate',
}

export interface InputFields{
  revenue: number
  incomeMode?: IncomeMode
  hourlyRate?: number
  plannedHours?: number
  deductLeave?: boolean
  leaveHours?: number
  expenses: number
  lossFromPreviousMonth: number
  taxSystem: EntrepreneurTaxSystem
  contributionBasis: number
  isFpContribution: boolean
  isSickContribution: boolean
  hasEmploymentContract:boolean
  accidentContributionRate: number
  hasTaxRelief: boolean
  hasTaxFreeAmount: boolean
  lumpSumTaxRate?:LumpSumTaxRate
  yearlyIncome: number
  previousMonthHealthContributionBasis: number
  businessIsRunning: boolean
  monthIndex: number
}
