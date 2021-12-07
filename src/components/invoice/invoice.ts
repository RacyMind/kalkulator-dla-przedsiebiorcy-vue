import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import {InvoiceResult} from 'components/invoice/interfaces/InvoiceResult'
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'

/**
 * Calculates the net amount
 *
 * @param {number} gross
 * @param {number} taxRate
 * @returns {number}
 */
function calculateNetAmount (gross:number, taxRate:number):number {
  return helpers.round(gross / (1 + taxRate), 2)
}

/**
 *  Calculates the gross amount
 *
 * @param {number} net
 * @param {number} taxAmount
 * @returns {number}
 */
function calculateGrossAmount (net:number, taxAmount:number):number {
  return net + taxAmount
}

/**
 * Calculates the tax amount
 *
 * @param {number} net
 * @param {number} taxRate
 * @returns {number}
 */
function calculateTaxAmount (net:number, taxRate:number):number {
  return helpers.round(net * taxRate, 2)
}

/**
 * Returns the result
 *
 * @param {InvoiceInputFields} input
 * @return {InvoiceResult}
 */
function getResult (input:InvoiceInputFields):InvoiceResult {
  let netAmount = 0
  let grossAmount = 0
  let taxAmount = 0

  switch (input.amountType) {
    case constants.AMOUNT_TYPES.NET:
      netAmount = input.amount
      taxAmount = calculateTaxAmount(netAmount, input.taxRate)
      grossAmount = calculateGrossAmount(netAmount, taxAmount)
      break
    case constants.AMOUNT_TYPES.GROSS:
      grossAmount = input.amount
      netAmount = calculateNetAmount(grossAmount, input.taxRate)
      taxAmount = calculateTaxAmount(netAmount, input.taxRate)
      break
  }

  return {
    netAmount: netAmount,
    taxAmount: taxAmount,
    grossAmount: grossAmount,
  }
}

export default { getResult }
