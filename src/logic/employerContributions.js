import helpers from 'src/logic/helpers'
import constants from 'src/logic/constants'

/**
 * Calculates the pension contribution of the employer
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculatePensionContribution (basisForRentAndPension) {
  return helpers.round(constants.ZUS.EMPLOYER.PENSION_RATE / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the rent contribution of the employer
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculateRentContribution (basisForRentAndPension) {
  return helpers.round(constants.ZUS.EMPLOYER.RENT_RATE / 100 * basisForRentAndPension, 2)
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
 * Calculates the PPK of the employer
 *
 * @param {number} grossAmount
 * @param {number} ppkRate
 * @returns {number}
 */
function calculatePpkContribution (grossAmount, ppkRate) {
  return helpers.round(ppkRate * grossAmount, 2)
}

export default {
  calculatePensionContribution,
  calculateRentContribution,
  calculateAccidentContribution,
  calculatePpkContribution,
}
