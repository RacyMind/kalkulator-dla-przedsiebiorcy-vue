/**
 * Composites raw app screenshots into device mockup frames with branded backgrounds.
 * Usage: node scripts/generate-store-screenshots.mjs [--type phone|tablet-7|tablet-10]
 * If no --type is specified, processes all types.
 * 
 * Reads raw screenshots from graphics/Google Play/<type>/raw/
 * Outputs composited images to graphics/Google Play/<type>/
 */
import sharp from 'sharp'
import { readdirSync, existsSync, mkdirSync } from 'fs'
import { resolve, dirname, basename } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const CONFIGS = {
  phone: {
    output: { width: 1080, height: 1920 },
    viewport: { width: 390, height: 844 },
    frame: { borderRadius: 40, bezelTop: 80, bezelBottom: 80, bezelSide: 24, notch: true },
    dir: 'phone',
  },
  'tablet-7': {
    output: { width: 1200, height: 2048 },
    viewport: { width: 600, height: 1024 },
    frame: { borderRadius: 30, bezelTop: 60, bezelBottom: 60, bezelSide: 40, notch: false },
    dir: 'tablet-7',
  },
  'tablet-10': {
    output: { width: 1600, height: 2560 },
    viewport: { width: 800, height: 1280 },
    frame: { borderRadius: 36, bezelTop: 70, bezelBottom: 70, bezelSide: 50, notch: false },
    dir: 'tablet-10',
  },
}

function generateFrameSvg(config) {
  const { output, frame } = config
  const { width: W, height: H } = output
  const { borderRadius: r, bezelTop, bezelBottom, bezelSide, notch } = frame

  const screenX = bezelSide
  const screenY = bezelTop
  const screenW = W - 2 * bezelSide
  const screenH = H - bezelTop - bezelBottom

  const notchSvg = notch
    ? `<rect x="${W / 2 - 60}" y="0" width="120" height="28" rx="14" fill="#1a1a1a"/>`
    : ''

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="#1976D2"/>
      <stop offset="100%" stop-color="#0D47A1"/>
    </linearGradient>
    <filter id="frameShadow" x="-5%" y="-3%" width="110%" height="106%">
      <feDropShadow dx="0" dy="8" stdDeviation="20" flood-color="#000000" flood-opacity="0.4"/>
    </filter>
    <clipPath id="screenClip">
      <rect x="${screenX}" y="${screenY}" width="${screenW}" height="${screenH}" rx="8"/>
    </clipPath>
  </defs>

  <!-- Background gradient -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>

  <!-- Device frame -->
  <rect x="${bezelSide - 4}" y="${bezelTop - 20}" width="${screenW + 8}" height="${screenH + 40}" rx="${r}" fill="#1a1a1a" filter="url(#frameShadow)"/>
  <rect x="${bezelSide - 2}" y="${bezelTop - 18}" width="${screenW + 4}" height="${screenH + 36}" rx="${r - 2}" fill="#2a2a2a"/>

  <!-- Notch -->
  ${notchSvg}

  <!-- Screen area (placeholder - will be composited) -->
  <rect x="${screenX}" y="${screenY}" width="${screenW}" height="${screenH}" rx="8" fill="#000000"/>
</svg>`
}

async function processType(typeName) {
  const config = CONFIGS[typeName]
  if (!config) {
    console.error(`Unknown type: ${typeName}`)
    return
  }

  const rawDir = resolve(rootDir, 'graphics', 'Google Play', config.dir, 'raw')
  const outDir = resolve(rootDir, 'graphics', 'Google Play', config.dir)

  if (!existsSync(rawDir)) {
    console.log(`No raw directory found: ${rawDir}, skipping ${typeName}`)
    return
  }

  const files = readdirSync(rawDir).filter(f => f.endsWith('.png'))
  if (files.length === 0) {
    console.log(`No PNG files in ${rawDir}, skipping ${typeName}`)
    return
  }

  mkdirSync(outDir, { recursive: true })

  const { output, frame } = config
  const screenX = frame.bezelSide
  const screenY = frame.bezelTop
  const screenW = output.width - 2 * frame.bezelSide
  const screenH = output.height - frame.bezelTop - frame.bezelBottom

  const frameSvg = generateFrameSvg(config)
  const frameBuffer = await sharp(Buffer.from(frameSvg))
    .resize(output.width, output.height)
    .png()
    .toBuffer()

  for (const file of files) {
    const rawPath = resolve(rawDir, file)
    const outPath = resolve(outDir, file)

    const screenshot = await sharp(rawPath)
      .resize(screenW, screenH, { fit: 'cover' })
      .png()
      .toBuffer()

    await sharp(frameBuffer)
      .composite([
        {
          input: screenshot,
          top: screenY,
          left: screenX,
        },
      ])
      .png({ quality: 90, compressionLevel: 9 })
      .toFile(outPath)

    console.log(`✓ ${typeName}/${file} (${output.width}×${output.height})`)
  }

  console.log(`Done: ${files.length} ${typeName} screenshots composited`)
}

const args = process.argv.slice(2)
const typeArg = args.indexOf('--type')
const types = typeArg !== -1 && args[typeArg + 1]
  ? [args[typeArg + 1]]
  : Object.keys(CONFIGS)

for (const t of types) {
  await processType(t)
}

console.log('\nAll done!')
