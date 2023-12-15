import {IncomeTaxResult} from 'src/logic/taxes/interfaces/IncomeTaxResult'

type IncomeTaxResultWithoutExpenses = Omit<IncomeTaxResult, 'expenses'>

export interface EntrepreneurResult extends IncomeTaxResultWithoutExpenses{
  readonly revenue: number,
  // the expenses which can reduce the income in the next month
  readonly deductibleExpenses: number,
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
