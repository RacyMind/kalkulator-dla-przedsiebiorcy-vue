 
import sharp from 'sharp'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const svgPath = resolve(rootDir, 'src/assets/app-icon.svg')
const svgBuffer = readFileSync(svgPath)

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

console.log(`Generating icons from ${svgPath}...\n`)

for (const target of targets) {
  const outputPath = resolve(rootDir, target.dir, target.name)
  await sharp(svgBuffer)
    .resize(target.size, target.size)
    .png()
    .toFile(outputPath)
  console.log(`  ✓ ${target.dir}/${target.name} (${target.size}x${target.size})`)
}

// Generate favicon.ico from 32x32 PNG
const ico32 = resolve(rootDir, 'public/icons/favicon-32x32.png')
await sharp(readFileSync(ico32))
  .resize(32, 32)
  .png()
  .toFile(resolve(rootDir, 'public/favicon.ico'))
console.log(`  ✓ public/favicon.ico (32x32)`)

console.log(`\nDone! Generated ${targets.length + 1} icon files.`)
