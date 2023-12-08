import {IncomeTaxResult} from 'src/logic/taxes/interfaces/IncomeTaxResult'

export interface EntrepreneurResult extends IncomeTaxResult{
  readonly grossAmount: number,
  readonly netAmount: number,
  readonly healthContribution:number,
  readonly sickContribution: number,
  readonly disabilityContribution: number,
  readonly pensionContribution: number,
  readonly accidentContribution: number,
  readonly fpContribution: number,
  readonly fgspContribution: number,
  readonly fsContribution: number,
}
