import helpers from 'src/logic/helpers'
import constants from 'src/logic/constants'

let year = helpers.getDefaultYear()

let params = {
  pensionContributionRate: constants.PARAMS[year].ZUS.OWNER.PENSION_RATE,
  rentContributionRate: constants.PARAMS[year].ZUS.OWNER.RENT_RATE,
  sickContributionRate: constants.PARAMS[year].ZUS.OWNER.SICK_RATE,
  healthContributionRate: constants.PARAMS[year].ZUS.OWNER.HEALTH_RATE,
  healthContributionRateForLinearTax: constants.PARAMS[year].ZUS.OWNER.HEALTH_RATE_FOR_LINEAR_TAX || 0,
  healthContributionRateForTaxOffice: constants.PARAMS[year].US.OWNER.HEALTH_RATE,
  fpContributionRate: constants.PARAMS[year].ZUS.OWNER.FP_RATE,
  basisForHealthContribution: constants.PARAMS[year].ZUS.OWNER.BASIS_AMOUNT_FOR_HEALTH,
  minimumSalary: constants.PARAMS[year].MINIMUM_SALARY,
  averageSalary: constants.PARAMS[year].AVERAGE_SALARY,
}

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear) {
  year = newYear

  params = {
    pensionContributionRate: constants.PARAMS[year].ZUS.OWNER.PENSION_RATE,
    rentContributionRate: constants.PARAMS[year].ZUS.OWNER.RENT_RATE,
    sickContributionRate: constants.PARAMS[year].ZUS.OWNER.SICK_RATE,
    healthContributionRate: constants.PARAMS[year].ZUS.OWNER.HEALTH_RATE,
    healthContributionRateForLinearTax: constants.PARAMS[year].ZUS.OWNER.HEALTH_RATE_FOR_LINEAR_TAX || 0,
    healthContributionRateForTaxOffice: constants.PARAMS[year].US.EMPLOYEE.HEALTH_RATE,
    fpContributionRate: constants.PARAMS[year].ZUS.OWNER.FP_RATE,
    basisForHealthContribution: constants.PARAMS[year].ZUS.OWNER.BASIS_AMOUNT_FOR_HEALTH,
    minimumSalary: constants.PARAMS[year].MINIMUM_SALARY,
    averageSalary: constants.PARAMS[year].AVERAGE_SALARY,
  }
}

/**
 * Calculates the pension contribution
 *
 * @param {number} basisForContributions
 * @returns {number}
 */
function calculatePensionContribution (basisForContributions) {
  return helpers.round(params.pensionContributionRate / 100 * basisForContributions, 2)
}

/**
 * Calculates the rent contribution
 *
 * @param {number} basisForContributions
 * @returns {number}
 */
function calculateRentContribution (basisForContributions) {
  return helpers.round(params.rentContributionRate / 100 * basisForContributions, 2)
}

/**
 * Calculates the sick contribution
 *
 * @param {number} basisForContributions
 * @returns {number}
 */
function calculateSickContribution (basisForContributions) {
  return helpers.round(params.sickContributionRate / 100 * basisForContributions, 2)
}

/**
 * Calculates the health contribution
 *
 * @param {number} amount
 * @param {string} taxType
 * @param {number} totalGrossAmount
 * @returns {number}
 */
function calculateHealthContribution (amount, taxType, totalGrossAmount) {
  if (year < 2022) {
    return helpers.round(params.healthContributionRate / 100 * params.basisForHealthContribution, 2)
  }

  switch (taxType) {
    case constants.TAX_TYPES.LINEAR: {
      const healthContribution = helpers.round(params.healthContributionRateForLinearTax / 100 * amount, 2)
      const healthContributionForMinimumSalary = Math.floor(params.minimumSalary * params.healthContributionRate / 100)

      return Math.max(healthContribution, healthContributionForMinimumSalary)
    }
    case constants.TAX_TYPES.LUMP_SUM: {
      let rateForBasis = 60

      if (totalGrossAmount > 60000) {
        rateForBasis = 100
      }

      if (totalGrossAmount > 300000) {
        rateForBasis = 180
      }

      const basisForHealthContribution = params.averageSalary * rateForBasis / 100
      return helpers.round(params.healthContributionRate / 100 * basisForHealthContribution, 2)
    }
    case constants.TAX_TYPES.GENERAL:
      return helpers.round(params.healthContributionRate / 100 * amount, 2)
  }
}

/**
 * Calculates the accident contribution
 *
 * @param {number} basisForContributions
 * @param {number} accidentRate
 * @returns {number}
 */
function calculateAccidentContribution (basisForContributions, accidentRate) {
  return helpers.round(accidentRate * basisForContributions, 2)
}

/**
 * Calculates the FP contribution of the employer
 *
 * @param {number} basisForContributions
 * @returns {number}
 */
function calculateFpContribution (basisForContributions) {
  return helpers.round(params.fpContributionRate / 100 * basisForContributions, 2)
}

/**
 * Calculates the amount of the gross amount minus contributions
 *
 * @param {number} grossAmount
 * @param {number} pensionContribution
 * @param {number} rentContribution
 * @param {number} sickContribution
 * @param {number} accidentContribution
 * @returns {number}
 */
function calculateGrossAmountMinusContributions (
  grossAmount,
  pensionContribution,
  rentContribution,
  sickContribution,
  accidentContribution,
) {
  const contributions = pensionContribution + rentContribution + sickContribution + accidentContribution

  return grossAmount - contributions
}

/**
 * Calculates the amount of deduction of the health contribution from tax
 *
 * @returns {number}
 */
function calculateAmountOfDeductionOfHealthContributionFromTax () {
  const healthRate = params.healthContributionRateForTaxOffice / 100
  return helpers.round(params.basisForHealthContribution * healthRate, 2)
}

/**
 * Sums contributions
 *
 * @param {number} pensionContribution
 * @param {number} rentContribution
 * @param {number} sickContribution
 * @param {number} healthContribution
 * @param {number} accidentContribution
 * @param {number} fpContribution
 * @returns {number}
 */
function sumContributions (pensionContribution, rentContribution, sickContribution, healthContribution, accidentContribution, fpContribution) {
  return pensionContribution + rentContribution + sickContribution + healthContribution + accidentContribution + fpContribution
}

export default {
  setYear,
  calculatePensionContribution,
  calculateRentContribution,
  calculateSickContribution,
  calculateHealthContribution,
  calculateAccidentContribution,
  calculateFpContribution,
  calculateAmountOfDeductionOfHealthContributionFromTax,
  sumContributions,
  calculateGrossAmountMinusContributions,
}
