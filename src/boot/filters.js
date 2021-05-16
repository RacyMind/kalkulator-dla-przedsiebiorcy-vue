export default ({ app }) => {
  app.config.globalProperties.$filters = {
    currencyPLN (value) {
      return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value)
    },
    currency (value, code) {
      return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: code }).format(value)
    },
  }
}
