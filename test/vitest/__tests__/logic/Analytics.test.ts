import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

type AnalyticsModule = typeof import('logic/analytics')

const originalDevValue = process.env.DEV

const importAnalytics = async (
  nativePlatform: boolean,
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

  it('sends custom event to GA4 on web when gtag is available', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    localStorage.cid = 'web-cid'

    const { analytics, firebaseLogEvent } = await importAnalytics(false)
    analytics.logEvent('Modal', 'Open', 'Wsparcie autora', 3)

    expect(firebaseLogEvent).not.toHaveBeenCalled()
    expect(gtagSpy).toHaveBeenCalledWith('event', 'Open', {
      cid: 'web-cid',
      event_category: 'Modal',
      event_label: 'Wsparcie autora',
      value: 3,
    })
  })

  it('sends page view to GA4 on web when gtag is available', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    localStorage.cid = 'page-cid'

    const { analytics, firebaseLogEvent } = await importAnalytics(false)
    analytics.logPage('app/umowa-o-prace')

    expect(firebaseLogEvent).not.toHaveBeenCalled()
    expect(gtagSpy).toHaveBeenCalledWith('event', 'page_view', {
      cid: 'page-cid',
      page_path: 'app/umowa-o-prace',
    })
  })

  it('does not throw on web when gtag is unavailable', async () => {
    const { analytics, firebaseLogEvent } = await importAnalytics(false)

    expect(() => analytics.logEvent('Modal', 'Open', 'Wsparcie')).not.toThrow()
    expect(() => analytics.logPage('app/porownywarka-b2b')).not.toThrow()
    expect(firebaseLogEvent).not.toHaveBeenCalled()
  })

  it('uses Firebase analytics on native platform', async () => {
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy
    localStorage.cid = 'native-cid'

    const { analytics, firebaseLogEvent } = await importAnalytics(true)
    analytics.logEvent('Modal', 'Open', 'Wsparcie')
    analytics.logPage('app/kalkulator-ike')

    expect(gtagSpy).not.toHaveBeenCalled()
    expect(firebaseLogEvent).toHaveBeenNthCalledWith(1, {
      name: 'Open',
      params: {
        category: 'Modal',
        cid: 'native-cid',
        label: 'Wsparcie',
        value: null,
      },
    })
    expect(firebaseLogEvent).toHaveBeenNthCalledWith(2, {
      name: 'screen_view',
      params: {
        cid: 'native-cid',
        screen_name: 'app/kalkulator-ike',
      },
    })
  })

  it('does not emit analytics in development mode', async () => {
    ;(process.env as Record<string, string | undefined>).DEV = 'true'
    const gtagSpy = vi.fn()
    ;(window as Window & { gtag?: (...args: unknown[]) => void }).gtag = gtagSpy

    const webAnalytics = await importAnalytics(false)
    webAnalytics.analytics.logEvent('Modal', 'Open', 'Wsparcie autora')
    webAnalytics.analytics.logPage('app/umowa-zlecenie')

    const nativeAnalytics = await importAnalytics(true)
    nativeAnalytics.analytics.logEvent('Modal', 'Open', 'Wsparcie autora')
    nativeAnalytics.analytics.logPage('app/umowa-zlecenie')

    expect(gtagSpy).not.toHaveBeenCalled()
    expect(webAnalytics.firebaseLogEvent).not.toHaveBeenCalled()
    expect(nativeAnalytics.firebaseLogEvent).not.toHaveBeenCalled()
  })
})
