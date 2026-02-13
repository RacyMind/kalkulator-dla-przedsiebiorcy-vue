import { Capacitor } from '@capacitor/core'
import {
  PurchaseStatus,
  type BillingReadinessResult,
  type ProductDetails,
  type PurchaseResult,
  type RestoreResult,
} from './types'

interface BillingError {
  isError: true
  code: number
  message: string
  platform: string | null
  productId: string | null
}

interface BillingTransaction {
  finish: () => Promise<void> | void
}

interface BillingOffer {
  pricingPhases?: Array<{
    price?: string
  }>
  order: () => Promise<BillingError | undefined>
}

interface BillingProduct {
  pricing?: {
    price?: string
  }
  offers: BillingOffer[]
  getOffer?: (id?: string) => BillingOffer | undefined
}

interface BillingStore {
  register: (product: { id: string; type: string; platform: string }) => void
  initialize: (platforms?: string[]) => Promise<BillingError[]>
  get: (productId: string, platform?: string) => BillingProduct | undefined
  update: () => Promise<void>
  owned: (product: { id: string; platform?: string } | string) => boolean
  restorePurchases: () => Promise<BillingError | undefined>
  when: () => {
    approved: (callback: (transaction: BillingTransaction) => void) => unknown
  }
}

interface BillingNamespace {
  store: BillingStore
  Platform: {
    GOOGLE_PLAY: string
  }
  ProductType: {
    NON_CONSUMABLE: string
  }
  ErrorCode: {
    SETUP: number
    PAYMENT_CANCELLED: number
  }
}

const BILLING_PLUGIN_WAIT_TIMEOUT_MS = 5000
const BILLING_PLUGIN_WAIT_INTERVAL_MS = 100
const PREMIUM_BILLING_LOG_PREFIX = '[PremiumBilling]'

export class BillingService {
  private isInitialized = false
  private initializationPromise: Promise<void> | null = null
  private billingStore: BillingStore | null = null
  private billingNamespace: BillingNamespace | null = null
  private isApprovalListenerRegistered = false
  private registeredProducts = new Set<string>()

  isAvailable(): boolean {
    if (!Capacitor.isNativePlatform()) {
      return false
    }

    const platform =
      typeof Capacitor.getPlatform === 'function'
        ? Capacitor.getPlatform()
        : 'android'

    return platform === 'android'
  }

  async initialize(productId?: string): Promise<void> {
    if (!this.isAvailable()) {
      return
    }

    if (this.isInitialized) {
      if (productId) {
        this.registerProduct(productId)
      }
      return
    }

    if (this.initializationPromise) {
      await this.initializationPromise
      if (productId) {
        this.registerProduct(productId)
      }
      return
    }

    this.initializationPromise = this.performInitialization(productId)
    try {
      await this.initializationPromise
    } finally {
      this.initializationPromise = null
    }
  }

  async getPurchaseReadiness(
    productId: string,
  ): Promise<BillingReadinessResult> {
    return this.buildReadiness(productId, true)
  }

  async getProductDetails(productId: string): Promise<ProductDetails | null> {
    if (!this.isAvailable()) {
      return null
    }

    await this.initialize(productId)
    if (!this.isInitialized) {
      return null
    }

    const product = await this.getProduct(productId)
    if (!product) {
      return null
    }

    const priceLabel = this.getPriceLabel(product)
    if (!priceLabel) {
      return null
    }

    return {
      productId,
      priceLabel,
    }
  }

