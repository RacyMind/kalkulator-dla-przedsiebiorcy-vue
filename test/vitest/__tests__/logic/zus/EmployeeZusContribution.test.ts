import {EmployeeZusContribution} from 'src/logic/zus/EmployeeZusContribution'
import { beforeAll, describe, expect, it } from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'


describe('ZUS contributions for an employee in 2023', () => {
  let employeeZusContribution:EmployeeZusContribution

  beforeAll(() => {
    setActivePinia(createPinia())
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2023,11,1)

    employeeZusContribution = new EmployeeZusContribution()
  })

  it('the health contibution', () => {
    expect(employeeZusContribution.getHealthContribution(100)).toBe(9)
    expect(employeeZusContribution.getHealthContribution(0)).toBe(0)
    expect(employeeZusContribution.getHealthContribution(-1)).toBe(0)
  })

  it('the disability contibution', () => {
    expect(employeeZusContribution.geDisabilityContribution(100)).toBe(1.5)
    expect(employeeZusContribution.geDisabilityContribution(0)).toBe(0)
    expect(employeeZusContribution.geDisabilityContribution(-1)).toBe(0)
  })

  it('the pension contibution', () => {
    expect(employeeZusContribution.gePensionContribution(100)).toBe(9.76)
    expect(employeeZusContribution.gePensionContribution(100.1)).toBe(9.77)
    expect(employeeZusContribution.gePensionContribution(0)).toBe(0)
    expect(employeeZusContribution.gePensionContribution(-1)).toBe(0)
  })

  it('the sick contibution', () => {
    expect(employeeZusContribution.getSickContribution(100)).toBe(2.45)
    expect(employeeZusContribution.getSickContribution(100.1)).toBe(2.45)
    expect(employeeZusContribution.getSickContribution(0)).toBe(0)
    expect(employeeZusContribution.getSickContribution(-1)).toBe(0)
  })

  it('the PPK contibution', () => {
    expect(employeeZusContribution.getPPKContribution(100)).toBe(2)
    expect(employeeZusContribution.getPPKContribution(100, 0.04)).toBe(4)
    expect(employeeZusContribution.getPPKContribution(100, 0.005)).toBe(0.5)
    expect(employeeZusContribution.getPPKContribution(100.1, 0.005)).toBe(0.5)
    expect(employeeZusContribution.getPPKContribution(0)).toBe(0)
    expect(employeeZusContribution.getPPKContribution(-1)).toBe(0)
    expect(() => employeeZusContribution.getPPKContribution(100, 0.0049)).toThrowError('Invalid argument')
    expect(() => employeeZusContribution.getPPKContribution(100, 0.041)).toThrowError('Invalid argument')
  })

  it('the basis for contibutions', () => {
    expect(employeeZusContribution.getBasisForContributions(100)).toBe(100)
    expect(employeeZusContribution.getBasisForContributions(0)).toBe(0)
    expect(employeeZusContribution.getBasisForContributions(-1)).toBe(0)
    expect(employeeZusContribution.getBasisForContributions(EmployeeZusContribution.limitOfBasisForContributions + 1)).toBe(EmployeeZusContribution.limitOfBasisForContributions)
    expect(employeeZusContribution.getBasisForContributions(1000, EmployeeZusContribution.limitOfBasisForContributions)).toBe(0)
    expect(employeeZusContribution.getBasisForContributions(1000, EmployeeZusContribution.limitOfBasisForContributions + 1)).toBe(0)
    expect(employeeZusContribution.getBasisForContributions(1000, EmployeeZusContribution.limitOfBasisForContributions - 500)).toBe(500)
    expect(employeeZusContribution.getBasisForContributions(400, EmployeeZusContribution.limitOfBasisForContributions - 500)).toBe(400)
  })
})
