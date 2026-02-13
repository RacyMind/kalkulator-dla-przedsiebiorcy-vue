<?php
$gaMeasurementId = getenv('GA_MEASUREMENT_ID') ?: 'G-9P7ZTHLC47';
$escapedGaMeasurementId = htmlspecialchars($gaMeasurementId, ENT_QUOTES, 'UTF-8');
?>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=<?= $escapedGaMeasurementId ?>"></script>
  <script>
    window.dataLayer = window.dataLayer || []
    function gtag(){dataLayer.push(arguments)}
    window.gtag = gtag
    gtag('js', new Date())

    const consentStorageKey = 'kf-consent-v1'
    const defaultConsentState = {
      analytics_storage: 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    }

    const getStoredAnalyticsConsent = () => {
      try {
        const rawConsent = localStorage.getItem(consentStorageKey)
        if (!rawConsent) {
          return null
        }
        const parsedConsent = JSON.parse(rawConsent)
        return parsedConsent?.analyticsStorage ?? null
      } catch {
        return null
      }
    }

    const updateAnalyticsConsent = (decision) => {
      if (decision !== 'granted' && decision !== 'denied') {
        return
      }

      gtag('consent', 'update', {
        ...defaultConsentState,
        analytics_storage: decision,
      })
    }

    gtag('consent', 'default', defaultConsentState)

    const storedAnalyticsConsent = getStoredAnalyticsConsent()
    if (storedAnalyticsConsent === 'granted' || storedAnalyticsConsent === 'denied') {
      updateAnalyticsConsent(storedAnalyticsConsent)
    }

    window.kfApplyAnalyticsConsent = updateAnalyticsConsent

    gtag('config', '<?= $escapedGaMeasurementId ?>', {
      anonymize_ip: true,
      allow_google_signals: false,
    })
  </script>
