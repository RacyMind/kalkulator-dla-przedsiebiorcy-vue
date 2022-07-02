import {InvestmentInputFields} from 'components/investment/interfaces/InvestmentInputFields'
import {InvestmentResult} from 'components/investment/interfaces/InvestmentResult'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

/**
 * Returns the result
 *
 * @param {InvestmentInputFields} input
 * @returns {InvestmentResult}
 */
function getResult (input:InvestmentInputFields):InvestmentResult {
  const grossAmount = helpers.round(input.amount * input.rate * input.monthCount / 12, 2)
  const taxAmount = helpers.round(grossAmount * constants.TAX_RATES.BELKA_RATE / 100, 2)
  const netAMount = grossAmount - taxAmount

  return {
    capital: input.amount,
    grossAmount: grossAmount,
    netAmount: netAMount,
    taxAmount: taxAmount,
  }
}

export default { getResult }
