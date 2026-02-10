import { MaternityBenefitCalculator } from 'components/maternityBenefit/logic/MaternityBenefitCalculator'
import { InputFields } from 'components/maternityBenefit/interfaces/InputFields'
import { Result } from 'components/maternityBenefit/interfaces/Result'
import { EmploymentType, ZusType } from 'components/maternityBenefit/types'
import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useSettingStore } from 'stores/settingStore'

setActivePinia(createPinia())

const getResult = (input: InputFields): Result => {
  return new MaternityBenefitCalculator()
    .setInputData(input)
    .calculate()
    .getResult()
}

describe('MaternityBenefitCalculator on 1.01.2026', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('The invalid data', () => {
    expect(() => new MaternityBenefitCalculator().getResult()).toThrowError(
      'undefined',
    )
    expect(() =>
      new MaternityBenefitCalculator().calculate().getResult(),
    ).toThrowError('undefined')
  })

  describe('US1: Umowa o pracę, 1 dziecko', () => {
    it('should calculate benefit for average salary 5583.33 zł', () => {
      const result = getResult({
        employmentType: EmploymentType.EmploymentContract,
        zusType: ZusType.Big,
        averageBasis: 5583.33,
        childrenCount: 1,
      })

      expect(result.benefitBasis).toBe(4817.86)
      expect(result.dailyRate).toBe(160.6)

      expect(result.leavePeriods.maternityLeaveWeeks).toBe(20)
      expect(result.leavePeriods.maternityLeaveDays).toBe(140)
      expect(result.leavePeriods.parentalLeaveWeeks).toBe(32)
      expect(result.leavePeriods.parentalLeaveDays).toBe(224)
      expect(result.leavePeriods.totalWeeks).toBe(52)
      expect(result.leavePeriods.totalDays).toBe(364)

      expect(result.variantA.maternityDailyRate).toBe(130.89)
      expect(result.variantA.maternityMonthlyAmount).toBe(3926.7)
      expect(result.variantA.maternityLeaveAmount).toBe(18324.6)
      expect(result.variantA.parentalDailyRate).toBe(130.89)
      expect(result.variantA.parentalMonthlyAmount).toBe(3926.7)
      expect(result.variantA.parentalLeaveAmount).toBe(29319.36)
      expect(result.variantA.totalAmount).toBe(47643.96)

      expect(result.variantB.maternityDailyRate).toBe(160.6)
      expect(result.variantB.maternityMonthlyAmount).toBe(4818)
      expect(result.variantB.maternityLeaveAmount).toBe(22484)
      expect(result.variantB.parentalDailyRate).toBe(112.42)
      expect(result.variantB.parentalMonthlyAmount).toBe(3372.6)
      expect(result.variantB.parentalLeaveAmount).toBe(25182.08)
      expect(result.variantB.totalAmount).toBe(47666.08)

      expect(result.secondParentDailyRate).toBe(112.42)
      expect(result.secondParentMonthlyAmount).toBe(3372.6)
      expect(result.secondParentDays).toBe(63)
      expect(result.secondParentBenefit).toBe(7082.46)
    })
  })

  describe('US2: Działalność gospodarcza — duży ZUS, 1 dziecko', () => {
    it('should calculate benefit for big ZUS basis 5652.00 zł', () => {
      const result = getResult({
        employmentType: EmploymentType.SelfEmployment,
        zusType: ZusType.Big,
        averageBasis: 5652.0,
        childrenCount: 1,
      })

      expect(result.benefitBasis).toBe(4877.11)
      expect(result.dailyRate).toBe(162.57)

      expect(result.leavePeriods.maternityLeaveWeeks).toBe(20)
      expect(result.leavePeriods.maternityLeaveDays).toBe(140)
      expect(result.leavePeriods.parentalLeaveWeeks).toBe(32)
      expect(result.leavePeriods.parentalLeaveDays).toBe(224)
      expect(result.leavePeriods.totalWeeks).toBe(52)
      expect(result.leavePeriods.totalDays).toBe(364)

      expect(result.variantA.maternityDailyRate).toBe(132.49)
      expect(result.variantA.maternityMonthlyAmount).toBe(3974.7)
      expect(result.variantA.maternityLeaveAmount).toBe(18548.6)
      expect(result.variantA.parentalDailyRate).toBe(132.49)
      expect(result.variantA.parentalMonthlyAmount).toBe(3974.7)
      expect(result.variantA.parentalLeaveAmount).toBe(29677.76)
      expect(result.variantA.totalAmount).toBe(48226.36)

      expect(result.variantB.maternityDailyRate).toBe(162.57)
      expect(result.variantB.maternityMonthlyAmount).toBe(4877.1)
      expect(result.variantB.maternityLeaveAmount).toBe(22759.8)
      expect(result.variantB.parentalDailyRate).toBe(113.8)
      expect(result.variantB.parentalMonthlyAmount).toBe(3414)
      expect(result.variantB.parentalLeaveAmount).toBe(25491.2)
      expect(result.variantB.totalAmount).toBe(48251)

      expect(result.secondParentDailyRate).toBe(113.8)
      expect(result.secondParentMonthlyAmount).toBe(3414)
      expect(result.secondParentDays).toBe(63)
      expect(result.secondParentBenefit).toBe(7169.4)
    })
  })

  describe('US3: Działalność gospodarcza — ZUS preferencyjny, 1 dziecko', () => {
    it('should calculate benefit for preferential ZUS basis 1441.80 zł', () => {
      const result = getResult({
        employmentType: EmploymentType.SelfEmployment,
        zusType: ZusType.Preferential,
        averageBasis: 1441.8,
        childrenCount: 1,
      })

      expect(result.benefitBasis).toBe(1244.13)
      expect(result.dailyRate).toBe(41.47)

      expect(result.leavePeriods.maternityLeaveWeeks).toBe(20)
      expect(result.leavePeriods.maternityLeaveDays).toBe(140)
      expect(result.leavePeriods.parentalLeaveWeeks).toBe(32)
      expect(result.leavePeriods.parentalLeaveDays).toBe(224)
      expect(result.leavePeriods.totalWeeks).toBe(52)
      expect(result.leavePeriods.totalDays).toBe(364)

      expect(result.variantA.maternityDailyRate).toBe(33.8)
      expect(result.variantA.maternityMonthlyAmount).toBe(1014)
      expect(result.variantA.maternityLeaveAmount).toBe(4732)
      expect(result.variantA.parentalDailyRate).toBe(33.8)
      expect(result.variantA.parentalMonthlyAmount).toBe(1014)
      expect(result.variantA.parentalLeaveAmount).toBe(7571.2)
      expect(result.variantA.totalAmount).toBe(12303.2)

      expect(result.variantB.maternityDailyRate).toBe(41.47)
      expect(result.variantB.maternityMonthlyAmount).toBe(1244.1)
      expect(result.variantB.maternityLeaveAmount).toBe(5805.8)
      expect(result.variantB.parentalDailyRate).toBe(29.03)
      expect(result.variantB.parentalMonthlyAmount).toBe(870.9)
      expect(result.variantB.parentalLeaveAmount).toBe(6502.72)
      expect(result.variantB.totalAmount).toBe(12308.52)

      expect(result.secondParentDailyRate).toBe(29.03)
      expect(result.secondParentMonthlyAmount).toBe(870.9)
      expect(result.secondParentDays).toBe(63)
      expect(result.secondParentBenefit).toBe(1828.89)
    })
  })

  describe('US4: Działalność gospodarcza — inna podstawa 10000 zł, 1 dziecko', () => {
    it('should calculate benefit for custom basis 10000 zł', () => {
      const result = getResult({
        employmentType: EmploymentType.SelfEmployment,
        zusType: ZusType.Custom,
        averageBasis: 10000,
        childrenCount: 1,
      })

      expect(result.benefitBasis).toBe(8629.0)
      expect(result.dailyRate).toBe(287.63)

      expect(result.leavePeriods.maternityLeaveWeeks).toBe(20)
      expect(result.leavePeriods.maternityLeaveDays).toBe(140)
      expect(result.leavePeriods.parentalLeaveWeeks).toBe(32)
      expect(result.leavePeriods.parentalLeaveDays).toBe(224)
      expect(result.leavePeriods.totalWeeks).toBe(52)
      expect(result.leavePeriods.totalDays).toBe(364)

      expect(result.variantA.maternityDailyRate).toBe(234.42)
      expect(result.variantA.maternityMonthlyAmount).toBe(7032.6)
      expect(result.variantA.maternityLeaveAmount).toBe(32818.8)
      expect(result.variantA.parentalDailyRate).toBe(234.42)
      expect(result.variantA.parentalMonthlyAmount).toBe(7032.6)
      expect(result.variantA.parentalLeaveAmount).toBe(52510.08)
      expect(result.variantA.totalAmount).toBe(85328.88)

      expect(result.variantB.maternityDailyRate).toBe(287.63)
      expect(result.variantB.maternityMonthlyAmount).toBe(8628.9)
      expect(result.variantB.maternityLeaveAmount).toBe(40268.2)
      expect(result.variantB.parentalDailyRate).toBe(201.34)
      expect(result.variantB.parentalMonthlyAmount).toBe(6040.2)
      expect(result.variantB.parentalLeaveAmount).toBe(45100.16)
      expect(result.variantB.totalAmount).toBe(85368.36)

      expect(result.secondParentDailyRate).toBe(201.34)
      expect(result.secondParentMonthlyAmount).toBe(6040.2)
      expect(result.secondParentDays).toBe(63)
      expect(result.secondParentBenefit).toBe(12684.42)
    })
  })

  describe('US5: Poród mnogi — wymiary urlopów', () => {
    const basis = 5583.33

    it('should calculate leave periods for 2 children', () => {
      const result = getResult({
        employmentType: EmploymentType.EmploymentContract,
        zusType: ZusType.Big,
        averageBasis: basis,
        childrenCount: 2,
      })

      expect(result.leavePeriods.maternityLeaveWeeks).toBe(31)
      expect(result.leavePeriods.maternityLeaveDays).toBe(217)
      expect(result.leavePeriods.parentalLeaveWeeks).toBe(34)
      expect(result.leavePeriods.parentalLeaveDays).toBe(238)
      expect(result.leavePeriods.totalWeeks).toBe(65)
      expect(result.leavePeriods.totalDays).toBe(455)

      expect(result.variantA.maternityLeaveAmount).toBe(28403.13)
      expect(result.variantA.parentalLeaveAmount).toBe(31151.82)
      expect(result.variantA.totalAmount).toBe(59554.95)

      expect(result.variantB.maternityLeaveAmount).toBe(34850.2)
      expect(result.variantB.parentalLeaveAmount).toBe(26755.96)
      expect(result.variantB.totalAmount).toBe(61606.16)
    })

    it('should calculate leave periods for 3 children', () => {
      const result = getResult({
        employmentType: EmploymentType.EmploymentContract,
        zusType: ZusType.Big,
        averageBasis: basis,
        childrenCount: 3,
      })

      expect(result.leavePeriods.maternityLeaveWeeks).toBe(33)
      expect(result.leavePeriods.maternityLeaveDays).toBe(231)
      expect(result.leavePeriods.parentalLeaveWeeks).toBe(34)
      expect(result.leavePeriods.parentalLeaveDays).toBe(238)
      expect(result.leavePeriods.totalWeeks).toBe(67)
      expect(result.leavePeriods.totalDays).toBe(469)

      expect(result.variantA.maternityLeaveAmount).toBe(30235.59)
      expect(result.variantA.parentalLeaveAmount).toBe(31151.82)
      expect(result.variantA.totalAmount).toBe(61387.41)

      expect(result.variantB.maternityLeaveAmount).toBe(37098.6)
      expect(result.variantB.parentalLeaveAmount).toBe(26755.96)
      expect(result.variantB.totalAmount).toBe(63854.56)
    })

    it('should calculate leave periods for 4 children', () => {
      const result = getResult({
        employmentType: EmploymentType.EmploymentContract,
        zusType: ZusType.Big,
        averageBasis: basis,
        childrenCount: 4,
      })

      expect(result.leavePeriods.maternityLeaveWeeks).toBe(35)
      expect(result.leavePeriods.maternityLeaveDays).toBe(245)
      expect(result.leavePeriods.parentalLeaveWeeks).toBe(34)
      expect(result.leavePeriods.parentalLeaveDays).toBe(238)
      expect(result.leavePeriods.totalWeeks).toBe(69)
      expect(result.leavePeriods.totalDays).toBe(483)

      expect(result.variantA.maternityLeaveAmount).toBe(32068.05)
      expect(result.variantA.parentalLeaveAmount).toBe(31151.82)
      expect(result.variantA.totalAmount).toBe(63219.87)

      expect(result.variantB.maternityLeaveAmount).toBe(39347)
      expect(result.variantB.parentalLeaveAmount).toBe(26755.96)
      expect(result.variantB.totalAmount).toBe(66102.96)
    })

    it('should calculate leave periods for 5+ children', () => {
      const result = getResult({
        employmentType: EmploymentType.EmploymentContract,
        zusType: ZusType.Big,
        averageBasis: basis,
        childrenCount: 5,
      })

      expect(result.leavePeriods.maternityLeaveWeeks).toBe(37)
      expect(result.leavePeriods.maternityLeaveDays).toBe(259)
      expect(result.leavePeriods.parentalLeaveWeeks).toBe(34)
      expect(result.leavePeriods.parentalLeaveDays).toBe(238)
      expect(result.leavePeriods.totalWeeks).toBe(71)
      expect(result.leavePeriods.totalDays).toBe(497)

      expect(result.variantA.maternityLeaveAmount).toBe(33900.51)
      expect(result.variantA.parentalLeaveAmount).toBe(31151.82)
      expect(result.variantA.totalAmount).toBe(65052.33)

      expect(result.variantB.maternityLeaveAmount).toBe(41595.4)
      expect(result.variantB.parentalLeaveAmount).toBe(26755.96)
      expect(result.variantB.totalAmount).toBe(68351.36)
    })
  })

  describe('US6: Dodatkowy urlop drugiego rodzica', () => {
    it('should calculate second parent benefit based on UoP 5583.33 zł', () => {
      const result = getResult({
        employmentType: EmploymentType.EmploymentContract,
        zusType: ZusType.Big,
        averageBasis: 5583.33,
        childrenCount: 1,
      })

      expect(result.secondParentDailyRate).toBe(112.42)
      expect(result.secondParentMonthlyAmount).toBe(3372.6)
      expect(result.secondParentDays).toBe(63)
      expect(result.secondParentBenefit).toBe(7082.46)
    })
  })
})
