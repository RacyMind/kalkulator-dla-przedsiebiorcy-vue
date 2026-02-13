import { AD_CONFIG } from './adConfig'
import {
  AdMob,
  BannerAdPluginEvents,
  BannerAdPosition,
  BannerAdSize,
} from '@capacitor-community/admob'
import { Capacitor } from '@capacitor/core'
import type { AdMobServiceState } from './types'
import { usePremiumStore } from 'stores/premiumStore'

export class AdMobService {
  private state: AdMobServiceState = {
    isInitialized: false,
    isBannerLoaded: false,
    isBannerVisible: false,
    bannerHeight: 0,
    lastError: null,
  }

  isNative(): boolean {
    return Capacitor.isNativePlatform()
  }

  async initialize(): Promise<void> {
    if (this.state.isInitialized || !this.isNative()) {
      return
    }

    if (this.isPremiumActive()) {
      this.state.isBannerVisible = false
      return
    }

    try {
      this.registerListeners()
      await AdMob.initialize()
      this.state.isInitialized = true

      if (this.isPremiumActive()) {
        this.state.isBannerVisible = false
        return
      }

      await this.showBanner()
    } catch (error) {
      console.error('[AdMobService] Initialization failed:', error)
    }
  }

  async showAd(): Promise<void> {
    if (this.isPremiumActive()) {
      await this.hideAd()
      return
    }

    if (!this.state.isInitialized || this.state.isBannerVisible) {
      return
    }

    if (!this.state.isBannerLoaded) {
      await this.showBanner()
      return
    }

    try {
      await AdMob.resumeBanner()
      this.state.isBannerVisible = true
    } catch (error) {
      console.error('[AdMobService] resumeBanner failed:', error)
    }
  }

  async hideAd(): Promise<void> {
    if (!this.state.isBannerVisible) {
      return
    }

    try {
      await AdMob.hideBanner()
      this.state.isBannerVisible = false
    } catch (error) {
      console.error('[AdMobService] hideBanner failed:', error)
    }
  }

  getBannerHeight(): number {
    return this.state.bannerHeight
  }

  private registerListeners(): void {
    AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
      this.state.isBannerLoaded = true
    })

    AdMob.addListener(
      BannerAdPluginEvents.FailedToLoad,
      (error: { code: number; message: string }) => {
        this.state.lastError = { code: error.code, message: error.message }
        this.state.isBannerVisible = false
        console.error(
          '[AdMobService] Banner failed to load:',
          error.code,
          error.message,
        )
      },
    )

    AdMob.addListener(
      BannerAdPluginEvents.SizeChanged,
      (size: { width: number; height: number }) => {
        this.state.bannerHeight = size.height
      },
    )
  }

  private async showBanner(): Promise<void> {
    await AdMob.showBanner({
      adId: AD_CONFIG.bannerAdId,
      adSize: BannerAdSize.ADAPTIVE_BANNER,
      position: BannerAdPosition.BOTTOM_CENTER,
      margin: 0,
      isTesting: AD_CONFIG.isTesting,
    })
    this.state.isBannerVisible = true
  }

  private isPremiumActive(): boolean {
    try {
      return usePremiumStore().isPremiumActive
    } catch {
      return false
    }
  }
}
