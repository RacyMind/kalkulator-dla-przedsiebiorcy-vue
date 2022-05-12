import {colors} from 'quasar'

export function useLineChart(title: string, labels: string[], values:any[]) {
  return {
    datasets: [{
      label: title,
      data: values,
      fill: false,
      borderColor: colors.lighten('#FF8356', -20),
    }],
    labels: labels,
  }
}
