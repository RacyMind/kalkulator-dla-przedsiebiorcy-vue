import {InvestmentInputFields} from 'components/investment/interfaces/InvestmentInputFields'
import {InvestmentResult} from 'components/investment/interfaces/InvestmentResult'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

/**
 * Returns the result
 *
 * @param {InvestmentInputFields} input
 * @returns {InvestmentResult}
 */
function getResult (input:InvestmentInputFields):InvestmentResult {
  const constants = useConstantsStore()
  const grossAmount = helpers.round(input.amount * input.rate * input.monthCount / 12, 2)
  const taxAmount = helpers.round(grossAmount * constants.taxRates.belkaRate / 100, 2)
  const netAmount = helpers.round(grossAmount - taxAmount,2)

  return {
    capital: input.amount,
    grossAmount: grossAmount,
    netAmount: netAmount,
    taxAmount: taxAmount,
  }
}

export default { getResult }
