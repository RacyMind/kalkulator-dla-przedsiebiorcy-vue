export const useMonths = () => {
  const monthNames = [
    'Styczeń',
    'Luty',
    'Marzec',
    'Kwiecień',
    'Maj',
    'Czerwiec',
    'Lipiec',
    'Sierpień',
    'Wrzesień',
    'Październik',
    'Listopad',
    'Grudzień',
  ]

  const monthOptions:{label:string, value: number}[] = []

  monthNames.forEach((label, index) => {
    monthOptions.push({
      label: label,
      value: index,
    })
  })

  return {
    fullYear: 'Cały rok',
    monthNames,
    monthOptions,
  }
}
