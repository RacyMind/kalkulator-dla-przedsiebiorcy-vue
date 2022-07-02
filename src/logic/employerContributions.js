import helpers from 'src/logic/helpers'
import constants from 'src/logic/constants'

let year = helpers.getDefaultYear()

let params = {
  fgspContributionRate: constants.PARAMS[year].ZUS.EMPLOYER.FGSP_RATE,
  fpContributionRate: constants.PARAMS[year].ZUS.EMPLOYER.FP_RATE,
  pensionContributionRate: constants.PARAMS[year].ZUS.EMPLOYER.PENSION_RATE,
  rentContributionRate: constants.PARAMS[year].ZUS.EMPLOYER.RENT_RATE,
}

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear) {
  year = newYear

  params = {
    fgspContributionRate: constants.PARAMS[year].ZUS.EMPLOYER.FGSP_RATE,
    fpContributionRate: constants.PARAMS[year].ZUS.EMPLOYER.FP_RATE,
    pensionContributionRate: constants.PARAMS[year].ZUS.EMPLOYER.PENSION_RATE,
    rentContributionRate: constants.PARAMS[year].ZUS.EMPLOYER.RENT_RATE,
  }
}

/**
 * Calculates the pension contribution of the employer
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculatePensionContribution (basisForRentAndPension) {
  return helpers.round(params.pensionContributionRate / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the rent contribution of the employer
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculateDisabilityContribution (basisForRentAndPension) {
  return helpers.round(params.rentContributionRate / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the FP contribution of the employer
 *
 * @param {number} grossAMount
 * @returns {number}
 */
function calculateFpContribution (grossAMount) {
  return helpers.round(params.fpContributionRate / 100 * grossAMount, 2)
}

/**
 * Calculates the FGSP contribution of the employer
 *
 * @param {number} grossAMount
 * @returns {number}
 */
function calculateFgspContribution (grossAMount) {
  return helpers.round(params.fgspContributionRate / 100 * grossAMount, 2)
}

/**
 * Calculates the accident contribution of the employer
 *
 * @param {number} grossAMount
 * @param {number} accidentRate
 * @returns {number}
 */
function calculateAccidentContribution (grossAMount, accidentRate) {
  return helpers.round(accidentRate * grossAMount, 2)
}

/**
 * Calculates the PPK contribution of the employer
 *
 * @param {number} grossAmount
 * @param {number} ppkRate
 * @returns {number}
 */
function calculatePpkContribution (grossAmount, ppkRate) {
  return helpers.round(ppkRate * grossAmount, 2)
}

export default {
  calculateAccidentContribution,
  calculateDisabilityContribution,
  calculateFgspContribution,
  calculateFpContribution,
  calculatePensionContribution,
  calculatePpkContribution,
  setYear,
}
