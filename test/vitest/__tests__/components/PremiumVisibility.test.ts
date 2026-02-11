import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { installQuasarPlugin } from '@quasar/quasar-app-extension-testing-unit-vitest'

vi.mock('components/partials/adrverts/Donate.vue', () => ({
  default: {
    template: '<div data-test="donate-stub" />',
  },
}))

vi.mock('components/partials/adrverts/TaxDonation.vue', () => ({
  default: {
    template: '<div data-test="tax-donation-stub" />',
  },
}))

vi.mock('components/partials/SupportProject.vue', () => ({
  default: {
    template: '<div data-test="support-project-stub" />',
  },
}))

import Advert from 'components/partials/Advert.vue'
import Footer from 'components/partials/Footer.vue'
import ModulePageLayout from 'components/partials/ModulePageLayout.vue'
import { usePremiumStore } from 'stores/premiumStore'

installQuasarPlugin()

const setPremiumState = (isPremiumActive: boolean) => {
  const premiumStore = usePremiumStore()
  premiumStore.isPremiumActive = isPremiumActive
  premiumStore.isBillingAvailable = false
}

describe('Premium visibility rules', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('shows advert card when premium is inactive', () => {
    setPremiumState(false)
    const wrapper = mount(Advert)
    expect(wrapper.find('.advert-wrapper').exists()).toBe(true)
  })

  it('hides advert card when premium is active', () => {
    setPremiumState(true)
    const wrapper = mount(Advert)
    expect(wrapper.find('.advert-wrapper').exists()).toBe(false)
  })

  it('shows support button in footer when premium is inactive', () => {
    setPremiumState(false)
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          SupportProject: true,
          PremiumActions: true,
        },
      },
    })

    expect(wrapper.text()).toContain('WESPRZYJ PROJEKT')
  })

  it('hides support button in footer when premium is active', () => {
    setPremiumState(true)
    const wrapper = mount(Footer, {
      global: {
        stubs: {
          SupportProject: true,
          PremiumActions: true,
        },
      },
    })

    expect(wrapper.text()).not.toContain('WESPRZYJ PROJEKT')
  })

  it('shows AdSense slot when premium is inactive', () => {
    setPremiumState(false)
    const wrapper = mount(ModulePageLayout, {
      slots: {
        form: '<div>Form</div>',
        results: '<div>Results</div>',
      },
      global: {
        stubs: {
          AdSenseBanner: { template: '<div data-test="adsense-banner" />' },
          Footer: true,
        },
      },
    })

    expect(wrapper.find('[data-test="adsense-banner"]').exists()).toBe(true)
  })

  it('hides AdSense slot when premium is active', () => {
    setPremiumState(true)
    const wrapper = mount(ModulePageLayout, {
      slots: {
        form: '<div>Form</div>',
        results: '<div>Results</div>',
      },
      global: {
        stubs: {
          AdSenseBanner: { template: '<div data-test="adsense-banner" />' },
          Footer: true,
        },
      },
    })

    expect(wrapper.find('[data-test="adsense-banner"]').exists()).toBe(false)
  })
})
