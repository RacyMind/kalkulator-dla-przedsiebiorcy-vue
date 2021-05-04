export default ({ Vue }) => {
  Vue.filter('pln', function (value) {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value)
  })
  Vue.filter('currency', function (value, code) {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: code }).format(value)
  })
}
