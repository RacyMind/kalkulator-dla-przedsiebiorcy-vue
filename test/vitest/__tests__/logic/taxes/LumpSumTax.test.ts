import {LumpSumTax} from 'src/logic/taxes/LumpSumTax'
import {createPinia, setActivePinia} from 'pinia'
import { describe, expect, it } from 'vitest'
import {useSettingStore} from 'stores/settingStore'


describe('Income tax using the flat tax in 2023', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const lumpSumTax = new LumpSumTax()

  it('the standard cases', () => {
    expect(lumpSumTax.getIncomeTax(100, 0.17)).toBe(17)
    expect(lumpSumTax.getIncomeTax(100.1, 0.17)).toBe(17)
    expect(lumpSumTax.getIncomeTax(-100, 0.17)).toBe(0)
    expect(lumpSumTax.getIncomeTax(100, 0.15)).toBe(15)
    expect(lumpSumTax.getIncomeTax(100, 0.14)).toBe(14)
    expect(lumpSumTax.getIncomeTax(100, 0.12)).toBe(12)
    expect(lumpSumTax.getIncomeTax(100, 0.02)).toBe(2)
  })
})
