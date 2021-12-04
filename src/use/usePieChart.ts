export function usePieChart(labels: String[], values: Number[]) {
  const colors: String[] = [
    '#e32514',
    '#edb113',
    '#ed6d13',
    '#360d13',
    '#BB4985',
    '#a31718',
    '#00A7D9',
    '#70B749',
  ]

  return {
    datasets: [{
      data: values,
      backgroundColor: colors.slice(0, values.length),
    }],
    labels: labels,
  }
}
