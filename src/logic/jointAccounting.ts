import helpers from 'src/logic/helpers'
import taxes from './taxes'
import {AvailableYear} from 'src/types/AvailableYear'

interface SpouseData {
  grossAmount: number
  basisForTax: number
  amountOfDeductionOfHealthContributionFromTax: number
  contributionTotal: number
  isAidForMiddleClass?: boolean
}

interface JointResult {
  basisForTax: number
  grossAmount: number
  netAmount: number
  taxAmount: number
}

/**
 * Sets parameters for the year
 * @param newYear
 */
function setYear (newYear: AvailableYear): void {
  taxes.setParams(newYear)
}

/**
 * Calculates the gross amount
 *
 * @param {number} myGrossAmount
 * @param {number} spouseGrossAmount
 * @returns {number}
 */
function calculateGrossAMount (myGrossAmount: number, spouseGrossAmount: number): number {
  return myGrossAmount + spouseGrossAmount
}

/**
 * Calculates the basis
 *
 * @param {number} jointBasisForTax
 * @returns {number}
 */
function calculateBasisForTax (jointBasisForTax: number): number {
  return helpers.round(jointBasisForTax / 2, 2)
}

/**
 * Calculates the gross amount
 *
 * @param {number} myAmountOfDeductionOfHealthContributionFromTax
 * @param {number} spouseAmountOfDeductionOfHealthContributionFromTax
 * @returns {number}
 */
function calculateAmountOfDeductionOfHealthContributionFromTax (myAmountOfDeductionOfHealthContributionFromTax: number, spouseAmountOfDeductionOfHealthContributionFromTax: number): number {
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
  myGrossAmount: number,
  spouseGrossAmount: number,
  basisForTax: number,
  amountOfDeductionOfHealthContributionFromTax: number,
  isAidForMiddleClass: boolean,
  isFreeAmount: boolean,
): number {
  let taxAmount = helpers.round(taxes.calculateIncomeTaxUsingTaxScales(myGrossAmount + spouseGrossAmount, basisForTax, 0, isFreeAmount, 0, false, true) * 2 - amountOfDeductionOfHealthContributionFromTax)

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
function calculateNetAmount (grossAmount: number, taxAmount: number, contributionTotal: number): number {
  return grossAmount - taxAmount - contributionTotal
}

/**
 * Returns the result
 *
 * @param {Object} myData
 * @param {Object} spouseData
 * @returns {{netAmount: number, basisForTax: number, grossAmount: number, taxAmount: number}}
 */
function getResult (myData: SpouseData, spouseData: SpouseData): JointResult {
  let isAidForMiddleClass = false
  const isFreeAmount = true

  const grossAmount = calculateGrossAMount(myData.grossAmount, spouseData.grossAmount)

  if (myData.isAidForMiddleClass || spouseData.isAidForMiddleClass) {
    isAidForMiddleClass = true
  }

  const commonBasisForTax = myData.basisForTax + spouseData.basisForTax

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
