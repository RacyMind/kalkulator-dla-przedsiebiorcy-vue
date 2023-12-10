import {FlatTax} from 'src/logic/taxes/FlatTax'
import {createPinia, setActivePinia} from 'pinia'
import { describe, expect, it } from 'vitest'
import {useSettingStore} from 'stores/settingStore'


describe('Income tax using the flat tax in 2023', () => {
  setActivePinia(createPinia())
  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2023,11,1)

  const flatTax = new FlatTax()

  it('the standard cases', () => {
    expect(flatTax.getIncomeTax(100)).toBe(19)
  })
})
