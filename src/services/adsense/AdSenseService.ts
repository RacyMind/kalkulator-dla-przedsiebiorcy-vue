import { Capacitor } from '@capacitor/core'
import { AD_SENSE_CONFIG } from './adSenseConfig'
import { usePremiumStore } from 'stores/premiumStore'

export class AdSenseService {
  private scriptLoaded = false
  private _adPushed = false

  get adPushed(): boolean {
    return this._adPushed
  }

  markAdPushed(): void {
    this._adPushed = true
  }

  isAvailable(): boolean {
    return (
      !Capacitor.isNativePlatform() &&
      !process.env.DEV &&
      !this.isPremiumActive()
    )
  }

  loadScript(): Promise<void> {
    if (this.scriptLoaded || !this.isAvailable()) {
      return Promise.resolve()
    }

    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.async = true
      script.crossOrigin = 'anonymous'
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_SENSE_CONFIG.publisherId}`
      script.onload = () => {
        try {
          ;(window as any).adsbygoogle = (window as any).adsbygoogle || []
          ;(window as any).adsbygoogle.push({
            google_ad_client: AD_SENSE_CONFIG.publisherId,
            enable_page_level_ads: false,
          })
        } catch {
          /* ignore */
        }
        resolve()
      }
      script.onerror = () => resolve()
      document.head.appendChild(script)
      this.scriptLoaded = true
    })
  }

  isPageWithAds(path: string): boolean {
    return !AD_SENSE_CONFIG.noAdPages.includes(path)
  }

  private isPremiumActive(): boolean {
    try {
      return usePremiumStore().isPremiumActive
    } catch {
      return false
    }
  }
}

export const adSenseService = new AdSenseService()
