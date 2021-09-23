import { scroll } from 'quasar'

/**
 * Scrolls to the element
 *
 * @param el
 */
function scrollToElement (el) {
  const { getScrollTarget, setVerticalScrollPosition } = scroll
  const target = getScrollTarget(el)
  const offset = el.offsetTop // do not subtract the el.scrollHeight here
  const duration = 1000
  setVerticalScrollPosition(target, offset, duration)
}

/**
 * Rounds the number
 *
 * @param {number} number
 * @param {number} precision
 * @returns {number}
 */
function round (number, precision = 0) {
  if (!precision) {
    return Math.round(number)
  }
  return +number.toFixed(precision)
}
export default { scrollToElement, round }
