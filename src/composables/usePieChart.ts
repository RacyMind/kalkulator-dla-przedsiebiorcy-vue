import { useChartColors } from 'src/composables/useChartColors'

function toPositivePieValue(value: number): number {
  if (!Number.isFinite(value) || value <= 0) {
    return 0
  }

  return value
}

export function usePieChart(
  labels: string[],
  values: number[],
  cutout = '60%',
) {
  const { chartColors } = useChartColors()
  const colors = Object.values(chartColors.value)
  const normalizedValues = values.map((value) =>
    toPositivePieValue(Number(value)),
  )

  return {
    datasets: [
      {
        backgroundColor: colors.slice(0, normalizedValues.length),
        data: normalizedValues,
        cutout,
      },
    ],
    labels: labels,
  }
}
