/**
 * Generates a promo banner frame for the end of the promotional video.
 * Blue gradient background, app icon, marketing text in Polish.
 * Output: graphics/video/frames/scene09-promo-banner.png (780x1688 — same as screenshots)
 * 
 * Run: node scripts/generate-promo-banner.mjs
 */
import { mkdirSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const WIDTH = 780
const HEIGHT = 1688

const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="#1976D2"/>
      <stop offset="100%" stop-color="#0D47A1"/>
    </linearGradient>
    <linearGradient id="iconBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#42A5F5"/>
      <stop offset="100%" stop-color="#1565C0"/>
    </linearGradient>
    <filter id="iconShadow" x="-15%" y="-15%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="20" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
    <filter id="textGlow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#000000" flood-opacity="0.3"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>

  <!-- Subtle pattern overlay -->
  <circle cx="600" cy="200" r="400" fill="#1E88E5" opacity="0.15"/>
  <circle cx="150" cy="1400" r="350" fill="#0D47A1" opacity="0.2"/>

  <!-- App icon -->
  <g transform="translate(${(WIDTH - 280) / 2}, 380)" filter="url(#iconShadow)">
    <rect width="280" height="280" rx="56" fill="url(#iconBg)"/>
    <rect x="136" y="0" width="8" height="280" fill="#0D47A1" opacity="0.25" rx="0" clip-path="inset(0 round 56px)"/>
    <rect x="0" y="136" width="280" height="8" fill="#0D47A1" opacity="0.25" rx="0" clip-path="inset(0 round 56px)"/>
    <rect x="52" y="66" width="36" height="8" rx="4" fill="#FFFFFF"/>
    <rect x="66" y="52" width="8" height="36" rx="4" fill="#FFFFFF"/>
    <text x="210" y="72" fill="#FFFFFF" font-family="Arial,sans-serif" font-weight="bold" font-size="36" text-anchor="middle" dominant-baseline="central">PIT</text>
    <text x="70" y="210" fill="#FFFFFF" font-family="Arial,sans-serif" font-weight="bold" font-size="36" text-anchor="middle" dominant-baseline="central">VAT</text>
    <circle cx="198" cy="198" r="9" fill="none" stroke="#FFFFFF" stroke-width="3.5"/>
    <circle cx="222" cy="222" r="9" fill="none" stroke="#FFFFFF" stroke-width="3.5"/>
    <rect x="192" y="208" width="44" height="3.5" rx="1.75" fill="#FFFFFF" transform="rotate(-45 210 210)"/>
  </g>

  <!-- App name -->
  <text x="${WIDTH / 2}" y="740" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="52" text-anchor="middle" filter="url(#textGlow)">Kalkulator</text>
  <text x="${WIDTH / 2}" y="800" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="52" text-anchor="middle" filter="url(#textGlow)">finansowy</text>

  <!-- Divider line -->
  <rect x="${(WIDTH - 120) / 2}" y="840" width="120" height="3" rx="1.5" fill="#FFFFFF" opacity="0.4"/>

  <!-- Marketing text -->
  <text x="${WIDTH / 2}" y="910" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="28" text-anchor="middle" opacity="0.9">Darmowy kalkulator</text>
  <text x="${WIDTH / 2}" y="950" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="28" text-anchor="middle" opacity="0.9">wynagrodzeń i podatków</text>

  <!-- Feature bullets -->
  <text x="${WIDTH / 2}" y="1060" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="24" text-anchor="middle" opacity="0.7">✓  UoP, B2B, zlecenie, dzieło</text>
  <text x="${WIDTH / 2}" y="1105" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="24" text-anchor="middle" opacity="0.7">✓  Porównywarka form opodatkowania</text>
  <text x="${WIDTH / 2}" y="1150" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="24" text-anchor="middle" opacity="0.7">✓  IKE, IKZE, obligacje skarbowe</text>
  <text x="${WIDTH / 2}" y="1195" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="24" text-anchor="middle" opacity="0.7">✓  Kursy walut NBP</text>
  <text x="${WIDTH / 2}" y="1240" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="24" text-anchor="middle" opacity="0.7">✓  Faktura VAT netto ↔ brutto</text>

  <!-- CTA -->
  <rect x="${(WIDTH - 400) / 2}" y="1350" width="400" height="64" rx="32" fill="#FFFFFF" opacity="0.15"/>
  <rect x="${(WIDTH - 396) / 2}" y="1352" width="396" height="60" rx="30" fill="none" stroke="#FFFFFF" stroke-width="2" opacity="0.5"/>
  <text x="${WIDTH / 2}" y="1388" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="bold" font-size="24" text-anchor="middle">Pobierz za darmo!</text>

  <!-- URL -->
  <text x="${WIDTH / 2}" y="1480" fill="#FFFFFF" font-family="Arial,Helvetica,sans-serif" font-weight="normal" font-size="18" text-anchor="middle" opacity="0.4">kalkulatorfinansowy.app</text>
</svg>`

const outDir = resolve(rootDir, 'graphics', 'video', 'frames')
mkdirSync(outDir, { recursive: true })

const outPath = resolve(outDir, 'scene09-promo-banner.png')

await sharp(Buffer.from(svg))
  .resize(WIDTH, HEIGHT)
  .png({ compressionLevel: 9 })
  .toFile(outPath)

console.log(`✓ Promo banner saved: ${outPath}`)
console.log(`  Dimensions: ${WIDTH}×${HEIGHT} px`)
