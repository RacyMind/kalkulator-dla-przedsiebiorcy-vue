import { beforeEach, afterEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const { mockCapacitor } = vi.hoisted(() => {
  const mockCapacitor = {
    isNativePlatform: vi.fn().mockReturnValue(false),
  }

  return { mockCapacitor }
})

vi.mock('@capacitor/core', () => ({
  Capacitor: mockCapacitor,
}))

import { AdSenseService } from 'services/adsense/AdSenseService'
import { usePremiumStore } from 'stores/premiumStore'

const originalDev = process.env.DEV

describe('AdSenseService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    localStorage.clear()
    mockCapacitor.isNativePlatform.mockReturnValue(false)
    const premiumStore = usePremiumStore()
    premiumStore.isPremiumActive = false
    delete process.env.DEV
  })

  afterEach(() => {
    if (originalDev === undefined) {
      delete process.env.DEV
      return
    }

    process.env.DEV = originalDev
  })

  it('returns false from isAvailable on native platform', () => {
    const service = new AdSenseService()
    mockCapacitor.isNativePlatform.mockReturnValue(true)

    expect(service.isAvailable()).toBe(false)
  })

  it('returns false from isAvailable when premium is active', () => {
    const premiumStore = usePremiumStore()
    premiumStore.isPremiumActive = true
    const service = new AdSenseService()

    expect(service.isAvailable()).toBe(false)
  })

  it('loads AdSense script only once even when called multiple times', async () => {
    const service = new AdSenseService()
    ;(
      window as unknown as { adsbygoogle: { push: ReturnType<typeof vi.fn> } }
    ).adsbygoogle = { push: vi.fn() }

    const appendChildSpy = vi
      .spyOn(document.head, 'appendChild')
      .mockImplementation((node: Node) => {
        const script = node as HTMLScriptElement
        script.onload?.(new Event('load'))
        return node
      })

    await service.loadScript()
    await service.loadScript()

    expect(appendChildSpy).toHaveBeenCalledTimes(1)
    expect(
      (window as unknown as { adsbygoogle: { push: ReturnType<typeof vi.fn> } })
        .adsbygoogle.push,
    ).toHaveBeenCalledTimes(1)

    const appendedScript = appendChildSpy.mock.calls[0][0] as HTMLScriptElement
    expect(appendedScript.src).toContain(
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js',
    )
    expect(appendedScript.crossOrigin).toBe('anonymous')
  })

  it('does not append script when AdSense is unavailable', async () => {
    mockCapacitor.isNativePlatform.mockReturnValue(true)
    const service = new AdSenseService()
    const appendChildSpy = vi.spyOn(document.head, 'appendChild')

    await service.loadScript()

    expect(appendChildSpy).not.toHaveBeenCalled()
  })

  it('resolves when AdSense script fails to load', async () => {
    const service = new AdSenseService()
    const appendChildSpy = vi
      .spyOn(document.head, 'appendChild')
      .mockImplementation((node: Node) => {
        const script = node as HTMLScriptElement
        script.onerror?.(new Event('error'))
        return node
      })

    await expect(service.loadScript()).resolves.toBeUndefined()
    expect(appendChildSpy).toHaveBeenCalledTimes(1)
  })

  it('returns false for routes excluded from ads', () => {
    const service = new AdSenseService()

    expect(service.isPageWithAds('/kontakt')).toBe(false)
    expect(service.isPageWithAds('/umowa-o-dzielo')).toBe(true)
  })
})
