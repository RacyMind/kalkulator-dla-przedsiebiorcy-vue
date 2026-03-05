import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'
import { AnalyticsEventName } from 'src/types/Analytics'

const { mockNotify, mockAdMobService, mockPremiumStore, mockAnalytics } =
  vi.hoisted(() => {
    const mockNotify = vi.fn()
    const mockAdMobService = {
      hideAd: vi.fn().mockResolvedValue(undefined),
    }
    const mockAnalytics = {
      logEvent: vi.fn(),
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
      mockAnalytics,
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

vi.mock('src/logic/analytics', () => ({
  default: mockAnalytics,
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

const findButtonByText = (wrapper: ReturnType<typeof mount>, text: string) => {
  return wrapper
    .findAll('button')
    .find((button) => button.text().includes(text))
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
    const trigger = findButtonByText(wrapper, 'reklamy')

    expect(trigger).toBeDefined()
    expect(trigger?.attributes('data-color')).toBe('amber-8')
    expect(wrapper.find('[data-test="premium-dialog"]').exists()).toBe(false)

    await trigger?.trigger('click')
    await flushPromises()

    expect(wrapper.find('[data-test="premium-dialog"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Wersja premium')
    expect(wrapper.text()).toContain('Cena brutto:')
    expect(wrapper.text()).toContain('29,99')
    expect(wrapper.text()).toContain('Kup teraz')
    expect(mockPremiumStore.refreshBillingReadiness).toHaveBeenCalledTimes(2)
    expect(mockAnalytics.logEvent).toHaveBeenCalledWith(
      AnalyticsEventName.PremiumOfferOpen,
      {},
    )
  })

  it('calls buyPremium and closes modal after successful purchase', async () => {
    const wrapper = mountComponent()
    const trigger = findButtonByText(wrapper, 'reklamy')

    await trigger?.trigger('click')
    await flushPromises()

    const buyButton = findButtonByText(wrapper, 'Kup teraz')
    await buyButton?.trigger('click')
    await flushPromises()

    expect(mockPremiumStore.buyPremium).toHaveBeenCalledTimes(1)
    expect(mockAdMobService.hideAd).toHaveBeenCalledTimes(1)
    expect(mockAnalytics.logEvent).toHaveBeenCalledWith(
      AnalyticsEventName.PremiumPurchaseSuccess,
      {
        value: 29.99,
        currency: 'PLN',
      },
    )
    expect(mockNotify).toHaveBeenCalledWith({
      type: 'positive',
      message: 'Zakup aktywowany',
    })
    expect(wrapper.find('[data-test="premium-dialog"]').exists()).toBe(false)
  })

  it('tracks cancelled purchase flow', async () => {
    const wrapper = mountComponent()
    mockPremiumStore.buyPremium.mockResolvedValue({
      status: 'cancelled',
    })
    const trigger = findButtonByText(wrapper, 'reklamy')

    await trigger?.trigger('click')
    await flushPromises()

    const buyButton = findButtonByText(wrapper, 'Kup teraz')
    await buyButton?.trigger('click')
    await flushPromises()

    expect(mockAnalytics.logEvent).toHaveBeenCalledWith(
      AnalyticsEventName.PremiumPurchaseCancel,
      {},
    )
    expect(mockNotify).toHaveBeenCalledWith({
      type: 'warning',
      message: 'Zakup anulowany',
    })
  })

  it('calls restorePremium and closes modal after successful restore', async () => {
    const wrapper = mountComponent()
    const trigger = findButtonByText(wrapper, 'reklamy')

    await trigger?.trigger('click')
    await flushPromises()

    const restoreButton = findButtonByText(wrapper, 'Przywr')
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

  it('tracks purchase error details and shows debug message when purchase fails', async () => {
    const wrapper = mountComponent()
    mockPremiumStore.buyPremium.mockResolvedValue({
      status: 'error',
      message: 'purchase_failed',
      code: 13,
      rawMessage: 'network timeout',
    })

    const trigger = findButtonByText(wrapper, 'reklamy')
    await trigger?.trigger('click')
    await flushPromises()

    const buyButton = findButtonByText(wrapper, 'Kup teraz')
    await buyButton?.trigger('click')
    await flushPromises()

    expect(mockAnalytics.logEvent).toHaveBeenCalledWith(
      AnalyticsEventName.PremiumPurchaseError,
      {
        error_code: '13',
      },
    )
    expect(mockNotify).toHaveBeenCalledWith({
      type: 'negative',
      message: 'Nie udało się aktywować zakupu ([13] network timeout)',
    })
  })
})
