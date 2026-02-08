/**
 * Generates the Facebook Cover Photo (851x315) as SVG, then converts to PNG using sharp.
 * Run: node scripts/generate-fb-cover.mjs
 */
import { mkdirSync, statSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const WIDTH = 851
const HEIGHT = 315

const appIconElements = `
  <g transform="translate(40, 55) scale(0.4)">
    <defs>
      <linearGradient id="iconBg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#1976D2"/>
        <stop offset="100%" stop-color="#1565C0"/>
      </linearGradient>
      <filter id="iconShadow" x="-10%" y="-10%" width="130%" height="130%">
        <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#000000" flood-opacity="0.3"/>
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
  <text x="290" y="120" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="44" text-anchor="start">Kalkulator finansowy</text>

  <!-- Slogan -->
  <text x="290" y="170" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="20" text-anchor="start" opacity="0.85">Twój darmowy kalkulator wynagrodzeń</text>

  <!-- Features list -->
  <text x="290" y="215" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="16" text-anchor="start" opacity="0.7">• UoP, B2B, zlecenie, dzieło — netto/brutto</text>
  <text x="290" y="240" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="16" text-anchor="start" opacity="0.7">• Porównywarka form opodatkowania</text>
  <text x="290" y="265" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="16" text-anchor="start" opacity="0.7">• IKE, IKZE, obligacje, kursy walut</text>

  <!-- URL -->
  <text x="${WIDTH / 2}" y="300" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="14" text-anchor="middle" opacity="0.4">kalkulatorfinansowy.app</text>
</svg>`

const outDir = resolve(rootDir, 'graphics', 'Facebook')
mkdirSync(outDir, { recursive: true })

const pngPath = resolve(outDir, 'cover-photo.png')

try {
  const sharpModule = (await import('sharp')).default
  await sharpModule(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(pngPath)

  const stats = statSync(pngPath)
  const sizeKB = (stats.size / 1024).toFixed(1)
  console.log(`✓ Facebook cover photo saved: ${pngPath}`)
  console.log(`  Dimensions: ${WIDTH}×${HEIGHT} px`)
  console.log(`  Size: ${sizeKB} KB`)
} catch (e) {
  console.error('Error generating FB cover:', e.message)
  process.exit(1)
}
