import helpers from 'src/logic/helpers'
import constants from 'src/logic/constants'

/**
 * Calculates the pension contribution of the employee
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculatePensionContribution (basisForRentAndPension) {
  return helpers.round(constants.ZUS.EMPLOYEE.PENSION_RATE / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the rent contribution of the employee
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculateRentContribution (basisForRentAndPension) {
  return helpers.round(constants.ZUS.EMPLOYEE.RENT_RATE / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the sick contribution of the employee
 *
 * @param {number} grossAmount
 * @returns {number}
 */
function calculateSickContribution (grossAmount) {
  return helpers.round(constants.ZUS.EMPLOYEE.SICK_RATE / 100 * grossAmount, 2)
}

/**
 * Calculates the health contribution of the employee
 *
 * @param {number} amount
 * @returns {number}
 */
function calculateHealthContribution (amount) {
  return helpers.round(constants.ZUS.EMPLOYEE.HEALTH_RATE / 100 * amount, 2)
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
 * Calculates the PPK of the employee
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
  let healthRate = constants.ZUS.EMPLOYEE.HEALTH_RATE

  if (grossAmount > constants.LUMP_SUM_UP_TO_AMOUNT) {
    healthRate = constants.US.EMPLOYEE.HEALTH_RATE
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
  return pensionContribution + rentContribution + sickContribution + healthContribution
}

export default {
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
