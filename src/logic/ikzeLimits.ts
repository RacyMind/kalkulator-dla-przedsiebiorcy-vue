export enum IkzeLimitStatus {
  EmploymentContract = 'employment_contract',
  SelfEmployment = 'self_employment',
}

type IkzeLimits = {
  employmentContract: number
  selfEmployment: number
}

function getLimitsForYear(year: number): IkzeLimits {
  if (year <= 2023) {
    return {
      employmentContract: 8322,
      selfEmployment: 12483,
    }
  }
  if (year <= 2024) {
    return {
      employmentContract: 9388.8,
      selfEmployment: 14083.2,
    }
  }
  if (year <= 2025) {
    return {
      employmentContract: 10407.6,
      selfEmployment: 15611.4,
    }
  }
  return {
    employmentContract: 11304,
    selfEmployment: 16956,
  }
}

export function getIkzeLimit(dateOfLawRules: Date, status: IkzeLimitStatus): number {
  const year = dateOfLawRules.getFullYear()
  const limits = getLimitsForYear(year)

  if (status === IkzeLimitStatus.SelfEmployment) {
    return limits.selfEmployment
  }

  return limits.employmentContract
}

export function getIkzeLimits(dateOfLawRules: Date): IkzeLimits {
  return getLimitsForYear(dateOfLawRules.getFullYear())
}
