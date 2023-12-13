import {IncomeTaxResult} from 'src/logic/taxes/interfaces/IncomeTaxResult'

export interface EntrepreneurResult extends IncomeTaxResult{
  readonly revenue: number,
  readonly expenses: number,
  readonly netAmount: number,
  readonly healthContributionBasis:number,
  readonly healthContribution:number,
  readonly sickContribution: number,
  readonly disabilityContribution: number,
  readonly pensionContribution: number,
  readonly accidentContribution: number,
  readonly fpContribution: number,
  readonly fsContribution: number,
}
