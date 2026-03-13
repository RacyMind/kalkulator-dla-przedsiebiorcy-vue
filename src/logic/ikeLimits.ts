import { getIkeLimitDetails } from 'src/logic/savingsLimits'

export function getIkeLimit(dateOfLawRules: Date): number {
  return getIkeLimitDetails(dateOfLawRules).limit
}
