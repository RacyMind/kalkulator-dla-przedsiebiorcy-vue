import {VatLimitInputFields} from 'components/vatLimit/interfaces/VatLimitInputFields'
import {VatLimitResult} from 'components/vatLimit/interfaces/VatLimitResult'
import {getDayOfYear, lastDayOfYear} from 'date-fns'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

function getResult(input:VatLimitInputFields):VatLimitResult {
  if(!input.startDate) {
    throw new Error('Date can not be null')
  }

  const lastDayOfDateYear = lastDayOfYear(input.startDate)
  const dayOfYear = getDayOfYear(input.startDate)
  const daysOfYear = getDayOfYear(lastDayOfDateYear)
  const daysToEndYear = daysOfYear - dayOfYear + 1
  const amount = helpers.round(constants.VAT_LIMIT * daysToEndYear / daysOfYear, 2)

  return {
    amount: amount,
    daysToEndYear: daysToEndYear,
    startDate: input.startDate,
  }
}

export default {
  getResult,
}
