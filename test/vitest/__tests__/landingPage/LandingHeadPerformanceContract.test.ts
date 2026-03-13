import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('Landing head performance contract', () => {
  it('does not include external Google Fonts stylesheet in shared head include', () => {
    const headCommon = readTextFile('landing-page/_includes/head-common.php')

    expect(headCommon).toContain('href="/dist/style.css"')
    expect(headCommon).not.toContain('fonts.googleapis.com')
    expect(headCommon).not.toContain('fonts.gstatic.com')
  })

  it('defines local Roboto faces for required weights with swap rendering', () => {
    const styleCss = readTextFile('landing-page/style.css')

    expect(styleCss).toContain("font-family: 'Roboto';")
    expect(styleCss).toContain('font-weight: 400;')
    expect(styleCss).toContain('font-weight: 500;')
    expect(styleCss).toContain('font-weight: 700;')
    expect(styleCss).toContain('font-display: swap;')
    expect(styleCss).toContain(
      "src: url('/fonts/roboto/roboto-latin-ext.woff2') format('woff2');",
    )
    expect(styleCss).toContain(
      "src: url('/fonts/roboto/roboto-latin.woff2') format('woff2');",
    )
    expect(styleCss).toContain('unicode-range: U+0100-02BA')
    expect(styleCss).toContain('unicode-range: U+0000-00FF')
    expect(styleCss).toContain(
      "--font-sans: 'Roboto', system-ui, -apple-system, sans-serif;",
    )
    expect(styleCss).not.toContain('fonts.gstatic.com')
    expect(styleCss).not.toContain('fonts.googleapis.com')
  })

  it('emits local Roboto references in generated dist stylesheet', () => {
    const distStyleCss = readTextFile('landing-page/dist/style.css')

    expect(distStyleCss).toContain('/fonts/roboto/roboto-latin-ext.woff2')
    expect(distStyleCss).toContain('/fonts/roboto/roboto-latin.woff2')
    expect(distStyleCss).toContain('@font-face')
    expect(distStyleCss).toContain('font-display:swap')
    expect(distStyleCss).not.toContain('fonts.googleapis.com')
    expect(distStyleCss).not.toContain('fonts.gstatic.com')
  })

  it('configures Apache MIME and cache directives for local woff2 assets', () => {
    const htaccess = readTextFile('landing-page/.htaccess')

    expect(htaccess).toContain('AddType font/woff2 .woff2')
    expect(htaccess).toContain('ExpiresByType font/woff2 "access 1 year"')
    expect(htaccess).toContain(
      '(ico|flv|jpg|jpeg|png|gif|css|swf|webp|woff2|svg)',
    )
  })

  it('ships required local Roboto font files', () => {
    const localFontPaths = [
      'landing-page/fonts/roboto/roboto-latin-ext.woff2',
      'landing-page/fonts/roboto/roboto-latin.woff2',
    ]

    localFontPaths.forEach((relativePath) => {
      const absolutePath = resolve(process.cwd(), relativePath)

      expect(existsSync(absolutePath)).toBe(true)
      expect(statSync(absolutePath).size).toBeGreaterThan(0)
    })
  })
})
