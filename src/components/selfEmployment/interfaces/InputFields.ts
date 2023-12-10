import {EntrepreneurTaxSystem} from 'src/composables/constants'

export interface InputFields{
  revenue: number
  expenses: number
  taxSystem: EntrepreneurTaxSystem
  contributionBasis: number
  isFpContribution: boolean,
  isSickContribution: boolean,
  accidentContributionRate: number,
  hasTaxRelief: boolean,
  partTaxReducingAmount: number,
}
