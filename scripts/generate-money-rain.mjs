/**
 * Generates "raining money" transition clip frames.
 * Animated falling banknotes/coins on blue gradient background.
 * Output: graphics/video/transitions/money-rain/ (PNG frames at 25fps)
 * 
 * Run: node scripts/generate-money-rain.mjs
 */
import { mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const outDir = resolve(rootDir, 'graphics', 'video', 'transitions')

const WIDTH = 780
const HEIGHT = 1688
const FPS = 25
const DURATION = 2.0
const TOTAL_FRAMES = Math.floor(FPS * DURATION)

mkdirSync(outDir, { recursive: true })

// Seed random for reproducibility
function seededRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807 + 0) % 2147483647
    return s / 2147483647
  }
}

const rng = seededRandom(42)

// Generate money items (banknotes + coins)
const ITEM_COUNT = 35
const items = []
for (let i = 0; i < ITEM_COUNT; i++) {
  const isCoin = rng() < 0.4
  items.push({
    x: rng() * WIDTH,
    startY: -100 - rng() * 600,
    speed: 800 + rng() * 1200,
    rotation: rng() * 360,
    rotSpeed: 60 + rng() * 200,
    size: isCoin ? 40 + rng() * 25 : 60 + rng() * 40,
    isCoin,
    wobble: rng() * 30,
    wobbleSpeed: 1 + rng() * 3,
    opacity: 0.6 + rng() * 0.4,
  })
}

function renderBanknote(x, y, w, h, rotation, opacity) {
  const cx = x + w / 2
  const cy = y + h / 2
  return `
    <g transform="translate(${cx},${cy}) rotate(${rotation.toFixed(1)}) translate(${-w/2},${-h/2})" opacity="${opacity.toFixed(2)}">
      <rect width="${w}" height="${h}" rx="4" fill="#4CAF50" stroke="#388E3C" stroke-width="1.5"/>
      <rect x="4" y="4" width="${w-8}" height="${h-8}" rx="2" fill="none" stroke="#A5D6A7" stroke-width="0.8" stroke-dasharray="2,2"/>
      <text x="${w/2}" y="${h/2 + 2}" text-anchor="middle" dominant-baseline="central" font-family="Arial" font-weight="bold" font-size="${Math.floor(h * 0.45)}" fill="#FFFFFF">PLN</text>
      <circle cx="${w*0.15}" cy="${h*0.5}" r="${h*0.12}" fill="none" stroke="#A5D6A7" stroke-width="0.8"/>
      <circle cx="${w*0.85}" cy="${h*0.5}" r="${h*0.12}" fill="none" stroke="#A5D6A7" stroke-width="0.8"/>
    </g>`
}

function renderCoin(x, y, r, rotation, opacity) {
  const squeeze = 0.3 + 0.7 * Math.abs(Math.cos(rotation * Math.PI / 180))
  return `
    <g transform="translate(${x},${y}) scale(${squeeze.toFixed(2)},1)" opacity="${opacity.toFixed(2)}">
      <circle r="${r}" fill="#FFD700" stroke="#FFA000" stroke-width="2"/>
      <circle r="${r * 0.75}" fill="none" stroke="#FFA000" stroke-width="1"/>
      <text x="0" y="2" text-anchor="middle" dominant-baseline="central" font-family="Arial" font-weight="bold" font-size="${Math.floor(r * 0.9)}" fill="#B8860B">zł</text>
    </g>`
}

console.log(`Generating ${TOTAL_FRAMES} frames (${DURATION}s at ${FPS}fps)...`)

for (let frame = 0; frame < TOTAL_FRAMES; frame++) {
  const t = frame / FPS

  // Global fade in/out
  const fadeIn = Math.min(1, t / 0.3)
  const fadeOut = Math.min(1, (DURATION - t) / 0.3)
  const globalAlpha = fadeIn * fadeOut

  let itemsSvg = ''
  for (const item of items) {
    const y = item.startY + item.speed * t
    const x = item.x + Math.sin(t * item.wobbleSpeed * Math.PI * 2) * item.wobble
    const rot = item.rotation + item.rotSpeed * t
    const alpha = item.opacity * globalAlpha

    if (y < -item.size * 2 || y > HEIGHT + item.size) continue

    if (item.isCoin) {
      itemsSvg += renderCoin(x, y, item.size / 2, rot, alpha)
    } else {
      const w = item.size
      const h = item.size * 0.5
      itemsSvg += renderBanknote(x - w / 2, y - h / 2, w, h, rot, alpha)
    }
  }

  const svg = `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="#1976D2"/>
      <stop offset="100%" stop-color="#0D47A1"/>
    </linearGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  ${itemsSvg}
</svg>`

  const paddedFrame = String(frame).padStart(4, '0')
  const outPath = resolve(outDir, `money_${paddedFrame}.png`)

  await sharp(Buffer.from(svg))
    .resize(WIDTH, HEIGHT)
    .png({ compressionLevel: 6 })
    .toFile(outPath)

  if (frame % 5 === 0) process.stdout.write(`\r  Frame ${frame + 1}/${TOTAL_FRAMES}`)
}

console.log(`\n✓ Money rain frames saved to: ${outDir}`)
console.log(`  ${TOTAL_FRAMES} frames, ${DURATION}s at ${FPS}fps`)
