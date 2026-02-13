import { existsSync, mkdirSync, readdirSync } from 'fs'
import { resolve } from 'path'
import sharp from 'sharp'
import {
  editorialLayoutConfig,
  screenshotDevices,
  screenshotMarketingCopyBySlug,
} from './store-screenshots-config.mjs'

const rawScreenshotPattern = /^(\d{2})-([a-z0-9-]+)-(light|dark)\.png$/i

const escapeXml = (value) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export const parseScreenshotFileName = (fileName) => {
  const match = rawScreenshotPattern.exec(fileName)
  if (!match) {
    return null
  }

  return {
    order: Number(match[1]),
    slug: match[2],
    theme: match[3].toLowerCase(),
    fileName,
  }
}

export const getScreenBounds = (config) => {
  const { output, frame } = config
  return {
    x: frame.bezelSide,
    y: frame.bezelTop,
    width: output.width - 2 * frame.bezelSide,
    height: output.height - frame.bezelTop - frame.bezelBottom,
  }
}

export const getEditorialLayout = (config) => {
  const { width, height } = config.output
  const outerPadding = Math.round(width * 0.048)
  const copyTop = outerPadding
  const copyHeight = Math.round(height * 0.205)
  const cardX = outerPadding
  const cardY = copyTop + copyHeight + Math.round(height * 0.009)
  const cardWidth = width - 2 * outerPadding
  const cardHeight = height - cardY - outerPadding
  const cardInnerPadding = Math.max(14, Math.round(width * 0.012))
  const screenshotX = cardX + cardInnerPadding
  const screenshotY = cardY + cardInnerPadding
  const screenshotWidth = cardWidth - 2 * cardInnerPadding
  const screenshotHeight = cardHeight - 2 * cardInnerPadding

  return {
    copyTop,
    copyHeight,
    cardX,
    cardY,
    cardWidth,
    cardHeight,
    cardInnerPadding,
    screenshotX,
    screenshotY,
    screenshotWidth,
    screenshotHeight,
    cardRadius: Math.round(width * 0.024),
    screenshotRadius: Math.round(width * 0.018),
  }
}

export const generateFrameSvg = (config) => {
  const { output, frame } = config
  const bounds = getScreenBounds(config)
  const notchSvg = frame.notch
    ? `<rect x="${output.width / 2 - 60}" y="0" width="120" height="28" rx="14" fill="#1a1a1a"/>`
    : ''

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${output.width}" height="${output.height}" viewBox="0 0 ${output.width} ${output.height}">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0%" stop-color="#1976D2"/>
      <stop offset="100%" stop-color="#0D47A1"/>
    </linearGradient>
    <filter id="frameShadow" x="-5%" y="-3%" width="110%" height="106%">
      <feDropShadow dx="0" dy="8" stdDeviation="20" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <rect width="${output.width}" height="${output.height}" fill="url(#bgGrad)"/>
  <rect x="${frame.bezelSide - 4}" y="${frame.bezelTop - 20}" width="${bounds.width + 8}" height="${bounds.height + 40}" rx="${frame.borderRadius}" fill="#1a1a1a" filter="url(#frameShadow)"/>
  <rect x="${frame.bezelSide - 2}" y="${frame.bezelTop - 18}" width="${bounds.width + 4}" height="${bounds.height + 36}" rx="${Math.max(frame.borderRadius - 2, 0)}" fill="#2a2a2a"/>
  ${notchSvg}
  <rect x="${bounds.x}" y="${bounds.y}" width="${bounds.width}" height="${bounds.height}" rx="8" fill="#000000"/>
</svg>`
}

const getMarketingCopyForSlug = (slug) => {
  return (
    screenshotMarketingCopyBySlug[slug] ?? {
      headline: 'Darmowy kalkulator finansowy',
      subline: 'Aktualne stawki 2026 i obliczenia bez rejestracji.',
    }
  )
}

const splitTextIntoLines = (text, maxCharsPerLine, maxLines = 2) => {
  const words = text.trim().split(/\s+/).filter(Boolean)
  if (!words.length) {
    return []
  }

  const lines = []
  let wordIndex = 0

  while (wordIndex < words.length && lines.length < maxLines) {
    let line = words[wordIndex]
    wordIndex += 1

    while (wordIndex < words.length) {
      const candidate = `${line} ${words[wordIndex]}`
      if (candidate.length > maxCharsPerLine) {
        break
      }
      line = candidate
      wordIndex += 1
    }

    lines.push(line)
  }

  if (wordIndex < words.length && lines.length) {
    const lastLineIndex = lines.length - 1
    const line = lines[lastLineIndex]
    if (line.length + 1 <= maxCharsPerLine) {
      lines[lastLineIndex] = `${line}…`
    } else {
      lines[lastLineIndex] = `${line.slice(0, Math.max(3, maxCharsPerLine - 1)).trim()}…`
    }
  }

  return lines
}

const calculateMaxChars = (width, fontSize, averageCharWidthFactor = 0.56) => {
  return Math.max(10, Math.floor(width / (fontSize * averageCharWidthFactor)))
}

const renderTextLines = ({
  lines,
  x,
  startY,
  lineHeight,
  color,
  fontSize,
  fontWeight,
}) => {
  return lines
    .map((line, index) => {
      return `<text x="${x}" y="${startY + index * lineHeight}" fill="${color}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="${fontWeight}">${escapeXml(line)}</text>`
    })
    .join('\n')
}

