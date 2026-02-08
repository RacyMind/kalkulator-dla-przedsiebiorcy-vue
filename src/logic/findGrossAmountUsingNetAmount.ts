import helpers from 'src/logic/helpers'

interface GrossNetResult {
  grossAmount: number
  netAmount: number
}

export function findGrossAmountUsingNetAmount(
  computeResult: (grossAmount: number) => GrossNetResult,
  min: number,
  max: number,
  targetAmount: number,
  scale = 100,
): number {
  for (let iterator = max; iterator >= min; iterator -= scale) {
    const result = computeResult(iterator)

    if (Math.abs(result.netAmount - targetAmount) <= 0.0005) {
      return helpers.round(result.grossAmount, 2)
    }

    if (Math.abs(result.netAmount - targetAmount) <= scale) {
      return findGrossAmountUsingNetAmount(
        computeResult,
        result.netAmount - scale,
        result.grossAmount + scale,
        targetAmount,
        scale / 2,
      )
    }
  }

  return 0
}
