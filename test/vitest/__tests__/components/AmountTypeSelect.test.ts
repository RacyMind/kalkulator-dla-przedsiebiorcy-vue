import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { AmountTypes } from 'stores/constantsStore'

const mockNotify = vi.fn()

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('quasar')>()
  return {
    ...actual,
    useQuasar: () => ({
      notify: mockNotify,
    }),
  }
})

import AmountTypeSelect from 'components/partials/form/AmountTypeSelect.vue'

const QRadioStub = defineComponent({
  name: 'QRadio',
  props: {
    label: {
      type: String,
      required: true,
    },
  },
  template: '<label>{{ label }}</label>',
})

describe('AmountTypeSelect', () => {
  it('hides employer cost option by default', () => {
    const wrapper = mount(AmountTypeSelect, {
      props: {
        modelValue: AmountTypes.Gross,
      },
      global: {
        stubs: {
          'q-radio': QRadioStub,
        },
      },
    })

    expect(wrapper.text()).toContain('netto')
    expect(wrapper.text()).toContain('brutto')
    expect(wrapper.text()).not.toContain('koszt pracodawcy')
  })

  it('shows employer cost option when enabled and notifies on selection', async () => {
    const wrapper = mount(AmountTypeSelect, {
      props: {
        modelValue: AmountTypes.Gross,
        showEmployerCost: true,
      },
      global: {
        stubs: {
          'q-radio': QRadioStub,
        },
      },
    })

    expect(wrapper.text()).toContain('koszt pracodawcy')

    await wrapper.setProps({
      modelValue: AmountTypes.EmployerCost,
    })

    expect(mockNotify).toHaveBeenCalledWith({
      message:
        'Przy koszcie pracodawcy obliczenia są szacunkowe. Zalecane jest korzystanie z wynagrodzenia brutto, by poznać dokładne obliczenia.',
    })
  })
})
