export enum AnalyticsEventName {
  CalculationSubmit = 'calculation_submit',
  PremiumOfferOpen = 'premium_offer_open',
  PremiumPurchaseSuccess = 'premium_purchase_success',
  PremiumPurchaseCancel = 'premium_purchase_cancel',
  PremiumPurchaseError = 'premium_purchase_error',
  SupportModalOpen = 'support_modal_open',
}

export type AnalyticsCurrency = 'PLN' | 'EUR' | 'USD' | 'GBP'

export interface AnalyticsEventParamsMap {
  [AnalyticsEventName.CalculationSubmit]: {
    calculator_slug: string
  }
  [AnalyticsEventName.PremiumOfferOpen]: Record<string, never>
  [AnalyticsEventName.PremiumPurchaseSuccess]: {
    value: number
    currency: AnalyticsCurrency
  }
  [AnalyticsEventName.PremiumPurchaseCancel]: Record<string, never>
  [AnalyticsEventName.PremiumPurchaseError]: {
    error_code: string
  }
  [AnalyticsEventName.SupportModalOpen]: {
    support_target: 'author' | 'project'
  }
}

export type AnalyticsEventParams = AnalyticsEventParamsMap[AnalyticsEventName]
