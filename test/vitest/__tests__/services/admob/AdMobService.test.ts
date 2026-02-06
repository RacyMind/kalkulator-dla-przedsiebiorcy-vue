import { beforeEach, describe, expect, it, vi } from 'vitest'

const { mockAdMob, mockCapacitor } = vi.hoisted(() => {
  const mockAdMob = {
    initialize: vi.fn().mockResolvedValue(undefined),
    showBanner: vi.fn().mockResolvedValue(undefined),
    hideBanner: vi.fn().mockResolvedValue(undefined),
    resumeBanner: vi.fn().mockResolvedValue(undefined),
    addListener: vi.fn().mockResolvedValue({ remove: vi.fn() }),
  }
  const mockCapacitor = {
    isNativePlatform: vi.fn().mockReturnValue(true),
  }
  return { mockAdMob, mockCapacitor }
})

vi.mock('@capacitor-community/admob', () => ({
  AdMob: mockAdMob,
  BannerAdPluginEvents: {
    Loaded: 'bannerAdLoaded',
    FailedToLoad: 'bannerAdFailedToLoad',
    SizeChanged: 'bannerAdSizeChanged',
  },
  BannerAdSize: {
    ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
  },
  BannerAdPosition: {
    BOTTOM_CENTER: 'BOTTOM_CENTER',
  },
}))

vi.mock('@capacitor/core', () => ({
  Capacitor: mockCapacitor,
}))

import { AdMobService } from 'services/admob/AdMobService'

