function getLimitForYear(year: number): number {
  if (year <= 2023) {
    return 20805
  }
  if (year <= 2024) {
    return 23472
  }
  if (year <= 2025) {
    return 26019.60
  }
  return 28308
}

export function getIkeLimit(dateOfLawRules: Date): number {
  const year = dateOfLawRules.getFullYear()
  return getLimitForYear(year)
}
