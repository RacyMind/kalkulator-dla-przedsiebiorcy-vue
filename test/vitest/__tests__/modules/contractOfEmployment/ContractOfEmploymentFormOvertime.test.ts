import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { nextTick } from 'vue'
import Form from 'components/contractOfEmployment/components/Form.vue'
import { useEmploymentContractStore } from 'components/contractOfEmployment/store'
import { useSettingStore } from 'stores/settingStore'
import { AmountTypes } from 'stores/constantsStore'

installQuasarPlugin()

const createWrapper = () => {
  return mount(Form, {
    global: {
      stubs: {
        RouterLink: true,
      },
    },
  })
}

const submitForm = async (wrapper: ReturnType<typeof createWrapper>) => {
  wrapper.findComponent({ name: 'QForm' }).vm.$emit('submit', {
    preventDefault: () => undefined,
  })
  await nextTick()
}

const setStoredValue = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value))
}

const runNetFormAndGetFirstGrossAmount = async (overtimeEnabled: boolean) => {
  setActivePinia(createPinia())
  localStorage.clear()

  const settingStore = useSettingStore()
  settingStore.dateOfLawRules = new Date(2026, 0, 1)

  setStoredValue('contractOfEmployment/form/amountType', AmountTypes.Net)
  setStoredValue('contractOfEmployment/form/amount', 4300)
  setStoredValue('contractOfEmployment/form/isOvertimeEnabled', overtimeEnabled)
  setStoredValue('contractOfEmployment/form/standardMonthlyHours', 1)
  setStoredValue('contractOfEmployment/form/overtimeHours', 200)
  setStoredValue('contractOfEmployment/form/overtimePercent', 300)

  const wrapper = createWrapper()
  const store = useEmploymentContractStore()

  await submitForm(wrapper)

  const firstGrossAmount = store.monthlyInputFields?.[0]?.grossAmount
  wrapper.unmount()

  return firstGrossAmount
}

describe('Contract of employment form overtime', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()

    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('adds overtime gross amount to each month for gross amount type', async () => {
    setStoredValue('contractOfEmployment/form/amountType', AmountTypes.Gross)
    setStoredValue('contractOfEmployment/form/amount', 6000)
    setStoredValue('contractOfEmployment/form/isOvertimeEnabled', true)
    setStoredValue('contractOfEmployment/form/standardMonthlyHours', 160)
    setStoredValue('contractOfEmployment/form/overtimeHours', 10)
    setStoredValue('contractOfEmployment/form/overtimePercent', 50)
    setStoredValue(
      'contractOfEmployment/form/overtime/hasAmountForEachMonth',
      false,
    )

    const wrapper = createWrapper()
    const store = useEmploymentContractStore()

    await submitForm(wrapper)

    expect(store.monthlyInputFields).toHaveLength(12)
    expect(
      store.monthlyInputFields?.every((item) => item.grossAmount === 6562.5),
    ).toBe(true)
  })

  it('supports different overtime hours for each month', async () => {
    setStoredValue('contractOfEmployment/form/amountType', AmountTypes.Gross)
    setStoredValue('contractOfEmployment/form/amount', 4800)
    setStoredValue('contractOfEmployment/form/isOvertimeEnabled', true)
    setStoredValue('contractOfEmployment/form/standardMonthlyHours', 160)
    setStoredValue('contractOfEmployment/form/overtimeHours', 0)
    setStoredValue('contractOfEmployment/form/overtimePercent', 100)
    setStoredValue(
      'contractOfEmployment/form/overtime/hasAmountForEachMonth',
      true,
    )
    setStoredValue(
      'contractOfEmployment/form/overtime/monthlyAmounts',
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    )

    const wrapper = createWrapper()
    const store = useEmploymentContractStore()

    await submitForm(wrapper)

    expect(store.monthlyInputFields?.[0].grossAmount).toBe(4800)
    expect(store.monthlyInputFields?.[1].grossAmount).toBe(4860)
    expect(store.monthlyInputFields?.[2].grossAmount).toBe(4920)
    expect(store.monthlyInputFields?.[11].grossAmount).toBe(5460)
  })

  it('keeps overtime unavailable and ignored for net amount type', async () => {
    setStoredValue('contractOfEmployment/form/amountType', AmountTypes.Net)

    const wrapper = createWrapper()
    expect(wrapper.text()).not.toContain('Dodaj nadgodziny')
    wrapper.unmount()

    const firstGrossWithoutOvertime =
      await runNetFormAndGetFirstGrossAmount(false)
    const firstGrossWithOvertime = await runNetFormAndGetFirstGrossAmount(true)

    expect(firstGrossWithOvertime).toBe(firstGrossWithoutOvertime)
  })
})
