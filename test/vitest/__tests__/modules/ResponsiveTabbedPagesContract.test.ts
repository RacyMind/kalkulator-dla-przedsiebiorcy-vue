import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

const tabbedPages = [
  'src/components/accountingWithSpouse/pages/Index.vue',
  'src/components/contractOfEmployment/pages/Index.vue',
  'src/components/contractOfMandate/pages/Index.vue',
  'src/components/polishBonds/pages/Index.vue',
  'src/components/rentalProfit/pages/Index.vue',
  'src/components/selfEmployment/pages/Index.vue',
]

describe('responsive tabbed pages contract', () => {
  it('uses responsive tab panel setup and no hardcoded mobile breakpoint', () => {
    for (const pagePath of tabbedPages) {
      const pageSource = readTextFile(pagePath)

      expect(pageSource).toContain('useResponsiveTabPanels')
      expect(pageSource).toContain(':swipeable="isMobileTabMode"')
      expect(pageSource).toContain(':key="tabPanelsKey"')
      expect(pageSource).not.toContain(':breakpoint="0"')
    }
  })
})
