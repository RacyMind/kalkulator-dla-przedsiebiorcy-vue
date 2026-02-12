import { AD_CONFIG } from '../services/admob/adConfig'
import { AdMob, BannerAdPluginEvents } from '@capacitor-community/admob'
import { AdMobService } from '../services/admob/AdMobService'
import { usePremiumStore } from 'stores/premiumStore'
import type { Router } from 'vue-router'

const adMobService = new AdMobService()

function updateBodyMargin(height: number) {
  document.body.style.marginBottom = height > 0 ? `${height}px` : ''
}

export default ({ router }: { router: Router }) => {
  if (!adMobService.isNative()) {
    return
  }

  const premiumStore = usePremiumStore()

  if (premiumStore.isPremiumActive) {
    updateBodyMargin(0)
    return
  }

  AdMob.addListener(
    BannerAdPluginEvents.SizeChanged,
    (size: { width: number; height: number }) => {
      updateBodyMargin(size.height)
    },
  )

  void adMobService.initialize()

  router.afterEach((to) => {
    const path = to.path
    if (premiumStore.isPremiumActive || AD_CONFIG.noAdPages.includes(path)) {
      adMobService.hideAd()
      updateBodyMargin(0)
    } else {
      adMobService.showAd()
      updateBodyMargin(adMobService.getBannerHeight())
    }
  })
}

export { adMobService }
