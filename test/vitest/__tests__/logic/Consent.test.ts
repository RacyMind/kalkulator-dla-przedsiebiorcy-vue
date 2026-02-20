import { beforeEach, describe, expect, it, vi } from 'vitest'

type ConsentModule = typeof import('src/logic/consent')

const importConsentModule = async (
  nativePlatform: boolean,
): Promise<{
  consent: ConsentModule
  firebaseSetConsent: ReturnType<typeof vi.fn>
  firebaseResetAnalyticsData: ReturnType<typeof vi.fn>
}> => {
  vi.resetModules()

  const firebaseSetConsent = vi.fn().mockResolvedValue(undefined)
  const firebaseResetAnalyticsData = vi.fn().mockResolvedValue(undefined)

  vi.doMock('@capacitor/core', () => ({
    Capacitor: {
      isNativePlatform: () => nativePlatform,
    },
  }))

  vi.doMock('@capacitor-firebase/analytics', () => ({
    ConsentStatus: {
      Granted: 'GRANTED',
      Denied: 'DENIED',
    },
    ConsentType: {
      AdPersonalization: 'AD_PERSONALIZATION',
      AdStorage: 'AD_STORAGE',
      AdUserData: 'AD_USER_DATA',
      AnalyticsStorage: 'ANALYTICS_STORAGE',
      FunctionalityStorage: 'FUNCTIONALITY_STORAGE',
      PersonalizationStorage: 'PERSONALIZATION_STORAGE',
    },
    FirebaseAnalytics: {
      setConsent: firebaseSetConsent,
      resetAnalyticsData: firebaseResetAnalyticsData,
    },
  }))

  const consent = await import('src/logic/consent')

  return {
    consent,
    firebaseSetConsent,
    firebaseResetAnalyticsData,
  }
}

describe('consent logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    delete (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
  })

  it('stores granted analytics consent and updates web consent mode', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    const { consent, firebaseSetConsent } = await importConsentModule(false)

    await consent.acceptAnalytics('settings')

    expect(consent.hasAnalyticsConsent()).toBe(true)
    expect(firebaseSetConsent).not.toHaveBeenCalled()
    expect(gtagSpy).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'granted',
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
    })

    const storedConsent = localStorage.getItem(consent.consentStorageKey)
    expect(storedConsent).toBeTruthy()
    const parsedConsent = JSON.parse(storedConsent || '{}') as {
      analyticsStorage?: string
      source?: string
      updatedAt?: string
    }
    expect(parsedConsent.analyticsStorage).toBe('granted')
    expect(parsedConsent.source).toBe('settings')
    expect(typeof parsedConsent.updatedAt).toBe('string')
  })

  it('stores denied analytics consent, removes cid and updates web consent mode', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    localStorage.cid = 'test-cid'
    const { consent } = await importConsentModule(false)

    await consent.rejectAnalytics('settings')

    expect(consent.hasAnalyticsConsent()).toBe(false)
    expect(localStorage.getItem('cid')).toBe(null)
    expect(gtagSpy).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'denied',
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
    })
  })

  it('applies denied consent by default when user has not made a decision', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    const { consent } = await importConsentModule(false)

    await consent.applyStoredConsent()

    expect(consent.hasConsentDecision()).toBe(false)
    expect(gtagSpy).toHaveBeenCalledWith('consent', 'update', {
      analytics_storage: 'denied',
      ad_personalization: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
    })
  })

  it('applies native firebase consent and resets analytics data after rejection', async () => {
    const { consent, firebaseSetConsent, firebaseResetAnalyticsData } =
      await importConsentModule(true)

    await consent.acceptAnalytics('banner')
    await consent.rejectAnalytics('settings')

    expect(firebaseSetConsent).toHaveBeenCalledWith({
      type: 'ANALYTICS_STORAGE',
      status: 'GRANTED',
    })
    expect(firebaseSetConsent).toHaveBeenCalledWith({
      type: 'ANALYTICS_STORAGE',
      status: 'DENIED',
    })
    expect(firebaseSetConsent).toHaveBeenCalledWith({
      type: 'AD_STORAGE',
      status: 'DENIED',
    })
    expect(firebaseSetConsent).toHaveBeenCalledWith({
      type: 'AD_USER_DATA',
      status: 'DENIED',
    })
    expect(firebaseSetConsent).toHaveBeenCalledWith({
      type: 'AD_PERSONALIZATION',
      status: 'DENIED',
    })
    expect(firebaseResetAnalyticsData).toHaveBeenCalledTimes(1)
  })
})
