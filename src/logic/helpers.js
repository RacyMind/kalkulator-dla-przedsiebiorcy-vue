import { scroll } from 'quasar'

function formatCurrency (value) {
  return new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value)
}
function scrollToElement (el) {
  const { getScrollTarget, setScrollPosition } = scroll
  const target = getScrollTarget(el)
  const offset = el.offsetTop // do not subtract the el.scrollHeight here
  const duration = 1000
  setScrollPosition(target, offset, duration)
}
export default { formatCurrency, scrollToElement }
