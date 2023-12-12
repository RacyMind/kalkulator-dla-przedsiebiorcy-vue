import {EntrepreneurTaxSystem} from 'src/composables/constants'
import {LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'

export interface InputFields{
  revenue: number
  expenses: number
  taxSystem: EntrepreneurTaxSystem
  contributionBasis: number
  isFpContribution: boolean
  isSickContribution: boolean
  hasEmploymentContract:number
  accidentContributionRate: number
  hasTaxRelief: boolean
  partTaxReducingAmount: number
  lumpSumTaxRate:LumpSumTaxRate
  yearlyIncome: number
  lastMonthHealthContributionBasis: number
  monthIndex: number
}
