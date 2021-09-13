/**
 * Calculates the net amount
 *
 * @param {number }gross
 * @param {number} taxRate
 * @returns {number}
 */
export function calculateNetAmount (gross, taxRate) {
  return gross / (1 + taxRate)
}

/**
 *  Calculates the gross amount
 *
 * @param {number} net
 * @param {number} taxAmount
 * @returns {number}
 */
export function calculateGrossAmount (net, taxAmount) {
  return net + taxAmount
}

/**
 * Calculates the tax amount
 *
 * @param {number} net
 * @param {number} taxRate
 * @returns {number}
 */
export function calculateTaxAmount (net, taxRate) {
  return net * taxRate
}
