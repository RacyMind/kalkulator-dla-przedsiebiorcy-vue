import { scroll } from 'quasar'
import constants from 'src/logic/constants'
import {AvailableYear} from 'src/types/AvailableYear'

/**
 * Scrolls to the element
 *
 * @param el
 */
function scrollToElement (el:any) {
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
function round (number:number, precision = 0):number {
  if (!precision) {
    return Math.round(number)
  }
  return +number.toFixed(precision)
}

/**
 * Returns default year
 *
 * @returns {AvailableYear}
 */
function getDefaultYear ():AvailableYear {
  const currentYear: AvailableYear = <AvailableYear> new Date().getFullYear()

  if (constants.AVAILABLE_YEARS.includes(currentYear)) {
    return currentYear
  }

  return <AvailableYear> constants.AVAILABLE_YEARS[constants.AVAILABLE_YEARS.length - 1]
}
export default {
  scrollToElement,
  round,
  getDefaultYear,
}
