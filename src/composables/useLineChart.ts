import {useChartColors} from 'src/composables/useChartColors'

export function useLineChart(title: string, labels: string[], values:any[]) {
  const { chartColors } = useChartColors()

  return {
    datasets: [{
      borderColor: chartColors.value.chart1,
      data: values,
      fill: false,
      label: title,
    }],
    labels: labels,
  }
}