export const generateEditorialBaseSvg = ({
  config,
  copy,
}) => {
  const { output } = config
  const layout = getEditorialLayout(config)
  const headlineSize = Math.max(42, Math.min(82, Math.round(output.width * 0.053)))
  const sublineSize = Math.max(26, Math.min(44, Math.round(output.width * 0.028)))
  const headlineLineHeight = Math.round(headlineSize * 1.2)
  const sublineLineHeight = Math.round(sublineSize * 1.25)
  const copyX = layout.cardX
  const copyWidth = layout.cardWidth
  const headlineMaxChars = calculateMaxChars(copyWidth, headlineSize, 0.56)
  const sublineMaxChars = calculateMaxChars(copyWidth, sublineSize, 0.55)
  const headlineLines = splitTextIntoLines(copy.headline, headlineMaxChars, 2)
  const sublineLines = splitTextIntoLines(copy.subline, sublineMaxChars, 2)
  const headlineStartY = layout.copyTop + Math.round(output.height * 0.058)
  const sublineStartY =
    headlineStartY +
    headlineLineHeight * headlineLines.length +
    Math.round(output.height * 0.012)
  const headlineSvg = renderTextLines({
    lines: headlineLines,
    x: copyX,
    startY: headlineStartY,
    lineHeight: headlineLineHeight,
    color: editorialLayoutConfig.copy.headlineColor,
    fontSize: headlineSize,
    fontWeight: 'bold',
  })
  const sublineSvg = renderTextLines({
    lines: sublineLines,
    x: copyX,
    startY: sublineStartY,
    lineHeight: sublineLineHeight,
    color: editorialLayoutConfig.copy.sublineColor,
    fontSize: sublineSize,
    fontWeight: 'normal',
  })

  return `<?xml version="1.0" encoding="utf-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${output.width}" height="${output.height}" viewBox="0 0 ${output.width} ${output.height}">
  <defs>
    <linearGradient id="editorialBg" x1="0" y1="0" x2="0.95" y2="1">
      <stop offset="0%" stop-color="${editorialLayoutConfig.background.start}"/>
      <stop offset="100%" stop-color="${editorialLayoutConfig.background.end}"/>
    </linearGradient>
    <linearGradient id="accentBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1565C0"/>
      <stop offset="100%" stop-color="#0D47A1"/>
    </linearGradient>
    <filter id="cardShadow" x="-8%" y="-6%" width="116%" height="118%">
      <feDropShadow dx="0" dy="16" stdDeviation="24" flood-color="#0B1D39" flood-opacity="0.2"/>
    </filter>
  </defs>

  <rect width="${output.width}" height="${output.height}" fill="url(#editorialBg)"/>
  <circle cx="${Math.round(output.width * 0.9)}" cy="${Math.round(output.height * 0.12)}" r="${Math.round(output.width * 0.22)}" fill="#1565C0" opacity="0.08"/>
  <circle cx="${Math.round(output.width * 0.12)}" cy="${Math.round(output.height * 0.9)}" r="${Math.round(output.width * 0.2)}" fill="#0D47A1" opacity="0.08"/>

  <rect x="${layout.cardX}" y="${layout.cardY}" width="${layout.cardWidth}" height="${layout.cardHeight}" rx="${layout.cardRadius}" fill="${editorialLayoutConfig.card.background}" stroke="${editorialLayoutConfig.card.border}" stroke-width="2" filter="url(#cardShadow)"/>
  <rect x="${layout.screenshotX}" y="${layout.screenshotY}" width="${layout.screenshotWidth}" height="${layout.screenshotHeight}" rx="${layout.screenshotRadius}" fill="#E6EEF9"/>
  ${headlineSvg}
  ${sublineSvg}
</svg>`
}

