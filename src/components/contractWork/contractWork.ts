import {AvailableYear} from 'src/types/AvailableYear'
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {ContractWorkResult} from 'components/contractWork/interfaces/ContractWorkResult'
import {ExpenseRate} from 'components/contractWork/types/ExpenseRate'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

let params = {
  amountOfTaxThreshold: constants.PARAMS[helpers.getDefaultYear()].AMOUNT_OF_TAX_THRESHOLD,
  lumpSumUpToAmount: constants.PARAMS[helpers.getDefaultYear()].LUMP_SUM_UP_TO_AMOUNT,
  taxRate: constants.PARAMS[helpers.getDefaultYear()].TAX_RATES.FIRST_RATE / 100,
}

/**
 * Sets parameters for the year
 * @param year
 */
function setParams (year:AvailableYear) {
  params = {
    amountOfTaxThreshold: constants.PARAMS[year].AMOUNT_OF_TAX_THRESHOLD,
    lumpSumUpToAmount: constants.PARAMS[year].LUMP_SUM_UP_TO_AMOUNT,
    taxRate: constants.PARAMS[year].TAX_RATES.FIRST_RATE / 100,
  }
}

/**
 * Calculates expenses
 *
 * @param {number} grossAmount
 * @param {ExpenseRate} expenseRate
 * @returns {number}
 */
function calculateExpenses (grossAmount:number, expenseRate:ExpenseRate):number {
  // for the amount <= lumpSumUpToAmount, the expenses don't exist
  if (grossAmount <= params.lumpSumUpToAmount) {
    return 0
  }
  const expenses = helpers.round(grossAmount * expenseRate, 2)

  if (expenseRate === constants.CONTRACT_WORK.EXPENSES_50 && expenses > params.amountOfTaxThreshold) {
    return params.amountOfTaxThreshold
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
function calculateBasisForTax (grossAmount:number, expenses:number):number {
  return helpers.round(grossAmount - expenses)
}

/**
 * Calculates a tax amount
 *
 * @param {number} basisForTax
 * @returns {number}
 */
function calculateTaxAmount (basisForTax:number):number {
  return helpers.round(basisForTax * params.taxRate)
}

/**
 * Calculates a gros amount
 *
 * @param {number} netAmount
 * @param {ExpenseRate} expenseRate
 * @returns {number}
 */
function calculateGrossAmount (netAmount:number, expenseRate:ExpenseRate):number {
  return helpers.round(netAmount / (1 - params.taxRate * (1 - expenseRate)), 2)
}

/**
 * Calculates a net amount
 *
 * @param {number} grossAmount
 * @param {number} taxAmount
 * @returns {number}
 */
function calculateNetAmount (grossAmount:number, taxAmount:number):number {
  return grossAmount - taxAmount
}

/**
 * Gets the result using a net amount
 *
 * @param {number} netAmount
 * @param {ExpenseRate} expenseRate
 * @returns {ContractWorkResult}
 */
function getResultUsingNetAmount (netAmount:number, expenseRate:ExpenseRate):ContractWorkResult {
  let grossAmount = calculateGrossAmount(netAmount, expenseRate)

  if (grossAmount <= params.lumpSumUpToAmount) {
    expenseRate = 0
    grossAmount = calculateGrossAmount(netAmount, expenseRate)
  }

  const expenses = calculateExpenses(grossAmount, expenseRate)
  const basisForTax = calculateBasisForTax(grossAmount, expenses)
  const taxAmount = calculateTaxAmount(basisForTax)
  grossAmount = netAmount + taxAmount

  return {
    basisForTax: basisForTax,
    expenses: expenses,
    grossAmount: grossAmount,
    netAmount: netAmount,
    taxAmount: taxAmount,
  }
}

/**
 * Gets the result using a gross amount
 *
 * @param {number} grossAmount
 * @param {number} expenseRate
 * @returns {ContractWorkResult}
 */
function getResultUsingGrossAmount (grossAmount:number, expenseRate:ExpenseRate):ContractWorkResult {
  if (grossAmount < params.lumpSumUpToAmount) {
    expenseRate = 0
  }

  const expenses = calculateExpenses(grossAmount, expenseRate)
  const basisForTax = calculateBasisForTax(grossAmount, expenses)
  const taxAmount = calculateTaxAmount(basisForTax)
  const netAmount = calculateNetAmount(grossAmount, taxAmount)

  return {
    basisForTax: basisForTax,
    expenses: expenses,
    grossAmount: grossAmount,
    netAmount: netAmount,
    taxAmount: taxAmount,
  }
}

/**
 * Gets the result
 *
 * @param {ContractWorkInputFields} input
 * @return {ContractWorkResult}
 */
function getResult (input:ContractWorkInputFields):ContractWorkResult {
  if (!input.amount || !input.amountType || !input.expenseRate || !input.year) {
    throw new Error('Uncompleted input data')
  }

  setParams(input.year)

  switch (input.amountType) {
    case constants.AMOUNT_TYPES.NET:
      return getResultUsingNetAmount(input.amount, input.expenseRate)
    case constants.AMOUNT_TYPES.GROSS:
    default:
      return getResultUsingGrossAmount(input.amount, input.expenseRate)
  }
}

export default {
  getResult,
  setParams,
}
