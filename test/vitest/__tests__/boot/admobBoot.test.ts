import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { Router } from 'vue-router'
import { AdMob } from '@capacitor-community/admob'
import admobBoot, { adMobService } from 'boot/admob'
import { usePremiumStore } from 'stores/premiumStore'

type AfterEachCallback = (to: { path: string }) => void

describe('admob boot', () => {
  let afterEachCallback: AfterEachCallback | undefined
  let router: Router

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    document.body.style.marginBottom = ''
    afterEachCallback = undefined
    vi.restoreAllMocks()

    router = {
      afterEach: vi.fn((callback: AfterEachCallback) => {
        afterEachCallback = callback
      }),
    } as unknown as Router
  })

  it('does not initialize AdMob when premium is active', () => {
    const premiumStore = usePremiumStore()
    premiumStore.isPremiumActive = true

    const isNativeSpy = vi.spyOn(adMobService, 'isNative').mockReturnValue(true)
    const initializeSpy = vi
      .spyOn(adMobService, 'initialize')
      .mockResolvedValue(undefined)
    const addListenerSpy = vi
      .spyOn(AdMob, 'addListener')
      .mockResolvedValue({ remove: vi.fn() })

    admobBoot({ router })

    expect(isNativeSpy).toHaveBeenCalledTimes(1)
    expect(initializeSpy).not.toHaveBeenCalled()
    expect(addListenerSpy).not.toHaveBeenCalled()
    expect(router.afterEach).not.toHaveBeenCalled()
    expect(document.body.style.marginBottom).toBe('')
  })

  it('initializes AdMob and reacts to route changes when premium is inactive', () => {
    const premiumStore = usePremiumStore()
    premiumStore.isPremiumActive = false

    vi.spyOn(adMobService, 'isNative').mockReturnValue(true)
    const initializeSpy = vi
      .spyOn(adMobService, 'initialize')
      .mockResolvedValue(undefined)
    const showAdSpy = vi
      .spyOn(adMobService, 'showAd')
      .mockResolvedValue(undefined)
    const hideAdSpy = vi
      .spyOn(adMobService, 'hideAd')
      .mockResolvedValue(undefined)
    vi.spyOn(adMobService, 'getBannerHeight').mockReturnValue(50)
    const addListenerSpy = vi
      .spyOn(AdMob, 'addListener')
      .mockResolvedValue({ remove: vi.fn() })

    admobBoot({ router })

    expect(initializeSpy).toHaveBeenCalledTimes(1)
    expect(addListenerSpy).toHaveBeenCalledWith(
      'bannerAdSizeChanged',
      expect.any(Function),
    )
    expect(router.afterEach).toHaveBeenCalledTimes(1)
    expect(afterEachCallback).toBeTypeOf('function')

    afterEachCallback?.({ path: '/umowa-o-prace' })

    expect(showAdSpy).toHaveBeenCalledTimes(1)
    expect(hideAdSpy).not.toHaveBeenCalled()
    expect(document.body.style.marginBottom).toBe('50px')

    afterEachCallback?.({ path: '/kontakt' })

    expect(hideAdSpy).toHaveBeenCalledTimes(1)
    expect(document.body.style.marginBottom).toBe('')
  })

  it('is no-op on web platform', () => {
    vi.spyOn(adMobService, 'isNative').mockReturnValue(false)
    const initializeSpy = vi
      .spyOn(adMobService, 'initialize')
      .mockResolvedValue(undefined)
    const addListenerSpy = vi
      .spyOn(AdMob, 'addListener')
      .mockResolvedValue({ remove: vi.fn() })

    admobBoot({ router })

    expect(initializeSpy).not.toHaveBeenCalled()
    expect(addListenerSpy).not.toHaveBeenCalled()
    expect(router.afterEach).not.toHaveBeenCalled()
  })
})
