function pln (value) {
  return formatToCurrency(value, 'PLN')
}
function formatToCurrency (value, code) {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: code }).format(value)
}

export { pln, formatToCurrency }
