import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

const responsiveWidths = [400, 640, 960]

const extractLandingScreenshotSlugs = (): string[] => {
  const pagesDir = resolve(process.cwd(), 'landing-page/_pages')
  const pageFiles = readdirSync(pagesDir).filter((fileName) =>
    fileName.endsWith('.php'),
  )
  const screenshotSlugs = new Set<string>()

  pageFiles.forEach((fileName) => {
    const pagePath = resolve(pagesDir, fileName)
    const pageContent = readFileSync(pagePath, 'utf8')
    const screenshotMatch = pageContent.match(/'screenshot'\s*=>\s*'([^']+)'/)

    if (screenshotMatch?.[1]) {
      screenshotSlugs.add(screenshotMatch[1])
    }
  })

  return Array.from(screenshotSlugs).sort()
}

describe('Landing responsive images contract', () => {
  it('uses responsive srcset and sizes for homepage hero and featured screenshots', () => {
    const homepage = readTextFile('landing-page/index.php')

    expect(homepage).toContain('/images/hero-screenshot-400.webp 400w')
    expect(homepage).toContain('/images/hero-screenshot-640.webp 640w')
    expect(homepage).toContain('/images/hero-screenshot-960.webp 960w')
    expect(homepage).toContain(
      'sizes="(min-width: 768px) 512px, calc(100vw - 32px)"',
    )

    const featuredSlugs = [
      'samozatrudnienie',
      'porownywarka-b2b',
      'umowa-o-prace',
      'kalkulator-ike',
    ]

    featuredSlugs.forEach((slug) => {
      expect(homepage).toContain(`/images/modules/${slug}-400.webp 400w`)
      expect(homepage).toContain(`/images/modules/${slug}-640.webp 640w`)
      expect(homepage).toContain(`/images/modules/${slug}-960.webp 960w`)
    })

    expect(homepage).toContain(
      'sizes="(min-width: 768px) 552px, calc(100vw - 32px)"',
    )
    expect(homepage).not.toContain(
      '<source srcset="/images/hero-screenshot.webp" type="image/webp">',
    )
  })

  it('uses dynamic responsive srcset and sizes in shared landing layout', () => {
    const layout = readTextFile('landing-page/_includes/layout.php')

    expect(layout).toContain(
      "/images/modules/<?= $e($page['screenshot']) ?>-400.webp 400w",
    )
    expect(layout).toContain(
      "/images/modules/<?= $e($page['screenshot']) ?>-640.webp 640w",
    )
    expect(layout).toContain(
      "/images/modules/<?= $e($page['screenshot']) ?>-960.webp 960w",
    )
    expect(layout).toContain(
      'sizes="(min-width: 768px) 552px, calc(100vw - 32px)"',
    )
    expect(layout).not.toContain(
      '<source srcset="/images/modules/<?= $e($page[\'screenshot\']) ?>.webp" type="image/webp">',
    )
  })

  it('ships generated responsive webp variants for hero and all landing page screenshots', () => {
    const screenshotSlugs = extractLandingScreenshotSlugs()
    const requiredImagePaths: string[] = []

    responsiveWidths.forEach((width) => {
      requiredImagePaths.push(
        `landing-page/images/hero-screenshot-${width}.webp`,
      )
    })

    screenshotSlugs.forEach((screenshotSlug) => {
      responsiveWidths.forEach((width) => {
        requiredImagePaths.push(
          `landing-page/images/modules/${screenshotSlug}-${width}.webp`,
        )
      })
    })

    requiredImagePaths.forEach((relativePath) => {
      const absolutePath = resolve(process.cwd(), relativePath)

      expect(existsSync(absolutePath)).toBe(true)
      expect(statSync(absolutePath).size).toBeGreaterThan(0)
    })
  })
})
