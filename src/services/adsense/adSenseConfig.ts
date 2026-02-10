import { AD_CONFIG } from '../admob/adConfig'

export const AD_SENSE_CONFIG = {
  publisherId: import.meta.env.VITE_ADSENSE_PUBLISHER_ID ?? '',
  adSlot: import.meta.env.VITE_ADSENSE_AD_SLOT ?? '',
  layoutKey: import.meta.env.VITE_ADSENSE_LAYOUT_KEY ?? '',
  noAdPages: AD_CONFIG.noAdPages,
}
