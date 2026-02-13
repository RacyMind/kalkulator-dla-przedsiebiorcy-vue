import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('Landing page analytics snippet contract', () => {
  it('defines GA4 gtag include with required initialization', () => {
    const ga4Include = readTextFile('landing-page/_includes/ga4.php')

    expect(ga4Include).toContain('https://www.googletagmanager.com/gtag/js?id=')
    expect(ga4Include).toContain('window.dataLayer = window.dataLayer || []')
    expect(ga4Include).toContain("gtag('config',")
  })

  it('uses GA4 include in homepage and dynamic landing layout', () => {
    const homepage = readTextFile('landing-page/index.php')
    const layout = readTextFile('landing-page/_includes/layout.php')

    expect(homepage).toContain("'/_includes/ga4.php'")
    expect(layout).toContain("'/ga4.php'")
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
