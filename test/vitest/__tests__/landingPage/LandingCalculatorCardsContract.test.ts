import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

const getSection = (
  contents: string,
  startMarker: string,
  endMarker: string,
): string => {
  const startIndex = contents.indexOf(startMarker)
  const endIndex = contents.indexOf(endMarker, startIndex)

  expect(startIndex).toBeGreaterThanOrEqual(0)
  expect(endIndex).toBeGreaterThan(startIndex)

  return contents.slice(startIndex, endIndex)
}

describe('Landing calculator cards contract', () => {
  it('shows exactly six calculator cards on the homepage without the VAT card', () => {
    const homepage = readTextFile('landing-page/index.php')
    const moduleSection = getSection(
      homepage,
      '<section id="moduly"',
      '    <!-- FAQ -->',
    )
    const cardLinks = moduleSection.match(
      /href="https:\/\/kalkulatorfinansowy\.app\/app\/#\//g,
    )

    expect(moduleSection).not.toContain('/kalkulator-vat/')
    expect(moduleSection).not.toContain('#/faktura-vat')
    expect(cardLinks).toHaveLength(6)
  })

  it('limits related calculators to the first three items in the shared layout', () => {
    const layout = readTextFile('landing-page/_includes/layout.php')

    expect(layout).toContain(
      "foreach (array_slice($page['related'], 0, 3) as $rel)",
    )
  })
})
