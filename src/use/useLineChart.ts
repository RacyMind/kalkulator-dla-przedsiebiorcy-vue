import {colors} from 'quasar'

export function useLineChart(title: string, labels: string[], values:any[]) {
  return {
    datasets: [{
      borderColor: colors.lighten('#FF8356', -20),
      data: values,
      fill: false,
      label: title,
    }],
    labels: labels,
  }
}
