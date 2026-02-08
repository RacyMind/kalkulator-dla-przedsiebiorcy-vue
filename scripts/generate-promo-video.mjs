/**
 * Generates a promotional video from scene screenshots using ffmpeg.
 * Uses xfade crossfade transitions (0.5s) between scenes.
 * Output: graphics/video/promo.mp4 (1080p portrait, ~30s)
 * 
 * Run: node scripts/generate-promo-video.mjs
 * Requires: ffmpeg in PATH
 */
import { execSync } from 'child_process'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const framesDir = resolve(rootDir, 'graphics', 'video', 'frames')
const outDir = resolve(rootDir, 'graphics', 'video')
const musicPath = resolve(outDir, 'bg-music.wav')

const FFMPEG = '"C:\\Users\\HARDPC\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0.1-full_build\\bin\\ffmpeg.exe"'

const scenes = [
  { file: 'scene01-menu.png', duration: 4, label: 'Menu główne' },
  { file: 'scene02-uop-form.png', duration: 3, label: 'Umowa o pracę — formularz' },
  { file: 'scene03-uop-results.png', duration: 4, label: 'Umowa o pracę — wyniki' },
  { file: 'scene04-b2b-results.png', duration: 4, label: 'Porównywarka B2B' },
  { file: 'scene05-b2b-self-results.png', duration: 4, label: 'Samozatrudnienie' },
  { file: 'scene06-vat-results.png', duration: 4, label: 'Faktura VAT' },
  { file: 'scene07-obligacje-results.png', duration: 4, label: 'Obligacje skarbowe' },
  { file: 'scene08-menu-end.png', duration: 3, label: 'Menu — zakończenie' },
  { file: 'scene09-promo-banner.png', duration: 5, label: 'Promo banner' },
]

const FADE_DURATION = 0.5

for (const scene of scenes) {
  const srcPath = resolve(framesDir, scene.file)
  if (!existsSync(srcPath)) {
    console.error(`Missing frame: ${srcPath}`)
    process.exit(1)
  }
}

// Build ffmpeg command with xfade transitions between each pair of scenes
// Each scene is a looped image input; xfade blends them together
const inputs = scenes.map(s =>
  `-loop 1 -t ${s.duration} -i "${resolve(framesDir, s.file)}"`
).join(' ')

// Build the xfade filter chain
// xfade merges two streams at offset = (cumulative duration) - (fade_duration * transition_index)
const n = scenes.length
let filterParts = []
let cumDuration = scenes[0].duration

for (let i = 1; i < n; i++) {
  const offset = cumDuration - FADE_DURATION
  const prevLabel = i === 1 ? '[0]' : `[v${i - 1}]`
  const nextLabel = `[${i}]`
  const outLabel = i < n - 1 ? `[v${i}]` : '[vout]'

  filterParts.push(
    `${prevLabel}${nextLabel}xfade=transition=fade:duration=${FADE_DURATION}:offset=${offset}${outLabel}`
  )

  cumDuration += scenes[i].duration - FADE_DURATION
}

// Scale to 1080x1920 and set pixel format
filterParts.push('[vout]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black,format=yuv420p[final]')

const filterComplex = filterParts.join(';')
const outPath = resolve(outDir, 'promo.mp4')

const videoOnlyPath = resolve(outDir, 'promo-noaudio.mp4')

const ffmpegCmd = [
  FFMPEG, '-y',
  inputs,
  `-filter_complex "${filterComplex}"`,
  '-map "[final]"',
  '-c:v libx264',
  '-preset medium',
  '-crf 23',
  '-movflags +faststart',
  `"${videoOnlyPath}"`,
].join(' ')

const totalDuration = cumDuration
console.log('Scenes:')
scenes.forEach(s => console.log(`  ${s.label}: ${s.duration}s`))
console.log(`\nFade duration: ${FADE_DURATION}s`)
console.log(`Total duration: ~${totalDuration.toFixed(1)}s`)
console.log(`\nRunning ffmpeg...`)

try {
  execSync(ffmpegCmd, { stdio: 'inherit', shell: true })
  console.log(`\n✓ Video (no audio) saved: ${videoOnlyPath}`)
} catch (e) {
  console.error('ffmpeg video pass failed:', e.message)
  process.exit(1)
}

// Step 2: Mux video with background music
if (existsSync(musicPath)) {
  console.log(`\nAdding background music: ${musicPath}`)

  const muxCmd = [
    FFMPEG, '-y',
    `-i "${videoOnlyPath}"`,
    `-i "${musicPath}"`,
    '-map 0:v',
    '-map 1:a',
    '-c:v copy',
    '-c:a aac -b:a 128k',
    '-shortest',
    '-movflags +faststart',
    `"${outPath}"`,
  ].join(' ')

  try {
    execSync(muxCmd, { stdio: 'inherit', shell: true })
    console.log(`\n✓ Final video with music saved: ${outPath}`)
  } catch (e) {
    console.error('ffmpeg audio mux failed:', e.message)
    process.exit(1)
  }

  // Clean up intermediate file
  try { const { unlinkSync } = await import('fs'); unlinkSync(videoOnlyPath) } catch {}
} else {
  // No music file — just rename
  const { renameSync } = await import('fs')
  renameSync(videoOnlyPath, outPath)
  console.log(`\n✓ Video saved (no music): ${outPath}`)
}

console.log(`  Duration: ~${totalDuration.toFixed(1)}s`)
console.log(`  Resolution: 1080×1920 (portrait)`)
console.log(`  Transitions: ${n - 1} crossfades (${FADE_DURATION}s each)`)
console.log(`  Audio: ${existsSync(musicPath) ? 'background music (generated, royalty-free)' : 'none'}`)
console.log('Done!')
