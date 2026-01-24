import {IkzeLimitStatus} from 'src/logic/ikzeLimits'
import {IkzeTaxReliefCalculator} from 'components/ikzeTaxRelief/logic/IkzeTaxReliefCalculator'
import {IkzeTaxSystem} from 'components/ikzeTaxRelief/types/IkzeTaxSystem'
import {InputFields} from 'components/ikzeTaxRelief/interfaces/InputFields'
import {Result} from 'components/ikzeTaxRelief/interfaces/Result'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

const getResult = (input: InputFields): Result => {
  return new IkzeTaxReliefCalculator().setInputData(input).calculate().getResult()
}

describe('IkzeTaxReliefCalculator on 1.01.2026', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('The invalid data', () => {
    expect(() => new IkzeTaxReliefCalculator().getResult()).toThrowError('undefined')
    expect(() => new IkzeTaxReliefCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Employment Contract (Umowa o pracę)', () => {
    it('Tax scale - basic calculation', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.EmploymentContract,
        taxSystem: IkzeTaxSystem.TaxScale,
        ikzeContribution: 10000,
        taxBaseBeforeRelief: 80000,
      }

      const result = getResult(input)

      expect(result.status).toBe(IkzeLimitStatus.EmploymentContract)
      expect(result.taxSystem).toBe(IkzeTaxSystem.TaxScale)
      expect(result.ikzeLimit).toBe(11304)
      expect(result.ikzeContribution).toBe(10000)
      expect(result.taxBaseBeforeRelief).toBe(80000)
      expect(result.taxBaseAfterRelief).toBe(70000)
      expect(result.taxBeforeRelief).toBe(9600)
      expect(result.taxAfterRelief).toBe(8400)
      expect(result.taxSaving).toBe(1200)
    })

    it('Tax scale - contribution equal to limit', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.EmploymentContract,
        taxSystem: IkzeTaxSystem.TaxScale,
        ikzeContribution: 11304,
        taxBaseBeforeRelief: 100000,
      }

      const result = getResult(input)

      expect(result.status).toBe(IkzeLimitStatus.EmploymentContract)
      expect(result.taxSystem).toBe(IkzeTaxSystem.TaxScale)
      expect(result.ikzeLimit).toBe(11304)
      expect(result.ikzeContribution).toBe(11304)
      expect(result.taxBaseBeforeRelief).toBe(100000)
      expect(result.taxBaseAfterRelief).toBe(88696)
      expect(result.taxBeforeRelief).toBe(12000)
      expect(result.taxAfterRelief).toBe(10644)
      expect(result.taxSaving).toBe(1356)
    })

    it('Tax scale - second tax bracket', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.EmploymentContract,
        taxSystem: IkzeTaxSystem.TaxScale,
        ikzeContribution: 11304,
        taxBaseBeforeRelief: 150000,
      }

      const result = getResult(input)

      expect(result.status).toBe(IkzeLimitStatus.EmploymentContract)
      expect(result.taxSystem).toBe(IkzeTaxSystem.TaxScale)
      expect(result.ikzeLimit).toBe(11304)
      expect(result.ikzeContribution).toBe(11304)
      expect(result.taxBaseBeforeRelief).toBe(150000)
      expect(result.taxBaseAfterRelief).toBe(138696)
      expect(result.taxBeforeRelief).toBe(24000)
      expect(result.taxAfterRelief).toBe(20383)
      expect(result.taxSaving).toBe(3617)
    })
  })

  describe('Self Employment (Działalność gospodarcza)', () => {
    it('Tax scale - basic calculation', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.SelfEmployment,
        taxSystem: IkzeTaxSystem.TaxScale,
        ikzeContribution: 15000,
        taxBaseBeforeRelief: 100000,
      }

      const result = getResult(input)

      expect(result.status).toBe(IkzeLimitStatus.SelfEmployment)
      expect(result.taxSystem).toBe(IkzeTaxSystem.TaxScale)
      expect(result.ikzeLimit).toBe(16956)
      expect(result.ikzeContribution).toBe(15000)
      expect(result.taxBaseBeforeRelief).toBe(100000)
      expect(result.taxBaseAfterRelief).toBe(85000)
      expect(result.taxBeforeRelief).toBe(12000)
      expect(result.taxAfterRelief).toBe(10200)
      expect(result.taxSaving).toBe(1800)
    })

    it('Flat tax - basic calculation', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.SelfEmployment,
        taxSystem: IkzeTaxSystem.FlatTax,
        ikzeContribution: 16956,
        taxBaseBeforeRelief: 200000,
      }

      const result = getResult(input)

      expect(result.status).toBe(IkzeLimitStatus.SelfEmployment)
      expect(result.taxSystem).toBe(IkzeTaxSystem.FlatTax)
      expect(result.ikzeLimit).toBe(16956)
      expect(result.ikzeContribution).toBe(16956)
      expect(result.taxBaseBeforeRelief).toBe(200000)
      expect(result.taxBaseAfterRelief).toBe(183044)
      expect(result.taxBeforeRelief).toBe(38000)
      expect(result.taxAfterRelief).toBe(34778)
      expect(result.taxSaving).toBe(3222)
    })

    it('Lump sum tax - 8.5% rate', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.SelfEmployment,
        taxSystem: IkzeTaxSystem.LumpSum,
        ikzeContribution: 16956,
        taxBaseBeforeRelief: 200000,
        lumpSumTaxRate: 0.085,
      }

      const result = getResult(input)

      expect(result.status).toBe(IkzeLimitStatus.SelfEmployment)
      expect(result.taxSystem).toBe(IkzeTaxSystem.LumpSum)
      expect(result.ikzeLimit).toBe(16956)
      expect(result.ikzeContribution).toBe(16956)
      expect(result.taxBaseBeforeRelief).toBe(200000)
      expect(result.taxBaseAfterRelief).toBe(183044)
      expect(result.taxBeforeRelief).toBe(17000)
      expect(result.taxAfterRelief).toBe(15559)
      expect(result.taxSaving).toBe(1441)
    })

    it('Lump sum tax - 12% rate', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.SelfEmployment,
        taxSystem: IkzeTaxSystem.LumpSum,
        ikzeContribution: 10000,
        taxBaseBeforeRelief: 150000,
        lumpSumTaxRate: 0.12,
      }

      const result = getResult(input)

      expect(result.status).toBe(IkzeLimitStatus.SelfEmployment)
      expect(result.taxSystem).toBe(IkzeTaxSystem.LumpSum)
      expect(result.ikzeLimit).toBe(16956)
      expect(result.ikzeContribution).toBe(10000)
      expect(result.taxBaseBeforeRelief).toBe(150000)
      expect(result.taxBaseAfterRelief).toBe(140000)
      expect(result.taxBeforeRelief).toBe(18000)
      expect(result.taxAfterRelief).toBe(16800)
      expect(result.taxSaving).toBe(1200)
    })
  })

  describe('Limit comparison UoP vs DG', () => {
    it('Contribution between UoP and DG limits - UoP status', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.EmploymentContract,
        taxSystem: IkzeTaxSystem.TaxScale,
        ikzeContribution: 11304,
        taxBaseBeforeRelief: 100000,
      }

      const result = getResult(input)

      expect(result.ikzeLimit).toBe(11304)
      expect(result.ikzeContribution).toBe(11304)
    })

    it('Contribution between UoP and DG limits - DG status', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.SelfEmployment,
        taxSystem: IkzeTaxSystem.TaxScale,
        ikzeContribution: 14000,
        taxBaseBeforeRelief: 100000,
      }

      const result = getResult(input)

      expect(result.ikzeLimit).toBe(16956)
      expect(result.ikzeContribution).toBe(14000)
    })
  })

  describe('Edge cases', () => {
    it('Zero contribution', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.EmploymentContract,
        taxSystem: IkzeTaxSystem.TaxScale,
        ikzeContribution: 0,
        taxBaseBeforeRelief: 80000,
      }

      const result = getResult(input)

      expect(result.ikzeContribution).toBe(0)
      expect(result.taxBaseAfterRelief).toBe(80000)
      expect(result.taxSaving).toBe(0)
    })

    it('Contribution greater than tax base', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.EmploymentContract,
        taxSystem: IkzeTaxSystem.TaxScale,
        ikzeContribution: 10000,
        taxBaseBeforeRelief: 5000,
      }

      const result = getResult(input)

      expect(result.taxBaseAfterRelief).toBe(0)
      expect(result.taxBeforeRelief).toBe(600)
      expect(result.taxAfterRelief).toBe(0)
      expect(result.taxSaving).toBe(600)
    })

    it('Lump sum without rate throws error', () => {
      const input: InputFields = {
        status: IkzeLimitStatus.SelfEmployment,
        taxSystem: IkzeTaxSystem.LumpSum,
        ikzeContribution: 10000,
        taxBaseBeforeRelief: 100000,
      }

      expect(() => getResult(input)).toThrowError('Lump sum tax rate is required')
    })
  })
})
