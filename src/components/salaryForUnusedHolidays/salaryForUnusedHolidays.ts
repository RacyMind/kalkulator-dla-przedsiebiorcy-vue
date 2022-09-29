import {AvailableYear} from 'src/types/AvailableYear'
import {SalaryForUnusedHolidaysFields} from 'components/salaryForUnusedHolidays/interfaces/SalaryForUnusedHolidaysFields'
import {SalaryForUnusedHolidaysResult} from 'components/salaryForUnusedHolidays/interfaces/SalaryForUnusedHolidaysResult'
import constants from 'src/logic/constants'
import helpers from 'src/logic/helpers'
import ownerContributions from 'src/logic/ownerContributions'
import taxes from 'src/logic/taxes'

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
 * @param {InvestmentInputFields} input
 * @returns {InvestmentResult}
 */
function getResult (input:SalaryForUnusedHolidaysFields):SalaryForUnusedHolidaysResult {
  if(!input.dailyNorm || !input.dailyNorm) {
    return {
      basicAmount: 0,
      equivalent: 0,
      holidayRate: 0,
      propoitonalRate: 0,
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
    propoitonalRate: proportionalRate,
  }
}

export default {
  setParams,
  getResult,
}
