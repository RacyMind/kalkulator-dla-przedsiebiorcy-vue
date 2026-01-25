import {InputFields} from 'components/salaryForUnusedHolidays/interfaces/InputFields'
import {
  SalaryForUnusedHolidaysCalculator,
} from 'components/salaryForUnusedHolidays/logic/SalaryForUnusedHolidaysCalculator'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

describe('Calculator for UnregisteredCompany on 1.01.2024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,0,1)
  })

  const getDefaultInput = ():InputFields => {
    return {
      amount: 3600,
      holidayHours: 150,
      dailyNorm:8,
      workingTime: 1,
    }
  }

  it('The invalid data', () => {
    expect(() => new SalaryForUnusedHolidaysCalculator().getResult()).toThrowError('undefined')
    expect(() => new SalaryForUnusedHolidaysCalculator().calculate().getResult()).toThrowError('undefined')
  })

  it('the full time work', () => {
    const result = new SalaryForUnusedHolidaysCalculator().setInputData(getDefaultInput()).calculate().getResult()

    expect(result.basicAmount).toBe(3600)
    expect(result.holidayRate).toBe(20.92)
    expect(result.proportionalRate).toBe(20.92)
    expect(result.equivalent).toBe(3226.5)
  })

  it('the 3/4 time work', () => {
    const result = new SalaryForUnusedHolidaysCalculator().setInputData({
      ...getDefaultInput(),
      workingTime: 0.75,
    }).calculate().getResult()

    expect(result.basicAmount).toBe(3600)
    expect(result.holidayRate).toBe(20.92)
    expect(result.proportionalRate).toBe(15.69)
    expect(result.equivalent).toBe(4302)
  })
})

describe('Calculator for SalaryForUnusedHolidays on 1.01.2025', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2025, 0, 1)
  })

  const getDefaultInput = (): InputFields => {
    return {
      amount: 4666,
      holidayHours: 160,
      dailyNorm: 8,
      workingTime: 1,
    }
  }

  it('the full time work', () => {
    const result = new SalaryForUnusedHolidaysCalculator().setInputData(getDefaultInput()).calculate().getResult()

    expect(result.basicAmount).toBe(4666)
    expect(result.holidayRate).toBe(20.83)
    expect(result.proportionalRate).toBe(20.83)
    expect(result.equivalent).toBe(4480)
  })

  it('the 1/2 time work', () => {
    const result = new SalaryForUnusedHolidaysCalculator().setInputData({
      ...getDefaultInput(),
      workingTime: 0.5,
    }).calculate().getResult()

    expect(result.basicAmount).toBe(4666)
    expect(result.holidayRate).toBe(20.83)
    expect(result.proportionalRate).toBe(10.42)
    expect(result.equivalent).toBe(8955.2)
  })
})

describe('Calculator for SalaryForUnusedHolidays on 1.01.2026', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  const getDefaultInput = (): InputFields => {
    return {
      amount: 4806,
      holidayHours: 160,
      dailyNorm: 8,
      workingTime: 1,
    }
  }

  it('the full time work', () => {
    const result = new SalaryForUnusedHolidaysCalculator().setInputData(getDefaultInput()).calculate().getResult()

    expect(result.basicAmount).toBe(4806)
    expect(result.holidayRate).toBe(20.92)
    expect(result.proportionalRate).toBe(20.92)
    expect(result.equivalent).toBe(4595.2)
  })

  it('the 1/2 time work', () => {
    const result = new SalaryForUnusedHolidaysCalculator().setInputData({
      ...getDefaultInput(),
      workingTime: 0.5,
    }).calculate().getResult()

    expect(result.basicAmount).toBe(4806)
    expect(result.holidayRate).toBe(20.92)
    expect(result.proportionalRate).toBe(10.46)
    expect(result.equivalent).toBe(9188.8)
  })
})
