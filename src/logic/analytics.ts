import { uid } from 'quasar'
import { Capacitor } from '@capacitor/core'
import { FirebaseAnalytics } from '@capacitor-firebase/analytics'

declare global {
  interface Window {
    dataLayer: any
  }
}

const isNative = Capacitor.isNativePlatform()

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

    if (isNative) {
      FirebaseAnalytics.logEvent({
        name: action,
        params: { category, label, value, cid: this.getCid() },
      })
    } else {
      window.dataLayer.push({
        action: action,
        category: category,
        cid: this.getCid(),
        event: 'customEvent',
        label: label,
        value: value,
      })
    }
  },

  logPage(path: string) {
    if (process.env.DEV) {
      return
    }

    if (isNative) {
      FirebaseAnalytics.logEvent({
        name: 'screen_view',
        params: { screen_name: path, cid: this.getCid() },
      })
    } else {
      window.dataLayer.push({
        cid: this.getCid(),
        event: 'customPageView',
        path: path,
      })
    }
  },
}
