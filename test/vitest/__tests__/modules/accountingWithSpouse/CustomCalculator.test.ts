import {CustomCalculator} from 'components/accountingWithSpouse/logic/CustomCalculator'
import {CustomInputFields} from 'components/accountingWithSpouse/interfaces/CustomInputFields'
import {JointAccountingCalculator} from 'components/accountingWithSpouse/logic/JointAccountingCalculator'
import {JointAccountingInputFields} from 'components/accountingWithSpouse/interfaces/JointAccountingInputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

describe('Custom Calculator in the module "Accounting with Spouse" on 1.1.20024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,0,1)
  })

  const getDefaultInput = ():CustomInputFields => {
    return {
      revenue: 100000,
      expenses: 10000,
      socialContributions: 20000,
      healthContributions: 10000,
      hasTaxRelief: false,
    }
  }

  it('The invalid data', () => {
    expect(() => new CustomCalculator().getResult()).toThrowError('undefined')
    expect(() => new CustomCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test all results', () => {
    it('within the first tax rate', () => {
      const result = new CustomCalculator().setInputData(getDefaultInput()).calculate().getResult()

      expect(result.revenue).toBe(100000)
      expect(result.socialContributions).toBe(20000)
      expect(result.healthContributions).toBe(10000)
      expect(result.expenses).toBe(10000)
      expect(result.taxBasis).toBe(70000)
      expect(result.taxAmount).toBe(4800)
      expect(result.income).toBe(55200)
    })

    it('within the second tax rate', () => {
      const result = new CustomCalculator().setInputData({
        ...getDefaultInput(),
        revenue: 200000,
      }).calculate().getResult()

      expect(result.revenue).toBe(200000)
      expect(result.socialContributions).toBe(20000)
      expect(result.healthContributions).toBe(10000)
      expect(result.expenses).toBe(10000)
      expect(result.taxBasis).toBe(170000)
      expect(result.taxAmount).toBe(26800)
      expect(result.income).toBe(133200)
    })

    it('with the tax relief', () => {
      const result = new CustomCalculator().setInputData({
        ...getDefaultInput(),
        hasTaxRelief: true,
      }).calculate().getResult()

      expect(result.revenue).toBe(100000)
      expect(result.socialContributions).toBe(20000)
      expect(result.healthContributions).toBe(10000)
      expect(result.expenses).toBe(10000)
      expect(result.taxBasis).toBe(0)
      expect(result.taxAmount).toBe(0)
      expect(result.income).toBe(60000)
    })

    it('with the tax relief, over the tax relief', () => {
      const result = new CustomCalculator().setInputData({
        ...getDefaultInput(),
        revenue: 200000,
        hasTaxRelief: true,
      }).calculate().getResult()

      expect(result.revenue).toBe(200000)
      expect(result.socialContributions).toBe(20000)
      expect(result.healthContributions).toBe(10000)
      expect(result.expenses).toBe(10000)
      expect(result.taxBasis).toBe(84472)
      expect(result.taxAmount).toBe(6537)
      expect(result.income).toBe(153463)
    })
  })
})
