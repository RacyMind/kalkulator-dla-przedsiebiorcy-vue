import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import { routeLocationKey } from 'vue-router'
import { AnalyticsEventName } from 'src/types/Analytics'

const { mockEventStore, mockAnalytics } = vi.hoisted(() => ({
  mockEventStore: {
    $reset: vi.fn(),
  },
  mockAnalytics: {
    logEvent: vi.fn(),
  },
}))

vi.mock('stores/eventStore', () => ({
  useEventStore: () => mockEventStore,
}))

vi.mock('src/logic/analytics', () => ({
  default: mockAnalytics,
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

const createMountOptions = () => ({
  global: {
    stubs: {
      'q-btn': QBtnStub,
      'router-link': RouterLinkStub,
    },
    provide: {
      [routeLocationKey as symbol]: {
        path: '/samozatrudnienie',
      },
    },
  },
})

describe('SubmitButton legal links', () => {
  it('renders links to regulations and privacy policy', () => {
    const wrapper = mount(SubmitButton, createMountOptions())

    const legalLinks = wrapper
      .findAll('a')
      .map((link) => link.attributes('data-to'))
    expect(legalLinks).toContain('/regulamin')
    expect(legalLinks).toContain('/polityka-prywatnosci')
    expect(wrapper.text()).toContain('akceptujesz')
  })

  it('resets event store on submit button click', async () => {
    const wrapper = mount(SubmitButton, createMountOptions())

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
