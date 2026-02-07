import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'
import {AvailableYear} from 'src/types/AvailableYear'

let year: AvailableYear = helpers.getDefaultYear()

function buildParams(selectedYear: AvailableYear) {
  const constants = useConstantsStore()
  return {
    fgspContributionRate: constants.PARAMS[selectedYear].ZUS.EMPLOYER.FGSP_RATE,
    fpContributionRate: constants.PARAMS[selectedYear].ZUS.EMPLOYER.FP_RATE,
    pensionContributionRate: constants.PARAMS[selectedYear].ZUS.EMPLOYER.PENSION_RATE,
    rentContributionRate: constants.PARAMS[selectedYear].ZUS.EMPLOYER.RENT_RATE,
  }
}

let params = buildParams(year)

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear: AvailableYear): void {
  year = newYear
  params = buildParams(year)
}

/**
 * Calculates the pension contribution of the employer
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculatePensionContribution (basisForRentAndPension: number): number {
  return helpers.round(params.pensionContributionRate / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the rent contribution of the employer
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculateDisabilityContribution (basisForRentAndPension: number): number {
  return helpers.round(params.rentContributionRate / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the FP contribution of the employer
 *
 * @param {number} grossAMount
 * @returns {number}
 */
function calculateFpContribution (grossAMount: number): number {
  return helpers.round(params.fpContributionRate / 100 * grossAMount, 2)
}

/**
 * Calculates the FGSP contribution of the employer
 *
 * @param {number} grossAMount
 * @returns {number}
 */
function calculateFgspContribution (grossAMount: number): number {
  return helpers.round(params.fgspContributionRate / 100 * grossAMount, 2)
}

/**
 * Calculates the accident contribution of the employer
 *
 * @param {number} grossAMount
 * @param {number} accidentRate
 * @returns {number}
 */
function calculateAccidentContribution (grossAMount: number, accidentRate: number): number {
  return helpers.round(accidentRate * grossAMount, 2)
}

/**
 * Calculates the PPK contribution of the employer
 *
 * @param {number} grossAmount
 * @param {number} ppkRate
 * @returns {number}
 */
function calculatePpkContribution (grossAmount: number, ppkRate: number): number {
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
