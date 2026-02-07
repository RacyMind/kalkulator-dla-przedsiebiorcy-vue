 
import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const svgPath = resolve(rootDir, 'src/assets/app-icon.svg')
const svgWhitePath = resolve(rootDir, 'src/assets/app-icon-white.svg')
const svgBuffer = readFileSync(svgPath)
const svgWhiteBuffer = readFileSync(svgWhitePath)

const androidResDir = 'src-capacitor/android/app/src/main/res'

const targets = [
  // Favicons
  { name: 'favicon-16x16.png', size: 16, dir: 'public/icons' },
  { name: 'favicon-32x32.png', size: 32, dir: 'public/icons' },
  { name: 'favicon-96x96.png', size: 96, dir: 'public/icons' },
  { name: 'favicon-128x128.png', size: 128, dir: 'public/icons' },

  // PWA icons
  { name: 'icon-128x128.png', size: 128, dir: 'public/icons' },
  { name: 'icon-192x192.png', size: 192, dir: 'public/icons' },
  { name: 'icon-256x256.png', size: 256, dir: 'public/icons' },
  { name: 'icon-384x384.png', size: 384, dir: 'public/icons' },
  { name: 'icon-512x512.png', size: 512, dir: 'public/icons' },

  // Apple icons
  { name: 'apple-icon-120x120.png', size: 120, dir: 'public/icons' },
  { name: 'apple-icon-152x152.png', size: 152, dir: 'public/icons' },
  { name: 'apple-icon-167x167.png', size: 167, dir: 'public/icons' },
  { name: 'apple-icon-180x180.png', size: 180, dir: 'public/icons' },

  // MS icon
  { name: 'ms-icon-144x144.png', size: 144, dir: 'public/icons' },

  // Source favicon
  { name: 'favicon-512x512.png', size: 512, dir: 'src/assets' },
  { name: 'favicon-512x512.png', size: 512, dir: 'public/icons' },
]

// Android launcher icons (full icon with background)
const androidIconTargets = [
  { name: 'ic_launcher.png', size: 72, dir: `${androidResDir}/mipmap-hdpi` },
  { name: 'ic_launcher.png', size: 48, dir: `${androidResDir}/mipmap-mdpi` },
  { name: 'ic_launcher.png', size: 96, dir: `${androidResDir}/mipmap-xhdpi` },
  { name: 'ic_launcher.png', size: 144, dir: `${androidResDir}/mipmap-xxhdpi` },
  { name: 'ic_launcher.png', size: 192, dir: `${androidResDir}/mipmap-xxxhdpi` },
  { name: 'ic_launcher_round.png', size: 72, dir: `${androidResDir}/mipmap-hdpi` },
  { name: 'ic_launcher_round.png', size: 48, dir: `${androidResDir}/mipmap-mdpi` },
  { name: 'ic_launcher_round.png', size: 96, dir: `${androidResDir}/mipmap-xhdpi` },
  { name: 'ic_launcher_round.png', size: 144, dir: `${androidResDir}/mipmap-xxhdpi` },
  { name: 'ic_launcher_round.png', size: 192, dir: `${androidResDir}/mipmap-xxxhdpi` },
]

// Android adaptive icon foreground (108dp with 18dp padding = icon at 66% centered)
const androidForegroundTargets = [
  { name: 'ic_launcher_foreground.png', size: 162, dir: `${androidResDir}/mipmap-hdpi` },
  { name: 'ic_launcher_foreground.png', size: 108, dir: `${androidResDir}/mipmap-mdpi` },
  { name: 'ic_launcher_foreground.png', size: 216, dir: `${androidResDir}/mipmap-xhdpi` },
  { name: 'ic_launcher_foreground.png', size: 324, dir: `${androidResDir}/mipmap-xxhdpi` },
  { name: 'ic_launcher_foreground.png', size: 432, dir: `${androidResDir}/mipmap-xxxhdpi` },
]

