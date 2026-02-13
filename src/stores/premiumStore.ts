import { acceptHMRUpdate, defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { BILLING_CONFIG } from 'src/services/billing/billingConfig'
import { billingService } from 'src/services/billing/BillingService'
import {
  PremiumStatus,
  PurchaseStatus,
  type BillingReadinessResult,
  type PurchaseResult,
  type RestoreResult,
} from 'src/services/billing/types'

const getTodayDate = () => new Date().toISOString().split('T')[0]

export const usePremiumStore = defineStore('premiumStore', {
  state: () => ({
    isPremiumActive: useLocalStorage('premium/isPremiumActive', false),
    priceLabel: useLocalStorage<string | null>(
      'premium/priceLabel',
      BILLING_CONFIG.defaultPriceLabel,
    ),
    status: PremiumStatus.Idle,
    lastError: null as string | null,
    lastBillingErrorCode: null as string | number | null,
    lastBillingRawMessage: null as string | null,
    lastSyncDate: useLocalStorage<string | null>('premium/lastSyncDate', null),
    isBillingAvailable: billingService.isAvailable(),
    billingReadiness: undefined as BillingReadinessResult | undefined,
  }),
  getters: {
    premiumPriceLabel(state): string {
      return state.priceLabel ?? BILLING_CONFIG.defaultPriceLabel
    },
  },
  actions: {
    async initializePremium() {
      this.clearError()
      this.isBillingAvailable = billingService.isAvailable()

      if (!this.isBillingAvailable) {
        this.status = this.isPremiumActive
          ? PremiumStatus.Active
          : PremiumStatus.Inactive
        this.billingReadiness = undefined
        return
      }

      this.status = PremiumStatus.Loading
      await billingService.initialize(BILLING_CONFIG.premiumProductId)
      await this.loadProductPrice()
      await this.syncEntitlement()
      await this.refreshBillingReadiness()
    },
    async loadProductPrice() {
      if (!this.isBillingAvailable) {
        return
      }

      const productDetails = await billingService.getProductDetails(
        BILLING_CONFIG.premiumProductId,
      )

      if (!productDetails) {
        this.lastError = 'price_unavailable'
        return
      }

      this.priceLabel = productDetails.priceLabel
      this.lastError = null
    },
    async syncEntitlement() {
      if (!this.isBillingAvailable) {
        this.status = this.isPremiumActive
          ? PremiumStatus.Active
          : PremiumStatus.Inactive
        this.billingReadiness = undefined
        return
      }

      this.status = PremiumStatus.Loading
      const isActive = await billingService.hasActiveEntitlement(
        BILLING_CONFIG.premiumProductId,
      )

      this.isPremiumActive = isActive
      this.lastSyncDate = getTodayDate()
      this.status = isActive ? PremiumStatus.Active : PremiumStatus.Inactive
      this.lastError = null
      await this.refreshBillingReadiness()
    },
    async refreshBillingReadiness() {
      if (!this.isBillingAvailable) {
        this.billingReadiness = undefined
        return undefined
      }

      const readiness = await billingService.getPurchaseReadiness(
        BILLING_CONFIG.premiumProductId,
      )
      this.billingReadiness = readiness
      return readiness
    },
    async buyPremium(): Promise<PurchaseResult> {
      if (!this.isBillingAvailable) {
        const result = {
          status: PurchaseStatus.Error,
          message: 'billing_unavailable',
        } as const
        this.setError(result.message)
        return result
      }

      await this.refreshBillingReadiness()
      this.status = PremiumStatus.Loading
      const result = await billingService.purchase(
        BILLING_CONFIG.premiumProductId,
      )

      if (result.status === PurchaseStatus.Purchased) {
        this.isPremiumActive = true
        this.lastSyncDate = getTodayDate()
        this.status = PremiumStatus.Active
        this.lastError = null
        this.clearBillingError()
        await this.refreshBillingReadiness()
        return result
      }

      if (result.status === PurchaseStatus.Cancelled) {
        this.status = this.isPremiumActive
          ? PremiumStatus.Active
          : PremiumStatus.Inactive
        this.lastError = null
        this.clearBillingError()
        return result
      }

      this.setError(
        result.message ?? 'purchase_failed',
        result.code,
        result.rawMessage,
      )
      return result
    },
    async restorePremium(): Promise<RestoreResult> {
      if (!this.isBillingAvailable) {
        const result = {
          restored: false,
          message: 'billing_unavailable',
        } as const
        this.setError(result.message)
        return result
      }

      this.status = PremiumStatus.Loading
      const result = await billingService.restorePurchases(
        BILLING_CONFIG.premiumProductId,
      )

      if (result.restored) {
        this.isPremiumActive = true
        this.lastSyncDate = getTodayDate()
        this.status = PremiumStatus.Active
        this.lastError = null
        this.clearBillingError()
        await this.refreshBillingReadiness()
      } else {
        this.isPremiumActive = false
        this.status = PremiumStatus.Inactive
        this.lastError =
          result.message === 'not_found'
            ? null
            : (result.message ?? 'restore_failed')
        if (result.message !== 'not_found') {
          this.lastBillingErrorCode = result.code ?? null
          this.lastBillingRawMessage = result.rawMessage ?? null
        } else {
          this.clearBillingError()
        }
      }

      return result
    },
    clearError() {
      this.lastError = null
      this.clearBillingError()
    },
    setError(message: string, code?: string | number, rawMessage?: string) {
      this.lastError = message
      this.lastBillingErrorCode = code ?? null
      this.lastBillingRawMessage = rawMessage ?? null
      this.status = PremiumStatus.Error
    },
    clearBillingError() {
      this.lastBillingErrorCode = null
      this.lastBillingRawMessage = null
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePremiumStore, import.meta.hot))
}
