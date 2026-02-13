import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('Landing page analytics snippet contract', () => {
  it('defines GA4 gtag include with consent mode defaults', () => {
    const ga4Include = readTextFile('landing-page/_includes/ga4.php')

    expect(ga4Include).toContain('https://www.googletagmanager.com/gtag/js?id=')
    expect(ga4Include).toContain('window.dataLayer = window.dataLayer || []')
    expect(ga4Include).toContain(
      "gtag('consent', 'default', defaultConsentState)",
    )
    expect(ga4Include).toContain("analytics_storage: 'denied'")
    expect(ga4Include).toContain('window.kfApplyAnalyticsConsent')
    expect(ga4Include).toContain("gtag('config',")
  })

  it('uses GA4 include and consent include in homepage and dynamic landing layout', () => {
    const homepage = readTextFile('landing-page/index.php')
    const layout = readTextFile('landing-page/_includes/layout.php')

    expect(homepage).toContain("'/_includes/ga4.php'")
    expect(layout).toContain("'/ga4.php'")
    expect(homepage).toContain("'/_includes/consent.php'")
    expect(layout).toContain("'/consent.php'")
  })

  it('defines consent banner include with analytics actions', () => {
    const consentInclude = readTextFile('landing-page/_includes/consent.php')

    expect(consentInclude).toContain('consent-banner')
    expect(consentInclude).toContain('consent-accept')
    expect(consentInclude).toContain('consent-reject')
    expect(consentInclude).toContain('consent-settings-modal')
    expect(consentInclude).toContain('localStorage.setItem(consentStorageKey')
    expect(consentInclude).toContain('window.kfApplyAnalyticsConsent')
  })

  it('removes GTM includes from landing templates and include directory', () => {
    const homepage = readTextFile('landing-page/index.php')
    const layout = readTextFile('landing-page/_includes/layout.php')

    expect(homepage).not.toContain('gtm.php')
    expect(homepage).not.toContain('gtm-noscript.php')
    expect(layout).not.toContain('gtm.php')
    expect(layout).not.toContain('gtm-noscript.php')
    expect(
      existsSync(resolve(process.cwd(), 'landing-page/_includes/gtm.php')),
    ).toBe(false)
    expect(
      existsSync(
        resolve(process.cwd(), 'landing-page/_includes/gtm-noscript.php'),
      ),
    ).toBe(false)
  })
})