const applyRoundedMask = async ({
  imageBuffer,
  width,
  height,
  radius,
}) => {
  const maskSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
  <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#ffffff"/>
</svg>`

  const maskBuffer = await sharp(Buffer.from(maskSvg))
    .png()
    .toBuffer()

  return sharp(imageBuffer)
    .composite([
      {
        input: maskBuffer,
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer()
}

export const listRawScreenshots = ({
  rawDir,
  theme = 'mixed',
}) => {
  if (!existsSync(rawDir)) {
    return []
  }

  const parsedFiles = readdirSync(rawDir)
    .filter((fileName) => fileName.toLowerCase().endsWith('.png'))
    .map((fileName) => parseScreenshotFileName(fileName))
    .filter(Boolean)
    .sort((left, right) => left.order - right.order)

  if (theme === 'mixed') {
    return parsedFiles
  }

  return parsedFiles.filter((file) => file.theme === theme)
}

const compositeFrameStyleScreenshot = async ({
  config,
  file,
  rawDir,
  outDir,
}) => {
  const bounds = getScreenBounds(config)
  const frameBuffer = await sharp(Buffer.from(generateFrameSvg(config)))
    .resize(config.output.width, config.output.height)
    .png()
    .toBuffer()
  const rawPath = resolve(rawDir, file.fileName)
  const outPath = resolve(outDir, file.fileName)
  const screenshotBuffer = await sharp(rawPath)
    .resize(bounds.width, bounds.height, {
      fit: 'cover',
      position: 'top',
    })
    .png()
    .toBuffer()

  await sharp(frameBuffer)
    .composite([
      {
        input: screenshotBuffer,
        top: bounds.y,
        left: bounds.x,
      },
    ])
    .png({ quality: 90, compressionLevel: 9 })
    .toFile(outPath)
}

const compositeEditorialStyleScreenshot = async ({
  config,
  file,
  rawDir,
  outDir,
}) => {
  const layout = getEditorialLayout(config)
  const rawPath = resolve(rawDir, file.fileName)
  const outPath = resolve(outDir, file.fileName)
  const marketingCopy = getMarketingCopyForSlug(file.slug)
  const baseBuffer = await sharp(
    Buffer.from(
      generateEditorialBaseSvg({
        config,
        copy: marketingCopy,
      }),
    ),
  )
    .png()
    .toBuffer()

  const screenshotBuffer = await sharp(rawPath)
    .resize(layout.screenshotWidth, layout.screenshotHeight, {
      fit: 'cover',
      position: 'top',
    })
    .png()
    .toBuffer()
  const roundedScreenshotBuffer = await applyRoundedMask({
    imageBuffer: screenshotBuffer,
    width: layout.screenshotWidth,
    height: layout.screenshotHeight,
    radius: layout.screenshotRadius,
  })

  await sharp(baseBuffer)
    .composite([
      {
        input: roundedScreenshotBuffer,
        top: layout.screenshotY,
        left: layout.screenshotX,
      },
    ])
    .png({ quality: 92, compressionLevel: 9 })
    .toFile(outPath)
}

export const compositeTypeScreenshots = async ({
  typeName,
  rawDir,
  outDir,
  theme = 'mixed',
  overlay = 'off',
  style = 'editorial',
  copySource = 'landing',
  logger = () => undefined,
}) => {
  void overlay
  void copySource

  const config = screenshotDevices[typeName]
  if (!config) {
    throw new Error(`Unknown screenshot type: ${typeName}`)
  }

  const rawFiles = listRawScreenshots({ rawDir, theme })
  if (!rawFiles.length) {
    return {
      typeName,
      processed: 0,
      skippedReason: 'missing-or-empty-raw',
    }
  }

  mkdirSync(outDir, { recursive: true })
  let processed = 0

  for (const file of rawFiles) {
    if (style === 'frame') {
      await compositeFrameStyleScreenshot({
        config,
        file,
        rawDir,
        outDir,
      })
    } else {
      await compositeEditorialStyleScreenshot({
        config,
        file,
        rawDir,
        outDir,
      })
    }

    processed += 1
    logger(
      `✓ ${typeName}/${file.fileName} (${config.output.width}x${config.output.height}, style=${style})`,
    )
  }

  return {
    typeName,
    processed,
    skippedReason: null,
  }
}
