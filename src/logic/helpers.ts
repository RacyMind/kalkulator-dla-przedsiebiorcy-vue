import { scroll } from 'quasar'
import constants from 'src/logic/constants'
import {AvailableYear} from 'src/types/AvailableYear'
import {ContractOfEmploymentEmployeeSingleResult} from 'components/contractOfEmployment/interfaces/ContractOfEmploymentEmployeeSingleResult'
import {ContractOfMandateEmployeeSingleResult} from 'components/contractOfMandate/interfaces/ContractOfMandateEmployeeSingleResult'

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

function  sumMonthlyResults(monthlyResults:ContractOfEmploymentEmployeeSingleResult[]|ContractOfMandateEmployeeSingleResult[]) {
  return {
    netAmount: round(monthlyResults.map(result => result.netAmount)
      .reduce((current, sum) => current + sum, 0), 2),
    grossAmount: round(monthlyResults.map(result => result.grossAmount)
      .reduce((current, sum) => current + sum, 0), 2),
    basisForRentAndPensionContributions: round(monthlyResults.map(result => result.basisForRentAndPensionContributions)
      .reduce((current, sum) => current + sum, 0), 2),
    pensionContribution: round(monthlyResults.map(result => result.pensionContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    disabilityContribution: round(monthlyResults.map(result => result.disabilityContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    sickContribution: round(monthlyResults.map(result => result.sickContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    healthContribution: round(monthlyResults.map(result => result.healthContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    ppkContribution: round(monthlyResults.map(result => result.ppkContribution)
      .reduce((current, sum) => current + sum, 0), 2),
    basisForTax: monthlyResults.map(result => result.basisForTax)
      .reduce((current, sum) => current + sum, 0),
    expenses: round(monthlyResults.map(result => result.expenses)
      .reduce((current, sum) => current + sum, 0), 2),
    taxAmount: monthlyResults.map(result => result.taxAmount)
      .reduce((current, sum) => current + sum, 0),
    contributionTotal: round(monthlyResults.map(result => result.contributionTotal)
      .reduce((current, sum) => current + sum, 0), 2),
  }

}
export default {
  scrollToElement,
  round,
  getDefaultYear,
  sumMonthlyResults,
}
