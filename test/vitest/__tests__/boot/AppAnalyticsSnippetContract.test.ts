import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('App analytics snippet contract', () => {
  it('embeds SoftwareApplication JSON-LD for web app/PWA discovery', () => {
    const appIndex = readTextFile('index.html')

    expect(appIndex).toContain('<script type="application/ld+json">')
    expect(appIndex).toContain('"@type": "SoftwareApplication"')
    expect(appIndex).toContain('"name": "Kalkulator finansowy"')
    expect(appIndex).toContain('"applicationCategory": "FinanceApplication"')
    expect(appIndex).toContain('"operatingSystem": "Web, Android"')
    expect(appIndex).toContain('"url": "https://kalkulatorfinansowy.app/app"')
    expect(appIndex).toContain('"price": "0"')
    expect(appIndex).toContain('"priceCurrency": "PLN"')
  })

  it('uses a single canonical SPA URL in canonical, Open Graph and JSON-LD metadata', () => {
    const appIndex = readTextFile('index.html')

    expect(appIndex).toContain(
      '<link rel="canonical" href="https://kalkulatorfinansowy.app/app">',
    )
    expect(appIndex).toContain(
      '<meta property="og:url" content="https://kalkulatorfinansowy.app/app" />',
    )
    expect(appIndex).toContain('"url": "https://kalkulatorfinansowy.app/app"')
  })

  it('defines deferred GA4 loader in SPA index template', () => {
    const appIndex = readTextFile('index.html')

    expect(appIndex).toContain(
      '<% if (process.env.VITE_GA_MEASUREMENT_ID && !ctx.mode.capacitor && !ctx.mode.cordova) { %>',
    )
    expect(appIndex).not.toContain(
      '<script async src="https://www.googletagmanager.com/gtag/js?id=<%= process.env.VITE_GA_MEASUREMENT_ID %>"></script>',
    )
    expect(appIndex).toContain('window.dataLayer = window.dataLayer || []')
    expect(appIndex).toContain('window.gtag = gtag')
    expect(appIndex).toContain('const loadGaScriptOnce = () => {')
    expect(appIndex).toContain(
      "const script = document.createElement('script')",
    )
    expect(appIndex).toContain(
      "script.src = 'https://www.googletagmanager.com/gtag/js?id=<%= process.env.VITE_GA_MEASUREMENT_ID %>'",
    )
    expect(appIndex).toContain("'requestIdleCallback' in window")
    expect(appIndex).toContain(
      "window.addEventListener('load', loadWhenIdle, { once: true })",
    )
    expect(appIndex).toContain(
      "gtag('consent', 'default', defaultConsentState)",
    )
    expect(appIndex).toContain(
      "gtag('config', '<%= process.env.VITE_GA_MEASUREMENT_ID %>', {",
    )
  })
})
