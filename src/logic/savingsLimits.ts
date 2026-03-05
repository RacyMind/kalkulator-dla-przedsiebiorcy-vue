export type IkzeLimitGroup = 'employment_contract' | 'self_employment'

interface IkzeLimitByYear {
  employmentContract: number
  selfEmployment: number
}

interface YearSelection {
  selectedYear: number
  isFallback: boolean
}

export interface LimitDetails {
  limit: number
  selectedYear: number
  isFallback: boolean
}

const ikeLimitByYear: Record<number, number> = {
  2021: 20805,
  2022: 20805,
  2023: 20805,
  2024: 23472,
  2025: 26019.6,
  2026: 28308,
}

const ikzeLimitByYear: Record<number, IkzeLimitByYear> = {
  2021: {
    employmentContract: 8322,
    selfEmployment: 12483,
  },
  2022: {
    employmentContract: 8322,
    selfEmployment: 12483,
  },
  2023: {
    employmentContract: 8322,
    selfEmployment: 12483,
  },
  2024: {
    employmentContract: 9388.8,
    selfEmployment: 14083.2,
  },
  2025: {
    employmentContract: 10407.6,
    selfEmployment: 15611.4,
  },
  2026: {
    employmentContract: 11304,
    selfEmployment: 16956,
  },
}

function getYearSelection(
  year: number,
  availableYears: number[],
): YearSelection {
  if (availableYears.length === 0) {
    throw new Error('Limit years not configured')
  }

  const sortedYears = [...availableYears].sort(
    (first, second) => first - second,
  )
  const minYear = sortedYears[0] as number
  const maxYear = sortedYears[sortedYears.length - 1] as number

  if (sortedYears.includes(year)) {
    return {
      selectedYear: year,
      isFallback: false,
    }
  }

  if (year <= minYear) {
    return {
      selectedYear: minYear,
      isFallback: true,
    }
  }

  if (year >= maxYear) {
    return {
      selectedYear: maxYear,
      isFallback: true,
    }
  }

  const previousYear = sortedYears
    .filter((availableYear) => availableYear < year)
    .at(-1)

  return {
    selectedYear: previousYear ?? minYear,
    isFallback: true,
  }
}

export function getIkeLimitDetails(dateOfLawRules: Date): LimitDetails {
  const year = dateOfLawRules.getFullYear()
  const selection = getYearSelection(
    year,
    Object.keys(ikeLimitByYear).map(Number),
  )

  return {
    limit: ikeLimitByYear[selection.selectedYear] as number,
    selectedYear: selection.selectedYear,
    isFallback: selection.isFallback,
  }
}

export function getIkzeLimitDetails(
  dateOfLawRules: Date,
  group: IkzeLimitGroup,
): LimitDetails {
  const year = dateOfLawRules.getFullYear()
  const selection = getYearSelection(
    year,
    Object.keys(ikzeLimitByYear).map(Number),
  )
  const limits = ikzeLimitByYear[selection.selectedYear] as IkzeLimitByYear

  return {
    limit:
      group === 'self_employment'
        ? limits.selfEmployment
        : limits.employmentContract,
    selectedYear: selection.selectedYear,
    isFallback: selection.isFallback,
  }
}
