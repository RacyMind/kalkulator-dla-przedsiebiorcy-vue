import { DisabilityDegree } from 'components/pfronRefund/types/DisabilityDegree'

export interface Result {
  readonly disabilityDegree: DisabilityDegree
  readonly pensionContribution: number
  readonly disabilityContribution: number
  readonly socialContributionsAmount: number
  readonly refundRate: number
  readonly refundAmount: number
  readonly entrepreneurCostAfterRefund: number
}
