export enum PremiumStatus {
  Idle = 'idle',
  Loading = 'loading',
  Active = 'active',
  Inactive = 'inactive',
  Error = 'error',
}

export enum PurchaseStatus {
  Purchased = 'purchased',
  Cancelled = 'cancelled',
  Error = 'error',
}

export interface ProductDetails {
  productId: string
  priceLabel: string
}

export interface PurchaseResult {
  status: PurchaseStatus
  message?: string
  code?: string | number
  rawMessage?: string
}

export interface RestoreResult {
  restored: boolean
  message?: string
  code?: string | number
  rawMessage?: string
}

export interface BillingReadinessResult {
  isNativeAndroid: boolean
  hasCdvPurchaseNamespace: boolean
  storeInitialized: boolean
  productLoaded: boolean
  hasOffer: boolean
  isReadyToPurchase: boolean
  message?: string
  code?: string | number
  rawMessage?: string
}
