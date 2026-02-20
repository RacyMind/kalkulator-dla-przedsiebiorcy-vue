import { Capacitor } from '@capacitor/core'
import { useQuasar } from 'quasar'
import { computed, onMounted, onUnmounted, ref } from 'vue'

interface BeforeInstallPromptChoiceResult {
  outcome: 'accepted' | 'dismissed'
  platform: string
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<BeforeInstallPromptChoiceResult>
}

const googlePlayUrl =
  'https://play.google.com/store/apps/details?id=racyMind.kalkulator'

const isStandaloneMode = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }

  const navigatorWithStandalone = window.navigator as Navigator & {
    standalone?: boolean
  }
  const hasDisplayModeStandalone =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(display-mode: standalone)').matches

  return navigatorWithStandalone.standalone === true || hasDisplayModeStandalone
}

export function useInstallCta() {
  const $q = useQuasar()
  const deferredInstallPrompt = ref<BeforeInstallPromptEvent | null>(null)
  const isPwaInstalled = ref(false)
  const isNativeInstalled = Capacitor.isNativePlatform()

  const updateInstallState = () => {
    isPwaInstalled.value = isStandaloneMode()
    if (isPwaInstalled.value) {
      deferredInstallPrompt.value = null
    }
  }

  const onBeforeInstallPrompt = (event: Event) => {
    event.preventDefault()
    deferredInstallPrompt.value = event as BeforeInstallPromptEvent
  }

  const onAppInstalled = () => {
    isPwaInstalled.value = true
    deferredInstallPrompt.value = null
  }

  onMounted(() => {
    updateInstallState()
    window.addEventListener(
      'beforeinstallprompt',
      onBeforeInstallPrompt as EventListener,
    )
    window.addEventListener('appinstalled', onAppInstalled)
  })

  onUnmounted(() => {
    window.removeEventListener(
      'beforeinstallprompt',
      onBeforeInstallPrompt as EventListener,
    )
    window.removeEventListener('appinstalled', onAppInstalled)
  })

  const isInstalled = computed(() => isNativeInstalled || isPwaInstalled.value)
  const isAndroidMobileWeb = computed(
    () =>
      $q.platform.is.mobile &&
      $q.platform.is.android &&
      !$q.platform.is.nativeMobile,
  )

  const showGooglePlayCta = computed(
    () => !isInstalled.value && isAndroidMobileWeb.value,
  )
  const showPwaInstallCta = computed(
    () =>
      !isInstalled.value &&
      !isAndroidMobileWeb.value &&
      deferredInstallPrompt.value !== null,
  )

  const installPwa = async () => {
    if (!showPwaInstallCta.value || !deferredInstallPrompt.value) {
      return
    }

    const promptEvent = deferredInstallPrompt.value
    deferredInstallPrompt.value = null

    await promptEvent.prompt()
    await promptEvent.userChoice.catch(() => undefined)
  }

  return {
    googlePlayUrl,
    showGooglePlayCta,
    showPwaInstallCta,
    installPwa,
  }
}
