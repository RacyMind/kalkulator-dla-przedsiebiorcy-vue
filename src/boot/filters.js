export default ({ Vue }) => {
  Vue.filter('pln', function (value) {
    if (value === null) {
      return '- zł'
    }
    return `${value.toFixed(2)} zł`
  })
}
