import { existsSync, statSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'
import { describe, expect, it } from 'vitest'
import {
  buildCapturePlan,
  screenshotDevices,
} from '../../../../scripts/lib/store-screenshots-config.mjs'

const toCanonicalName = (fileName: string) => {
  return fileName.replace(/-(dark|light)\.png$/u, '.png')
}

describe('Google Play screenshots asset contract', () => {
  it('keeps all generated mixed-theme screenshots ready for upload', async () => {
    const plan = buildCapturePlan({
      type: 'all',
      theme: 'mixed',
    })

    for (const entry of plan) {
      const themedPath = resolve(
        process.cwd(),
        'graphics',
        'Google Play',
        entry.type,
        entry.fileName,
      )
      const canonicalPath = resolve(
        process.cwd(),
        'graphics',
        'Google Play',
        entry.type,
        toCanonicalName(entry.fileName),
      )

      expect(
        existsSync(themedPath),
        `Missing themed asset: ${themedPath}`,
      ).toBe(true)
      expect(
        existsSync(canonicalPath),
        `Missing canonical asset: ${canonicalPath}`,
      ).toBe(true)

      const themedMetadata = await sharp(themedPath).metadata()
      const themedStats = statSync(themedPath)
      const outputSize = screenshotDevices[entry.type].output

      expect(themedMetadata.width).toBe(outputSize.width)
      expect(themedMetadata.height).toBe(outputSize.height)
      expect(themedStats.size).toBeLessThan(8 * 1024 * 1024)
    }
  })
})
