import helpers from 'src/logic/helpers'

interface GrossNetResult {
  grossAmount: number
  netAmount: number
}

interface GrossTargetResult {
  grossAmount: number
}

export function findGrossAmountUsingTargetAmount<Result extends GrossTargetResult>(
  computeResult: (grossAmount: number) => Result,
  min: number,
  max: number,
  targetAmount: number,
  getTargetAmount: (result: Result) => number,
  scale = 100,
): number {
  for (let iterator = max; iterator >= min; iterator -= scale) {
    const result = computeResult(iterator)
    const calculatedTargetAmount = getTargetAmount(result)

    if (Math.abs(calculatedTargetAmount - targetAmount) <= 0.0005) {
      return helpers.round(result.grossAmount, 2)
    }

    if (Math.abs(calculatedTargetAmount - targetAmount) <= scale) {
      return findGrossAmountUsingTargetAmount(
        computeResult,
        result.grossAmount - scale,
        result.grossAmount + scale,
        targetAmount,
        getTargetAmount,
        scale / 2,
      )
    }
  }

  return 0
}

export function findGrossAmountUsingNetAmount(
  computeResult: (grossAmount: number) => GrossNetResult,
  min: number,
  max: number,
  targetAmount: number,
  scale = 100,
): number {
  return findGrossAmountUsingTargetAmount(
    computeResult,
    min,
    max,
    targetAmount,
    (result) => result.netAmount,
    scale,
  )
}
