import {AvailableYear} from 'src/types/AvailableYear'
import {SickPayInputFields} from 'components/sickPay/interfaces/SickPayInputFields'
import {SickPayResult} from 'components/sickPay/interfaces/SickPayResult'
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
 * @param {SickPayInputFields} input
 * @returns {SickPayResult}
 */
function getResult (input:SickPayInputFields):SickPayResult {
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
