function toValidPieValue(value: unknown): number {
  const numericValue = Number(value)

  if (!Number.isFinite(numericValue) || numericValue <= 0) {
    return 0
  }

  return numericValue
}

export function calculatePieChartTotal(values: unknown[]): number {
  return values.reduce((total, value) => total + toValidPieValue(value), 0)
}

export function calculatePieChartPercentages(values: unknown[]): number[] {
  const total = calculatePieChartTotal(values)

  if (total <= 0) {
    return values.map(() => 0)
  }

  return values.map((value) => (toValidPieValue(value) / total) * 100)
}

export function formatPieChartPercentage(
  value: number,
  fractionDigits = 1,
): string {
  const safeValue = Number.isFinite(value) && value > 0 ? value : 0

  return `${safeValue.toLocaleString('pl-PL', {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })}%`
}
