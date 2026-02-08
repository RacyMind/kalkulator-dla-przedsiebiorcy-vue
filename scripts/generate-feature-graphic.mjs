/**
 * Generates the Google Play Feature Graphic (1024x500) as SVG, then converts to PNG using sharp.
 * Run: node scripts/generate-feature-graphic.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, statSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const WIDTH = 1024
const HEIGHT = 500

const appIconElements = `
  <g transform="translate(60, 110) scale(0.55)">
    <defs>
      <linearGradient id="iconBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1976D2"/>
        <stop offset="100%" stop-color="#1565C0"/>
      </linearGradient>
      <filter id="iconShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="12" flood-color="#000000" flood-opacity="0.35"/>
      </filter>
    </defs>
    <rect width="512" height="512" rx="96" ry="96" fill="url(#iconBg)" filter="url(#iconShadow)"/>
    <rect x="248" y="0" width="16" height="512" fill="#0D47A1" opacity="0.3" rx="0" clip-path="inset(0 round 96px)"/>
    <rect x="0" y="248" width="512" height="16" fill="#0D47A1" opacity="0.3" rx="0" clip-path="inset(0 round 96px)"/>
    <rect x="96" y="121" width="64" height="14" rx="7" fill="#FFFFFF"/>
    <rect x="121" y="96" width="14" height="64" rx="7" fill="#FFFFFF"/>
    <text x="384" y="128" fill="#FFFFFF" font-family="Arial,sans-serif" font-weight="bold" font-size="64" text-anchor="middle" dominant-baseline="central">PIT</text>
    <text x="128" y="384" fill="#FFFFFF" font-family="Arial,sans-serif" font-weight="bold" font-size="64" text-anchor="middle" dominant-baseline="central">VAT</text>
    <circle cx="362" cy="362" r="16" fill="none" stroke="#FFFFFF" stroke-width="6"/>
    <circle cx="406" cy="406" r="16" fill="none" stroke="#FFFFFF" stroke-width="6"/>
    <rect x="352" y="381" width="80" height="6" rx="3" fill="#FFFFFF" transform="rotate(-45 384 384)"/>
  </g>
`

const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1976D2"/>
      <stop offset="100%" stop-color="#0D47A1"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>

  <!-- App icon -->
  ${appIconElements}

  <!-- Title -->
  <text x="380" y="190" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="52" text-anchor="start">Kalkulator</text>
  <text x="380" y="255" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="52" text-anchor="start">finansowy</text>

  <!-- Slogan -->
  <text x="380" y="320" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="24" text-anchor="start" opacity="0.85">Twój darmowy kalkulator wynagrodzeń</text>

  <!-- URL -->
  <text x="380" y="370" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="18" text-anchor="start" opacity="0.5">kalkulatorfinansowy.app</text>
</svg>`

const outDir = resolve(rootDir, 'graphics', 'Google Play')
mkdirSync(outDir, { recursive: true })

const pngPath = resolve(outDir, 'feature-graphic.png')

try {
  const sharpModule = (await import('sharp')).default
  await sharpModule(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(pngPath)

  const stats = statSync(pngPath)
  const sizeKB = (stats.size / 1024).toFixed(1)
  console.log(`✓ Feature graphic saved: ${pngPath}`)
  console.log(`  Dimensions: ${WIDTH}×${HEIGHT} px`)
  console.log(`  Size: ${sizeKB} KB (limit: 15 MB)`)

  if (stats.size > 15 * 1024 * 1024) {
    console.warn('WARNING: File exceeds 15 MB limit!')
  }
} catch (e) {
  console.error('Error generating feature graphic:', e.message)
  process.exit(1)
}
