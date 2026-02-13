import { describe, expect, it } from 'vitest'
import {
  buildCapturePlan,
  getThemeDistribution,
  parseStoreScreenshotCliArgs,
  validateStoreScreenshotMatrix,
} from '../../../../scripts/lib/store-screenshots-config.mjs'

describe('store screenshots config', () => {
  it('builds a mixed capture plan with 50/50 theme split for phone', () => {
    const plan = buildCapturePlan({
      type: 'phone',
      theme: 'mixed',
    })
    const distribution = getThemeDistribution(plan)

    expect(plan).toHaveLength(8)
    expect(distribution.dark).toBe(4)
    expect(distribution.light).toBe(4)
  })

  it('parses defaults for generator CLI args', () => {
    const args = parseStoreScreenshotCliArgs([], {
      includeCaptureOptions: false,
      includeOverlay: true,
    })

    expect(args).toMatchObject({
      type: 'all',
      theme: 'mixed',
      style: 'editorial',
      copySource: 'landing',
      overlay: 'off',
    })
  })

  it('rejects unsupported style and copy source', () => {
    expect(() =>
      parseStoreScreenshotCliArgs(['--style', 'posterized']),
    ).toThrow('Invalid value for --style')
    expect(() =>
      parseStoreScreenshotCliArgs(['--copy-source', 'manual']),
    ).toThrow('Invalid value for --copy-source')
  })

  it('keeps screenshot matrix and marketing copy valid', () => {
    expect(validateStoreScreenshotMatrix()).toBe(true)
  })
})
