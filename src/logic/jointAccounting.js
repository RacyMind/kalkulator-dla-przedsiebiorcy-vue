import helpers from 'src/logic/helpers'
import taxes from './taxes'

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear) {
  taxes.setYear(newYear)
}

/**
 * Calculates the gross amount
 *
 * @param {number} myGrossAmount
 * @param {number} spouseGrossAmount
 * @returns {number}
 */
function calculateGrossAMount (myGrossAmount, spouseGrossAmount) {
  return myGrossAmount + spouseGrossAmount
}

/**
 * Calculates the basis
 *
 * @param {number} jointBasisForTax
 * @returns {number}
 */
function calculateBasisForTax (jointBasisForTax) {
  return helpers.round(jointBasisForTax / 2, 2)
}

/**
 * Calculates the gross amount
 *
 * @param {number} myAmountOfDeductionOfHealthContributionFromTax
 * @param {number} spouseAmountOfDeductionOfHealthContributionFromTax
 * @returns {number}
 */
function calculateAmountOfDeductionOfHealthContributionFromTax (myAmountOfDeductionOfHealthContributionFromTax, spouseAmountOfDeductionOfHealthContributionFromTax) {
  return myAmountOfDeductionOfHealthContributionFromTax + spouseAmountOfDeductionOfHealthContributionFromTax
}

/**
 * Calculates the tax amount
 *
 * @param {number} myGrossAmount
 * @param {number} spouseGrossAmount
 * @param {number} basisForTax
 * @param {number} amountOfDeductionOfHealthContributionFromTax
 * @param {boolean} isAidForMiddleClass
 * @param {boolean} isFreeAmount
 * @returns {number}
 */
function calculateTaxAmount (
  myGrossAmount,
  spouseGrossAmount,
  basisForTax,
  amountOfDeductionOfHealthContributionFromTax,
  isAidForMiddleClass,
  isFreeAmount,
) {
  let taxAmount = helpers.round(taxes.calculateIncomeTaxUsingTaxScales(myGrossAmount + spouseGrossAmount, basisForTax, 0, isFreeAmount, 0, false, true, true) * 2 - amountOfDeductionOfHealthContributionFromTax)

  if (isAidForMiddleClass) {
    taxAmount -= taxes.calculateAidForMiddleClass(myGrossAmount, true)
    taxAmount -= taxes.calculateAidForMiddleClass(spouseGrossAmount, true)
  }

  if (taxAmount < 0) {
    taxAmount = 0
  }

  return taxAmount
}

/**
 * Calculates the net amount
 *
 * @param {number} grossAmount
 * @param {number} taxAmount
 * @param {number} contributionTotal
 * @returns {number}
 */
function calculateNetAmount (grossAmount, taxAmount, contributionTotal) {
  return grossAmount - taxAmount - contributionTotal
}

/**
 * Returns the result
 *
 * @param {Object} myData
 * @param {Object} spouseData
 * @returns {{netAmount: number, basisForTax: number, grossAmount: number, taxAmount: number}}
 */
function getResult (myData, spouseData) {
  let isAidForMiddleClass = false
  const isFreeAmount = true

  const grossAmount = calculateGrossAMount(myData.grossAmount, spouseData.grossAmount)

  if (myData.isAidForMiddleClass || spouseData.isAidForMiddleClass) {
    isAidForMiddleClass = true
  }

  const commonBasisForTax = myData.basisForTax + spouseData.basisForTax

/*  let amountToCalculateTax = 0

  if (isAidForBigFamily) {
    let limitFreeAmountOfTax = params.grossAmountLimitForAid * 2

      limitFreeAmountOfTax += params.freeAmountOfTax * 2

    if (grossAmount > limitFreeAmountOfTax) {
      amountToCalculateTax = commonBasisForTax
    }
    isFreeAmount = false
  } else {
    amountToCalculateTax = commonBasisForTax
  } */

  const basisForTax = calculateBasisForTax(commonBasisForTax)
  const amountOfDeductionOfHealthContributionFromTax = calculateAmountOfDeductionOfHealthContributionFromTax(myData.amountOfDeductionOfHealthContributionFromTax, spouseData.amountOfDeductionOfHealthContributionFromTax)
  const taxAmount = calculateTaxAmount(myData.grossAmount, spouseData.grossAmount, basisForTax, amountOfDeductionOfHealthContributionFromTax, isAidForMiddleClass, isFreeAmount)
  const netAmount = calculateNetAmount(grossAmount, taxAmount, myData.contributionTotal + spouseData.contributionTotal)

  return {
    basisForTax,
    grossAmount,
    netAmount,
    taxAmount,
  }
}

export default {
  getResult,
  setYear,
}
