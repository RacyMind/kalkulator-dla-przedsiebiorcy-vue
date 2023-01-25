import {SalaryForUnusedHolidaysFields} from 'components/salaryForUnusedHolidays/interfaces/SalaryForUnusedHolidaysFields'
import {SalaryForUnusedHolidaysResult} from 'components/salaryForUnusedHolidays/interfaces/SalaryForUnusedHolidaysResult'
import { describe, expect, it } from '@jest/globals'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-jest'
import constants from '../../../../src/logic/constants'
import helpers from '../../../../src/logic/helpers'
import salaryForUnusedHolidays from 'components/salaryForUnusedHolidays/salaryForUnusedHolidays'

installQuasarPlugin()

const defaultInput:SalaryForUnusedHolidaysFields = {
  amount: 4800,
  dailyNorm: 8,
  holidayHours: 24,
  year: 2022,
  workingTime: 1,
}

const yearlyHolidayRate = constants.PARAMS[2022].HOLIDAY_RATE

const getResult = (input:SalaryForUnusedHolidaysFields):SalaryForUnusedHolidaysResult => {
  salaryForUnusedHolidays.setParams(input.year)
  return salaryForUnusedHolidays.getResult(input)
}

describe('salaryForUnusedHolidays - 2022', () => {
  it('full time', () => {
    const input:SalaryForUnusedHolidaysFields = {
      ...defaultInput,
    }

    const result = getResult(input)

    expect(result.basicAmount).toBe(4800)
    expect(result.equivalent).toBe(688.32)
    expect(result.holidayRate).toBe(yearlyHolidayRate)
    expect(result.propoitonalRate).toBe(yearlyHolidayRate)
  })

  it('1/2 time', () => {
    const input:SalaryForUnusedHolidaysFields = {
      ...defaultInput,
      workingTime: 0.5,
    }

    const result = getResult(input)

    expect(result.basicAmount).toBe(4800)
    expect(result.equivalent).toBe(1376.64)
    expect(result.holidayRate).toBe(yearlyHolidayRate)
    expect(result.propoitonalRate).toBe(helpers.round(yearlyHolidayRate / 2, 2))
  })
  it('7h - daily norm', () => {
    const input:SalaryForUnusedHolidaysFields = {
      ...defaultInput,
      dailyNorm: 7,
    }

    const result = getResult(input)

    expect(result.basicAmount).toBe(4800)
    expect(result.equivalent).toBe(786.72)
    expect(result.holidayRate).toBe(yearlyHolidayRate)
    expect(result.propoitonalRate).toBe(yearlyHolidayRate)
  })
})
