import {AvailableYear} from 'src/types/AvailableYear'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

let year = helpers.getDefaultYear()

function buildParams(selectedYear: AvailableYear) {
  const constants = useConstantsStore()
  return {
    amountOfTaxThreshold: constants.PARAMS[selectedYear].AMOUNT_OF_TAX_THRESHOLD,
    firstTaxRate: constants.PARAMS[selectedYear].TAX_RATES.FIRST_RATE / 100,
    linearTaxRate: constants.PARAMS[selectedYear].TAX_RATES.LINEAR_RATE / 100,
    secondTaxRate: constants.PARAMS[selectedYear].TAX_RATES.SECOND_RATE / 100,
    taxReducingAmount: constants.PARAMS[selectedYear].TAX_REDUCING_AMOUNT,
  }
}

let params = buildParams(year)

/**
 * Sets parameters for the year
 * @param newYear
 */
function setParams (newYear:AvailableYear) {
  year = newYear
  params = buildParams(year)
}
/**
 * Calculates the income tax using general rules
 *
 * @param {number} grossAmount
 * @param {number} basisForTax
 * @param {number} amountOfDeductionOfHealthContributionFromTax
 * @param {boolean} isFreeAmount
 * @param {number} totalBasisForTax
 * @param {boolean} isYearly
 * @param {boolean} isMarriage
 * @returns {number}
 */
function calculateIncomeTaxUsingTaxScales (
  grossAmount:number,
  basisForTax:number,
  amountOfDeductionOfHealthContributionFromTax:number,
  isFreeAmount:boolean,
  totalBasisForTax:number,
  isYearly = false,
  isMarriage = false,
):number {
  let taxReducingAmount = 0

  if (isFreeAmount) {
    taxReducingAmount = params.taxReducingAmount
  }

  if (isMarriage) {
    taxReducingAmount *= 2
  }

  if (isYearly) {
    taxReducingAmount *= 12
  }

  let taxAmount = basisForTax * params.firstTaxRate - amountOfDeductionOfHealthContributionFromTax

  const newTotalBasisForTax = basisForTax + totalBasisForTax

  // If the total basis for the tax tax is grater than the amount of the tax threshold, there is second tax rate
  if (totalBasisForTax > params.amountOfTaxThreshold) {
    taxAmount = basisForTax * params.secondTaxRate - amountOfDeductionOfHealthContributionFromTax
  } else if (newTotalBasisForTax > params.amountOfTaxThreshold) {
    // first rate
    taxAmount = (params.amountOfTaxThreshold - totalBasisForTax) * params.firstTaxRate - amountOfDeductionOfHealthContributionFromTax
    // second rate
    taxAmount += (newTotalBasisForTax - params.amountOfTaxThreshold) * params.secondTaxRate
  }

  taxAmount -= taxReducingAmount

  if (taxAmount < 0) {
    taxAmount = 0
  }

  return helpers.round(taxAmount)
}

/**
 * Calculates the income tax using linear rules
 *
 * @param {number} basisForTax
 * @param {number} amountOfDeductionOfHealthContributionFromTax
 * @returns {number}
 */
function calculateIncomeTaxUsingLinearRules (
  basisForTax:number,
  amountOfDeductionOfHealthContributionFromTax:number,
):number {
  let taxAmount = basisForTax * params.linearTaxRate - amountOfDeductionOfHealthContributionFromTax

  if (taxAmount < 0) {
    taxAmount = 0
  }
  return helpers.round(taxAmount)
}

/**
 * Calculates the income tax using lump sum rules
 *
 * @param {number} basisForTax
 * @param {number} lumpSumTaxRate
 * @param {number} amountOfDeductionOfHealthContributionFromTax
 * @returns {number}
 */
function calculateIncomeTaxUsingLumpSumRules (
  basisForTax:number,
  lumpSumTaxRate:number,
  amountOfDeductionOfHealthContributionFromTax:number,
):number {
  let taxAmount = basisForTax * lumpSumTaxRate - amountOfDeductionOfHealthContributionFromTax

  if (taxAmount < 0) {
    taxAmount = 0
  }
  return helpers.round(taxAmount)
}

export default {
  calculateIncomeTaxUsingTaxScales,
  calculateIncomeTaxUsingLinearRules,
  calculateIncomeTaxUsingLumpSumRules,
  setParams,
}
