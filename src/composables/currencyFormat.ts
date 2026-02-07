function pln (value: number): string {
  return formatToCurrency(value, 'PLN')
}
function formatToCurrency (value: number, code: string): string {
  return new Intl.NumberFormat('pl-PL', { currency: code, style: 'currency' }).format(value)
}

export { pln, formatToCurrency }
