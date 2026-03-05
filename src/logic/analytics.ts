import { uid } from 'quasar'
import { Capacitor } from '@capacitor/core'
import { FirebaseAnalytics } from '@capacitor-firebase/analytics'
import { hasAnalyticsConsent } from 'src/logic/consent'
import type {
  AnalyticsEventName,
  AnalyticsEventParams,
  AnalyticsEventParamsMap,
} from 'src/types/Analytics'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

const isNative = Capacitor.isNativePlatform()
const hasGtag = () => typeof window.gtag === 'function'
const analyticsCidParamKey = 'kf_cid'

type AnalyticsLegacyEventValue = number | null | undefined
type AnalyticsPayload = Record<string, string | number>

const withAnalyticsCid = (params: AnalyticsPayload): AnalyticsPayload => ({
  ...params,
  [analyticsCidParamKey]: analytics.getCid(),
})

const normalizeLegacyEventName = (action: string): string => {
  const normalized = action
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')

  return normalized.length > 0 ? normalized : 'legacy_event'
}

const createLegacyParams = (
  category: string,
  label: string,
  value: AnalyticsLegacyEventValue,
): AnalyticsPayload => {
  const params: AnalyticsPayload = {
    legacy_category: category,
    legacy_label: label,
  }

  if (typeof value === 'number') {
    params.value = value
  }

  return params
}

const emitEvent = (eventName: string, params: AnalyticsPayload) => {
  if (process.env.DEV) {
    return
  }

  if (!hasAnalyticsConsent()) {
    return
  }

  const eventParams = withAnalyticsCid(params)

  if (isNative) {
    FirebaseAnalytics.logEvent({
      name: eventName,
      params: eventParams,
    })
    return
  }

  if (!hasGtag()) {
    return
  }

  window.gtag?.('event', eventName, eventParams)
}

function logEvent<T extends AnalyticsEventName>(
  eventName: T,
  params: AnalyticsEventParamsMap[T],
): void
function logEvent(
  category: string,
  action: string,
  label: string,
  value?: AnalyticsLegacyEventValue,
): void
function logEvent(
  eventNameOrCategory: string,
  paramsOrAction: AnalyticsEventParams | string,
  legacyLabel?: string,
  legacyValue: AnalyticsLegacyEventValue = null,
): void {
  if (typeof paramsOrAction === 'string') {
    if (typeof legacyLabel !== 'string') {
      return
    }

    emitEvent(
      normalizeLegacyEventName(paramsOrAction),
      createLegacyParams(eventNameOrCategory, legacyLabel, legacyValue),
    )
    return
  }

  emitEvent(eventNameOrCategory, paramsOrAction)
}

const analytics = {
  getCid() {
    if (!localStorage.cid) {
      localStorage.cid = uid()
    }
    return localStorage.cid
  },

  logEvent,

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
        params: {
          screen_name: path,
          [analyticsCidParamKey]: this.getCid(),
        },
      })
      return
    }

    if (!hasGtag()) {
      return
    }

    window.gtag?.('event', 'page_view', {
      [analyticsCidParamKey]: this.getCid(),
      page_path: path,
    })
  },
}

export default analytics
