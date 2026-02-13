import { existsSync, mkdirSync, mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { afterEach, describe, expect, it } from 'vitest'
import {
  compositeTypeScreenshots,
  getEditorialLayout,
  parseScreenshotFileName,
} from '../../../../scripts/lib/store-screenshots-core.mjs'
import { screenshotDevices } from '../../../../scripts/lib/store-screenshots-config.mjs'

const tempRoots = []

const createTempDir = () => {
  const tempDir = mkdtempSync(resolve(tmpdir(), 'store-shots-'))
  tempRoots.push(tempDir)
  return tempDir
}

const createRawFixture = async (targetPath, color) => {
  await sharp({
    create: {
      width: 390,
      height: 844,
      channels: 3,
      background: color,
    },
  })
    .png()
    .toFile(targetPath)
}

const createTopMarkerFixture = async (targetPath) => {
  const markerSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="390" height="844">
    <rect x="0" y="0" width="390" height="844" fill="#1E3A8A"/>
    <rect x="0" y="0" width="390" height="120" fill="#EF4444"/>
    <rect x="0" y="724" width="390" height="120" fill="#22C55E"/>
  </svg>`

  await sharp(Buffer.from(markerSvg)).png().toFile(targetPath)
}

afterEach(() => {
  tempRoots.splice(0).forEach((dir) => {
    rmSync(dir, { recursive: true, force: true })
  })
})

describe('store screenshots generation', () => {
  it('parses raw file names with theme suffix', () => {
    expect(parseScreenshotFileName('05-faktura-vat-dark.png')).toMatchObject({
      order: 5,
      slug: 'faktura-vat',
      theme: 'dark',
    })
    expect(parseScreenshotFileName('05-faktura-vat.png')).toBeNull()
  })

  it('generates editorial style screenshots with target dimensions', async () => {
    const root = createTempDir()
    const rawDir = resolve(root, 'raw')
    const outDir = resolve(root, 'out')

    mkdirSync(rawDir, { recursive: true })
    await createRawFixture(resolve(rawDir, '01-main-menu-dark.png'), '#2D7DD2')
    await createRawFixture(
      resolve(rawDir, '02-umowa-o-prace-light.png'),
      '#F4F7FC',
    )

    const summary = await compositeTypeScreenshots({
      typeName: 'phone',
      rawDir,
      outDir,
      theme: 'mixed',
      style: 'editorial',
      copySource: 'landing',
      overlay: 'off',
    })

    const outputPath = resolve(outDir, '01-main-menu-dark.png')
    const metadata = await sharp(outputPath).metadata()

    expect(summary.processed).toBe(2)
    expect(existsSync(outputPath)).toBe(true)
    expect(metadata.width).toBe(screenshotDevices.phone.output.width)
    expect(metadata.height).toBe(screenshotDevices.phone.output.height)
  })

  it('supports fallback frame style generation', async () => {
    const root = createTempDir()
    const rawDir = resolve(root, 'raw')
    const outDir = resolve(root, 'out')

    mkdirSync(rawDir, { recursive: true })
    await createRawFixture(resolve(rawDir, '01-main-menu-dark.png'), '#0D47A1')

    const summary = await compositeTypeScreenshots({
      typeName: 'tablet-7',
      rawDir,
      outDir,
      theme: 'dark',
      style: 'frame',
      copySource: 'landing',
      overlay: 'off',
    })

    const outputPath = resolve(outDir, '01-main-menu-dark.png')
    const metadata = await sharp(outputPath).metadata()

    expect(summary.processed).toBe(1)
    expect(metadata.width).toBe(screenshotDevices['tablet-7'].output.width)
    expect(metadata.height).toBe(screenshotDevices['tablet-7'].output.height)
  })

  it('keeps top area visible for editorial screenshots (no logo clipping)', async () => {
    const root = createTempDir()
    const rawDir = resolve(root, 'raw')
    const outDir = resolve(root, 'out')

    mkdirSync(rawDir, { recursive: true })
    await createTopMarkerFixture(resolve(rawDir, '01-main-menu-dark.png'))

    await compositeTypeScreenshots({
      typeName: 'phone',
      rawDir,
      outDir,
      theme: 'dark',
      style: 'editorial',
      copySource: 'landing',
      overlay: 'off',
    })

    const outputPath = resolve(outDir, '01-main-menu-dark.png')
    const layout = getEditorialLayout(screenshotDevices.phone)
    const markerPixel = await sharp(outputPath)
      .extract({
        left: layout.screenshotX + 16,
        top: layout.screenshotY + 16,
        width: 1,
        height: 1,
      })
      .raw()
      .toBuffer()

    expect(markerPixel[0]).toBeGreaterThan(180)
    expect(markerPixel[1]).toBeLessThan(120)
    expect(markerPixel[2]).toBeLessThan(120)
  })
})