describe('AdMobService', () => {
  let service: AdMobService

  beforeEach(() => {
    vi.clearAllMocks()
    mockCapacitor.isNativePlatform.mockReturnValue(true)
    service = new AdMobService()
  })

  describe('isNative()', () => {
    it('returns true on native platform', () => {
      mockCapacitor.isNativePlatform.mockReturnValue(true)
      expect(service.isNative()).toBe(true)
    })

    it('returns false on web platform', () => {
      mockCapacitor.isNativePlatform.mockReturnValue(false)
      expect(service.isNative()).toBe(false)
    })
  })

  describe('initialize()', () => {
    it('calls AdMob.initialize() exactly once on native', async () => {
      await service.initialize()

      expect(mockAdMob.initialize).toHaveBeenCalledTimes(1)
    })

    it('calls AdMob.showBanner() with correct options after init', async () => {
      await service.initialize()

      expect(mockAdMob.showBanner).toHaveBeenCalledTimes(1)
      expect(mockAdMob.showBanner).toHaveBeenCalledWith(
        expect.objectContaining({
          adId: expect.any(String),
          adSize: 'ADAPTIVE_BANNER',
          position: 'BOTTOM_CENTER',
        }),
      )
    })

    it('registers event listeners', async () => {
      await service.initialize()

      expect(mockAdMob.addListener).toHaveBeenCalledWith('bannerAdLoaded', expect.any(Function))
      expect(mockAdMob.addListener).toHaveBeenCalledWith('bannerAdFailedToLoad', expect.any(Function))
      expect(mockAdMob.addListener).toHaveBeenCalledWith('bannerAdSizeChanged', expect.any(Function))
    })

    it('does not create duplicate when called twice (idempotent)', async () => {
      await service.initialize()
      await service.initialize()

      expect(mockAdMob.initialize).toHaveBeenCalledTimes(1)
      expect(mockAdMob.showBanner).toHaveBeenCalledTimes(1)
    })

    it('is no-op on web platform', async () => {
      mockCapacitor.isNativePlatform.mockReturnValue(false)
      service = new AdMobService()

      await service.initialize()

      expect(mockAdMob.initialize).not.toHaveBeenCalled()
      expect(mockAdMob.showBanner).not.toHaveBeenCalled()
    })
  })

  describe('showAd()', () => {
    it('calls resumeBanner() when banner is loaded and hidden', async () => {
      await service.initialize()
      // Simulate banner loaded
      const loadedCallback = mockAdMob.addListener.mock.calls.find(
        (call: unknown[]) => call[0] === 'bannerAdLoaded',
      )?.[1]
      loadedCallback?.()

      await service.hideAd()
      vi.clearAllMocks()

      await service.showAd()

      expect(mockAdMob.resumeBanner).toHaveBeenCalledTimes(1)
    })

    it('is no-op when banner already visible', async () => {
      await service.initialize()
      const loadedCallback = mockAdMob.addListener.mock.calls.find(
        (call: unknown[]) => call[0] === 'bannerAdLoaded',
      )?.[1]
      loadedCallback?.()
      vi.clearAllMocks()

      await service.showAd()

      expect(mockAdMob.resumeBanner).not.toHaveBeenCalled()
    })

    it('is no-op when banner not loaded', async () => {
      await service.showAd()

      expect(mockAdMob.resumeBanner).not.toHaveBeenCalled()
    })
  })

  describe('hideAd()', () => {
    it('calls hideBanner() when banner is visible', async () => {
      await service.initialize()
      const loadedCallback = mockAdMob.addListener.mock.calls.find(
        (call: unknown[]) => call[0] === 'bannerAdLoaded',
      )?.[1]
      loadedCallback?.()
      vi.clearAllMocks()

      await service.hideAd()

      expect(mockAdMob.hideBanner).toHaveBeenCalledTimes(1)
    })

    it('is no-op when banner already hidden', async () => {
      await service.initialize()
      const loadedCallback = mockAdMob.addListener.mock.calls.find(
        (call: unknown[]) => call[0] === 'bannerAdLoaded',
      )?.[1]
      loadedCallback?.()
      await service.hideAd()
      vi.clearAllMocks()

      await service.hideAd()

      expect(mockAdMob.hideBanner).not.toHaveBeenCalled()
    })
  })

  describe('error handling', () => {
    it('FailedToLoad sets lastError and logs error', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await service.initialize()
      const failCallback = mockAdMob.addListener.mock.calls.find(
        (call: unknown[]) => call[0] === 'bannerAdFailedToLoad',
      )?.[1]
      failCallback?.({ code: 3, message: 'No fill' })

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('showAd() does not throw when banner not loaded', async () => {
      await expect(service.showAd()).resolves.not.toThrow()
    })

    it('hideAd() does not throw when banner not loaded', async () => {
      await expect(service.hideAd()).resolves.not.toThrow()
    })

    it('initialize() does not throw on SDK error', async () => {
      mockAdMob.initialize.mockRejectedValueOnce(new Error('SDK error'))
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      await expect(service.initialize()).resolves.not.toThrow()

      consoleSpy.mockRestore()
    })
  })

  describe('adConfig noAdPages', () => {
    it('contains pages that should not show ads', async () => {
      const { AD_CONFIG } = await import('services/admob/adConfig')

      expect(AD_CONFIG.noAdPages).toContain('/')
      expect(AD_CONFIG.noAdPages).toContain('/polityka-prywatnosci')
      expect(AD_CONFIG.noAdPages).toContain('/kontakt')
      expect(AD_CONFIG.noAdPages).toContain('/historia-zmian')
      expect(AD_CONFIG.noAdPages).toHaveLength(4)
    })

    it('does not contain module pages', async () => {
      const { AD_CONFIG } = await import('services/admob/adConfig')

      expect(AD_CONFIG.noAdPages).not.toContain('/samozatrudnienie')
      expect(AD_CONFIG.noAdPages).not.toContain('/umowa-o-prace')
      expect(AD_CONFIG.noAdPages).not.toContain('/faktura-vat')
    })
  })

  describe('getBannerHeight()', () => {
    it('returns 0 when banner not loaded', () => {
      expect(service.getBannerHeight()).toBe(0)
    })

    it('returns height from SizeChanged event', async () => {
      await service.initialize()
      const sizeCallback = mockAdMob.addListener.mock.calls.find(
        (call: unknown[]) => call[0] === 'bannerAdSizeChanged',
      )?.[1]
      sizeCallback?.({ width: 360, height: 50 })

      expect(service.getBannerHeight()).toBe(50)
    })
  })
})
