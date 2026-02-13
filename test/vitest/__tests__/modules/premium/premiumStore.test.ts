import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { PremiumStatus, PurchaseStatus } from 'src/services/billing/types'

const mockBillingService = vi.hoisted(() => ({
  isAvailable: vi.fn().mockReturnValue(true),
  initialize: vi.fn().mockResolvedValue(undefined),
  getPurchaseReadiness: vi.fn().mockResolvedValue({
    isNativeAndroid: true,
    hasCdvPurchaseNamespace: true,
    storeInitialized: true,
    productLoaded: true,
    hasOffer: true,
    isReadyToPurchase: true,
  }),
  getProductDetails: vi.fn().mockResolvedValue({
    productId: 'premium_no_ads_lifetime',
    priceLabel: '29,99 zł',
  }),
  purchase: vi.fn().mockResolvedValue({
    status: 'purchased',
  }),
  restorePurchases: vi.fn().mockResolvedValue({
    restored: true,
  }),
  hasActiveEntitlement: vi.fn().mockResolvedValue(false),
}))

vi.mock('src/services/billing/BillingService', () => ({
  billingService: mockBillingService,
}))

import { usePremiumStore } from 'stores/premiumStore'

describe('premiumStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    vi.clearAllMocks()

    mockBillingService.isAvailable.mockReturnValue(true)
    mockBillingService.initialize.mockResolvedValue(undefined)
    mockBillingService.getPurchaseReadiness.mockResolvedValue({
      isNativeAndroid: true,
      hasCdvPurchaseNamespace: true,
      storeInitialized: true,
      productLoaded: true,
      hasOffer: true,
      isReadyToPurchase: true,
    })
    mockBillingService.getProductDetails.mockResolvedValue({
      productId: 'premium_no_ads_lifetime',
      priceLabel: '29,99 zł',
    })
    mockBillingService.purchase.mockResolvedValue({
      status: PurchaseStatus.Purchased,
    })
    mockBillingService.restorePurchases.mockResolvedValue({
      restored: true,
    })
    mockBillingService.hasActiveEntitlement.mockResolvedValue(false)
  })

  it('initializes premium state with product price and inactive entitlement', async () => {
    const store = usePremiumStore()

    await store.initializePremium()

    expect(store.isBillingAvailable).toBe(true)
    expect(store.isPremiumActive).toBe(false)
    expect(store.premiumPriceLabel).toBe('29,99 zł')
    expect(store.status).toBe(PremiumStatus.Inactive)
    expect(mockBillingService.getPurchaseReadiness).toHaveBeenCalledTimes(2)
  })

  it('activates premium after successful purchase', async () => {
    const store = usePremiumStore()
    mockBillingService.purchase.mockResolvedValue({
      status: PurchaseStatus.Purchased,
    })

    const result = await store.buyPremium()

    expect(result.status).toBe(PurchaseStatus.Purchased)
    expect(store.isPremiumActive).toBe(true)
    expect(store.status).toBe(PremiumStatus.Active)
  })

  it('does not activate premium when purchase is cancelled', async () => {
    const store = usePremiumStore()
    mockBillingService.purchase.mockResolvedValue({
      status: PurchaseStatus.Cancelled,
    })

    const result = await store.buyPremium()

    expect(result.status).toBe(PurchaseStatus.Cancelled)
    expect(store.isPremiumActive).toBe(false)
    expect(store.status).toBe(PremiumStatus.Inactive)
  })

  it('restores premium when previous purchase exists', async () => {
    const store = usePremiumStore()
    mockBillingService.restorePurchases.mockResolvedValue({
      restored: true,
    })

    const result = await store.restorePremium()

    expect(result.restored).toBe(true)
    expect(store.isPremiumActive).toBe(true)
    expect(store.status).toBe(PremiumStatus.Active)
  })

  it('sets unavailable state when billing is not available', async () => {
    const store = usePremiumStore()
    mockBillingService.isAvailable.mockReturnValue(false)

    await store.initializePremium()

    expect(store.isBillingAvailable).toBe(false)
    expect(store.status).toBe(PremiumStatus.Inactive)
    expect(mockBillingService.initialize).not.toHaveBeenCalled()
    expect(store.billingReadiness).toBeUndefined()
  })

  it('reads premium flag from local storage', () => {
    localStorage.setItem('premium/isPremiumActive', 'true')

    setActivePinia(createPinia())
    const restoredStore = usePremiumStore()

    expect(restoredStore.isPremiumActive).toBe(true)
  })

  it('stores technical purchase error details', async () => {
    const store = usePremiumStore()
    mockBillingService.purchase.mockResolvedValue({
      status: PurchaseStatus.Error,
      message: 'purchase_failed',
      code: 13,
      rawMessage: 'network timeout',
    })

    const result = await store.buyPremium()

    expect(result.status).toBe(PurchaseStatus.Error)
    expect(store.lastError).toBe('purchase_failed')
    expect(store.lastBillingErrorCode).toBe(13)
    expect(store.lastBillingRawMessage).toBe('network timeout')
    expect(store.status).toBe(PremiumStatus.Error)
  })
})
