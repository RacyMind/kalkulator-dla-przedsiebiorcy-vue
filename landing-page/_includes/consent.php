<style>
  .kf-consent-banner {
    position: fixed;
    right: 12px;
    bottom: 8px;
    left: 12px;
    z-index: 50;
  }

  .kf-consent-banner__card {
    max-width: 920px;
    margin: 0 auto;
  }

  .kf-consent-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .kf-consent-actions > button {
    width: 100%;
  }

  .kf-consent-settings-overlay {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100dvh;
    padding: max(16px, env(safe-area-inset-top)) 16px
      max(16px, env(safe-area-inset-bottom));
    background-color: rgba(15, 23, 42, 0.62);
    backdrop-filter: blur(3px);
    overflow-y: auto;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.2s ease;
  }

  .kf-consent-settings-overlay.kf-consent-settings-modal--open {
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 1;
    pointer-events: auto;
  }

  .kf-consent-settings-card {
    width: 100%;
    max-width: 560px;
    max-height: calc(100dvh - 32px);
    display: flex;
    flex-direction: column;
    border: 1px solid #d1d5db;
    border-top: 4px solid #1565c0;
    border-radius: 14px;
    overflow: hidden;
  }

  .kf-consent-settings-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 12px;
    padding: 18px 20px 12px;
    border-bottom: 1px solid #e5e7eb;
    background-color: #f8fafc;
  }

  .kf-consent-settings-body {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding: 16px 20px;
    background-color: #ffffff;
  }

  .kf-consent-settings-option {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 16px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    padding: 12px;
    background: #ffffff;
  }

  .kf-consent-settings-option-title {
    font-size: 14px;
    font-weight: 600;
    color: #111827;
  }

  .kf-consent-settings-option-description {
    margin-top: 4px;
    font-size: 12px;
    line-height: 1.4;
    color: #6b7280;
  }

  .kf-consent-settings-toggle {
    margin-top: 2px;
    height: 18px;
    width: 18px;
    flex-shrink: 0;
    accent-color: #1565c0;
  }

  .kf-consent-settings-close {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 34px;
    width: 34px;
    border: 1px solid #d1d5db;
    border-radius: 9999px;
    background: transparent;
    color: #4b5563;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .kf-consent-settings-close:hover {
    background-color: #f3f4f6;
  }

  .kf-consent-settings-actions {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 20px 20px;
    border-top: 1px solid #e5e7eb;
    background-color: #f8fafc;
  }

  .kf-consent-settings-actions > button {
    width: 100%;
  }

  @media (prefers-color-scheme: dark) {
    #consent-settings-modal {
      background-color: rgba(2, 6, 23, 0.76);
    }

    .kf-consent-settings-card {
      border-color: #374151;
      border-top-color: #42a5f5;
    }

    .kf-consent-settings-header {
      border-bottom-color: #374151;
      background-color: #111827;
    }

    .kf-consent-settings-body {
      background-color: #111827;
    }

    .kf-consent-settings-option {
      border-color: #374151;
      background: #1f2937;
    }

    .kf-consent-settings-option-title {
      color: #f9fafb;
    }

    .kf-consent-settings-option-description {
      color: #9ca3af;
    }

    .kf-consent-settings-close {
      border-color: #4b5563;
      color: #d1d5db;
    }

    .kf-consent-settings-close:hover {
      background-color: #1f2937;
    }

    .kf-consent-settings-actions {
      border-top-color: #374151;
      background-color: #111827;
    }
  }

  .kf-consent-actions > button,
  .kf-consent-settings-actions > button,
  .kf-consent-manage-button {
    cursor: pointer;
  }

  .kf-consent-manage-button {
    position: fixed;
    bottom: 8px;
    left: 8px;
    z-index: 40;
  }

  @media (min-width: 640px) {
    .kf-consent-actions {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .kf-consent-actions > button {
      width: auto;
    }

    .kf-consent-settings-actions {
      flex-direction: row;
      justify-content: flex-end;
      flex-wrap: wrap;
    }

    .kf-consent-settings-actions > button {
      width: auto;
    }
  }

  @media (min-width: 768px) {
    .kf-consent-banner {
      right: 20px;
      bottom: 16px;
      left: 20px;
    }

    .kf-consent-manage-button {
      bottom: 16px;
      left: 16px;
    }
  }
</style>

<div
  id="consent-banner"
  class="kf-consent-banner hidden"
  role="region"
  aria-label="Ustawienia prywatności"
>
  <div
    class="kf-consent-banner__card rounded-lg border border-gray-300 bg-white p-5 shadow-lg sm:p-6 dark:border-gray-700 dark:bg-gray-900"
  >
    <p class="mb-2 text-sm font-semibold text-gray-900 dark:text-gray-100">
      Ustawienia prywatności
    </p>
    <p class="mb-4 text-xs leading-relaxed text-gray-700 dark:text-gray-300">
      Używamy Google Analytics, aby analizować sposób korzystania z aplikacji i
      ulepszać kalkulatory. Dane analityczne uruchamiamy tylko po Twojej
      decyzji.
    </p>
    <div class="kf-consent-actions">
      <button
        id="consent-open-settings"
        type="button"
        class="rounded border border-[#1565C0] px-3 py-2 text-sm font-medium text-[#1565C0] transition-colors hover:bg-blue-50 dark:hover:bg-gray-800"
      >
        Ustawienia
      </button>
      <button
        id="consent-reject"
        type="button"
        class="rounded border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
      >
        Odrzucam analityczne
      </button>
      <button
        id="consent-accept"
        type="button"
        class="rounded bg-[#1565C0] px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0D47A1]"
      >
        Akceptuję analityczne
      </button>
    </div>
  </div>
</div>

<div
  id="consent-settings-modal"
  class="kf-consent-settings-overlay fixed inset-0 z-[4000] hidden"
>
  <div
    id="consent-settings-dialog"
    class="kf-consent-settings-card bg-white shadow-2xl dark:bg-gray-900"
    role="dialog"
    aria-modal="true"
    aria-labelledby="consent-settings-title"
    aria-describedby="consent-settings-description"
    tabindex="-1"
  >
    <div class="kf-consent-settings-header">
      <div>
        <p
          id="consent-settings-title"
          class="text-lg font-bold text-gray-900 dark:text-gray-100"
        >
          Ustawienia prywatności
        </p>
        <p
          id="consent-settings-description"
          class="mt-2 text-sm text-gray-700 dark:text-gray-300"
        >
          Niezbędne dane techniczne są zawsze aktywne. Poniżej możesz zarządzać
          analityką.
        </p>
      </div>
      <button
        id="consent-settings-close"
        type="button"
        aria-label="Zamknij ustawienia prywatności"
        class="kf-consent-settings-close"
      >
        ×
      </button>
    </div>

    <div class="kf-consent-settings-body">
      <label class="kf-consent-settings-option">
        <span>
          <span class="kf-consent-settings-option-title">
            Analityka (Google Analytics)
          </span>
          <span class="kf-consent-settings-option-description">
            Pozwala analizować ruch i ulepszać działanie kalkulatorów.
          </span>
        </span>
        <input
          id="consent-analytics-toggle"
          type="checkbox"
          class="kf-consent-settings-toggle"
        >
      </label>
    </div>

    <div class="kf-consent-settings-actions">
      <button
        id="consent-settings-cancel"
        type="button"
        class="rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 dark:border-gray-600 dark:text-gray-200"
      >
        Anuluj
      </button>
      <button
        id="consent-settings-reject"
        type="button"
        class="rounded border border-[#1565C0] px-3 py-2 text-sm text-[#1565C0]"
      >
        Odrzuć analityczne
      </button>
      <button
        id="consent-settings-save"
        type="button"
        class="rounded bg-[#1565C0] px-3 py-2 text-sm font-semibold text-white"
      >
        Zapisz
      </button>
    </div>
  </div>
</div>

<button
  id="consent-manage-button"
  type="button"
  class="kf-consent-manage-button hidden rounded-full border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-md transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
>
  Ustawienia prywatności
</button>

<script>
  ;(() => {
    const consentStorageKey = 'kf-consent-v1'
    const modalOpenClass = 'kf-consent-settings-modal--open'
    const banner = document.getElementById('consent-banner')
    const modal = document.getElementById('consent-settings-modal')
    const settingsDialog = document.getElementById('consent-settings-dialog')
    const analyticsToggle = document.getElementById('consent-analytics-toggle')
    const openSettingsBtn = document.getElementById('consent-open-settings')
    const rejectBtn = document.getElementById('consent-reject')
    const acceptBtn = document.getElementById('consent-accept')
    const settingsCancelBtn = document.getElementById('consent-settings-cancel')
    const settingsCloseBtn = document.getElementById('consent-settings-close')
    const settingsRejectBtn = document.getElementById('consent-settings-reject')
    const settingsSaveBtn = document.getElementById('consent-settings-save')
    const manageButton = document.getElementById('consent-manage-button')
    let lastFocusedTrigger = null

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

    const restoreFocusToTrigger = () => {
      if (
        lastFocusedTrigger instanceof HTMLElement &&
        document.contains(lastFocusedTrigger) &&
        !lastFocusedTrigger.classList.contains('hidden')
      ) {
        lastFocusedTrigger.focus()
      }

      lastFocusedTrigger = null
    }

    const closeSettings = (options = { restoreFocus: true }) => {
      if (modal) {
        modal.classList.add('hidden')
        modal.classList.remove(modalOpenClass)
      }
      document.body.classList.remove('overflow-hidden')

      if (options.restoreFocus) {
        restoreFocusToTrigger()
      }
    }

    const syncBannerVisibility = () => {
      const consentState = readConsentState()

      if (!banner) {
        return
      }

      if (consentState) {
        banner.classList.add('hidden')
        manageButton?.classList.remove('hidden')
      } else {
        banner.classList.remove('hidden')
        manageButton?.classList.add('hidden')
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

      syncBannerVisibility()

      if (options.closeModal) {
        closeSettings({ restoreFocus: false })
      }
    }

    const focusPrimarySettingsAction = () => {
      if (settingsCloseBtn instanceof HTMLElement) {
        settingsCloseBtn.focus()
        return
      }

      if (settingsSaveBtn instanceof HTMLElement) {
        settingsSaveBtn.focus()
        return
      }

      if (settingsDialog instanceof HTMLElement) {
        settingsDialog.focus()
      }
    }

    const openSettings = (event) => {
      const trigger = event?.currentTarget
      if (trigger instanceof HTMLElement) {
        lastFocusedTrigger = trigger
      }

      const consentState = readConsentState()
      if (analyticsToggle) {
        analyticsToggle.checked = consentState?.analyticsStorage === 'granted'
      }
      if (modal) {
        modal.classList.remove('hidden')
        modal.classList.add(modalOpenClass)
      }
      document.body.classList.add('overflow-hidden')
      focusPrimarySettingsAction()
    }

    const handleModalBackdropClick = (event) => {
      if (event.target === modal) {
        closeSettings()
      }
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && modal?.classList.contains(modalOpenClass)) {
        closeSettings()
      }
    }

    openSettingsBtn?.addEventListener('click', openSettings)
    manageButton?.addEventListener('click', openSettings)
    rejectBtn?.addEventListener('click', () => applyDecision('denied', 'banner'))
    acceptBtn?.addEventListener('click', () => applyDecision('granted', 'banner'))
    settingsCancelBtn?.addEventListener('click', closeSettings)
    settingsCloseBtn?.addEventListener('click', closeSettings)
    settingsRejectBtn?.addEventListener('click', () =>
      applyDecision('denied', 'settings'),
    )
    settingsSaveBtn?.addEventListener('click', () => {
      const decision = analyticsToggle?.checked ? 'granted' : 'denied'
      applyDecision(decision, 'settings')
    })
    modal?.addEventListener('click', handleModalBackdropClick)
    document.addEventListener('keydown', handleKeyDown)

    syncBannerVisibility()
  })()
</script>