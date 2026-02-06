export const AdMob = {
  initialize: async () => {},
  showBanner: async () => {},
  hideBanner: async () => {},
  resumeBanner: async () => {},
  removeBanner: async () => {},
  addListener: async () => ({ remove: async () => {} }),
}

export const BannerAdPluginEvents = {
  Loaded: 'bannerAdLoaded',
  FailedToLoad: 'bannerAdFailedToLoad',
  SizeChanged: 'bannerAdSizeChanged',
  Opened: 'bannerAdOpened',
  Closed: 'bannerAdClosed',
  AdImpression: 'bannerAdImpression',
}

export const BannerAdSize = {
  BANNER: 'BANNER',
  FULL_BANNER: 'FULL_BANNER',
  LARGE_BANNER: 'LARGE_BANNER',
  MEDIUM_RECTANGLE: 'MEDIUM_RECTANGLE',
  ADAPTIVE_BANNER: 'ADAPTIVE_BANNER',
  SMART_BANNER: 'SMART_BANNER',
}

export const BannerAdPosition = {
  TOP_CENTER: 'TOP_CENTER',
  CENTER: 'CENTER',
  BOTTOM_CENTER: 'BOTTOM_CENTER',
}
