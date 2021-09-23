import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const taxRate = constants.TAX_RATES.FIRST_RATE / 100

/**
 * Calculates the basis for tax
 *
 * @param {number} grossAmount
 * @param {number} expenses
 * @returns {number}
 */
function calculateBasisForTax (grossAmount, expenses) {
  return helpers.round(grossAmount - expenses)
}

/**
 * Calculates the tax amount
 * @param {number} basisForTax
 * @returns {number}
 */
function calculateTaxAmount (basisForTax) {
  return helpers.round(basisForTax * taxRate)
}

/**
 * Calculates the net amount
 *
 * @param {number} grossAmount
 * @param {number} taxAmount
 * @returns {number}
 */
function calculateNetAmount (grossAmount, taxAmount) {
  return grossAmount - taxAmount
}

/**
 * Returns the result
 *
 * @param {number} grossAmount
 * @param {number} expenses
 * @returns {{netAmount: number, basisForTax: number, grossAmount, taxAmount: number}}
 */
function getResult (grossAmount, expenses) {
  const basisForTax = calculateBasisForTax(grossAmount, expenses)
  const taxAmount = calculateTaxAmount(basisForTax)
  const netAmount = calculateNetAmount(grossAmount, taxAmount)

  return {
    netAmount: netAmount,
    grossAmount: grossAmount,
    basisForTax: basisForTax,
    taxAmount: taxAmount,
    expenses: expenses,
  }
}

export { getResult }
