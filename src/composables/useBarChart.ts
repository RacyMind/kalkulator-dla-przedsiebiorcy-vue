import {useChartColors} from 'src/composables/useChartColors'

export function useBarChart(label:string, labels: string[], values: number[]) {
  const { chartColors } = useChartColors()
  const colors = Object.values(chartColors.value)

  return {
    datasets: [{
      label: label,
      backgroundColor: colors.slice(0, values.length),
      data: values,
    }],
    labels: labels,
  }
}
