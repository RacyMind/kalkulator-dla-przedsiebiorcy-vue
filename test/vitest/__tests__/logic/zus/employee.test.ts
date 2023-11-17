import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {geDisabilityContribution, gePensionContribution, getHealthContribution, getSickContribution} from 'src/logic/parameters/zus/employee'
import {useSettingStore} from 'stores/settingStore'


describe('ZUS contributions for an employee in 2023', () => {
  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,0,1)
  })

  it('the health contibution', () => {
    expect(getHealthContribution(100)).toBe(9)
    expect(getHealthContribution(0)).toBe(0)
    expect(getHealthContribution(-1)).toBe(0)
  })

  it('the disability contibution', () => {
    expect(geDisabilityContribution(100)).toBe(1.5)
    expect(geDisabilityContribution(0)).toBe(0)
    expect(geDisabilityContribution(-1)).toBe(0)
  })

  it('the pension contibution', () => {
    expect(gePensionContribution(100)).toBe(9.76)
    expect(gePensionContribution(100.1)).toBe(9.77)
    expect(gePensionContribution(0)).toBe(0)
    expect(gePensionContribution(-1)).toBe(0)
  })

  it('the sick contibution', () => {
    expect(getSickContribution(100)).toBe(2.45)
    expect(getSickContribution(100.1)).toBe(2.45)
    expect(getSickContribution(0)).toBe(0)
    expect(getSickContribution(-1)).toBe(0)
  })
})
