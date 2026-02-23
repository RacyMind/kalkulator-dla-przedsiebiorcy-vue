import { getIkzeLimitDetails } from 'src/logic/savingsLimits'

export enum IkzeLimitStatus {
  EmploymentContract = 'employment_contract',
  SelfEmployment = 'self_employment',
}

export function getIkzeLimit(
  dateOfLawRules: Date,
  status: IkzeLimitStatus,
): number {
  return getIkzeLimitDetails(dateOfLawRules, status).limit
}
