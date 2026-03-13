import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import sharp from 'sharp'

const rootDir = process.cwd()
const pagesDir = resolve(rootDir, 'landing-page/_pages')
const modulesDir = resolve(rootDir, 'landing-page/images/modules')
const heroSourcePath = resolve(rootDir, 'landing-page/images/hero-screenshot.png')

const responsiveWidths = [400, 640, 960]
const webpOptions = {
  quality: 80,
  effort: 6,
}

const extractScreenshotSlugs = () => {
  const pageFiles = readdirSync(pagesDir).filter((fileName) =>
    fileName.endsWith('.php'),
  )
  const screenshotSlugs = new Set()

  pageFiles.forEach((fileName) => {
    const pagePath = resolve(pagesDir, fileName)
    const pageContent = readFileSync(pagePath, 'utf8')
    const screenshotMatch = pageContent.match(/'screenshot'\s*=>\s*'([^']+)'/)

    if (screenshotMatch?.[1]) {
      screenshotSlugs.add(screenshotMatch[1])
    }
  })

  return Array.from(screenshotSlugs).sort()
}

const createResponsiveVariants = async (sourcePath, outputBasePath) => {
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing source image: ${sourcePath}`)
  }

  const sourceMetadata = await sharp(sourcePath).metadata()
  const sourceSizeLabel = `${sourceMetadata.width ?? '?'}x${sourceMetadata.height ?? '?'}`

  for (const width of responsiveWidths) {
    const outputPath = `${outputBasePath}-${width}.webp`

    await sharp(sourcePath)
      .resize({
        width,
      })
      .webp(webpOptions)
      .toFile(outputPath)

    console.log(`  - ${outputPath} (${width}w from ${sourceSizeLabel})`)
  }
}

const main = async () => {
  console.log('Generating responsive landing images...')

  await createResponsiveVariants(
    heroSourcePath,
    resolve(rootDir, 'landing-page/images/hero-screenshot'),
  )

  const screenshotSlugs = extractScreenshotSlugs()

  for (const screenshotSlug of screenshotSlugs) {
    const moduleSourcePath = resolve(modulesDir, `${screenshotSlug}.png`)
    const outputBasePath = resolve(modulesDir, screenshotSlug)

    await createResponsiveVariants(moduleSourcePath, outputBasePath)
  }

  console.log(`Completed responsive variants for ${screenshotSlugs.length + 1} images.`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
