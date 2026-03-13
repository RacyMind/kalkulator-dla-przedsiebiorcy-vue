import { existsSync, readFileSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('Landing favicon contract', () => {
  it('emits the full favicon and manifest set from the shared head include', () => {
    const headCommon = readTextFile('landing-page/_includes/head-common.php')

    expect(headCommon).toContain('href="/favicon.svg"')
    expect(headCommon).toContain('sizes="48x48" href="/favicon-48x48.png"')
    expect(headCommon).toContain('sizes="32x32" href="/favicon-32x32.png"')
    expect(headCommon).toContain('sizes="16x16" href="/favicon-16x16.png"')
    expect(headCommon).toContain('href="/apple-touch-icon.png"')
    expect(headCommon).toContain('href="/site.webmanifest"')
    expect(headCommon).toContain(
      'href="/safari-pinned-tab.svg" color="#1565C0"',
    )
    expect(headCommon).toContain('href="/favicon.ico"')
    expect(headCommon).toContain(
      '<meta name="msapplication-TileColor" content="#1565C0">',
    )
  })

  it('ships all root-served favicon assets', () => {
    const requiredAssetPaths = [
      'landing-page/favicon.ico',
      'landing-page/favicon.svg',
      'landing-page/favicon-16x16.png',
      'landing-page/favicon-32x32.png',
      'landing-page/favicon-48x48.png',
      'landing-page/apple-touch-icon.png',
      'landing-page/safari-pinned-tab.svg',
      'landing-page/site.webmanifest',
    ]

    requiredAssetPaths.forEach((relativePath) => {
      const absolutePath = resolve(process.cwd(), relativePath)

      expect(existsSync(absolutePath)).toBe(true)
      expect(statSync(absolutePath).size).toBeGreaterThan(0)
    })
  })

  it('ships a valid ico container for browser fallback requests', () => {
    const faviconIco = readFileSync(
      resolve(process.cwd(), 'landing-page/favicon.ico'),
    )

    expect(faviconIco.readUInt16LE(0)).toBe(0)
    expect(faviconIco.readUInt16LE(2)).toBe(1)
    expect(faviconIco.readUInt16LE(4)).toBe(2)
  })

  it('defines a landing page manifest that installs into the calculator app', () => {
    const manifestText = readTextFile('landing-page/site.webmanifest')
    const manifest = JSON.parse(manifestText) as {
      name: string
      short_name: string
      display: string
      start_url: string
      background_color: string
      theme_color: string
      icons: Array<{ src: string; sizes: string; type: string }>
    }

    expect(manifest.name).toBe('Kalkulator finansowy')
    expect(manifest.short_name).toBe('Kalkulator finansowy')
    expect(manifest.display).toBe('minimal-ui')
    expect(manifest.start_url).toBe('/app/')
    expect(manifest.background_color).toBe('#1565C0')
    expect(manifest.theme_color).toBe('#1565C0')
    expect(manifest.icons).toEqual([
      {
        src: '/images/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ])
  })

  it('configures Apache MIME and cache headers for manifest and svg favicon assets', () => {
    const htaccess = readTextFile('landing-page/.htaccess')

    expect(htaccess).toContain('AddType image/svg+xml .svg')
    expect(htaccess).toContain('AddType application/manifest+json .webmanifest')
    expect(htaccess).toContain('ExpiresByType image/svg+xml "access 1 year"')
    expect(htaccess).toContain(
      'ExpiresByType application/manifest+json "access 1 day"',
    )
    expect(htaccess).toContain(
      '(ico|flv|jpg|jpeg|png|gif|css|swf|webp|woff2|svg)',
    )
    expect(htaccess).toContain('<filesmatch "\\.(webmanifest)$">')
    expect(htaccess).toContain(
      'Header set Cache-Control "max-age=86400, public"',
    )
  })
})
