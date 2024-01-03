import { InputFields } from './interfaces/InputFields'
import {Result} from 'components/unregisteredCompany/interfaces/Result'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const taxRate = constants.TAX_RATES.FIRST_RATE / 100

/**
 * Returns the result
 *
 * @param input
 * @returns {Result}
 */
function getResult (input:InputFields):Result {
  const basisForTax = input.incomeAmount - input.expenses
  const taxAmount = helpers.round(basisForTax * taxRate)
  const netAmount = input.incomeAmount - taxAmount

  return {
    basicTaxAmount: basisForTax,
    expenses: input.expenses,
    grossIncomeAmount: input.incomeAmount,
    netIncomeAmount: netAmount,
    taxAmount: taxAmount,
  }
}

export default { getResult }
