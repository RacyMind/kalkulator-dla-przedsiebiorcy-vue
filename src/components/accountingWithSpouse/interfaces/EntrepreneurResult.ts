import {IncomeTaxResult} from 'src/logic/taxes/interfaces/IncomeTaxResult'
import {SpouseResult} from 'components/accountingWithSpouse/interfaces/SpouseResult'

export interface EntrepreneurResult extends IncomeTaxResult, SpouseResult{
  readonly revenue: number
  readonly income: number
  readonly healthContribution:number
  readonly sickContribution: number
  readonly disabilityContribution: number
  readonly pensionContribution: number
  readonly accidentContribution: number
  readonly fpContribution: number
  readonly fsContribution: number
}
