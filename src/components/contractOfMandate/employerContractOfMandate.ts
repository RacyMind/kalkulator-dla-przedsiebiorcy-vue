import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import employeeContributions from 'src/logic/employeeContributions'
import employerContributions from 'src/logic/employerContributions'

let year = helpers.getDefaultYear()

let params = {
  taxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
  amountOfTaxThreshold: constants.PARAMS[year].AMOUNT_OF_TAX_THRESHOLD,
  lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
  limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
  grossAmountLimitForAid: constants.PARAMS[year].GROSS_AMOUNT_LIMIT_FOR_AID,
}

let totalBasisForRentAndPensionContributions = 0
let totalExpenses = 0
let totalGrossAmount = 0

/**
 * Resets total amounts
 */
function resetTotalAmounts () {
  totalBasisForRentAndPensionContributions = 0
  totalExpenses = 0
  totalGrossAmount = 0
}

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear) {
  year = newYear

  params = {
    taxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
    amountOfTaxThreshold: constants.PARAMS[year].AMOUNT_OF_TAX_THRESHOLD,
    lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
    limitBasicAmountForZus: constants.PARAMS[year].LIMIT_BASIC_AMOUNT_FOR_ZUS,
    grossAmountLimitForAid: constants.PARAMS[year].GROSS_AMOUNT_LIMIT_FOR_AID,
  }

  resetTotalAmounts()

  employerContributions.setYear(newYear)
  employeeContributions.setYear(newYear)
}

/**
 * Calculates basisForRentAndPensionContributions
 * @param {number} grossAmount
 * @returns {number}
 */
function calculateBasisForRentAndPensionContributions (grossAmount:number) {
  const newTotalBasisForRentAndPensionContributions = grossAmount + totalBasisForRentAndPensionContributions

  // The total basis of rend and pension contributions can't cross the limit basis for ZUS
  if (totalBasisForRentAndPensionContributions > params.limitBasicAmountForZus) {
    return 0
  }
  if (newTotalBasisForRentAndPensionContributions > params.limitBasicAmountForZus) {
    return params.limitBasicAmountForZus - totalBasisForRentAndPensionContributions
  }

  return grossAmount
}

/**
 * Returns the monthly results of an employer
 *
 * @param {number} grossAmount
 * @param {number} accidentContributionRate
 * @param {number} ppkContributionRate
 * @param {boolean} isPensionContribution
 * @param {boolean} isRentContribution
 * @returns {{totalAmount: number, ppkContribution: number, rentContribution: number, grossAmount: number, accidentContribution: number, pensionContribution: number}}
 */
function getMonthlyResultOfEmployer (
  grossAmount,
  accidentContributionRate,
  ppkContributionRate,
  isPensionContribution,
  isRentContribution,
) {
  if (!grossAmount) {
    grossAmount = 0
  }

  let pensionContribution = 0
  let rentContribution = 0
  let accidentContribution = 0
  let ppkContribution = 0
  const basisForRentAndPensionContributions = calculateBasisForRentAndPensionContributions(grossAmount)

  if (isPensionContribution) {
    pensionContribution = employerContributions.calculatePensionContribution(basisForRentAndPensionContributions)
  }
  if (isRentContribution) {
    rentContribution = employerContributions.calculateRentContribution(basisForRentAndPensionContributions)
  }
  if (accidentContributionRate) {
    accidentContribution = employerContributions.calculateAccidentContribution(grossAmount, accidentContributionRate)
  }
  if (ppkContributionRate) {
    ppkContribution = employerContributions.calculatePpkContribution(grossAmount, ppkContributionRate)
  }

  const totalAmount = grossAmount + pensionContribution + rentContribution + accidentContribution + ppkContribution

  return {
    totalAmount: totalAmount,
    grossAmount: grossAmount,
    pensionContribution: pensionContribution,
    rentContribution: rentContribution,
    accidentContribution: accidentContribution,
    ppkContribution: ppkContribution,
  }
}

/**
 * Returns the yearly results of an employer
 *
 * @param {[]} monthlyInputs
 * @returns {{totalBasisForRentAndPensionContributions: number, rows: *[]}}
 */
function getYearlyResultOfEmployer (monthlyInputs) {
  const results = []
  let i = 0
  totalBasisForRentAndPensionContributions = 0

  monthlyInputs.forEach(input => {
    const result = getMonthlyResultOfEmployer(...Object.values(input))
    result.month = i
    results.push(result)

    totalBasisForRentAndPensionContributions += result.grossAmount
    i++
  })

  results.push({
    month: constants.LOCALE_DATE.wholeYearIndex,
    totalAmount: results.map(result => result.totalAmount)
      .reduce((current, sum) => current + sum, 0),
    grossAmount: results.map(result => result.grossAmount)
      .reduce((current, sum) => current + sum, 0),
    pensionContribution: results.map(result => result.pensionContribution)
      .reduce((current, sum) => current + sum, 0),
    rentContribution: results.map(result => result.rentContribution)
      .reduce((current, sum) => current + sum, 0),
    accidentContribution: results.map(result => result.accidentContribution)
      .reduce((current, sum) => current + sum, 0),
    ppkContribution: results.map(result => result.ppkContribution)
      .reduce((current, sum) => current + sum, 0),
  })

  return {
    rows: results,
    totalBasisForRentAndPensionContributions: totalBasisForRentAndPensionContributions,
  }
}

export default {
  getMonthlyResultOfEmployee,
  getMonthlyResultOfEmployer,
  getYearlyResultOfEmployer,
  getYearlyResultOfEmployee,
  setYear,
  resetTotalAmounts,
}
