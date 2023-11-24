import {EmployerZusContribution} from 'src/logic/zus/EmployerZusContribution'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'


describe('ZUS contributions for an employer in 2023', () => {
  let employerZusContribution:EmployerZusContribution

  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)

    employerZusContribution = new EmployerZusContribution()
  })

  it('the disability contibution', () => {
    expect(employerZusContribution.geDisabilityContribution(100)).toBe(1.5)
    expect(employerZusContribution.geDisabilityContribution(0)).toBe(0)
    expect(employerZusContribution.geDisabilityContribution(-1)).toBe(0)
  })

  it('the pension contibution', () => {
    expect(employerZusContribution.gePensionContribution(100)).toBe(9.76)
    expect(employerZusContribution.gePensionContribution(100.1)).toBe(9.77)
    expect(employerZusContribution.gePensionContribution(0)).toBe(0)
    expect(employerZusContribution.gePensionContribution(-1)).toBe(0)
  })

  it('the accident contibution', () => {
    expect(employerZusContribution.getAccidentContribution(100, 0.0167)).toBe(1.67)
    expect(employerZusContribution.getAccidentContribution(100.1, 0.0167)).toBe(1.67)
    expect(employerZusContribution.getAccidentContribution(0, 0.0167)).toBe(0)
    expect(employerZusContribution.getAccidentContribution(-1, 0.0167)).toBe(0)
  })

  it('the FP contibution', () => {
    expect(employerZusContribution.getFPContribution(100)).toBe(1)
    expect(employerZusContribution.getFPContribution(100.1)).toBe(1)
    expect(employerZusContribution.getFPContribution(0)).toBe(0)
    expect(employerZusContribution.getFPContribution(-1)).toBe(0)
  })

  it('the FPGSP contibution', () => {
    expect(employerZusContribution.getFGSPContribution(100)).toBe(0.1)
    expect(employerZusContribution.getFGSPContribution(100.1)).toBe(0.1)
    expect(employerZusContribution.getFGSPContribution(0)).toBe(0)
    expect(employerZusContribution.getFGSPContribution(-1)).toBe(0)
  })

  it('the FS contibution', () => {
    expect(employerZusContribution.getFSContribution(100)).toBe(1.45)
    expect(employerZusContribution.getFSContribution(100.1)).toBe(1.45)
    expect(employerZusContribution.getFSContribution(0)).toBe(0)
    expect(employerZusContribution.getFSContribution(-1)).toBe(0)
  })

  it('the PPK contibution', () => {
    expect(employerZusContribution.getPPKContribution(100)).toBe(1.5)
    expect(employerZusContribution.getPPKContribution(100, 0.04)).toBe(4)
    expect(employerZusContribution.getPPKContribution(0)).toBe(0)
    expect(employerZusContribution.getPPKContribution(-1)).toBe(0)
    expect(() => employerZusContribution.getPPKContribution(100, 0.0149)).toThrowError('Invalid argument')
    expect(() => employerZusContribution.getPPKContribution(100, 0.041)).toThrowError('Invalid argument')
  })
})
