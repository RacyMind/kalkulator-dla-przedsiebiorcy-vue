import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const pfronSlug = 'kalkulator-refundacja-skladek-spolecznych-pfron'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('PFRON landing page smoke', () => {
  it('defines the new landing page with expected slug and CTA route', () => {
    const pageFile = readTextFile(`landing-page/_pages/${pfronSlug}.php`)

    expect(pageFile).toContain(`'slug' => '${pfronSlug}'`)
    expect(pageFile).toContain(
      "'cta_url' => 'https://kalkulatorfinansowy.app/app/#/refundacja-skladek-spolecznych-pfron'",
    )
    expect(pageFile).toContain(
      "'screenshot' => 'kalkulator-refundacja-skladek-spolecznych-pfron'",
    )
  })

  it('adds the new landing page to related calculators for business subpages with accessible icon', () => {
    const businessPages = [
      'landing-page/_pages/kalkulator-b2b.php',
      'landing-page/_pages/porownywarka-b2b.php',
      'landing-page/_pages/kalkulator-vat.php',
    ]

    for (const pagePath of businessPages) {
      const pageFile = readTextFile(pagePath)
      expect(pageFile).toContain(`'slug' => '${pfronSlug}'`)
      expect(pageFile).toContain("'icon' => $icons['accessiblePerson']")
    }
  })

  it('contains the new landing page url in sitemap', () => {
    const sitemap = readTextFile('landing-page/sitemap.xml')

    expect(sitemap).toContain(
      '<loc>https://kalkulatorfinansowy.app/kalkulator-refundacja-skladek-spolecznych-pfron/</loc>',
    )
  })

  it('contains the new landing page in footer links', () => {
    const footer = readTextFile('landing-page/_includes/footer.php')

    expect(footer).toContain(
      '<a href="/kalkulator-refundacja-skladek-spolecznych-pfron/"',
    )
  })

  it('defines the accessible icon used by the PFRON related card', () => {
    const icons = readTextFile('landing-page/_includes/icons.php')

    expect(icons).toContain("'accessiblePerson' => '<svg")
  })
})
