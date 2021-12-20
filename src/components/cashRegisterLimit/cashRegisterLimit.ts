import {getDayOfYear, lastDayOfYear} from 'date-fns'
import {CashRegisterLimitInputFields} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitInputFields'
import {CashRegisterLimitResult} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitResult'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

function getResult(input:CashRegisterLimitInputFields):CashRegisterLimitResult {
  if(!input.startDate) {
    throw new Error('Date can not be null')
  }

  const lastDayOfDateYear = lastDayOfYear(input.startDate)
  const dayOfYear = getDayOfYear(input.startDate)
  const daysOfYear = getDayOfYear(lastDayOfDateYear)
  const daysToEndYear = daysOfYear - dayOfYear + 1
  const amount = helpers.round(constants.CASH_REGISTER_LIMIT * daysToEndYear / daysOfYear, 2)

  return {
    startDate: input.startDate,
    daysToEndYear: daysToEndYear,
    amount: amount,
  }
}

export default {
  getResult,
}
