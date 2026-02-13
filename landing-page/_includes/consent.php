<div id="consent-banner" class="fixed inset-x-2 bottom-2 z-50 hidden rounded-lg border border-gray-300 bg-white p-4 shadow-lg md:inset-x-6 md:bottom-6 dark:border-gray-700 dark:bg-gray-900">
  <p class="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">Ustawienia prywatności</p>
  <p class="mb-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
    Korzystamy z Google Analytics, aby analizować ruch i ulepszać aplikację. Dane analityczne uruchamiamy po Twojej decyzji.
  </p>
  <div class="flex flex-col gap-2 sm:flex-row">
    <button id="consent-open-settings" class="rounded border border-[#1565C0] px-3 py-2 text-sm font-medium text-[#1565C0] transition-colors hover:bg-blue-50 dark:hover:bg-gray-800">Ustawienia</button>
    <button id="consent-reject" class="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800">Odrzucam analityczne</button>
    <button id="consent-accept" class="rounded bg-[#1565C0] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0D47A1]">Akceptuję analityczne</button>
  </div>
</div>

<div id="consent-settings-modal" class="fixed inset-0 z-[60] hidden items-center justify-center bg-black/60 p-4">
  <div class="w-full max-w-md rounded-lg bg-white p-5 shadow-xl dark:bg-gray-900">
    <p class="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">Ustawienia prywatności</p>
    <p class="mb-4 text-sm text-gray-700 dark:text-gray-300">
      Niezbędne dane techniczne są zawsze aktywne. Możesz zdecydować, czy włączyć analitykę.
    </p>
    <label class="mb-5 flex items-center justify-between gap-4 rounded border border-gray-200 p-3 dark:border-gray-700">
      <span class="text-sm text-gray-900 dark:text-gray-100">Analityka (Google Analytics)</span>
      <input id="consent-analytics-toggle" type="checkbox" class="h-4 w-4 accent-[#1565C0]">
    </label>
    <div class="flex flex-col gap-2 sm:flex-row sm:justify-end">
      <button id="consent-settings-cancel" class="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-200">Anuluj</button>
      <button id="consent-settings-reject" class="rounded border border-[#1565C0] px-3 py-2 text-sm text-[#1565C0]">Odrzuć</button>
      <button id="consent-settings-save" class="rounded bg-[#1565C0] px-3 py-2 text-sm font-semibold text-white">Zapisz</button>
    </div>
  </div>
</div>

<button id="consent-manage-button" class="fixed bottom-2 left-2 z-40 rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-100 md:bottom-4 md:left-4 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800">
  Ustawienia prywatności
</button>

<script>
  ;(() => {
    const consentStorageKey = 'kf-consent-v1'
    const banner = document.getElementById('consent-banner')
    const modal = document.getElementById('consent-settings-modal')
    const analyticsToggle = document.getElementById('consent-analytics-toggle')
    const openSettingsBtn = document.getElementById('consent-open-settings')
    const rejectBtn = document.getElementById('consent-reject')
    const acceptBtn = document.getElementById('consent-accept')
    const settingsCancelBtn = document.getElementById('consent-settings-cancel')
    const settingsRejectBtn = document.getElementById('consent-settings-reject')
    const settingsSaveBtn = document.getElementById('consent-settings-save')
    const manageButton = document.getElementById('consent-manage-button')

    const readConsentState = () => {
      try {
        const rawConsent = localStorage.getItem(consentStorageKey)
        if (!rawConsent) {
          return null
        }
        const parsedConsent = JSON.parse(rawConsent)
        if (
          parsedConsent?.analyticsStorage !== 'granted' &&
          parsedConsent?.analyticsStorage !== 'denied'
        ) {
          return null
        }
        return parsedConsent
      } catch {
        return null
      }
    }

    const applyDecision = (decision, source, options = { closeModal: true }) => {
      if (decision !== 'granted' && decision !== 'denied') {
        return
      }

      const nextConsentState = {
        analyticsStorage: decision,
        source,
        updatedAt: new Date().toISOString(),
      }

      localStorage.setItem(consentStorageKey, JSON.stringify(nextConsentState))

      if (typeof window.kfApplyAnalyticsConsent === 'function') {
        window.kfApplyAnalyticsConsent(decision)
      }

      if (banner) {
        banner.classList.add('hidden')
      }

      if (options.closeModal && modal) {
        modal.classList.add('hidden')
        modal.classList.remove('flex')
      }
    }

    const openSettings = () => {
      const consentState = readConsentState()
      if (analyticsToggle) {
        analyticsToggle.checked = consentState?.analyticsStorage === 'granted'
      }
      if (modal) {
        modal.classList.remove('hidden')
        modal.classList.add('flex')
      }
    }

    const closeSettings = () => {
      if (modal) {
        modal.classList.add('hidden')
        modal.classList.remove('flex')
      }
    }

    const syncBannerVisibility = () => {
      const consentState = readConsentState()
      if (!banner) {
        return
      }

      if (consentState) {
        banner.classList.add('hidden')
      } else {
        banner.classList.remove('hidden')
      }
    }

    openSettingsBtn?.addEventListener('click', openSettings)
    manageButton?.addEventListener('click', openSettings)
    rejectBtn?.addEventListener('click', () => applyDecision('denied', 'banner'))
    acceptBtn?.addEventListener('click', () => applyDecision('granted', 'banner'))
    settingsCancelBtn?.addEventListener('click', closeSettings)
    settingsRejectBtn?.addEventListener('click', () =>
      applyDecision('denied', 'settings'),
    )
    settingsSaveBtn?.addEventListener('click', () => {
      const decision = analyticsToggle?.checked ? 'granted' : 'denied'
      applyDecision(decision, 'settings')
    })

    syncBannerVisibility()
  })()
</script>
