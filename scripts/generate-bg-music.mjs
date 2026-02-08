/**
 * Generates a relaxed lo-fi ambient background music track.
 * Deep pads, pentatonic scale, slow LFO, warm filtered sound.
 * Uses raw PCM synthesis — no copyright issues.
 * Output: graphics/video/bg-music.wav (~32s, 44100Hz, 16-bit stereo)
 * 
 * Run: node scripts/generate-bg-music.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = resolve(__dirname, '..')

const SAMPLE_RATE = 44100
const DURATION = 32
const TOTAL_SAMPLES = SAMPLE_RATE * DURATION
const VOLUME = 0.10

// C pentatonic — dreamy, no tension
// Using low octave for warmth
const C3 = 130.81, D3 = 146.83, E3 = 164.81, G3 = 196.00, A3 = 220.00
const C4 = 261.63, E4 = 329.63, G4 = 392.00

// Slow chord pads — long crossfades between them
const PADS = [
  { notes: [C3, G3, C4, E4], duration: 8 },
  { notes: [A3 * 0.5, E3, A3, C4], duration: 8 },
  { notes: [D3 * 0.5, D3, A3, D3 * 2], duration: 8 },
  { notes: [C3, G3, C4, E4], duration: 8 },
]

// Soft triangle-ish wave (rounder than sine, warmer than square)
function softWave(phase) {
  const s = Math.sin(phase)
  return s * (1 - 0.15 * s * s) // slight saturation for warmth
}

// Simple one-pole low-pass filter state
let lpL = 0, lpR = 0
function lowPass(sample, cutoff) {
  const rc = 1.0 / (2 * Math.PI * cutoff)
  const alpha = 1.0 / (rc * SAMPLE_RATE + 1)
  return alpha * sample + (1 - alpha)
}

const bufferL = new Float64Array(TOTAL_SAMPLES)
const bufferR = new Float64Array(TOTAL_SAMPLES)

let globalSample = 0

for (const pad of PADS) {
  const padSamples = Math.floor(pad.duration * SAMPLE_RATE)
  const crossfade = SAMPLE_RATE * 2 // 2s crossfade

  for (let i = 0; i < padSamples && globalSample < TOTAL_SAMPLES; i++) {
    const t = globalSample / SAMPLE_RATE

    // Pad envelope: very slow attack (2s) and release (2s)
    const attack = Math.min(1, i / crossfade)
    const release = Math.min(1, (padSamples - i) / crossfade)
    const env = attack * release

    // Global fade in (3s) and fade out (4s)
    const gIn = Math.min(1, globalSample / (SAMPLE_RATE * 3))
    const gOut = Math.min(1, (TOTAL_SAMPLES - globalSample) / (SAMPLE_RATE * 4))

    // Slow LFO for gentle movement (0.08 Hz — one cycle per ~12s)
    const lfo = 0.5 + 0.5 * Math.sin(2 * Math.PI * 0.08 * t)

    let sampleL = 0, sampleR = 0

    for (let n = 0; n < pad.notes.length; n++) {
      const freq = pad.notes[n]

      // Slight stereo spread: detune L/R differently
      const detuneL = 1.0 - 0.001 * (n % 2)
      const detuneR = 1.0 + 0.001 * (n % 2)

      const phaseL = 2 * Math.PI * freq * detuneL * t
      const phaseR = 2 * Math.PI * freq * detuneR * t

      // Layer: fundamental + soft octave above
      const ampBase = 0.4 + 0.1 * lfo
      const ampOctave = 0.15 - 0.05 * lfo

      sampleL += softWave(phaseL) * ampBase + softWave(phaseL * 2) * ampOctave
      sampleR += softWave(phaseR) * ampBase + softWave(phaseR * 2) * ampOctave
    }

    const noteCount = pad.notes.length
    sampleL = sampleL / noteCount * env * gIn * gOut * VOLUME
    sampleR = sampleR / noteCount * env * gIn * gOut * VOLUME

    // Simple low-pass filter for warmth (cutoff modulated by LFO)
    const cutoff = 600 + 400 * lfo
    const rc = 1.0 / (2 * Math.PI * cutoff)
    const alpha = 1.0 / (rc * SAMPLE_RATE + 1)
    lpL = lpL + alpha * (sampleL - lpL)
    lpR = lpR + alpha * (sampleR - lpR)

    bufferL[globalSample] = (bufferL[globalSample] || 0) + lpL
    bufferR[globalSample] = (bufferR[globalSample] || 0) + lpR

    globalSample++
  }

  // Rewind for crossfade overlap with next pad
  globalSample -= Math.min(Math.floor(crossfade * 0.5), globalSample)
}

// Normalize and write
let maxVal = 0
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  maxVal = Math.max(maxVal, Math.abs(bufferL[i]), Math.abs(bufferR[i]))
}
const norm = maxVal > 0 ? 0.85 / maxVal : 1

const pcm = Buffer.alloc(TOTAL_SAMPLES * 4) // 16-bit stereo = 4 bytes/sample
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const l = Math.max(-1, Math.min(1, bufferL[i] * norm))
  const r = Math.max(-1, Math.min(1, bufferR[i] * norm))
  pcm.writeInt16LE(Math.floor(l * 32767), i * 4)
  pcm.writeInt16LE(Math.floor(r * 32767), i * 4 + 2)
}

// WAV header (stereo)
const outDir = resolve(rootDir, 'graphics', 'video')
mkdirSync(outDir, { recursive: true })
const outPath = resolve(outDir, 'bg-music.wav')

const dataSize = TOTAL_SAMPLES * 4
const wavHeader = Buffer.alloc(44)
wavHeader.write('RIFF', 0)
wavHeader.writeUInt32LE(dataSize + 36, 4)
wavHeader.write('WAVE', 8)
wavHeader.write('fmt ', 12)
wavHeader.writeUInt32LE(16, 16)
wavHeader.writeUInt16LE(1, 20)        // PCM
wavHeader.writeUInt16LE(2, 22)        // stereo
wavHeader.writeUInt32LE(SAMPLE_RATE, 24)
wavHeader.writeUInt32LE(SAMPLE_RATE * 4, 28) // byte rate (stereo 16-bit)
wavHeader.writeUInt16LE(4, 32)        // block align
wavHeader.writeUInt16LE(16, 34)       // bits per sample
wavHeader.write('data', 36)
wavHeader.writeUInt32LE(dataSize, 40)

writeFileSync(outPath, Buffer.concat([wavHeader, pcm]))

const sizeKB = ((dataSize + 44) / 1024).toFixed(1)
console.log(`✓ Background music saved: ${outPath}`)
console.log(`  Duration: ${DURATION}s`)
console.log(`  Format: ${SAMPLE_RATE} Hz, 16-bit stereo`)
console.log(`  Size: ${sizeKB} KB`)
console.log(`  Style: relaxed ambient pad, C pentatonic`)
console.log(`  License: Generated — no copyright`)
