import { scroll } from 'quasar'
import constants from 'src/logic/constants'

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

/**
 * Returns default year
 *
 * @returns {number}
 */
function getDefaultYear () {
  const currentYear = new Date().getFullYear()

  if (constants.AVAILABLE_YEARS.includes(currentYear)) {
    return currentYear
  }

  return constants.AVAILABLE_YEARS[constants.AVAILABLE_YEARS.length - 1]
}

export default {
  scrollToElement,
  round,
  getDefaultYear,
}
