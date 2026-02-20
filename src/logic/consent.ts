import { Capacitor } from '@capacitor/core'
import {
  ConsentStatus,
  ConsentType,
  FirebaseAnalytics,
} from '@capacitor-firebase/analytics'
import type {
  ConsentDecision,
  ConsentSource,
  ConsentState,
} from 'src/types/Consent'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export const consentStorageKey = 'kf-consent-v1'
const defaultConsentDecision: ConsentDecision = 'denied'

const isConsentDecision = (value: unknown): value is ConsentDecision => {
  return value === 'granted' || value === 'denied'
}

const isConsentSource = (value: unknown): value is ConsentSource => {
  return value === 'banner' || value === 'settings'
}

const getStorage = (): Storage | null => {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

const hasGtag = () =>
  typeof window !== 'undefined' && typeof window.gtag === 'function'

const readStoredConsent = (): ConsentState | null => {
  const storage = getStorage()
  if (!storage) {
    return null
  }

  const rawState = storage.getItem(consentStorageKey)
  if (!rawState) {
    return null
  }

  try {
    const parsed = JSON.parse(rawState) as Partial<ConsentState>
    if (!isConsentDecision(parsed.analyticsStorage)) {
      return null
    }

    return {
      analyticsStorage: parsed.analyticsStorage,
      source: isConsentSource(parsed.source) ? parsed.source : 'settings',
      updatedAt:
        typeof parsed.updatedAt === 'string'
          ? parsed.updatedAt
          : new Date().toISOString(),
    }
  } catch {
    return null
  }
}

const saveConsentState = (state: ConsentState) => {
  const storage = getStorage()
  if (!storage) {
    return
  }

  storage.setItem(consentStorageKey, JSON.stringify(state))
}

const getNativeConsentStatus = (decision: ConsentDecision): ConsentStatus => {
  return decision === 'granted' ? ConsentStatus.Granted : ConsentStatus.Denied
}

const getWebConsentStatus = (
  decision: ConsentDecision,
): 'granted' | 'denied' => (decision === 'granted' ? 'granted' : 'denied')

export const getConsentState = (): ConsentState | null => readStoredConsent()

export const hasConsentDecision = (): boolean => getConsentState() !== null

export const hasAnalyticsConsent = (): boolean =>
  getConsentState()?.analyticsStorage === 'granted'

export const applyWebConsentMode = (decision: ConsentDecision) => {
  if (!hasGtag()) {
    return
  }

  window.gtag?.('consent', 'update', {
    analytics_storage: getWebConsentStatus(decision),
    ad_personalization: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
  })
}

export const applyNativeFirebaseConsent = async (
  decision: ConsentDecision,
  options: { resetData: boolean } = { resetData: false },
) => {
  if (!Capacitor.isNativePlatform()) {
    return
  }

  try {
    const analyticsStatus = getNativeConsentStatus(decision)

    await FirebaseAnalytics.setConsent({
      type: ConsentType.AnalyticsStorage,
      status: analyticsStatus,
    })

    await FirebaseAnalytics.setConsent({
      type: ConsentType.AdStorage,
      status: ConsentStatus.Denied,
    })

    await FirebaseAnalytics.setConsent({
      type: ConsentType.AdUserData,
      status: ConsentStatus.Denied,
    })

    await FirebaseAnalytics.setConsent({
      type: ConsentType.AdPersonalization,
      status: ConsentStatus.Denied,
    })

    if (options.resetData && decision === 'denied') {
      await FirebaseAnalytics.resetAnalyticsData()
    }
  } catch {
    /* ignore consent sync errors */
  }
}

const setConsentDecision = async (
  decision: ConsentDecision,
  source: ConsentSource,
  options: { resetData: boolean } = { resetData: false },
) => {
  const state: ConsentState = {
    analyticsStorage: decision,
    source,
    updatedAt: new Date().toISOString(),
  }

  saveConsentState(state)
  if (decision === 'denied') {
    const storage = getStorage()
    storage?.removeItem('cid')
  }
  applyWebConsentMode(decision)
  await applyNativeFirebaseConsent(decision, options)

  return state
}

export const acceptAnalytics = async (source: ConsentSource = 'banner') =>
  setConsentDecision('granted', source)

export const rejectAnalytics = async (source: ConsentSource = 'banner') =>
  setConsentDecision('denied', source, { resetData: true })

export const applyStoredConsent = async () => {
  const storedState = getConsentState()
  const decision = storedState?.analyticsStorage ?? defaultConsentDecision

  applyWebConsentMode(decision)
  await applyNativeFirebaseConsent(decision)
}
