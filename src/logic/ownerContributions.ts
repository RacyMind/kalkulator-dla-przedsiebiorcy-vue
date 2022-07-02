import helpers from 'src/logic/helpers'
import constants from 'src/logic/constants'
import {AvailableYear} from 'src/types/AvailableYear'
import {IncomeTaxType} from 'src/types/IncomeTaxType'

let year = helpers.getDefaultYear()

let params = {
  averageSalary: constants.PARAMS[year].AVERAGE_SALARY,
  basisForHealthContribution: constants.PARAMS[year].ZUS.OWNER.BASIS_AMOUNT_FOR_HEALTH,
  fpContributionRate: constants.PARAMS[year].ZUS.OWNER.FP_RATE,
  healthContributionRate: constants.PARAMS[year].ZUS.OWNER.HEALTH_RATE,
  healthContributionRateForLinearTax: constants.PARAMS[year].ZUS.OWNER.HEALTH_RATE_FOR_LINEAR_TAX || 0,
  healthContributionRateForTaxOffice: constants.PARAMS[year].US.OWNER.HEALTH_RATE,
  limitOfDeductionHealthContribution: constants.PARAMS[year].US.OWNER.LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION,
  minimumSalary: constants.PARAMS[year].MINIMUM_SALARY,
  pensionContributionRate: constants.PARAMS[year].ZUS.OWNER.PENSION_RATE,
  rentContributionRate: constants.PARAMS[year].ZUS.OWNER.RENT_RATE,
  sickContributionRate: constants.PARAMS[year].ZUS.OWNER.SICK_RATE,
}

/**
 * Sets parameters for the year
 * @param newYear
 */
function setParams (newYear:AvailableYear) {
  year = newYear

  params = {
    averageSalary: constants.PARAMS[year].AVERAGE_SALARY,
    basisForHealthContribution: constants.PARAMS[year].ZUS.OWNER.BASIS_AMOUNT_FOR_HEALTH,
    fpContributionRate: constants.PARAMS[year].ZUS.OWNER.FP_RATE,
    healthContributionRate: constants.PARAMS[year].ZUS.OWNER.HEALTH_RATE,
    healthContributionRateForLinearTax: constants.PARAMS[year].ZUS.OWNER.HEALTH_RATE_FOR_LINEAR_TAX || 0,
    healthContributionRateForTaxOffice: constants.PARAMS[year].US.EMPLOYEE.HEALTH_RATE,
    limitOfDeductionHealthContribution: constants.PARAMS[year].US.OWNER.LIMIT_OF_DEDUCTION_HEALTH_CONTRIBUTION,
    minimumSalary: constants.PARAMS[year].MINIMUM_SALARY,
    pensionContributionRate: constants.PARAMS[year].ZUS.OWNER.PENSION_RATE,
    rentContributionRate: constants.PARAMS[year].ZUS.OWNER.RENT_RATE,
    sickContributionRate: constants.PARAMS[year].ZUS.OWNER.SICK_RATE,
  }
}

/**
 * Calculates the pension contribution
 *
 * @param {number} basisForContributions
 * @returns {number}
 */
function calculatePensionContribution (basisForContributions:number):number {
  return helpers.round(params.pensionContributionRate / 100 * basisForContributions, 2)
}

/**
 * Calculates the rent contribution
 *
 * @param {number} basisForContributions
 * @returns {number}
 */
function calculateDisabilityContribution (basisForContributions:number):number {
  return helpers.round(params.rentContributionRate / 100 * basisForContributions, 2)
}

/**
 * Calculates the sick contribution
 *
 * @param {number} basisForContributions
 * @returns {number}
 */
function calculateSickContribution (basisForContributions:number):number {
  return helpers.round(params.sickContributionRate / 100 * basisForContributions, 2)
}

/**
 * Calculates the health contribution
 *
 * @param {number} amount
 * @param {IncomeTaxType} taxType
 * @param {number} yearlyIncome
 * @returns {number}
 */
function calculateHealthContribution (amount:number, taxType:IncomeTaxType, yearlyIncome:number):number {
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
      // fix for a monthly result
      yearlyIncome = Math.max(amount, yearlyIncome)

      let rateForBasis = 60

      if (yearlyIncome > 60000) {
        rateForBasis = 100
      }

      if (yearlyIncome > 300000) {
        rateForBasis = 180
      }

      const basisForHealthContribution = params.averageSalary * rateForBasis / 100
      return helpers.round(params.healthContributionRate / 100 * basisForHealthContribution, 2)
    }
    case constants.TAX_TYPES.GENERAL:
      const higherAmount = Math.max(params.minimumSalary, amount)
      return helpers.round(params.healthContributionRate / 100 * higherAmount, 2)
  }

  return 0
}

/**
 * Calculates the accident contribution
 *
 * @param {number} basisForContributions
 * @param {number} accidentRate
 * @returns {number}
 */
function calculateAccidentContribution (basisForContributions:number, accidentRate:number):number {
  return helpers.round(accidentRate * basisForContributions, 2)
}

/**
 * Calculates the FP contribution of the employer
 *
 * @param {number} basisForContributions
 * @returns {number}
 */
function calculateFpContribution (basisForContributions:number):number {
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
  grossAmount:number,
  pensionContribution:number,
  rentContribution:number,
  sickContribution:number,
  accidentContribution:number,
):number {
  const contributions = pensionContribution + rentContribution + sickContribution + accidentContribution

  return grossAmount - contributions
}

/**
 * Calculates the amount of deduction of the health contribution from tax
 *
 * @returns {number}
 */
function calculateAmountOfDeductionOfHealthContributionFromTax (healthContribution:number, taxType:IncomeTaxType, totalAmountOfDeductionOfHealthContributionFromTax:number):number {
  if(year >= 2022) {
    switch (taxType) {
      case constants.TAX_TYPES.LINEAR:
        if(totalAmountOfDeductionOfHealthContributionFromTax >= params.limitOfDeductionHealthContribution) {
          return 0
        }

        let amountOfDeductionOfHealthContributionFromTax = healthContribution
        const newTotalAmountOfDeductionOfHealthContributionFromTax = totalAmountOfDeductionOfHealthContributionFromTax + healthContribution

        if(newTotalAmountOfDeductionOfHealthContributionFromTax > params.limitOfDeductionHealthContribution) {
          amountOfDeductionOfHealthContributionFromTax = healthContribution + params.limitOfDeductionHealthContribution - newTotalAmountOfDeductionOfHealthContributionFromTax
        }

        return helpers.round(amountOfDeductionOfHealthContributionFromTax, 2)
      case constants.TAX_TYPES.LUMP_SUM:
        return helpers.round(healthContribution * 0.5, 2)
    }

  }
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
function sumContributions (pensionContribution:number, rentContribution:number, sickContribution:number, healthContribution:number, accidentContribution:number, fpContribution:number):number {
  return pensionContribution + rentContribution + sickContribution + healthContribution + accidentContribution + fpContribution
}

export default {
  calculateAccidentContribution,
  calculateAmountOfDeductionOfHealthContributionFromTax,
  calculateDisabilityContribution,
  calculateFpContribution,
  calculateGrossAmountMinusContributions,
  calculateHealthContribution,
  calculatePensionContribution,
  calculateSickContribution,
  setParams,
  sumContributions,
}
