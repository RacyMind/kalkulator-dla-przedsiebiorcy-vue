import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'
import { nextTick } from 'vue'
import Form from 'components/pfronRefund/components/Form.vue'
import { DisabilityDegree } from 'components/pfronRefund/types/DisabilityDegree'
import { ContributionBasises } from 'src/composables/contributionBasises'
import { usePfronRefundStore } from 'components/pfronRefund/store'
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

describe('PfronRefund Form', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()

    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })

  it('submits contribution basis and disability degree without manual contribution fields', async () => {
    const wrapper = createWrapper()
    const store = usePfronRefundStore()

    await submitForm(wrapper)

    expect(store.inputFields).toEqual({
      disabilityDegree: DisabilityDegree.Moderate,
      contributionBasis: 5652,
    })
    expect('pensionContribution' in (store.inputFields as object)).toBe(false)
    expect('disabilityContribution' in (store.inputFields as object)).toBe(
      false,
    )
  })

  it('recalculates small basis after year change', async () => {
    localStorage.setItem(
      'pfronRefund/form/chosenContributionBasis',
      JSON.stringify(ContributionBasises.Small),
    )

    const wrapper = createWrapper()
    const store = usePfronRefundStore()
    const settingStore = useSettingStore()

    await submitForm(wrapper)
    expect(store.inputFields?.contributionBasis).toBe(1441.8)

    settingStore.dateOfLawRules = new Date(2025, 0, 1)
    await nextTick()
    await submitForm(wrapper)

    expect(store.inputFields?.contributionBasis).toBe(1399.8)
  })
})