// Android splash screens
const androidSplashTargets = [
  { name: 'splash.png', width: 320, height: 480, dir: `${androidResDir}/drawable-port-mdpi` },
  { name: 'splash.png', width: 480, height: 800, dir: `${androidResDir}/drawable-port-hdpi` },
  { name: 'splash.png', width: 720, height: 1280, dir: `${androidResDir}/drawable-port-xhdpi` },
  { name: 'splash.png', width: 960, height: 1600, dir: `${androidResDir}/drawable-port-xxhdpi` },
  { name: 'splash.png', width: 1280, height: 1920, dir: `${androidResDir}/drawable-port-xxxhdpi` },
  { name: 'splash.png', width: 480, height: 320, dir: `${androidResDir}/drawable-land-mdpi` },
  { name: 'splash.png', width: 800, height: 480, dir: `${androidResDir}/drawable-land-hdpi` },
  { name: 'splash.png', width: 1280, height: 720, dir: `${androidResDir}/drawable-land-xhdpi` },
  { name: 'splash.png', width: 1600, height: 960, dir: `${androidResDir}/drawable-land-xxhdpi` },
  { name: 'splash.png', width: 1920, height: 1280, dir: `${androidResDir}/drawable-land-xxxhdpi` },
  { name: 'splash.png', width: 480, height: 320, dir: `${androidResDir}/drawable` },
]

const BRAND_COLOR = { r: 21, g: 101, b: 192 }

let totalGenerated = 0

// --- Web / PWA icons ---
console.log(`Generating icons from ${svgPath}...\n`)

for (const target of targets) {
  const outputPath = resolve(rootDir, target.dir, target.name)
  await sharp(svgBuffer)
    .resize(target.size, target.size)
    .png()
    .toFile(outputPath)
  console.log(`  ✓ ${target.dir}/${target.name} (${target.size}x${target.size})`)
  totalGenerated++
}

const ico32 = resolve(rootDir, 'public/icons/favicon-32x32.png')
await sharp(readFileSync(ico32))
  .resize(32, 32)
  .png()
  .toFile(resolve(rootDir, 'public/favicon.ico'))
console.log(`  ✓ public/favicon.ico (32x32)`)
totalGenerated++

// --- Android launcher icons ---
console.log(`\nGenerating Android launcher icons...\n`)

for (const target of androidIconTargets) {
  const outputPath = resolve(rootDir, target.dir, target.name)
  mkdirSync(dirname(outputPath), { recursive: true })
  await sharp(svgBuffer)
    .resize(target.size, target.size)
    .png()
    .toFile(outputPath)
  console.log(`  ✓ ${target.dir}/${target.name} (${target.size}x${target.size})`)
  totalGenerated++
}

// --- Android adaptive icon foreground ---
console.log(`\nGenerating Android adaptive icon foregrounds...\n`)

for (const target of androidForegroundTargets) {
  const outputPath = resolve(rootDir, target.dir, target.name)
  mkdirSync(dirname(outputPath), { recursive: true })
  const iconSize = Math.round(target.size * 0.5)
  const padding = Math.round((target.size - iconSize) / 2)
  const iconBuffer = await sharp(svgWhiteBuffer)
    .resize(iconSize, iconSize)
    .png()
    .toBuffer()
  await sharp({
    create: {
      width: target.size,
      height: target.size,
      channels: 4,
      background: { ...BRAND_COLOR, alpha: 1 },
    },
  })
    .composite([{ input: iconBuffer, left: padding, top: padding }])
    .png()
    .toFile(outputPath)
  console.log(`  ✓ ${target.dir}/${target.name} (${target.size}x${target.size})`)
  totalGenerated++
}

// --- Android splash screens ---
console.log(`\nGenerating Android splash screens...\n`)

for (const target of androidSplashTargets) {
  const outputPath = resolve(rootDir, target.dir, target.name)
  mkdirSync(dirname(outputPath), { recursive: true })
  const minDim = Math.min(target.width, target.height)
  const iconSize = Math.round(minDim * 0.35)
  const iconBuffer = await sharp(svgWhiteBuffer)
    .resize(iconSize, iconSize)
    .png()
    .toBuffer()
  const left = Math.round((target.width - iconSize) / 2)
  const top = Math.round((target.height - iconSize) / 2)
  await sharp({
    create: {
      width: target.width,
      height: target.height,
      channels: 4,
      background: { ...BRAND_COLOR, alpha: 1 },
    },
  })
    .composite([{ input: iconBuffer, left, top }])
    .png()
    .toFile(outputPath)
  console.log(`  ✓ ${target.dir}/${target.name} (${target.width}x${target.height})`)
  totalGenerated++
}

console.log(`\nDone! Generated ${totalGenerated} files.`)
