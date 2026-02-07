import {AvailableYear} from 'src/types/AvailableYear'
import { scroll } from 'quasar'
import {useConstantsStore} from 'stores/constantsStore'
import {sumMonthlyResults} from 'src/logic/sumMonthlyResults'

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
 * @param {number} value
 * @param {number} precision
 * @returns {number}
 */
function round (value:number, precision = 0):number {
  const factor = Math.pow(10, precision)
  return Math.round(value * factor) / factor
}

/**
 * Returns default year
 *
 * @returns {AvailableYear}
 */
function getDefaultYear ():AvailableYear {
  const constants = useConstantsStore()
  const currentYear: AvailableYear = <AvailableYear> new Date().getFullYear()

  if (constants.AVAILABLE_YEARS.includes(currentYear)) {
    return currentYear
  }

  return <AvailableYear> constants.AVAILABLE_YEARS[constants.AVAILABLE_YEARS.length - 1]
}

function sum<EmployeType>(monthlyResults:EmployeType[], property: keyof EmployeType) {
  return monthlyResults.reduce((accumulator:number, result:EmployeType) => {
    return round(<number>accumulator + <number>result[property], 2)
  }, 0)
}


function applyMixins(derivedCtor: any, constructors: any[]) {
  constructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
        Object.create(null),
      )
    })
  })
}

/**
 * Formats a number with specified decimal places
 * 
 * @param {number} value - The number to format
 * @param {number} decimalPlaces - Number of decimal places
 * @returns {string} - Formatted number as string
 */
function formatNumber(value: number, decimalPlaces = 2): string {
  return value.toLocaleString('pl-PL', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
}

export default {
  getDefaultYear,
  round,
  scrollToElement,
  sum,
  sumMonthlyResults,
  applyMixins,
  formatNumber,
}
