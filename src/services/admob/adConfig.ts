import { AdBannerPosition, AdBannerSize } from './types';
import type { AdConfig } from './types';

export const AD_CONFIG: AdConfig = {
  bannerAdId: import.meta.env.VITE_ADMOB_BANNER_ID ?? '',
  position: AdBannerPosition.BOTTOM_CENTER,
  adSize: AdBannerSize.ADAPTIVE_BANNER,
  isTesting: process.env.NODE_ENV !== 'production',
  noAdPages: ['/', '/polityka-prywatnosci', '/kontakt', '/historia-zmian'],
};
