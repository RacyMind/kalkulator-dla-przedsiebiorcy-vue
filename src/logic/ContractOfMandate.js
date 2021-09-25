import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const taxRate = constants.TAX_RATES.FIRST_RATE / 100

/**
 * Calculates the ta amount
 *
 * @param {number} grossAmount
 * @param {number} basisForTax
 * @param {number} amountTaxDeductibilityOfHealthContributions
 * @returns {number}
 */
function calculateTaxAmount (grossAmount, basisForTax, amountTaxDeductibilityOfHealthContributions) {
  let taxAmount = basisForTax * taxRate

  if (grossAmount > constants.LUMP_SUM_UP_TO_AMOUNT) {
    taxAmount -= amountTaxDeductibilityOfHealthContributions
  }

  return (helpers.round(taxAmount))
}

/**
 * Calculates basis for expenses
 *
 * @param {number} grossAmount
 * @param {number} pensionContributions
 * @param {number} rentContributions
 * @param {number} sickContributions
 * @returns {number}
 */
function calculateBasisForExpenses (grossAmount, pensionContributions, rentContributions, sickContributions) {
  const contributions = pensionContributions + rentContributions + sickContributions

  return grossAmount - contributions
}

/**
 * Calculates expenses
 *
 * @param {number} basisForExpenses
 * @param {number} expenseRate
 * @param {number} partOfWorkWithAuthorExpenses
 * @returns {number}
 */
function calculateExpenses (basisForExpenses, expenseRate, partOfWorkWithAuthorExpenses = 0) {
  const normalPartOfWork = 1 - partOfWorkWithAuthorExpenses
  let expenses = basisForExpenses * normalPartOfWork * expenseRate

  if (partOfWorkWithAuthorExpenses) {
    expenses += basisForExpenses * partOfWorkWithAuthorExpenses * constants.CONTRACT_OF_MANDATE.AUTHOR_EXPENSES_RATE
  }

  if (expenses > constants.AMOUNT_OF_TAX_THRESHOLD) {
    expenses = constants.AMOUNT_OF_TAX_THRESHOLD
  }

  return helpers.round(expenses, 2)
}
