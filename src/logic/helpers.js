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

function csvToJson (csv) {
  const lines = csv.split('\n')

  const result = []

  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  const headers = lines[0].split(';')

  for (let i = 1; i < lines.length; i++) {
    const obj = {}
    const currentline = lines[i].split(';')

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j]
    }

    result.push(obj)
  }

  // return result; //JavaScript object
  return JSON.stringify(result) // JSON
}
export default {
  scrollToElement,
  round,
  getDefaultYear,
  csvToJson,
}
