import {AvailableYear} from 'src/types/AvailableYear'
import {Result} from 'components/salaryForUnusedHolidays/interfaces/Result'
import {SalaryForUnusedHolidaysFields} from 'components/salaryForUnusedHolidays/interfaces/SalaryForUnusedHolidaysFields'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'

let params = {
  holidayRate: constants.PARAMS[helpers.getDefaultYear()].HOLIDAY_RATE,
}

/**
 * Sets parameters for the year
 * @param year
 */
function setParams (year:AvailableYear) {
  params = {
    holidayRate: constants.PARAMS[year].HOLIDAY_RATE,
  }
}

/**
 * Returns the result
 *
 * @param {SalaryForUnusedHolidaysFields} input
 * @returns {Result}
 */
function getResult (input:SalaryForUnusedHolidaysFields):Result {
  if(!input.dailyNorm || !input.dailyNorm) {
    return {
      basicAmount: 0,
      equivalent: 0,
      holidayRate: 0,
      proportionalRate: 0,
    }
  }

  const proportionalRate =  helpers.round(params.holidayRate * input.workingTime, 2)

  let equivalent = helpers.round(input.amount / proportionalRate, 2)
  equivalent = helpers.round(equivalent / input.dailyNorm, 2)
  equivalent = helpers.round(equivalent * input.holidayHours, 2)
  return {
    basicAmount: input.amount,
    equivalent: equivalent,
    holidayRate: params.holidayRate,
    proportionalRate: proportionalRate,
  }
}

export default {
  setParams,
  getResult,
}
