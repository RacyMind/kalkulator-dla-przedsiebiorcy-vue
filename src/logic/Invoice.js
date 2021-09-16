/**
 * Calculates the net amount
 *
 * @param {number }gross
 * @param {number} taxRate
 * @returns {number}
 */
function calculateNetAmount (gross, taxRate) {
  return +(gross / (1 + taxRate)).toFixed(2)
}

/**
 *  Calculates the gross amount
 *
 * @param {number} net
 * @param {number} taxAmount
 * @returns {number}
 */
function calculateGrossAmount (net, taxAmount) {
  return net + taxAmount
}

/**
 * Calculates the tax amount
 *
 * @param {number} net
 * @param {number} taxRate
 * @returns {number}
 */
function calculateTaxAmount (net, taxRate) {
  return +(net * taxRate).toFixed(2)
}

/**
 * Returns the result
 *
 * @param {number} amount
 * @param {string} amountType
 * @param {number} taxRate
 * @returns {{netAMount: number, grossAmount: number, taxAmount: number}}
 */
function getResult (amount, amountType, taxRate) {
  let netAmount = 0; let grossAmount = 0; let taxAmount = 0

  switch (amountType) {
    case 'net':
      netAmount = amount
      taxAmount = calculateTaxAmount(netAmount, taxRate)
      grossAmount = calculateGrossAmount(netAmount, taxAmount)
      break
    case 'gross':
      grossAmount = amount
      netAmount = calculateNetAmount(grossAmount, taxRate)
      taxAmount = calculateTaxAmount(netAmount, taxRate)
      break
  }

  return {
    netAmount: netAmount,
    taxAmount: taxAmount,
    grossAmount: grossAmount,
  }
}

export { getResult }
