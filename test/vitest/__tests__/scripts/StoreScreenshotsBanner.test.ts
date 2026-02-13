import { describe, expect, it } from 'vitest'
import {
  generateEditorialBaseSvg,
  getEditorialLayout,
} from '../../../../scripts/lib/store-screenshots-core.mjs'
import { screenshotDevices } from '../../../../scripts/lib/store-screenshots-config.mjs'

describe('store screenshot editorial layout', () => {
  it('keeps screenshot area inside card bounds', () => {
    const deviceConfig = screenshotDevices.phone
    const layout = getEditorialLayout(deviceConfig)

    expect(layout.screenshotX).toBeGreaterThan(layout.cardX)
    expect(layout.screenshotY).toBeGreaterThan(layout.cardY)
    expect(layout.screenshotX + layout.screenshotWidth).toBeLessThan(
      layout.cardX + layout.cardWidth,
    )
    expect(layout.screenshotY + layout.screenshotHeight).toBeLessThan(
      layout.cardY + layout.cardHeight,
    )
  })

  it('uses a tighter copy-to-mockup spacing so device frame can be taller', () => {
    const deviceConfig = screenshotDevices.phone
    const layout = getEditorialLayout(deviceConfig)
    const copyToCardGap = layout.cardY - (layout.copyTop + layout.copyHeight)

    expect(copyToCardGap).toBeLessThanOrEqual(
      Math.round(deviceConfig.output.height * 0.01),
    )
    expect(layout.screenshotHeight).toBeGreaterThan(1350)
  })

  it('renders editorial base with landing copy and no badge', () => {
    const svg = generateEditorialBaseSvg({
      config: screenshotDevices.phone,
      copy: {
        headline: 'Porownaj formy opodatkowania B2B',
        subline: 'Skala podatkowa, podatek liniowy i ryczalt w jednym miejscu.',
      },
    })

    expect(svg).toContain('Porownaj formy opodatkowania')
    expect(svg).toContain('B2B')
    expect(svg).toContain('#EAF3FF')
    expect(svg).not.toContain('Kalkulator finansowy</text>')
  })

  it('uses larger headline typography scale for phone assets', () => {
    const svg = generateEditorialBaseSvg({
      config: screenshotDevices.phone,
      copy: {
        headline: 'Twoj darmowy kalkulator wynagrodzen i podatkow',
        subline: 'Oblicz netto, skladki ZUS, PIT i VAT. Aktualne stawki 2026.',
      },
    })

    const fontSizeMatches = [...svg.matchAll(/font-size="(\d+)"/g)]
    const largestFontSize = Math.max(
      ...fontSizeMatches.map((match) => Number(match[1])),
    )

    expect(largestFontSize).toBeGreaterThanOrEqual(50)
  })
})
