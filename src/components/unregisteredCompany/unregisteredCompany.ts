import { UnregisteredCompanyInputFields } from './interfaces/UnregisteredCompanyInputFields'
import {UnregisteredCompanyResult} from 'components/unregisteredCompany/interfaces/UnregisteredCompanyResult'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const taxRate = constants.TAX_RATES.FIRST_RATE / 100

/**
 * Returns the result
 *
 * @param input
 * @returns {UnregisteredCompanyResult}
 */
function getResult (input:UnregisteredCompanyInputFields):UnregisteredCompanyResult {
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
