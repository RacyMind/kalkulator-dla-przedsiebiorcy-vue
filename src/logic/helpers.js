function formatCurrency (value) {
  if (value === null || typeof value === 'undefined') {
    return '- zł'
  }
  return `${value.toFixed(2)} zł`
}
export default { formatCurrency }
