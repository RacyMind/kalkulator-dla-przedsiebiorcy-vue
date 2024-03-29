import {LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'

export interface InputFields{
  revenue: number
  expenses: number
  contributionBasis: number
  isFpContribution: boolean
  isSickContribution: boolean
  hasEmploymentContract:boolean
  accidentContributionRate: number
  hasTaxRelief: boolean
  hasTaxFreeAmount: boolean
  lumpSumTaxRate:LumpSumTaxRate
  previousMonthHealthContributionBasis: number
}
