import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

/**
 * Calculates expenses
 *
 * @param {number} grossAmount
 * @param {number} expensesRate
 * @returns {number}
 */
function calculateExpenses (grossAmount, expensesRate) {
  const expenses = helpers.round(grossAmount * expensesRate, 2)

  if (expensesRate === 0.5 && expenses > constants.CONTRACT_WORK.MAX_EXPENSES) {
    return constants.CONTRACT_WORK.MAX_EXPENSES / 2
  }
  return expenses
}

/**
 * Calculates basis for a tax
 *
 * @param {number} grossAmount
 * @param {number} expenses
 * @returns {number}
 */
function calculateBasisForTax (grossAmount, expenses) {
  return helpers.round(grossAmount - expenses)
}

/**
 * Calculates a tax amount
 *
 * @param {number} basisForTax
 * @param {number} taxRate
 * @returns {number}
 */
function calculateTaxAmount (basisForTax, taxRate) {
  return helpers.round(basisForTax * taxRate)
}

/**
 * Calculates a gros amount
 *
 * @param {number} netAmount
 * @param {number} taxRate
 * @param {number} expensesRate
 * @returns {number}
 */
function calculateGrossAmount (netAmount, taxRate, expensesRate) {
  return helpers.round(netAmount / (1 - taxRate * (1 - expensesRate)), 2)
}

/**
 * Calculates a net amount
 *
 * @param {number} grossAmount
 * @param {number} taxAmount
 * @returns {number}
 */
function calculateNetAmount (grossAmount, taxAmount) {
  return grossAmount - taxAmount
}

/**
 * Gets the result using a net amount
 *
 * @param {number} amount
 * @param {number} expensesRate
 * @returns {{netAmount, basisForTax: number, grossAmount: (*|number), taxAmount: number, expenses: number}}
 */
function getResultUsingNetAmount (amount, expensesRate) {
  const netAmount = amount
  let grossAmount = calculateGrossAmount(amount, constants.TAX_RATES.FIRST_RATE / 100, expensesRate)

  if (grossAmount <= constants.LUMP_SUM_UP_TO_AMOUNT) {
    expensesRate = 0
    grossAmount = calculateGrossAmount(amount, constants.TAX_RATES.FIRST_RATE / 100, expensesRate)
  }

  const expenses = calculateExpenses(grossAmount, expensesRate)
  const basisForTax = calculateBasisForTax(grossAmount, expenses)
  const taxAmount = calculateTaxAmount(basisForTax, constants.TAX_RATES.FIRST_RATE / 100)
  grossAmount = netAmount + taxAmount

  return {
    netAmount: netAmount,
    expenses: expenses,
    basisForTax: basisForTax,
    taxAmount: taxAmount,
    grossAmount: grossAmount,
  }
}

/**
 * Gets the result using a gross amount
 *
 * @param {number} amount
 * @param {number} expensesRate
 * @returns {{netAmount: number, basisForTax: number, grossAmount, taxAmount: number, expenses: number}}
 */
function getResultUsingGrossAmount (amount, expensesRate) {
  const grossAmount = amount

  if (grossAmount < constants.LUMP_SUM_UP_TO_AMOUNT) {
    expensesRate = 0
  }

  const expenses = calculateExpenses(grossAmount, expensesRate)
  const basisForTax = calculateBasisForTax(grossAmount, expenses)
  const taxAmount = calculateTaxAmount(basisForTax, constants.TAX_RATES.FIRST_RATE / 100)
  const netAmount = calculateNetAmount(grossAmount, taxAmount)

  return {
    netAmount: netAmount,
    expenses: expenses,
    basisForTax: basisForTax,
    taxAmount: taxAmount,
    grossAmount: grossAmount,
  }
}

/**
 * Gets the result
 *
 * @param {number} amount
 * @param {string} amountType
 * @param {number} expenseRate
 * @returns {{netAmount: number, basisForTax: number, grossAmount, taxAmount: number, expenses: number}|{netAmount, basisForTax: number, grossAmount: (*|number), taxAmount: number, expenses: number}}
 */
function getResult (amount, amountType, expenseRate) {
  if (!amount || !amountType || !expenseRate) {
    return {
      netAmount: 0,
      expenses: 0,
      basisForTax: 0,
      taxAmount: 0,
      grossAmount: 0,
    }
  }

  switch (amountType) {
    case constants.AMOUNT_TYPES.NET:
      return getResultUsingNetAmount(amount, expenseRate)
    case constants.AMOUNT_TYPES.GROSS:
      return getResultUsingGrossAmount(amount, expenseRate)
  }
}

export { getResult }
