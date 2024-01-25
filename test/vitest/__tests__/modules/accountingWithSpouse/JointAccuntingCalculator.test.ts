import {JointAccountingCalculator} from 'components/accountingWithSpouse/logic/JointAccountingCalculator'
import {JointAccountingInputFields} from 'components/accountingWithSpouse/interfaces/JointAccountingInputFields'
import {beforeEach, describe, expect, it} from 'vitest'
import {createPinia, setActivePinia} from 'pinia'
import {useSettingStore} from 'stores/settingStore'

setActivePinia(createPinia())

describe('Joint Accounting Calculator in the module "Accounting with Spouse" on 1.1.20024', () => {
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2024,0,1)
  })

  const getDefaultInput = (husbandTaxBasis:number, wifeTaxBasis: number):JointAccountingInputFields => {
    return {
      husband: {
        taxBasis: husbandTaxBasis,
        revenue: 0,
        expenses: 0,
        totalContributions: 0,
      },
      wife: {
        taxBasis: wifeTaxBasis,
        revenue: 0,
        expenses: 0,
        totalContributions: 0,
      },
    }
  }

  it('The invalid data', () => {
    expect(() => new JointAccountingCalculator().getResult()).toThrowError('undefined')
    expect(() => new JointAccountingCalculator().calculate().getResult()).toThrowError('undefined')
  })

  describe('Test tax amounts', () => {
    it('within the first tax rate', () => {
      expect(new JointAccountingCalculator().setInputData(getDefaultInput(50000, 170000)).calculate().getResult().taxAmount).toBe(19200)
    })

    it('within the second tax rate', () => {
      expect(new JointAccountingCalculator().setInputData(getDefaultInput(200000, 200000)).calculate().getResult().taxAmount).toBe(72800)
    })
  })

  describe('Test all results', () => {
    it('standard case', () => {
      const result = new JointAccountingCalculator().setInputData({
        husband: {
          revenue: 100000,
          totalContributions: 20000,
          expenses: 10000,
          taxBasis: 90000,
        },
        wife: {
          revenue: 100000,
          totalContributions: 20000,
          expenses: 10000,
          taxBasis: 90000,
        },
      }).calculate().getResult()

      expect(result.revenue).toBe(200000)
      expect(result.totalContributions).toBe(40000)
      expect(result.taxBasis).toBe(180000)
      expect(result.taxAmount).toBe(14400)
      expect(result.income).toBe(125600)
    })
  })
})
