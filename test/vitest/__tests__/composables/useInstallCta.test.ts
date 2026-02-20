import { beforeEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, reactive } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'

interface MockQuasar {
  platform: {
    is: {
      mobile: boolean
      android: boolean
      nativeMobile: boolean
    }
  }
}

interface InstallCtaVm {
  googlePlayUrl: string
  showGooglePlayCta: boolean
  showPwaInstallCta: boolean
  installPwa: () => Promise<void>
}

const { mockCapacitor } = vi.hoisted(() => ({
  mockCapacitor: {
    isNativePlatform: vi.fn().mockReturnValue(false),
  },
}))

let mockQuasar: MockQuasar

vi.mock('@capacitor/core', () => ({
  Capacitor: mockCapacitor,
}))

vi.mock('quasar', async (importOriginal) => {
  const actual = await importOriginal<typeof import('quasar')>()

  return {
    ...actual,
    useQuasar: () => mockQuasar,
  }
})

import { useInstallCta } from 'src/composables/useInstallCta'

const setStandaloneDisplayMode = (isStandalone: boolean) => {
  const matchMediaMock = vi.fn().mockImplementation((query: string) => ({
    matches: query === '(display-mode: standalone)' ? isStandalone : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))

  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: matchMediaMock,
    writable: true,
  })
}

const mountInstallCta = () => {
  const TestComponent = defineComponent({
    setup() {
      return useInstallCta()
    },
    template: '<div />',
  })

  const wrapper = mount(TestComponent)

  return {
    wrapper,
    vm: wrapper.vm as unknown as InstallCtaVm,
  }
}

const dispatchBeforeInstallPrompt = () => {
  const prompt = vi.fn().mockResolvedValue(undefined)
  const userChoice = Promise.resolve({
    outcome: 'accepted' as const,
    platform: 'web',
  })
  const installEvent = new Event('beforeinstallprompt') as Event & {
    prompt: typeof prompt
    userChoice: typeof userChoice
  }

  Object.defineProperty(installEvent, 'prompt', {
    configurable: true,
    value: prompt,
  })
  Object.defineProperty(installEvent, 'userChoice', {
    configurable: true,
    value: userChoice,
  })

  window.dispatchEvent(installEvent)

  return {
    prompt,
  }
}

describe('useInstallCta', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCapacitor.isNativePlatform.mockReturnValue(false)
    mockQuasar = reactive({
      platform: {
        is: {
          mobile: false,
          android: false,
          nativeMobile: false,
        },
      },
    })
    setStandaloneDisplayMode(false)
  })

  it('shows Google Play CTA on Android mobile web when app is not installed', () => {
    mockQuasar.platform.is.mobile = true
    mockQuasar.platform.is.android = true

    const { vm, wrapper } = mountInstallCta()

    expect(vm.showGooglePlayCta).toBe(true)
    expect(vm.showPwaInstallCta).toBe(false)

    wrapper.unmount()
  })

  it('shows PWA install CTA on non-Android web after beforeinstallprompt', async () => {
    const { vm, wrapper } = mountInstallCta()

    dispatchBeforeInstallPrompt()
    await nextTick()

    expect(vm.showGooglePlayCta).toBe(false)
    expect(vm.showPwaInstallCta).toBe(true)

    wrapper.unmount()
  })

  it('hides install CTA on non-Android web when beforeinstallprompt is unavailable', () => {
    const { vm, wrapper } = mountInstallCta()

    expect(vm.showGooglePlayCta).toBe(false)
    expect(vm.showPwaInstallCta).toBe(false)

    wrapper.unmount()
  })

  it('hides install CTA on native platform', async () => {
    mockCapacitor.isNativePlatform.mockReturnValue(true)
    const { vm, wrapper } = mountInstallCta()

    dispatchBeforeInstallPrompt()
    await nextTick()

    expect(vm.showGooglePlayCta).toBe(false)
    expect(vm.showPwaInstallCta).toBe(false)

    wrapper.unmount()
  })

  it('hides install CTA when app runs in standalone display mode', async () => {
    setStandaloneDisplayMode(true)
    const { vm, wrapper } = mountInstallCta()

    dispatchBeforeInstallPrompt()
    await nextTick()

    expect(vm.showGooglePlayCta).toBe(false)
    expect(vm.showPwaInstallCta).toBe(false)

    wrapper.unmount()
  })

  it('hides CTA after appinstalled event', async () => {
    const { vm, wrapper } = mountInstallCta()

    dispatchBeforeInstallPrompt()
    await nextTick()
    expect(vm.showPwaInstallCta).toBe(true)

    window.dispatchEvent(new Event('appinstalled'))
    await nextTick()

    expect(vm.showGooglePlayCta).toBe(false)
    expect(vm.showPwaInstallCta).toBe(false)

    wrapper.unmount()
  })

  it('calls prompt exactly once when installPwa is invoked with deferred prompt event', async () => {
    const { vm, wrapper } = mountInstallCta()
    const { prompt } = dispatchBeforeInstallPrompt()
    await nextTick()

    await vm.installPwa()
    await flushPromises()

    expect(prompt).toHaveBeenCalledTimes(1)
    expect(vm.showPwaInstallCta).toBe(false)

    wrapper.unmount()
  })
})
