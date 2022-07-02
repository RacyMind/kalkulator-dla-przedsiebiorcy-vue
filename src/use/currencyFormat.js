function pln (value) {
  return formatToCurrency(value, 'PLN')
}
function formatToCurrency (value, code) {
  return new Intl.NumberFormat('pl-PL', { currency: code, style: 'currency' }).format(value)
}

export { pln, formatToCurrency }
