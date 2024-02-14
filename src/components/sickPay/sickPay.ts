import {AvailableYear} from 'src/types/AvailableYear'
import {InputFields} from 'components/sickPay/interfaces/InputFields'
import {Result} from 'components/sickPay/interfaces/Result'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

const currentYear:AvailableYear = helpers.getDefaultYear()

/**
 * Percentage sum of ZUS contributions
 * @type {number}
 */
const zusContributionRate:number = (constants.PARAMS[currentYear].ZUS.EMPLOYEE.RENT_RATE + constants.PARAMS[currentYear].ZUS.EMPLOYEE.PENSION_RATE + constants.PARAMS[currentYear].ZUS.EMPLOYEE.SICK_RATE) / 100

/**
 * Returns the result
 *
 * @param {InputFields} input
 * @returns {Result}
 */
function getResult (input:InputFields):Result {
  let amount:number = helpers.round(input.basicAmount * (1 - zusContributionRate), 2)
  amount = helpers.round(amount / 30, 2)
  amount = amount * input.rate * input.dayCount

  return {
    basicAmount: input.basicAmount,
    dayCount: input.dayCount,
    sickPayAmount: amount,
  }
}

export default { getResult }
