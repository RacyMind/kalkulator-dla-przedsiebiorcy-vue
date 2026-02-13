import { beforeEach, describe, expect, it, vi } from 'vitest'
import { PurchaseStatus } from 'services/billing/types'

const productId = 'premium_no_ads_lifetime'
const googlePlayPlatform = 'android-playstore'
const setupErrorCode = 0
const paymentCancelledCode = 5
const purchaseErrorCode = 13

const { mockCapacitor } = vi.hoisted(() => {
  const mockCapacitor = {
    isNativePlatform: vi.fn().mockReturnValue(true),
    getPlatform: vi.fn().mockReturnValue('android'),
  }

  return { mockCapacitor }
})

vi.mock('@capacitor/core', () => ({
  Capacitor: mockCapacitor,
}))

import { BillingService } from 'services/billing/BillingService'

const createBillingError = (code: number, message: string) => ({
  isError: true as const,
  code,
  message,
  platform: googlePlayPlatform,
  productId,
})

const createBillingNamespace = () => {
  const approved = vi.fn()
  const when = vi.fn().mockReturnValue({ approved })

  const offer = {
    pricingPhases: [{ price: '29,99 zl' }],
    order: vi.fn().mockResolvedValue(undefined),
  }

  const product = {
    pricing: { price: '29,99 zl' },
    offers: [offer],
    getOffer: vi.fn().mockReturnValue(offer),
  }

  const store = {
    register: vi.fn(),
    initialize: vi.fn().mockResolvedValue([]),
    get: vi.fn().mockImplementation((searchedProductId: string) => {
      return searchedProductId === productId ? product : undefined
    }),
    update: vi.fn().mockResolvedValue(undefined),
    owned: vi.fn().mockReturnValue(false),
    restorePurchases: vi.fn().mockResolvedValue(undefined),
    when,
  }

  const namespace = {
    store,
    Platform: {
      GOOGLE_PLAY: googlePlayPlatform,
    },
    ProductType: {
      NON_CONSUMABLE: 'non consumable',
    },
    ErrorCode: {
      SETUP: setupErrorCode,
      PAYMENT_CANCELLED: paymentCancelledCode,
    },
  }

  ;(
    globalThis as typeof globalThis & {
      CdvPurchase?: typeof namespace
    }
  ).CdvPurchase = namespace

  return {
    namespace,
    store,
    product,
    offer,
    approved,
  }
}

describe('BillingService', () => {
  let service: BillingService
  let billing: ReturnType<typeof createBillingNamespace>

  beforeEach(() => {
    vi.clearAllMocks()
    mockCapacitor.isNativePlatform.mockReturnValue(true)
    mockCapacitor.getPlatform.mockReturnValue('android')
    billing = createBillingNamespace()
    service = new BillingService()
  })

  it('returns true when billing is available on native Android', () => {
    expect(service.isAvailable()).toBe(true)
  })

  it('returns false when platform is not native', () => {
    mockCapacitor.isNativePlatform.mockReturnValue(false)
    expect(service.isAvailable()).toBe(false)
  })

  it('returns readiness details with product and offer loaded', async () => {
    const readiness = await service.getPurchaseReadiness(productId)

    expect(readiness).toEqual({
      isNativeAndroid: true,
      hasCdvPurchaseNamespace: true,
      storeInitialized: true,
      productLoaded: true,
      hasOffer: true,
      isReadyToPurchase: true,
    })
  })

  it('returns setup failure in readiness when store initialization fails', async () => {
    billing.store.initialize.mockResolvedValue([
      createBillingError(setupErrorCode, 'setup_failed'),
    ])

    const readiness = await service.getPurchaseReadiness(productId)

    expect(readiness).toEqual({
      isNativeAndroid: true,
      hasCdvPurchaseNamespace: true,
      storeInitialized: false,
      productLoaded: false,
      hasOffer: false,
      isReadyToPurchase: false,
      message: 'billing_setup_failed',
    })
  })

  it('returns purchased status when order succeeds', async () => {
    billing.store.owned.mockReturnValue(true)

    const result = await service.purchase(productId)

    expect(result).toEqual({
      status: PurchaseStatus.Purchased,
    })
    expect(billing.offer.order).toHaveBeenCalled()
  })

  it('returns cancelled status when user cancels purchase dialog', async () => {
    billing.offer.order.mockResolvedValue(
      createBillingError(paymentCancelledCode, 'Purchase cancelled'),
    )

    const result = await service.purchase(productId)

    expect(result).toEqual({
      status: PurchaseStatus.Cancelled,
      code: paymentCancelledCode,
      rawMessage: 'Purchase cancelled',
    })
  })

  it('returns purchase error with code and raw message', async () => {
    billing.offer.order.mockResolvedValue(
      createBillingError(purchaseErrorCode, 'Item unavailable for purchase'),
    )

    const result = await service.purchase(productId)

    expect(result).toEqual({
      status: PurchaseStatus.Error,
      message: 'product_unavailable',
      code: purchaseErrorCode,
      rawMessage: 'Item unavailable for purchase',
    })
  })

  it('restores purchase when product ownership exists', async () => {
    billing.store.owned.mockImplementation((product) => {
      if (typeof product === 'string') {
        return product === productId
      }

      return product.id === productId
    })

    const result = await service.restorePurchases(productId)

    expect(result).toEqual({
      restored: true,
      message: undefined,
    })
  })

  it('returns restore error with code and raw message', async () => {
    billing.store.restorePurchases.mockResolvedValue(
      createBillingError(purchaseErrorCode, 'Restore failed due to network'),
    )

    const result = await service.restorePurchases(productId)

    expect(result).toEqual({
      restored: false,
      message: 'network_error',
      code: purchaseErrorCode,
      rawMessage: 'Restore failed due to network',
    })
  })

  it('returns false for entitlement when initialize has setup error', async () => {
    billing.store.initialize.mockResolvedValue([
      createBillingError(setupErrorCode, 'setup_failed'),
    ])

    const isActive = await service.hasActiveEntitlement(productId)

    expect(isActive).toBe(false)
  })
})
