import {IkzeLimitStatus} from 'src/logic/ikzeLimits'
import {IkzeTaxSystem} from 'components/ikzeTaxRelief/types/IkzeTaxSystem'
import {LumpSumTaxRate} from 'src/logic/taxes/LumpSumTax'

export interface InputFields {
  status: IkzeLimitStatus
  taxSystem: IkzeTaxSystem
  ikzeContribution: number
  taxBaseBeforeRelief: number
  lumpSumTaxRate?: LumpSumTaxRate
}
