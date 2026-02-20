import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('App analytics snippet contract', () => {
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
