import { uid } from 'quasar'
import { Capacitor } from '@capacitor/core'
import { FirebaseAnalytics } from '@capacitor-firebase/analytics'
import { hasAnalyticsConsent } from 'src/logic/consent'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const isNative = Capacitor.isNativePlatform()
const hasGtag = () => typeof window.gtag === 'function'

export default {
  getCid() {
    if (!localStorage.cid) {
      localStorage.cid = uid()
    }
    return localStorage.cid
  },

  logEvent(category: string, action: string, label: string, value = null) {
    if (process.env.DEV) {
      return
    }

    if (!hasAnalyticsConsent()) {
      return
    }

    if (isNative) {
      FirebaseAnalytics.logEvent({
        name: action,
        params: { category, label, value, cid: this.getCid() },
      })
      return
    }

    if (!hasGtag()) {
      return
    }

    const eventParams: Record<string, string | number> = {
      event_category: category,
      event_label: label,
      cid: this.getCid(),
    }

    if (typeof value === 'number') {
      eventParams.value = value
    }

    window.gtag?.('event', action, eventParams)
  },

  logPage(path: string) {
    if (process.env.DEV) {
      return
    }

    if (!hasAnalyticsConsent()) {
      return
    }

    if (isNative) {
      FirebaseAnalytics.logEvent({
        name: 'screen_view',
        params: { screen_name: path, cid: this.getCid() },
      })
      return
    }

    if (!hasGtag()) {
      return
    }

    window.gtag?.('event', 'page_view', {
      cid: this.getCid(),
      page_path: path,
    })
  },
}