  async purchase(productId: string): Promise<PurchaseResult> {
    const readiness = await this.getPurchaseReadiness(productId)
    this.logReadiness(productId, readiness)

    if (!readiness.isReadyToPurchase) {
      return {
        status: PurchaseStatus.Error,
        message: readiness.message ?? 'purchase_failed',
        code: readiness.code,
        rawMessage: readiness.rawMessage,
      }
    }

    const product = await this.getProduct(productId)
    if (!product) {
      return {
        status: PurchaseStatus.Error,
        message: 'product_unavailable',
      }
    }

    const offer = this.getDefaultOffer(product)
    if (!offer) {
      return {
        status: PurchaseStatus.Error,
        message: 'offer_unavailable',
      }
    }

    try {
      const orderError = await offer.order()
      if (orderError) {
        const errorPayload = this.buildErrorPayload(
          orderError,
          'purchase_failed',
        )
        if (this.isCancelledError(orderError)) {
          return {
            status: PurchaseStatus.Cancelled,
            code: errorPayload.code,
            rawMessage: errorPayload.rawMessage,
          }
        }

        return {
          status: PurchaseStatus.Error,
          ...errorPayload,
        }
      }

      await this.hasActiveEntitlement(productId)

      return {
        status: PurchaseStatus.Purchased,
      }
    } catch (error) {
      const errorPayload = this.buildErrorPayload(error, 'purchase_failed')
      if (this.isCancelledError(error)) {
        return {
          status: PurchaseStatus.Cancelled,
          code: errorPayload.code,
          rawMessage: errorPayload.rawMessage,
        }
      }

      console.error(`${PREMIUM_BILLING_LOG_PREFIX} purchase failed:`, error)
      return {
        status: PurchaseStatus.Error,
        ...errorPayload,
      }
    }
  }

  async restorePurchases(productId: string): Promise<RestoreResult> {
    const readiness = await this.buildReadiness(productId, false)
    if (!readiness.storeInitialized) {
      return {
        restored: false,
        message: readiness.message ?? 'restore_failed',
        code: readiness.code,
        rawMessage: readiness.rawMessage,
      }
    }

    const store = this.getStore()
    if (!store) {
      return {
        restored: false,
        message: 'billing_unavailable',
      }
    }

    try {
      const restoreError = await store.restorePurchases()
      if (restoreError) {
        return {
          restored: false,
          ...this.buildErrorPayload(restoreError, 'restore_failed'),
        }
      }

      const isActive = await this.hasActiveEntitlement(productId)
      return {
        restored: isActive,
        message: isActive ? undefined : 'not_found',
      }
    } catch (error) {
      console.error(
        `${PREMIUM_BILLING_LOG_PREFIX} restorePurchases failed:`,
        error,
      )
      return {
        restored: false,
        ...this.buildErrorPayload(error, 'restore_failed'),
      }
    }
  }

  async hasActiveEntitlement(productId: string): Promise<boolean> {
    if (!this.isAvailable()) {
      return false
    }

    await this.initialize(productId)
    if (!this.isInitialized) {
      return false
    }

    const store = this.getStore()
    if (!store) {
      return false
    }

    const platform = this.billingNamespace?.Platform.GOOGLE_PLAY
    if (!platform) {
      return false
    }

    try {
      await store.update()
      return store.owned({ id: productId, platform }) || store.owned(productId)
    } catch (error) {
      console.error(
        `${PREMIUM_BILLING_LOG_PREFIX} hasActiveEntitlement failed:`,
        error,
      )
      return false
    }
  }

  private async buildReadiness(
    productId: string,
    requireOffer: boolean,
  ): Promise<BillingReadinessResult> {
    const hasNativeAndroid = this.isAvailable()
    if (!hasNativeAndroid) {
      return {
        isNativeAndroid: false,
        hasCdvPurchaseNamespace: false,
        storeInitialized: false,
        productLoaded: false,
        hasOffer: false,
        isReadyToPurchase: false,
        message: 'billing_unavailable',
      }
    }

    await this.initialize(productId)

    const namespace = this.billingNamespace ?? this.getBillingNamespace()
    const hasNamespace = namespace !== null
    const storeInitialized = this.isInitialized && this.billingStore !== null

    if (!hasNamespace) {
      return {
        isNativeAndroid: true,
        hasCdvPurchaseNamespace: false,
        storeInitialized: false,
        productLoaded: false,
        hasOffer: false,
        isReadyToPurchase: false,
        message: 'billing_plugin_unavailable',
      }
    }

    if (!storeInitialized) {
      return {
        isNativeAndroid: true,
        hasCdvPurchaseNamespace: true,
        storeInitialized: false,
        productLoaded: false,
        hasOffer: false,
        isReadyToPurchase: false,
        message: 'billing_setup_failed',
      }
    }

    if (!requireOffer) {
      return {
        isNativeAndroid: true,
        hasCdvPurchaseNamespace: true,
        storeInitialized: true,
        productLoaded: true,
        hasOffer: true,
        isReadyToPurchase: true,
      }
    }

    const product = await this.getProduct(productId)
    if (!product) {
      return {
        isNativeAndroid: true,
        hasCdvPurchaseNamespace: true,
        storeInitialized: true,
        productLoaded: false,
        hasOffer: false,
        isReadyToPurchase: false,
        message: 'product_unavailable',
      }
    }

    const offer = this.getDefaultOffer(product)
    if (!offer) {
      return {
        isNativeAndroid: true,
        hasCdvPurchaseNamespace: true,
        storeInitialized: true,
        productLoaded: true,
        hasOffer: false,
        isReadyToPurchase: false,
        message: 'offer_unavailable',
      }
    }

    return {
      isNativeAndroid: true,
      hasCdvPurchaseNamespace: true,
      storeInitialized: true,
      productLoaded: true,
      hasOffer: true,
      isReadyToPurchase: true,
    }
  }

