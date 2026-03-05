import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { AnalyticsEventName } from 'src/types/Analytics'

type AnalyticsModule = typeof import('logic/analytics')

const originalDevValue = process.env.DEV

const importAnalytics = async (
  nativePlatform: boolean,
  analyticsConsent: boolean,
): Promise<{
  analytics: AnalyticsModule['default']
  firebaseLogEvent: ReturnType<typeof vi.fn>
}> => {
  vi.resetModules()
  const firebaseLogEvent = vi.fn()

  vi.doMock('@capacitor/core', () => ({
    Capacitor: {
      getPlatform: () => (nativePlatform ? 'android' : 'web'),
      isNativePlatform: () => nativePlatform,
    },
  }))

  vi.doMock('@capacitor-firebase/analytics', () => ({
    FirebaseAnalytics: {
      logEvent: firebaseLogEvent,
    },
  }))

  vi.doMock('src/logic/consent', () => ({
    hasAnalyticsConsent: () => analyticsConsent,
  }))

  const analyticsModule = await import('logic/analytics')

  return {
    analytics: analyticsModule.default,
    firebaseLogEvent,
  }
}

describe('analytics logic', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    delete (window as Window & { gtag?: (...args: unknown[]) => void }).gtag
    delete (process.env as Record<string, string | undefined>).DEV
  })

  afterEach(() => {
    if (originalDevValue) {
      ;(process.env as Record<string, string | undefined>).DEV =
        originalDevValue
    } else {
      delete (process.env as Record<string, string | undefined>).DEV
    }
  })

  it('sends typed custom event to GA4 on web when consent is granted', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    localStorage.cid = 'web-cid'

    const { analytics, firebaseLogEvent } = await importAnalytics(false, true)
    analytics.logEvent(AnalyticsEventName.CalculationSubmit, {
      calculator_slug: 'samozatrudnienie',
    })

    expect(firebaseLogEvent).not.toHaveBeenCalled()
    expect(gtagSpy).toHaveBeenCalledWith('event', 'calculation_submit', {
      calculator_slug: 'samozatrudnienie',
      kf_cid: 'web-cid',
    })
  })

  it('maps legacy signature to normalized GA4 event', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    localStorage.cid = 'legacy-cid'

    const { analytics } = await importAnalytics(false, true)
    analytics.logEvent('Modal', 'Open', 'Wsparcie autora', 3)

    expect(gtagSpy).toHaveBeenCalledWith('event', 'open', {
      legacy_category: 'Modal',
      legacy_label: 'Wsparcie autora',
      value: 3,
      kf_cid: 'legacy-cid',
    })
  })

  it('does not send custom event to GA4 on web when consent is denied', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy

    const { analytics, firebaseLogEvent } = await importAnalytics(false, false)
    analytics.logEvent(AnalyticsEventName.PremiumOfferOpen, {})

    expect(firebaseLogEvent).not.toHaveBeenCalled()
    expect(gtagSpy).not.toHaveBeenCalled()
  })

  it('sends page view to GA4 on web when consent is granted', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    localStorage.cid = 'page-cid'

    const { analytics, firebaseLogEvent } = await importAnalytics(false, true)
    analytics.logPage('app/umowa-o-prace')

    expect(firebaseLogEvent).not.toHaveBeenCalled()
    expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', {
      kf_cid: 'page-cid',
      page_path: 'app/umowa-o-prace',
    })
  })

  it('does not throw on web when gtag is unavailable', async () => {
    const { analytics, firebaseLogEvent } = await importAnalytics(false, true)

    expect(() =>
      analytics.logEvent(AnalyticsEventName.SupportModalOpen, {
        support_target: 'author',
      }),
    ).not.toThrow()
    expect(() => analytics.logPage('app/porownywarka-b2b')).not.toThrow()
    expect(firebaseLogEvent).not.toHaveBeenCalled()
  })

  it('uses Firebase analytics on native platform when consent is granted', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    localStorage.cid = 'native-cid'

    const { analytics, firebaseLogEvent } = await importAnalytics(true, true)
    analytics.logEvent(AnalyticsEventName.PremiumPurchaseSuccess, {
      value: 29.99,
      currency: 'PLN',
    })
    analytics.logPage('app/kalkulator-ike')

    expect(gtagSpy).not.toHaveBeenCalled()
    expect(firebaseLogEvent).toHaveBeenNthCalledWith(1, {
      name: 'premium_purchase_success',
      params: {
        value: 29.99,
        currency: 'PLN',
        kf_cid: 'native-cid',
      },
    })
    expect(firebaseLogEvent).toHaveBeenNthCalledWith(2, {
      name: 'screen_view',
      params: {
        kf_cid: 'native-cid',
        screen_name: 'app/kalkulator-ike',
      },
    })
  })

  it('does not use Firebase analytics on native platform when consent is denied', async () => {
    localStorage.cid = 'native-cid'

    const { analytics, firebaseLogEvent } = await importAnalytics(true, false)
    analytics.logEvent(AnalyticsEventName.PremiumOfferOpen, {})
    analytics.logPage('app/kalkulator-ike')

    expect(firebaseLogEvent).not.toHaveBeenCalled()
  })

  it('does not emit analytics in development mode', async () => {
    ;(process.env as Record<string, string | undefined>).DEV = 'true'
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy

    const webAnalytics = await importAnalytics(false, true)
    webAnalytics.analytics.logEvent(AnalyticsEventName.PremiumOfferOpen, {})
    webAnalytics.analytics.logPage('app/umowa-zlecenie')

    const nativeAnalytics = await importAnalytics(true, true)
    nativeAnalytics.analytics.logEvent(AnalyticsEventName.PremiumOfferOpen, {})
    nativeAnalytics.analytics.logPage('app/umowa-zlecenie')

    expect(gtagSpy).not.toHaveBeenCalled()
    expect(webAnalytics.firebaseLogEvent).not.toHaveBeenCalled()
    expect(nativeAnalytics.firebaseLogEvent).not.toHaveBeenCalled()
  })
})
