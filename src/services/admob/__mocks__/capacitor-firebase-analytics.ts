export const ConsentStatus = {
  Granted: 'GRANTED',
  Denied: 'DENIED',
} as const

export const ConsentType = {
  AnalyticsStorage: 'ANALYTICS_STORAGE',
  AdStorage: 'AD_STORAGE',
  AdUserData: 'AD_USER_DATA',
  AdPersonalization: 'AD_PERSONALIZATION',
} as const

export const FirebaseAnalytics = {
  logEvent: () => Promise.resolve(),
  setConsent: () => Promise.resolve(),
  resetAnalyticsData: () => Promise.resolve(),
}

export default {}
