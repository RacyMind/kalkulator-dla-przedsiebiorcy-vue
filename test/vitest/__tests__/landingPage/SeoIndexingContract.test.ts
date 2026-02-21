import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('Landing page SEO indexing contract', () => {
  it('does not block SPA shell path in robots.txt', () => {
    const robots = readTextFile('landing-page/robots.txt')

    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Allow: /')
    expect(robots).not.toContain('Disallow: /app/')
  })

  it('keeps sitemap declaration in robots.txt', () => {
    const robots = readTextFile('landing-page/robots.txt')

    expect(robots).toContain(
      'Sitemap: https://kalkulatorfinansowy.app/sitemap.xml',
    )
  })

  it('includes SPA shell URL in sitemap.xml', () => {
    const sitemap = readTextFile('landing-page/sitemap.xml')

    expect(sitemap).toContain('<loc>https://kalkulatorfinansowy.app/app</loc>')
  })
})
