import {InputFields} from 'components/sickPay/interfaces/InputFields'
import {SickPayCalculator} from 'components/sickPay/logic/SickPayCalculator'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

describe('Calculator for SIckPay on 1.01.2024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,0,1)
  })

  const getDefaultInput = ():InputFields => {
    return {
      basicAmount: 4242,
      dayCount: 28,
      rate: 0.8,
    }
  }

  it('The invalid data', () => {
    expect(() => new SickPayCalculator().getResult()).toThrowError('undefined')
    expect(() => new SickPayCalculator().calculate().getResult()).toThrowError('undefined')
  })

  it('80%', () => {
    const result = new SickPayCalculator().setInputData(getDefaultInput()).calculate().getResult()

    expect(result.basicAmount).toBe(4242)
    expect(result.dayCount).toBe(28)
    expect(result.sickPayAmount).toBe(2733.02)
  })

  it('100%', () => {
    const result = new SickPayCalculator().setInputData({
      ...getDefaultInput(),
      rate: 1,
    }).calculate().getResult()

    expect(result.basicAmount).toBe(4242)
    expect(result.dayCount).toBe(28)
    expect(result.sickPayAmount).toBe(3416.28)
  })
})
