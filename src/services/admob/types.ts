export enum AdBannerPosition {
  TOP_CENTER = 'TOP_CENTER',
  CENTER = 'CENTER',
  BOTTOM_CENTER = 'BOTTOM_CENTER',
}

export enum AdBannerSize {
  BANNER = 'BANNER',
  FULL_BANNER = 'FULL_BANNER',
  LARGE_BANNER = 'LARGE_BANNER',
  MEDIUM_RECTANGLE = 'MEDIUM_RECTANGLE',
  ADAPTIVE_BANNER = 'ADAPTIVE_BANNER',
  SMART_BANNER = 'SMART_BANNER',
}

export interface AdMobServiceState {
  isInitialized: boolean
  isBannerLoaded: boolean
  isBannerVisible: boolean
  bannerHeight: number
  lastError: { code: number; message: string } | null
}

export interface AdConfig {
  bannerAdId: string
  position: AdBannerPosition
  adSize: AdBannerSize
  isTesting: boolean
  noAdPages: string[]
}
