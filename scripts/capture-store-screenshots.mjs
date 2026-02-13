/**
 * Captures raw Google Play screenshots from a running app using Chrome remote debugging (CDP).
 * Usage:
 * node scripts/capture-store-screenshots.mjs
 * node scripts/capture-store-screenshots.mjs --type phone --theme mixed --base-url http://localhost:9200 --debug-endpoint http://127.0.0.1:9222/json
 */
import { mkdirSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { setTimeout as delay } from 'timers/promises'
import {
  buildCapturePlan,
  getThemeDistribution,
  parseStoreScreenshotCliArgs,
  removableCaptureSelectors,
  screenshotDevices,
} from './lib/store-screenshots-config.mjs'
import { createChromeCdpClient } from './lib/chrome-cdp-client.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const args = parseStoreScreenshotCliArgs(process.argv.slice(2), {
  includeOverlay: false,
})
const slugArgIndex = process.argv.indexOf('--slug')
const requestedSlug =
  slugArgIndex !== -1 && process.argv[slugArgIndex + 1]
    ? process.argv[slugArgIndex + 1]
    : null

let capturePlan = buildCapturePlan({
  type: args.type,
  theme: args.theme,
})

if (requestedSlug) {
  capturePlan = capturePlan.filter((entry) => entry.slug === requestedSlug)
}

if (!capturePlan.length) {
  console.log('Capture plan is empty, nothing to do')
  process.exit(1)
}

const toRouteUrl = (baseUrl, route) => {
  const normalizedBase = baseUrl.replace(/\/$/, '')
  const normalizedRoute = route === '/' ? '/' : route
  return `${normalizedBase}/#${normalizedRoute}`
}

const buildStorageExpression = (theme) => {
  return `(() => {
    localStorage.setItem('themeMode', '${theme}')
    localStorage.setItem('premium/isPremiumActive', 'true')
    localStorage.setItem('premium/status', 'ready')
    return true
  })()`
}

const buildCleanupExpression = ({
  shouldClickCalculate,
}) => {
  const selectorsJson = JSON.stringify(removableCaptureSelectors)
  return `(() => {
    const selectors = ${selectorsJson}
    selectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((node) => node.remove())
    })

    const nodes = Array.from(document.querySelectorAll('button, a, [role="button"], .q-btn'))
    nodes.forEach((node) => {
      const text = (node.textContent || '').toLowerCase()
      if (text.includes('wesprzyj')) {
        node.remove()
      }
    })

    if (${shouldClickCalculate ? 'true' : 'false'}) {
      const calculateNode = nodes.find((node) =>
        (node.textContent || '').toLowerCase().includes('oblicz')
      )
      if (calculateNode) {
        calculateNode.click()
      }
    }

    window.scrollTo(0, 0)
    return true
  })()`
}

const buildFillExpression = (slug) => {
  return `(async () => {
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

    const dispatch = (element) => {
      element.dispatchEvent(new Event('input', { bubbles: true }))
      element.dispatchEvent(new Event('change', { bubbles: true }))
      element.dispatchEvent(new Event('blur', { bubbles: true }))
    }

    const setInputValue = (input, value) => {
      input.focus()
      input.value = String(value)
      dispatch(input)
    }

    const pickLawRuleYear = async () => {
      const lawRuleField = Array.from(document.querySelectorAll('.q-field'))
        .find((field) => (field.textContent || '').toLowerCase().includes('data obowiązywania przepisów'))

      if (!lawRuleField) {
        return false
      }

      const clickable = lawRuleField.querySelector('.q-field__control') || lawRuleField
      clickable.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      clickable.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      clickable.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wait(180)

      const yearOption = Array.from(document.querySelectorAll('.q-item'))
        .find((item) => (item.textContent || '').trim() === '2026')

      if (!yearOption) {
        return false
      }

      yearOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
      yearOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
      yearOption.dispatchEvent(new MouseEvent('click', { bubbles: true }))
      await wait(120)
      return true
    }

    await pickLawRuleYear()

    if ('${slug}' === 'faktura-vat') {
      const amountField = Array.from(document.querySelectorAll('.q-field'))
        .find((field) => (field.textContent || '').toLowerCase().includes('kwota'))
      const amountInput = amountField?.querySelector('input')
      if (amountInput) {
        setInputValue(amountInput, '5000')
      }
    }

    return true
  })()`
}

const validateNoVisibleErrorsExpression = `(() => {
  const hasFieldError = !!document.querySelector('.q-field--error')
  const hasErrorNotification = Array.from(document.querySelectorAll('.q-notification'))
    .some((node) => /(błęd|error)/i.test(node.textContent || ''))
  return {
    hasFieldError,
    hasErrorNotification,
  }
})()`

const applyViewport = async (client, viewport) => {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: viewport.width,
    height: viewport.height,
    deviceScaleFactor: viewport.deviceScaleFactor,
    mobile: viewport.isMobile,
    screenWidth: viewport.width,
    screenHeight: viewport.height,
  })
  await client.send('Emulation.setTouchEmulationEnabled', {
    enabled: viewport.hasTouch,
    maxTouchPoints: viewport.hasTouch ? 5 : 0,
  })
}

const { client, target } = await createChromeCdpClient({
  debugEndpoint: args.debugEndpoint,
  preferredBaseUrl: args.baseUrl,
})

console.log(`Connected to Chrome target: ${target.title || target.url}`)

let capturedCount = 0
try {
  for (const entry of capturePlan) {
    const deviceConfig = screenshotDevices[entry.type]
    const routeUrl = toRouteUrl(args.baseUrl, entry.route)
    const rawOutPath = resolve(
      rootDir,
      'graphics',
      'Google Play',
      deviceConfig.dir,
      'raw',
      entry.fileName,
    )

    mkdirSync(dirname(rawOutPath), { recursive: true })

    await applyViewport(client, deviceConfig.viewport)
    await client.navigate(routeUrl)
    await client.evaluate(buildStorageExpression(entry.theme))
    await client.reload()
    await client.evaluate(buildFillExpression(entry.slug))
    await delay(250)
    await client.evaluate(
      buildCleanupExpression({
        shouldClickCalculate: entry.requiresCalculation,
      }),
    )
    await delay(entry.requiresCalculation ? 750 : 450)
    const validationState = await client.evaluate(
      validateNoVisibleErrorsExpression,
    )
    if (validationState?.hasFieldError || validationState?.hasErrorNotification) {
      throw new Error(
        `Cannot capture ${entry.slug}: form has visible validation errors`,
      )
    }
    await client.evaluate(buildCleanupExpression({ shouldClickCalculate: false }))
    await delay(300)

    const screenshotData = await client.captureScreenshot()
    writeFileSync(rawOutPath, Buffer.from(screenshotData, 'base64'))

    capturedCount += 1
    console.log(`✓ Captured ${entry.type}/raw/${entry.fileName}`)
  }
} finally {
  await client.close()
}

const distribution = getThemeDistribution(capturePlan)
console.log(`\nCaptured files: ${capturedCount}`)
console.log(
  `Theme mix: dark ${distribution.dark}, light ${distribution.light}, total ${distribution.total}`,
)
