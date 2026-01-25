import {IkzeLimitStatus} from 'src/logic/ikzeLimits'
import {IkzeTaxSystem} from 'components/ikzeTaxRelief/types/IkzeTaxSystem'

export interface Result {
  readonly status: IkzeLimitStatus
  readonly taxSystem: IkzeTaxSystem
  readonly ikzeLimit: number
  readonly ikzeContribution: number
  readonly taxBaseBeforeRelief: number
  readonly taxBaseAfterRelief: number
  readonly taxBeforeRelief: number
  readonly taxAfterRelief: number
  readonly taxSaving: number
}
