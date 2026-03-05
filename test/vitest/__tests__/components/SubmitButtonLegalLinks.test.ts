import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { AnalyticsEventName } from 'src/types/Analytics'

const { mockEventStore, mockAnalytics, mockRoute } = vi.hoisted(() => ({
  mockEventStore: {
    $reset: vi.fn(),
  },
  mockAnalytics: {
    logEvent: vi.fn(),
  },
  mockRoute: {
    path: '/samozatrudnienie',
  },
}))

vi.mock('stores/eventStore', () => ({
  useEventStore: () => mockEventStore,
}))

vi.mock('src/logic/analytics', () => ({
  default: mockAnalytics,
}))

vi.mock('vue-router', () => ({
  useRoute: () => mockRoute,
}))

import SubmitButton from 'components/partials/form/SubmitButton.vue'

const QBtnStub = defineComponent({
  name: 'QBtn',
  emits: ['click'],
  template: '<button @click="$emit(\'click\')"><slot />Oblicz</button>',
})

const RouterLinkStub = defineComponent({
  name: 'RouterLink',
  props: {
    to: {
      type: String,
      required: true,
    },
  },
  template: '<a :data-to="to"><slot /></a>',
})

describe('SubmitButton legal links', () => {
  it('renders links to regulations and privacy policy', () => {
    const wrapper = mount(SubmitButton, {
      global: {
        stubs: {
          'q-btn': QBtnStub,
          'router-link': RouterLinkStub,
        },
      },
    })

    const legalLinks = wrapper
      .findAll('a')
      .map((link) => link.attributes('data-to'))
    expect(legalLinks).toContain('/regulamin')
    expect(legalLinks).toContain('/polityka-prywatnosci')
    expect(wrapper.text()).toContain('akceptujesz')
  })

  it('resets event store on submit button click', async () => {
    const wrapper = mount(SubmitButton, {
      global: {
        stubs: {
          'q-btn': QBtnStub,
          'router-link': RouterLinkStub,
        },
      },
    })

    await wrapper.find('button').trigger('click')

    expect(mockEventStore.$reset).toHaveBeenCalledTimes(1)
    expect(mockAnalytics.logEvent).toHaveBeenCalledWith(
      AnalyticsEventName.CalculationSubmit,
      {
        calculator_slug: 'samozatrudnienie',
      },
    )
  })
})
