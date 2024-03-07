import {IncomeTaxResult} from 'src/logic/taxes/interfaces/IncomeTaxResult'

export interface Result extends IncomeTaxResult {
  readonly netAmount: number
  readonly grossAmount: number
}
