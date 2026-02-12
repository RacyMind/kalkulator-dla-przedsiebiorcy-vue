import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

const { mockRoute, mockUseRoute, mockAdSenseService, mockAdSenseConfig } =
  vi.hoisted(() => {
    const mockRoute = { path: '/umowa-o-dzielo' }
    const mockUseRoute = vi.fn(() => mockRoute)
    const mockAdSenseService = {
      isAvailable: vi.fn(() => true),
      isPageWithAds: vi.fn(() => true),
      loadScript: vi.fn().mockResolvedValue(undefined),
    }
    const mockAdSenseConfig = {
      publisherId: 'ca-pub-test',
      adSlot: '1234567890',
      layoutKey: '-6t+ed+2i-1n-4w',
      noAdPages: [],
    }

    return {
      mockRoute,
      mockUseRoute,
      mockAdSenseService,
      mockAdSenseConfig,
    }
  })

vi.mock('vue-router', () => ({
  useRoute: mockUseRoute,
}))

vi.mock('src/services/adsense/AdSenseService', () => ({
  adSenseService: mockAdSenseService,
}))

vi.mock('src/services/adsense/adSenseConfig', () => ({
  AD_SENSE_CONFIG: mockAdSenseConfig,
}))

import AdSenseBanner from 'components/partials/AdSenseBanner.vue'

describe('AdSenseBanner', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockRoute.path = '/umowa-o-dzielo'
    mockAdSenseService.isAvailable.mockReturnValue(true)
    mockAdSenseService.isPageWithAds.mockReturnValue(true)
    mockAdSenseService.loadScript.mockResolvedValue(undefined)
    ;(
      window as unknown as { adsbygoogle: { push: (data: unknown) => void } }
    ).adsbygoogle = { push: vi.fn() }
  })

  it('renders responsive auto-format AdSense unit and pushes a single request', async () => {
    const wrapper = mount(AdSenseBanner, {
      props: { adSlot: '1234567890' },
    })

    await flushPromises()

    const insElement = wrapper.find('ins.adsbygoogle')
    expect(insElement.exists()).toBe(true)
    expect(insElement.attributes('data-ad-slot')).toBe('1234567890')
    expect(insElement.attributes('data-ad-format')).toBe('auto')
    expect(insElement.attributes('data-full-width-responsive')).toBe('true')
    expect(insElement.attributes('data-ad-layout-key')).toBeUndefined()
    expect(mockAdSenseService.loadScript).toHaveBeenCalledTimes(1)
    expect(
      (window as unknown as { adsbygoogle: { push: ReturnType<typeof vi.fn> } })
        .adsbygoogle.push,
    ).toHaveBeenCalledWith({})
  })

  it('does not render ad when AdSense is unavailable', async () => {
    mockAdSenseService.isAvailable.mockReturnValue(false)

    const wrapper = mount(AdSenseBanner, {
      props: { adSlot: '1234567890' },
    })

    await flushPromises()

    expect(wrapper.find('ins.adsbygoogle').exists()).toBe(false)
    expect(mockAdSenseService.loadScript).not.toHaveBeenCalled()
  })

  it('does not render ad when route is excluded from ads', async () => {
    mockAdSenseService.isPageWithAds.mockReturnValue(false)

    const wrapper = mount(AdSenseBanner, {
      props: { adSlot: '1234567890' },
    })

    await flushPromises()

    expect(wrapper.find('ins.adsbygoogle').exists()).toBe(false)
    expect(mockAdSenseService.loadScript).not.toHaveBeenCalled()
  })

  it('pushes ad request for each banner mount to support SPA navigation', async () => {
    mount(AdSenseBanner, {
      props: { adSlot: '1234567890' },
    })
    await flushPromises()

    mount(AdSenseBanner, {
      props: { adSlot: '1234567890' },
    })
    await flushPromises()

    expect(mockAdSenseService.loadScript).toHaveBeenCalledTimes(2)
    expect(
      (window as unknown as { adsbygoogle: { push: ReturnType<typeof vi.fn> } })
        .adsbygoogle.push,
    ).toHaveBeenCalledTimes(2)
  })

  it('hides the ad container when adsbygoogle.push throws', async () => {
    ;(window as unknown as { adsbygoogle: { push: () => void } }).adsbygoogle =
      {
        push: vi.fn(() => {
          throw new Error('push failed')
        }),
      }

    const wrapper = mount(AdSenseBanner, {
      props: { adSlot: '1234567890' },
    })

    await flushPromises()

    expect(wrapper.find('ins.adsbygoogle').exists()).toBe(false)
  })

  it('does not render ad when adSlot prop is blank', async () => {
    const wrapper = mount(AdSenseBanner, {
      props: { adSlot: '   ' },
    })

    await flushPromises()

    expect(wrapper.find('ins.adsbygoogle').exists()).toBe(false)
    expect(mockAdSenseService.loadScript).not.toHaveBeenCalled()
  })
})
