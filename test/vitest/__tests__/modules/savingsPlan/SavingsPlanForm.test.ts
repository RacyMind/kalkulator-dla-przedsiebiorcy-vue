import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { nextTick } from 'vue'
import Form from 'components/savingsPlan/components/Form.vue'
import {
  SavingsPlanEmploymentForm,
  SavingsPlanTaxationForm,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'
import { useSavingsPlanStore } from 'components/savingsPlan/store'
import { useSettingStore } from 'stores/settingStore'

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
  localStorage.setItem(
    key,
    typeof value === 'string' ? value : JSON.stringify(value),
  )
}

describe('SavingsPlan form', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()

    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('submits new tax model fields and removes manual IKZE tax rate', async () => {
    const wrapper = createWrapper()
    const store = useSavingsPlanStore()

    await submitForm(wrapper)

    expect(store.inputFields).toBeDefined()
    expect(store.inputFields?.employmentForm).toBe(
      SavingsPlanEmploymentForm.EmploymentContract,
    )
    expect(store.inputFields?.taxationForm).toBe(
      SavingsPlanTaxationForm.TaxScale,
    )
    expect(store.inputFields?.annualTaxBase).toBe(90000)
    expect(store.inputFields?.annualLimitGrowthRate).toBe(0)
    expect(store.inputFields?.activeTool).toBe(SavingsPlanTool.Ike)
    expect('ikzeTaxRate' in (store.inputFields as object)).toBe(false)
    expect(wrapper.text()).not.toContain('Stawka ulgi IKZE')
  })

  it('allows 0 for yearly limit growth field validation', () => {
    const wrapper = createWrapper()
    const yearlyGrowthInput = wrapper
      .findAllComponents({ name: 'QInput' })
      .find(
        (component) =>
          component.props('label') === 'Roczny wzrost limitów IKE i IKZE',
      )

    const rules = (yearlyGrowthInput?.props('rules') ?? []) as Array<
      (value: number) => boolean | string
    >
    const validationResults = rules.map((rule) => rule(0))

    expect(validationResults.every((result) => result === true)).toBe(true)
  })

  it('shows taxation form only for self-employment and keeps it hidden for employment contract', async () => {
    const employmentWrapper = createWrapper()
    expect(employmentWrapper.text()).toContain('Forma zatrudnienia')
    expect(employmentWrapper.text()).not.toContain('Forma opodatkowania')
    employmentWrapper.unmount()

    setStoredValue(
      'savingsPlan/form/employmentForm',
      SavingsPlanEmploymentForm.SelfEmployment,
    )
    setStoredValue(
      'savingsPlan/form/taxationForm',
      SavingsPlanTaxationForm.FlatTax,
    )

    const selfEmploymentWrapper = createWrapper()
    const store = useSavingsPlanStore()

    expect(selfEmploymentWrapper.text()).toContain('Forma opodatkowania')
    await submitForm(selfEmploymentWrapper)

    expect(store.inputFields?.employmentForm).toBe(
      SavingsPlanEmploymentForm.SelfEmployment,
    )
    expect(store.inputFields?.taxationForm).toBe(
      SavingsPlanTaxationForm.FlatTax,
    )
  })

  it('keeps only save/delete actions and applies overwrite-or-create save behavior by plan name', async () => {
    const wrapper = createWrapper()
    const store = useSavingsPlanStore()

    const getSaveButton = () =>
      wrapper
        .findAll('button')
        .find((button) => button.text().includes('Zapisz'))
    const getDeleteButton = () =>
      wrapper.findAll('button').find((button) => button.text().includes('Usuń'))

    const planNameInput = wrapper
      .findAllComponents({ name: 'QInput' })
      .find((component) => component.props('label') === 'Nazwa planu')

    const goalAmountInput = wrapper
      .findAllComponents({ name: 'QInput' })
      .find((component) => component.props('label') === 'Kwota celu')

    const savedPlanSelect = wrapper
      .findAllComponents({ name: 'QSelect' })
      .find((component) => component.props('label') === 'Wybierz zapisany plan')

    expect(wrapper.text()).toContain('Zapisz')
    expect(wrapper.text()).toContain('Usuń')
    expect(wrapper.text()).not.toContain('Więcej')
    expect(wrapper.text()).not.toContain('Wczytaj')
    expect(wrapper.text()).not.toContain('Nadpisz')

    await getSaveButton()?.trigger('click')
    await nextTick()

    expect(store.savedPlans.length).toBe(1)
    const firstPlanId = store.savedPlans[0]?.id
    expect(firstPlanId).toBeTruthy()
    expect(planNameInput?.props('modelValue')).toBe('Plan oszczędzania 1')

    const options = (savedPlanSelect?.props('options') ?? []) as Array<{
      label: string
      value: string
    }>
    expect(options[0]?.label).toBe('Plan oszczędzania 1')

    goalAmountInput?.vm.$emit('update:modelValue', 999)
    await nextTick()
    await getSaveButton()?.trigger('click')
    await nextTick()

    expect(store.savedPlans.length).toBe(1)
    expect(store.savedPlans[0]?.id).toBe(firstPlanId)
    expect(store.savedPlans[0]?.payload.goalAmount).toBe(999)

    planNameInput?.vm.$emit('update:modelValue', 'Plan oszczędzania 2')
    goalAmountInput?.vm.$emit('update:modelValue', 777)
    await nextTick()
    await getSaveButton()?.trigger('click')
    await nextTick()

    expect(store.savedPlans.length).toBe(2)
    expect(store.savedPlans[0]?.name).toBe('Plan oszczędzania 2')
    expect(store.savedPlans[0]?.payload.goalAmount).toBe(777)
    expect(store.savedPlans[0]?.id).not.toBe(firstPlanId)

    savedPlanSelect?.vm.$emit('update:modelValue', firstPlanId)
    await nextTick()

    expect(store.inputFields?.goalAmount).toBe(999)
    expect(planNameInput?.props('modelValue')).toBe('Plan oszczędzania 1')

    await getDeleteButton()?.trigger('click')
    await nextTick()

    expect(store.savedPlans.length).toBe(2)
  })
})
