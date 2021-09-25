import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const taxRate = constants.TAX_RATES.FIRST_RATE / 100

/**
 * Calculates expenses
 *
 * @param {number} basisForExpenses
 * @param {number} expenseRate
 * @param {number} partOfWorkWithAuthorExpenses
 * @returns {number}
 */
function calculateExpenses (basisForExpenses, expenseRate, partOfWorkWithAuthorExpenses = 0) {
  const partOfWorkWithoutAuthorExpenses = 1 - partOfWorkWithAuthorExpenses

  let expenses = basisForExpenses * partOfWorkWithoutAuthorExpenses * expenseRate

  if (partOfWorkWithAuthorExpenses) {
    expenses += basisForExpenses * partOfWorkWithAuthorExpenses * constants.CONTRACT_OF_MANDATE.AUTHOR_EXPENSES_RATE
  }

  if (expenses > constants.AMOUNT_OF_TAX_THRESHOLD) {
    expenses = constants.AMOUNT_OF_TAX_THRESHOLD
  }

  return helpers.round(expenses, 2)
}

/**
 * Calculates the basis for tax
 *
 * @param {number} grossAmount
 * @param {number} expenses
 * @param {number} grossAmountMinusContributions
 * @returns {number}
 */
function calculateBasisForTax (grossAmount, expenses, grossAmountMinusContributions) {
  let basisForTax = grossAmount

  if (this.gross > constants.LUMP_SUM_UP_TO_AMOUNT) {
    basisForTax = basisForTax - expenses -
      grossAmountMinusContributions
  }

  return helpers.round(basisForTax)
}

/**
 * Calculates the ta amount
 *
 * @param {number} grossAmount
 * @param {number} basisForTax
 * @param {number} amountOfDeductionOfHealthContributionsFromTax
 * @returns {number}
 */
function calculateTaxAmount (grossAmount, basisForTax, amountOfDeductionOfHealthContributionsFromTax) {
  let taxAmount = basisForTax * taxRate

  if (grossAmount > constants.LUMP_SUM_UP_TO_AMOUNT) {
    taxAmount -= amountOfDeductionOfHealthContributionsFromTax
  }

  return helpers.round(taxAmount)
}

/**
 * Calculates the net amount
 *
 * @param {number} grossAmount
 * @param {number} taxAmount
 * @param {number} contributions
 * @param {number} ppkAmount
 * @returns {number}
 */
function calculateNetAmount (grossAmount, taxAmount, contributions, ppkAmount) {
  return helpers.round(grossAmount - taxAmount - ppkAmount -
    contributions, 2)
}
