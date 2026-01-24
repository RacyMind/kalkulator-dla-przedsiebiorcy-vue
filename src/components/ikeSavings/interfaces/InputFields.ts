import { ContributionType } from '../types/ContributionType'

export interface InputFields {
  currentAge: number
  contributionType: ContributionType
  contributionAmount: number
  expectedReturnRate: number
  withdrawalAge: number
  withdrawalPeriod: number
  initialCapital: number
}
