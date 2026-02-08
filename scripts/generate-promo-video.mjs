/**
 * Generates a promotional video from scene screenshots using ffmpeg.
 * Interleaves money rain transition clips between scenes.
 * Uses xfade crossfade transitions (0.5s).
 * Output: graphics/video/promo.mp4 (1080p portrait)
 * 
 * Run: node scripts/generate-promo-video.mjs
 * Requires: ffmpeg in PATH
 */
import { execSync } from 'child_process'
import { existsSync, writeFileSync, unlinkSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')
const framesDir = resolve(rootDir, 'graphics', 'video', 'frames')
const outDir = resolve(rootDir, 'graphics', 'video')
const musicPath = resolve(outDir, 'bg-music-feeling-happy.mp3')
const moneyRainPath = resolve(outDir, 'transitions', 'money-rain.mp4')

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

// Money rain inserted between these scene indices (after scene N)
const MONEY_RAIN_AFTER = [0, 2, 4, 6]

const FADE_DURATION = 0.5
const MONEY_RAIN_DURATION = 2.0

for (const scene of scenes) {
  const srcPath = resolve(framesDir, scene.file)
  if (!existsSync(srcPath)) {
    console.error(`Missing frame: ${srcPath}`)
    process.exit(1)
  }
}

// Build interleaved sequence: scene, [money rain], scene, [money rain], ...
const sequence = []
for (let i = 0; i < scenes.length; i++) {
  sequence.push({ type: 'scene', ...scenes[i] })
  if (MONEY_RAIN_AFTER.includes(i) && existsSync(moneyRainPath)) {
    sequence.push({ type: 'transition', file: 'money-rain', duration: MONEY_RAIN_DURATION, label: '💰 Money rain' })
  }
}

// Build inputs
const inputs = sequence.map(s => {
  if (s.type === 'transition') {
    return `-i "${moneyRainPath}"`
  }
  return `-loop 1 -t ${s.duration} -i "${resolve(framesDir, s.file)}"`
}).join(' ')

// Scale all inputs to 1080x1920 first
const n = sequence.length
let filterParts = []

for (let i = 0; i < n; i++) {
  filterParts.push(
    `[${i}:v]scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:color=black,fps=25,setsar=1,settb=AVTB,format=yuv420p[s${i}]`
  )
}

// Build xfade filter chain
let cumDuration = sequence[0].duration

for (let i = 1; i < n; i++) {
  const offset = cumDuration - FADE_DURATION
  const prevLabel = i === 1 ? '[s0]' : `[v${i - 1}]`
  const nextLabel = `[s${i}]`
  const outLabel = i < n - 1 ? `[v${i}]` : '[final]'

  filterParts.push(
    `${prevLabel}${nextLabel}xfade=transition=fade:duration=${FADE_DURATION}:offset=${offset}${outLabel}`
  )

  cumDuration += sequence[i].duration - FADE_DURATION
}

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
console.log('Sequence:')
sequence.forEach(s => console.log(`  ${s.type === 'transition' ? '  ↕' : '  ▶'} ${s.label}: ${s.duration}s`))
console.log(`\nFade duration: ${FADE_DURATION}s`)
console.log(`Money rain clips: ${MONEY_RAIN_AFTER.length}`)
console.log(`Total duration: ~${totalDuration.toFixed(1)}s`)
console.log(`\nStep 1: Building video...`)

try {
  execSync(ffmpegCmd, { stdio: 'inherit', shell: true })
  console.log(`\n✓ Video (no audio) saved: ${videoOnlyPath}`)
} catch (e) {
  console.error('ffmpeg video pass failed:', e.message)
  process.exit(1)
}

// Step 2: Add subtitles
const subsPath = resolve(outDir, 'subtitles.ass')
const videoWithSubsPath = resolve(outDir, 'promo-subs.mp4')

if (existsSync(subsPath)) {
  console.log(`\nStep 2: Burning subtitles...`)
  const subsCmd = [
    FFMPEG, '-y',
    `-i "${videoOnlyPath}"`,
    `-vf "ass='graphics/video/subtitles.ass'"`,
    '-c:v libx264 -preset medium -crf 23',
    '-movflags +faststart',
    `"${videoWithSubsPath}"`,
  ].join(' ')

  try {
    execSync(subsCmd, { stdio: 'inherit', shell: true })
    unlinkSync(videoOnlyPath)
    console.log(`✓ Subtitles burned`)
  } catch (e) {
    console.error('Subtitle burn failed, continuing without:', e.message)
  }
} else {
  console.log('No subtitles.ass found, skipping.')
}

const videoForMux = existsSync(videoWithSubsPath) ? videoWithSubsPath : videoOnlyPath

// Step 3: Mux with music
if (existsSync(musicPath)) {
  console.log(`\nStep 3: Adding background music...`)

  const muxCmd = [
    FFMPEG, '-y',
    `-i "${videoForMux}"`,
    `-i "${musicPath}"`,
    '-map 0:v',
    '-map 1:a',
    '-c:v copy',
    '-af "volume=0.3,afade=t=in:st=0:d=2,afade=t=out:st=' + Math.floor(totalDuration - 3) + ':d=3"',
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

  try { unlinkSync(videoForMux) } catch {}
} else {
  const { renameSync } = await import('fs')
  renameSync(videoForMux, outPath)
  console.log(`\n✓ Video saved (no music): ${outPath}`)
}

console.log(`  Duration: ~${totalDuration.toFixed(1)}s`)
console.log(`  Resolution: 1080×1920 (portrait)`)
console.log(`  Money rain transitions: ${MONEY_RAIN_AFTER.length}`)
console.log(`  Audio: ${existsSync(musicPath) ? 'Feeling Happy (CC0)' : 'none'}`)
console.log('Done!')
