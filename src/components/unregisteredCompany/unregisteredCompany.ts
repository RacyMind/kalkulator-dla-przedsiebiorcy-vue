import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import { UnregisteredCompanyInputFields } from './interfaces/UnregisteredCompanyInputFields'
import {UnregisteredCompanyResult} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyResult'

const taxRate = constants.TAX_RATES.FIRST_RATE / 100

/**
 * Returns the result
 *
 * @param input
 * @returns {UnregisteredCompanyResult}
 */
function getResult (input:UnregisteredCompanyInputFields):UnregisteredCompanyResult {
  const basisForTax = helpers.round(input.incomeAmount - input.expenses)
  const taxAmount = helpers.round(basisForTax * taxRate)
  const netAmount = input.incomeAmount - taxAmount

  return {
    netIncomeAmount: netAmount,
    grossIncomeAmount: input.incomeAmount,
    basicTaxAmount: basisForTax,
    taxAmount: taxAmount,
    expenses: input.expenses,
  }
}

export default { getResult }