  private async performInitialization(productId?: string): Promise<void> {
    const billingNamespace = await this.waitForBillingNamespace()
    if (!billingNamespace) {
      console.error(
        `${PREMIUM_BILLING_LOG_PREFIX} CdvPurchase namespace is unavailable`,
      )
      return
    }

    this.billingNamespace = billingNamespace
    this.billingStore = billingNamespace.store

    if (!this.billingStore) {
      console.error(
        `${PREMIUM_BILLING_LOG_PREFIX} CdvPurchase store is unavailable`,
      )
      return
    }

    if (productId) {
      this.registerProduct(productId)
    }
    this.registerApprovalListener()

    try {
      const errors = await this.billingStore.initialize([
        billingNamespace.Platform.GOOGLE_PLAY,
      ])
      const hasSetupError = errors.some(
        (error) => error.code === billingNamespace.ErrorCode.SETUP,
      )

      if (hasSetupError) {
        console.error(
          `${PREMIUM_BILLING_LOG_PREFIX} initialize failed with setup error:`,
          errors,
        )
        return
      }

      this.isInitialized = true
      if (errors.length > 0) {
        console.warn(
          `${PREMIUM_BILLING_LOG_PREFIX} initialize completed with warnings:`,
          errors,
        )
      }
    } catch (error) {
      console.error(`${PREMIUM_BILLING_LOG_PREFIX} initialize failed:`, error)
    }
  }

  private registerProduct(productId: string): void {
    if (
      !this.billingStore ||
      !this.billingNamespace ||
      this.registeredProducts.has(productId)
    ) {
      return
    }

    this.billingStore.register({
      id: productId,
      type: this.billingNamespace.ProductType.NON_CONSUMABLE,
      platform: this.billingNamespace.Platform.GOOGLE_PLAY,
    })
    this.registeredProducts.add(productId)
  }

  private registerApprovalListener(): void {
    if (!this.billingStore || this.isApprovalListenerRegistered) {
      return
    }

    this.billingStore.when().approved((transaction) => {
      try {
        const finished = transaction.finish()
        if (finished instanceof Promise) {
          finished.catch((error) => {
            console.error(
              `${PREMIUM_BILLING_LOG_PREFIX} transaction finish failed:`,
              error,
            )
          })
        }
      } catch (error) {
        console.error(
          `${PREMIUM_BILLING_LOG_PREFIX} transaction finish failed:`,
          error,
        )
      }
    })

    this.isApprovalListenerRegistered = true
  }

  private getStore(): BillingStore | null {
    if (!this.isInitialized || !this.billingStore) {
      return null
    }

    return this.billingStore
  }

  private async getProduct(productId: string): Promise<BillingProduct | null> {
    const store = this.getStore()
    const platform = this.billingNamespace?.Platform.GOOGLE_PLAY
    if (!store || !platform) {
      return null
    }

    let product = store.get(productId, platform) ?? store.get(productId)
    if (product) {
      return product
    }

    try {
      await store.update()
      product = store.get(productId, platform) ?? store.get(productId)
      return product ?? null
    } catch (error) {
      console.error(`${PREMIUM_BILLING_LOG_PREFIX} getProduct failed:`, error)
      return null
    }
  }

