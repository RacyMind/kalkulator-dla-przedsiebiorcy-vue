import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'

const { mockNotify, mockAdMobService, mockPremiumStore } = vi.hoisted(() => {
  const mockNotify = vi.fn()
  const mockAdMobService = {
    hideAd: vi.fn().mockResolvedValue(undefined),
  }
  const mockPremiumStore = {
    isBillingAvailable: true,
    isPremiumActive: false,
    premiumPriceLabel: '29,99 zł',
    status: 'inactive',
    billingReadiness: {
      isNativeAndroid: true,
      hasCdvPurchaseNamespace: true,
      storeInitialized: true,
      productLoaded: true,
      hasOffer: true,
      isReadyToPurchase: true,
    },
    lastBillingErrorCode: null as number | string | null,
    lastBillingRawMessage: null as string | null,
    initializePremium: vi.fn().mockResolvedValue(undefined),
    refreshBillingReadiness: vi.fn().mockResolvedValue(undefined),
    buyPremium: vi.fn().mockResolvedValue({
      status: 'purchased',
    }),
    restorePremium: vi.fn().mockResolvedValue({
      restored: true,
    }),
  }

  return {
    mockNotify,
    mockAdMobService,
    mockPremiumStore,
  }
})

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('quasar')>()
  return {
    ...actual,
    useQuasar: () => ({
      notify: mockNotify,
    }),
  }
})

vi.mock('boot/admob', () => ({
  adMobService: mockAdMobService,
}))

vi.mock('stores/premiumStore', () => ({
  usePremiumStore: () => mockPremiumStore,
}))

import PremiumActions from 'components/partials/PremiumActions.vue'

const QBtnStub = defineComponent({
  name: 'QBtn',
  props: {
    color: { type: String, default: '' },
    label: { type: String, default: '' },
    loading: { type: Boolean, default: false },
  },
  emits: ['click'],
  template:
    '<button :data-color="color" :data-loading="String(loading)" @click="$emit(\'click\')"><slot />{{ label }}</button>',
})

const QDialogStub = defineComponent({
  name: 'QDialog',
  props: {
    modelValue: { type: Boolean, default: false },
  },
  emits: ['update:modelValue'],
  template: '<div v-if="modelValue" data-test="premium-dialog"><slot /></div>',
})

const QCardStub = defineComponent({
  name: 'QCard',
  template: '<div><slot /></div>',
})

const QCardSectionStub = defineComponent({
  name: 'QCardSection',
  template: '<div><slot /></div>',
})

const QCardActionsStub = defineComponent({
  name: 'QCardActions',
  template: '<div><slot /></div>',
})

const mountComponent = () => {
  return mount(PremiumActions, {
    global: {
      stubs: {
        'q-btn': QBtnStub,
        'q-dialog': QDialogStub,
        'q-card': QCardStub,
        'q-card-section': QCardSectionStub,
        'q-card-actions': QCardActionsStub,
      },
    },
  })
}

describe('PremiumActions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.assign(mockPremiumStore, {
      isBillingAvailable: true,
      isPremiumActive: false,
      premiumPriceLabel: '29,99 zł',
      status: 'inactive',
      billingReadiness: {
        isNativeAndroid: true,
        hasCdvPurchaseNamespace: true,
        storeInitialized: true,
        productLoaded: true,
        hasOffer: true,
        isReadyToPurchase: true,
      },
      lastBillingErrorCode: null,
      lastBillingRawMessage: null,
    })
    mockPremiumStore.initializePremium.mockResolvedValue(undefined)
    mockPremiumStore.refreshBillingReadiness.mockResolvedValue(undefined)
    mockPremiumStore.buyPremium.mockResolvedValue({
      status: 'purchased',
    })
    mockPremiumStore.restorePremium.mockResolvedValue({
      restored: true,
    })
    mockAdMobService.hideAd.mockResolvedValue(undefined)
  })

  it('renders remove ads trigger with amber color and opens modal', async () => {
    const wrapper = mountComponent()
    const buttons = wrapper.findAll('button')
    const trigger = buttons.find((button) =>
      button.text().includes('Usuń reklamy i przyciski wsparcia'),
    )

    expect(trigger).toBeDefined()
    expect(trigger?.attributes('data-color')).toBe('amber-8')
    expect(wrapper.find('[data-test="premium-dialog"]').exists()).toBe(false)

    await trigger?.trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-test="premium-dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Wersja premium')
    expect(wrapper.text()).toContain('Cena brutto:')
    expect(wrapper.text()).toContain('29,99 zł')
    expect(wrapper.text()).toContain(
      'Opcja "Przywróć zakup" służy do odzyskania aktywnej wersji premium',
    )
    expect(wrapper.text()).toContain('Kup teraz')
    expect(wrapper.text()).toContain('Przywróć zakup')
    expect(mockPremiumStore.refreshBillingReadiness).toHaveBeenCalledTimes(2)
  })

  it('calls buyPremium and closes modal after successful purchase', async () => {
    const wrapper = mountComponent()
    const trigger = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Usuń reklamy'))

    await trigger?.trigger('click')
    await flushPromises()

    const buyButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Kup teraz'))
    await buyButton?.trigger('click')
    await flushPromises()

    expect(mockPremiumStore.buyPremium).toHaveBeenCalledTimes(1)
    expect(mockAdMobService.hideAd).toHaveBeenCalledTimes(1)
    expect(mockNotify).toHaveBeenCalledWith({
      type: 'positive',
      message: 'Zakup aktywowany',
    })
    expect(wrapper.find('[data-test="premium-dialog"]').exists()).toBe(false)
  })

  it('calls restorePremium and closes modal after successful restore', async () => {
    const wrapper = mountComponent()
    const trigger = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Usuń reklamy'))

    await trigger?.trigger('click')
    await flushPromises()

    const restoreButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Przywróć zakup'))
    await restoreButton?.trigger('click')
    await flushPromises()

    expect(mockPremiumStore.restorePremium).toHaveBeenCalledTimes(1)
    expect(mockAdMobService.hideAd).toHaveBeenCalledTimes(1)
    expect(mockNotify).toHaveBeenCalledWith({
      type: 'positive',
      message: 'Zakup został przywrócony',
    })
    expect(wrapper.find('[data-test="premium-dialog"]').exists()).toBe(false)
  })

  it('initializes premium when store status is idle', async () => {
    mockPremiumStore.status = 'idle'

    mountComponent()
    await flushPromises()

    expect(mockPremiumStore.initializePremium).toHaveBeenCalledTimes(1)
  })

  it('shows detailed error in debug mode when purchase fails', async () => {
    const wrapper = mountComponent()
    mockPremiumStore.buyPremium.mockResolvedValue({
      status: 'error',
      message: 'purchase_failed',
      code: 13,
      rawMessage: 'network timeout',
    })

    const trigger = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Usuń reklamy'))
    await trigger?.trigger('click')
    await flushPromises()

    const buyButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Kup teraz'))
    await buyButton?.trigger('click')
    await flushPromises()

    expect(mockNotify).toHaveBeenCalledWith({
      type: 'negative',
      message: 'Nie udało się aktywować zakupu ([13] network timeout)',
    })
  })
})
