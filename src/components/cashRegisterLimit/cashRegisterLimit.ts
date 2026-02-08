import {CashRegisterLimitInputFields} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitInputFields'
import {CashRegisterLimitResult} from 'components/cashRegisterLimit/interfaces/CashRegisterLimitResult'
import {getDayOfYear, lastDayOfYear} from 'date-fns'
import {useConstantsStore} from 'stores/constantsStore'
import helpers from 'src/logic/helpers'

function getResult(input:CashRegisterLimitInputFields):CashRegisterLimitResult {
  if(!input.startDate) {
    throw new Error('Date can not be null')
  }

  const constants = useConstantsStore()
  const lastDayOfDateYear = lastDayOfYear(input.startDate)
  const dayOfYear = getDayOfYear(input.startDate)
  const daysOfYear = getDayOfYear(lastDayOfDateYear)
  const daysToEndYear = daysOfYear - dayOfYear + 1
  const amount = helpers.round(constants.cashRegisterLimit * daysToEndYear / daysOfYear, 2)

  return {
    amount: amount,
    daysToEndYear: daysToEndYear,
    startDate: input.startDate,
  }
}

export default {
  getResult,
}