  private getDefaultOffer(product: BillingProduct): BillingOffer | null {
    const offerFromGetter =
      typeof product.getOffer === 'function' ? product.getOffer() : undefined
    return offerFromGetter ?? product.offers[0] ?? null
  }

  private getPriceLabel(product: BillingProduct): string | null {
    const directPrice = product.pricing?.price
    if (typeof directPrice === 'string' && directPrice.trim().length > 0) {
      return directPrice
    }

    const phasePrice = product.offers[0]?.pricingPhases?.[0]?.price
    if (typeof phasePrice === 'string' && phasePrice.trim().length > 0) {
      return phasePrice
    }

    return null
  }

  private logReadiness(
    productId: string,
    readiness: BillingReadinessResult,
  ): void {
    console.info(
      `${PREMIUM_BILLING_LOG_PREFIX} purchase readiness for ${productId}:`,
      readiness,
    )
  }

  private async waitForBillingNamespace(): Promise<BillingNamespace | null> {
    const directNamespace = this.getBillingNamespace()
    if (directNamespace) {
      return directNamespace
    }

    const startedAt = Date.now()
    while (Date.now() - startedAt < BILLING_PLUGIN_WAIT_TIMEOUT_MS) {
      await this.delay(BILLING_PLUGIN_WAIT_INTERVAL_MS)
      const namespace = this.getBillingNamespace()
      if (namespace) {
        return namespace
      }
    }

    return null
  }

  private getBillingNamespace(): BillingNamespace | null {
    const globalObject = globalThis as typeof globalThis & {
      CdvPurchase?: BillingNamespace
    }

    return globalObject.CdvPurchase ?? null
  }

  private delay(timeoutMs: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, timeoutMs)
    })
  }

  private isBillingError(error: unknown): error is BillingError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      'code' in error
    )
  }

  private isCancelledError(error: unknown): boolean {
    if (
      this.isBillingError(error) &&
      this.billingNamespace &&
      error.code === this.billingNamespace.ErrorCode.PAYMENT_CANCELLED
    ) {
      return true
    }

    const message = this.getErrorMessage(error).toLowerCase()
    return message.includes('cancel') || message.includes('canceled')
  }

  private buildErrorPayload(
    error: unknown,
    fallbackMessage: string,
  ): {
    message: string
    code?: string | number
    rawMessage?: string
  } {
    const rawMessage = this.getErrorMessage(error)
    const code = this.getErrorCode(error)

    return {
      message: this.mapErrorMessage(error, fallbackMessage),
      code,
      rawMessage: rawMessage === 'unknown_error' ? undefined : rawMessage,
    }
  }

  private mapErrorMessage(error: unknown, fallbackMessage: string): string {
    if (this.isBillingError(error) && this.billingNamespace) {
      if (error.code === this.billingNamespace.ErrorCode.SETUP) {
        return 'billing_setup_failed'
      }
    }

    const rawMessage = this.getErrorMessage(error).toLowerCase()
    if (rawMessage.includes('network') || rawMessage.includes('connect')) {
      return 'network_error'
    }

    if (
      rawMessage.includes('product') ||
      rawMessage.includes('sku') ||
      rawMessage.includes('item')
    ) {
      return 'product_unavailable'
    }

    if (rawMessage.includes('offer')) {
      return 'offer_unavailable'
    }

    return fallbackMessage
  }

  private getErrorCode(error: unknown): string | number | undefined {
    if (this.isBillingError(error)) {
      return error.code
    }

    if (typeof error === 'object' && error !== null && 'code' in error) {
      const potentialCode = error.code
      if (
        typeof potentialCode === 'string' ||
        typeof potentialCode === 'number'
      ) {
        return potentialCode
      }
    }

    return undefined
  }

  private getErrorMessage(error: unknown): string {
    if (this.isBillingError(error)) {
      return error.message
    }

    if (error instanceof Error) {
      return error.message
    }

    if (typeof error === 'string') {
      return error
    }

    return 'unknown_error'
  }
}

export const billingService = new BillingService()
