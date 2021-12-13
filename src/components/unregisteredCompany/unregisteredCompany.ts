import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import { UnregisteredCompanyInputFields } from './interfaces/UnregisteredCompanyInputFields'
import {UnregisteredCompanyResult} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyResult'

const taxRate = constants.TAX_RATES.FIRST_RATE / 100

/**
 * Calculates the basis for tax
 *
 * @param {number} grossAmount
 * @param {number} expenses
 * @returns {number}
 */
function calculateBasisForTax (grossAmount:number, expenses:number):number {
  return helpers.round(grossAmount - expenses)
}

/**
 * Calculates the tax amount
 *
 * @param {number} basisForTax
 * @returns {number}
 */
function calculateTaxAmount (basisForTax:number):number {
  return helpers.round(basisForTax * taxRate)
}

/**
 * Calculates the net amount
 *
 * @param {number} grossAmount
 * @param {number} taxAmount
 * @returns {number}
 */
function calculateNetAmount (grossAmount:number, taxAmount:number):number {
  return grossAmount - taxAmount
}

/**
 * Returns the result
 *
 * @param input
 * @returns {UnregisteredCompanyResult}
 */
function getResult (input:UnregisteredCompanyInputFields):UnregisteredCompanyResult {
  const basisForTax = calculateBasisForTax(input.incomeAmount, input.expenses)
  const taxAmount = calculateTaxAmount(basisForTax)
  const netAmount = calculateNetAmount(input.incomeAmount, taxAmount)

  return {
    netIncomeAmount: netAmount,
    grossIncomeAmount: input.incomeAmount,
    basicTaxAmount: basisForTax,
    taxAmount: taxAmount,
    expenses: input.expenses,
  }
}

export default { getResult }
