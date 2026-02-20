import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('Landing page consent UI contract', () => {
  it('positions consent banner as bottom fixed card aligned with app UX', () => {
    const consentInclude = readTextFile('landing-page/_includes/consent.php')

    expect(consentInclude).toContain('class="kf-consent-banner hidden"')
    expect(consentInclude).toContain('class="kf-consent-banner__card')
    expect(consentInclude).toContain('.kf-consent-banner {')
    expect(consentInclude).toContain('max-width: 920px;')
    expect(consentInclude).toContain('bg-white p-5 shadow-lg sm:p-6')
  })

  it('keeps settings modal centered and constrained in viewport', () => {
    const consentInclude = readTextFile('landing-page/_includes/consent.php')

    expect(consentInclude).toContain(
      '.kf-consent-settings-overlay.kf-consent-settings-modal--open {',
    )
    expect(consentInclude).toContain('display: flex;')
    expect(consentInclude).toContain('align-items: center;')
    expect(consentInclude).toContain('justify-content: center;')
    expect(consentInclude).toContain('width: 100vw;')
    expect(consentInclude).toContain('height: 100dvh;')
    expect(consentInclude).toContain('pointer-events: auto;')
    expect(consentInclude).toContain('max-height: calc(100dvh - 32px);')
    expect(consentInclude).toContain('overflow-y: auto;')
  })

  it('keeps settings modal structure consistent with landing card style', () => {
    const consentInclude = readTextFile('landing-page/_includes/consent.php')

    expect(consentInclude).toContain(
      'class="kf-consent-settings-overlay fixed inset-0 z-[4000] hidden"',
    )
    expect(consentInclude).toContain('id="consent-settings-dialog"')
    expect(consentInclude).toContain('class="kf-consent-settings-header"')
    expect(consentInclude).toContain('class="kf-consent-settings-body"')
    expect(consentInclude).toContain('class="kf-consent-settings-option"')
    expect(consentInclude).toContain('class="kf-consent-settings-actions"')
    expect(consentInclude).toContain('id="consent-settings-close"')
    expect(consentInclude).toContain('@media (prefers-color-scheme: dark) {')
    expect(consentInclude).toContain('#consent-settings-modal {')
  })

  it('shows pointer cursor for all consent action buttons', () => {
    const consentInclude = readTextFile('landing-page/_includes/consent.php')

    expect(consentInclude).toContain('.kf-consent-actions > button,')
    expect(consentInclude).toContain('.kf-consent-settings-actions > button,')
    expect(consentInclude).toContain('.kf-consent-manage-button {')
    expect(consentInclude).toContain('cursor: pointer;')
  })

  it('keeps polish copy with proper diacritics', () => {
    const consentInclude = readTextFile('landing-page/_includes/consent.php')

    expect(consentInclude).toContain('Ustawienia prywatno\u015bci')
    expect(consentInclude).toContain(
      'U\u017cywamy Google Analytics, aby analizowa\u0107 spos\u00f3b korzystania z aplikacji',
    )
    expect(consentInclude).toContain('Akceptuj\u0119 analityczne')
    expect(consentInclude).toContain(
      'Niezb\u0119dne dane techniczne s\u0105 zawsze aktywne',
    )
    expect(consentInclude).toContain('Odrzu\u0107 analityczne')
  })

  it('shows manage button only after consent decision is stored', () => {
    const consentInclude = readTextFile('landing-page/_includes/consent.php')

    expect(consentInclude).toContain("manageButton?.classList.remove('hidden')")
    expect(consentInclude).toContain("manageButton?.classList.add('hidden')")
    expect(consentInclude).toContain('const syncBannerVisibility = () => {')
  })

  it('supports closing settings and restoring focus when user cancels modal', () => {
    const consentInclude = readTextFile('landing-page/_includes/consent.php')

    expect(consentInclude).toContain(
      "const modalOpenClass = 'kf-consent-settings-modal--open'",
    )
    expect(consentInclude).toContain('let lastFocusedTrigger = null')
    expect(consentInclude).toContain(
      'const closeSettings = (options = { restoreFocus: true }) => {',
    )
    expect(consentInclude).toContain('if (options.restoreFocus) {')
    expect(consentInclude).toContain('lastFocusedTrigger.focus()')
    expect(consentInclude).toContain('closeSettings({ restoreFocus: false })')
    expect(consentInclude).toContain('settingsCloseBtn.focus()')
  })

  it('supports closing consent settings with all expected interactions', () => {
    const consentInclude = readTextFile('landing-page/_includes/consent.php')

    expect(consentInclude).toContain(
      'const handleModalBackdropClick = (event) => {',
    )
    expect(consentInclude).toContain('if (event.target === modal) {')
    expect(consentInclude).toContain(
      "if (event.key === 'Escape' && modal?.classList.contains(modalOpenClass)) {",
    )
    expect(consentInclude).toContain(
      "settingsCloseBtn?.addEventListener('click', closeSettings)",
    )
    expect(consentInclude).toContain(
      "modal?.addEventListener('click', handleModalBackdropClick)",
    )
    expect(consentInclude).toContain(
      "document.addEventListener('keydown', handleKeyDown)",
    )
  })
})
