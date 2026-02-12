import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readTextFile = (relativePath: string): string => {
  return readFileSync(resolve(process.cwd(), relativePath), 'utf8')
}

describe('Android metadata', () => {
  it('keeps the same app title in capacitor config and Android string resources', () => {
    const expectedTitle =
      'Kalkulator finansowy – Darmowy kalkulator wynagrodzeń i podatków'

    const capacitorConfig = JSON.parse(
      readTextFile('src-capacitor/capacitor.config.json'),
    ) as { appName: string }
    const stringsXml = readTextFile(
      'src-capacitor/android/app/src/main/res/values/strings.xml',
    )

    expect(capacitorConfig.appName).toBe(expectedTitle)
    expect(stringsXml).toContain(
      `<string name="app_name">${expectedTitle}</string>`,
    )
    expect(stringsXml).toContain(
      `<string name="title_activity_main">${expectedTitle}</string>`,
    )
  })

  it('keeps Android versionName aligned with package version and does not decrease versionCode', () => {
    const gradleConfig = readTextFile('src-capacitor/android/app/build.gradle')
    const packageVersion = (
      JSON.parse(readTextFile('package.json')) as { version: string }
    ).version

    const versionCodeMatch = gradleConfig.match(/versionCode\s+(\d+)/)
    const versionNameMatch = gradleConfig.match(/versionName\s+"([^"]+)"/)

    expect(versionCodeMatch).toBeTruthy()
    expect(versionNameMatch).toBeTruthy()
    expect(Number(versionCodeMatch?.[1])).toBeGreaterThanOrEqual(60008)
    expect(versionNameMatch?.[1]).toBe(packageVersion)
  })
})
