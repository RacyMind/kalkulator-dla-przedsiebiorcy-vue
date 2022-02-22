import helpers from 'src/logic/helpers'
import constants from 'src/logic/constants'

let year = helpers.getDefaultYear()

let params = {
  pensionContributionRate: constants.PARAMS[year].ZUS.EMPLOYEE.PENSION_RATE,
  rentContributionRate: constants.PARAMS[year].ZUS.EMPLOYEE.RENT_RATE,
  sickContributionRate: constants.PARAMS[year].ZUS.EMPLOYEE.SICK_RATE,
  healthContributionRate: constants.PARAMS[year].ZUS.EMPLOYEE.HEALTH_RATE,
  healthContributionRateForTaxOffice: constants.PARAMS[year].US.EMPLOYEE.HEALTH_RATE,
  lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
}

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear) {
  year = newYear

  params = {
    pensionContributionRate: constants.PARAMS[year].ZUS.EMPLOYEE.PENSION_RATE,
    rentContributionRate: constants.PARAMS[year].ZUS.EMPLOYEE.RENT_RATE,
    sickContributionRate: constants.PARAMS[year].ZUS.EMPLOYEE.SICK_RATE,
    healthContributionRate: constants.PARAMS[year].ZUS.EMPLOYEE.HEALTH_RATE,
    healthContributionRateForTaxOffice: constants.PARAMS[year].US.EMPLOYEE.HEALTH_RATE,
    lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
  }
}

/**
 * Calculates the pension contribution of the employee
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculatePensionContribution (basisForRentAndPension) {
  return helpers.round(params.pensionContributionRate / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the rent contribution of the employee
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculateRentContribution (basisForRentAndPension) {
  return helpers.round(params.rentContributionRate / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the sick contribution of the employee
 *
 * @param {number} grossAmount
 * @returns {number}
 */
function calculateSickContribution (grossAmount) {
  return helpers.round(params.sickContributionRate / 100 * grossAmount, 2)
}

/**
 * Calculates the health contribution of the employee
 *
 * @param {number} amount
 * @returns {number}
 */
function calculateHealthContribution (amount) {
  return helpers.round(params.healthContributionRate / 100 * amount, 2)
}

/**
 * Calculates the accident contribution of the employee
 *
 * @param {number} grossAMount
 * @param {number} accidentRate
 * @returns {number}
 */
function calculateAccidentContribution (grossAMount, accidentRate) {
  return helpers.round(accidentRate * grossAMount, 2)
}

/**
 * Calculates the PPK contribution of the employee
 *
 * @param {number} grossAmount
 * @param {number} ppkRate
 * @returns {number}
 */
function calculatePpkContribution (grossAmount, ppkRate) {
  return helpers.round(ppkRate * grossAmount, 2)
}

/**
 * Calculates the amount of the gross amount minus contributions
 *
 * @param {number} grossAmount
 * @param {number} pensionContribution
 * @param {number} rentContribution
 * @param {number} sickContribution
 * @returns {number}
 */
function calculateGrossAmountMinusContributions (grossAmount, pensionContribution, rentContribution, sickContribution) {
  const contributions = pensionContribution + rentContribution + sickContribution

  return grossAmount - contributions
}

/**
 * Calculates the amount of deduction of the health contribution from tax
 *
 * @param {number} grossAmount
 * @param {number} grossAmountMinusContributions
 * @returns {number}
 */
function calculateAmountOfDeductionOfHealthContributionFromTax (grossAmount, grossAmountMinusContributions) {
  let healthRate = params.healthContributionRate / 100

  if (grossAmount > params.lumpSumUpToAmount) {
    healthRate = params.healthContributionRateForTaxOffice / 100
  }

  return helpers.round(grossAmountMinusContributions * healthRate, 2)
}

/**
 * Sums contributions of the employee
 *
 * @param {number} pensionContribution
 * @param {number} rentContribution
 * @param {number} sickContribution
 * @param {number} healthContribution
 * @returns {number}
 */
function sumContributions (pensionContribution, rentContribution, sickContribution, healthContribution) {
  return helpers.round(pensionContribution + rentContribution + sickContribution + healthContribution, 2)
}

export default {
  setYear,
  calculatePensionContribution,
  calculateRentContribution,
  calculateSickContribution,
  calculateHealthContribution,
  calculateAccidentContribution,
  calculatePpkContribution,
  calculateAmountOfDeductionOfHealthContributionFromTax,
  sumContributions,
  calculateGrossAmountMinusContributions,
}
