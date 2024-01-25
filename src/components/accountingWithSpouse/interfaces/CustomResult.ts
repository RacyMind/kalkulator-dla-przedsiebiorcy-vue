import {SpouseResult} from 'components/accountingWithSpouse/interfaces/SpouseResult'

export interface CustomResult extends SpouseResult{
  readonly socialContributions: number
  readonly healthContributions: number
  readonly taxAmount: number
  readonly income: number
}
