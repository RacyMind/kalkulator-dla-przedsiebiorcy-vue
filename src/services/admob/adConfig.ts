import { AdBannerPosition, AdBannerSize } from './types'
import type { AdConfig } from './types'

export const AD_CONFIG: AdConfig = {
  bannerAdId: 'ca-app-pub-5774067444002039/8736767652',
  position: AdBannerPosition.BOTTOM_CENTER,
  adSize: AdBannerSize.ADAPTIVE_BANNER,
  isTesting: process.env.NODE_ENV !== 'production',
  noAdPages: [
    '/',
    '/polityka-prywatnosci',
    '/kontakt',
    '/historia-zmian',
  ],
}
