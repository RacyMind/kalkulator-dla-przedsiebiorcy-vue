import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'
import {AvailableYear} from 'src/types/AvailableYear'

let year: AvailableYear = helpers.getDefaultYear()

function buildParams(selectedYear: AvailableYear) {
  const constants = useConstantsStore()
  return {
    healthContributionRate: constants.params[selectedYear].ZUS.EMPLOYEE.HEALTH_RATE,
    healthContributionRateForTaxOffice: constants.params[selectedYear].US.EMPLOYEE.HEALTH_RATE,
    lumpSumUpToAmount: constants.params[selectedYear].LUMP_SUM_UP_TO_AMOUNT,
    pensionContributionRate: constants.params[selectedYear].ZUS.EMPLOYEE.PENSION_RATE,
    rentContributionRate: constants.params[selectedYear].ZUS.EMPLOYEE.RENT_RATE,
    sickContributionRate: constants.params[selectedYear].ZUS.EMPLOYEE.SICK_RATE,
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
 * Calculates the pension contribution of the employee
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculatePensionContribution (basisForRentAndPension: number): number {
  return helpers.round(params.pensionContributionRate / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the rent contribution of the employee
 *
 * @param {number} basisForRentAndPension
 * @returns {number}
 */
function calculateDisabilityContribution (basisForRentAndPension: number): number {
  return helpers.round(params.rentContributionRate / 100 * basisForRentAndPension, 2)
}

/**
 * Calculates the sick contribution of the employee
 *
 * @param {number} grossAmount
 * @returns {number}
 */
function calculateSickContribution (grossAmount: number): number {
  return helpers.round(params.sickContributionRate / 100 * grossAmount, 2)
}

/**
 * Calculates the health contribution of the employee
 *
 * @param {number} amount
 * @returns {number}
 */
function calculateHealthContribution (amount: number): number {
  return helpers.round(params.healthContributionRate / 100 * amount, 2)
}

/**
 * Calculates the accident contribution of the employee
 *
 * @param {number} grossAMount
 * @param {number} accidentRate
 * @returns {number}
 */
function calculateAccidentContribution (grossAMount: number, accidentRate: number): number {
  return helpers.round(accidentRate * grossAMount, 2)
}

/**
 * Calculates the PPK contribution of the employee
 *
 * @param {number} grossAmount
 * @param {number} ppkRate
 * @returns {number}
 */
function calculatePpkContribution (grossAmount: number, ppkRate: number): number {
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
function calculateGrossAmountMinusContributions (grossAmount: number, pensionContribution: number, rentContribution: number, sickContribution: number): number {
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
function calculateAmountOfDeductionOfHealthContributionFromTax (grossAmount: number, grossAmountMinusContributions: number): number {
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
function sumContributions (pensionContribution: number, rentContribution: number, sickContribution: number, healthContribution: number): number {
  return helpers.round(pensionContribution + rentContribution + sickContribution + healthContribution, 2)
}

export default {
  calculateAccidentContribution,
  calculateAmountOfDeductionOfHealthContributionFromTax,
  calculateDisabilityContribution,
  calculateGrossAmountMinusContributions,
  calculateHealthContribution,
  calculatePensionContribution,
  calculatePpkContribution,
  calculateSickContribution,
  setYear,
  sumContributions,
}
