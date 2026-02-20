import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import logs from 'components/changeLogs/logs'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('Release metadata', () => {
  it('keeps latest changelog entry aligned with package version and release note content', () => {
    const packageVersion = (
      JSON.parse(readTextFile('package.json')) as { version: string }
    ).version
    const latestLog = logs[0]

    expect(latestLog.version).toBe(packageVersion)
    expect(latestLog.publish_date).toBe('2026-02-18')
    expect(latestLog.content).toContain('Poprawiono interfejs.')
    expect(latestLog.content).toContain('Zaktualizowano wyświetlenie wykresów.')
  })

  it('keeps constants store app version aligned with package version', () => {
    const packageVersion = (
      JSON.parse(readTextFile('package.json')) as { version: string }
    ).version
    const constantsStore = readTextFile('src/stores/constantsStore.ts')
    const constantsVersionMatch = constantsStore.match(/version:\s*'([^']+)'/)

    expect(constantsVersionMatch).toBeTruthy()
    expect(constantsVersionMatch?.[1]).toBe(packageVersion)
  })
})
