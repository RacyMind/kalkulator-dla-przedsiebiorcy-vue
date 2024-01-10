export function useBarChart(label:string, labels: string[], values: number[]) {
  const colors: string[] = [
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
      label: label,
      backgroundColor: colors.slice(0, values.length),
      data: values,
    }],
    labels: labels,
  }
}
