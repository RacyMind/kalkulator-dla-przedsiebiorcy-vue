/**
 * Composites raw app screenshots into device mockups.
 * Usage:
 * node scripts/generate-store-screenshots.mjs
 * node scripts/generate-store-screenshots.mjs --type phone --theme dark --style editorial --copy-source landing
 * node scripts/generate-store-screenshots.mjs --type phone --theme dark --style frame
 */
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { compositeTypeScreenshots } from './lib/store-screenshots-core.mjs'
import {
  parseStoreScreenshotCliArgs,
  resolveScreenshotTypes,
  screenshotDevices,
} from './lib/store-screenshots-config.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const args = parseStoreScreenshotCliArgs(process.argv.slice(2), {
  includeCaptureOptions: false,
})
const selectedTypes = resolveScreenshotTypes(args.type)

let totalProcessed = 0
for (const typeName of selectedTypes) {
  const config = screenshotDevices[typeName]
  const rawDir = resolve(rootDir, 'graphics', 'Google Play', config.dir, 'raw')
  const outDir = resolve(rootDir, 'graphics', 'Google Play', config.dir)

  const summary = await compositeTypeScreenshots({
    typeName,
    rawDir,
    outDir,
    theme: args.theme,
    overlay: args.overlay,
    style: args.style,
    copySource: args.copySource,
    logger: (message) => console.log(message),
  })

  totalProcessed += summary.processed

  if (summary.skippedReason) {
    console.log(`Skipped ${typeName}: ${summary.skippedReason}`)
  } else {
    console.log(`Done: ${summary.processed} ${typeName} screenshots composited`)
  }
}

if (totalProcessed === 0) {
  console.log('No screenshots processed. Check graphics/Google Play/<type>/raw/*.png')
  process.exit(1)
}

console.log(`\nAll done. Processed ${totalProcessed} screenshots.`)
