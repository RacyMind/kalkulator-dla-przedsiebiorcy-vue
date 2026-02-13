const validTypes = ['phone', 'tablet-7', 'tablet-10']
const validThemes = ['light', 'dark', 'mixed']
const validOverlayModes = ['on', 'off']
const validStyles = ['editorial', 'frame']
const validCopySources = ['landing']

export const screenshotDevices = {
  phone: {
    output: { width: 1080, height: 1920 },
    viewport: {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
    frame: {
      borderRadius: 40,
      bezelTop: 80,
      bezelBottom: 80,
      bezelSide: 24,
      notch: true,
    },
    dir: 'phone',
  },
  'tablet-7': {
    output: { width: 1200, height: 2048 },
    viewport: {
      width: 600,
      height: 1024,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
    frame: {
      borderRadius: 30,
      bezelTop: 60,
      bezelBottom: 60,
      bezelSide: 40,
      notch: false,
    },
    dir: 'tablet-7',
  },
  'tablet-10': {
    output: { width: 1600, height: 2560 },
    viewport: {
      width: 800,
      height: 1280,
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    },
    frame: {
      borderRadius: 36,
      bezelTop: 70,
      bezelBottom: 70,
      bezelSide: 50,
      notch: false,
    },
    dir: 'tablet-10',
  },
}

export const editorialLayoutConfig = {
  background: {
    start: '#EAF3FF',
    end: '#D8E8FF',
    accent: '#1565C0',
  },
  copy: {
    badgeText: 'Kalkulator finansowy',
    headlineColor: '#0F2A4D',
    sublineColor: '#34506F',
  },
  card: {
    background: '#FFFFFF',
    border: '#D7E5F7',
  },
}

export const screenshotMatrix = [
  {
    order: 1,
    slug: 'main-menu',
    route: '/',
    types: [...validTypes],
    requiresCalculation: false,
  },
  {
    order: 2,
    slug: 'umowa-o-prace',
    route: '/umowa-o-prace',
    types: [...validTypes],
    requiresCalculation: true,
  },
  {
    order: 3,
    slug: 'porownywarka-b2b',
    route: '/porownywarka-b2b',
    types: [...validTypes],
    requiresCalculation: true,
  },
  {
    order: 4,
    slug: 'samozatrudnienie',
    route: '/samozatrudnienie',
    types: [...validTypes],
    requiresCalculation: true,
  },
  {
    order: 5,
    slug: 'faktura-vat',
    route: '/faktura-vat',
    types: ['phone'],
    requiresCalculation: true,
  },
  {
    order: 6,
    slug: 'ikze',
    route: '/ulga-podatkowa-ikze',
    types: ['phone'],
    requiresCalculation: true,
  },
  {
    order: 7,
    slug: 'ike',
    route: '/kalkulator-ike',
    types: ['phone'],
    requiresCalculation: true,
  },
  {
    order: 8,
    slug: 'obligacje',
    route: '/obligacje-skarbowe',
    types: ['phone'],
    requiresCalculation: true,
  },
]

export const screenshotMarketingCopyBySlug = {
  'main-menu': {
    headline: 'Twój darmowy kalkulator wynagrodzeń i podatków',
    subline: 'Oblicz netto, składki ZUS, PIT i VAT. Aktualne stawki 2026.',
  },
  'umowa-o-prace': {
    headline: 'Oblicz wynagrodzenie netto z umowy o pracę',
    subline: 'Sprawdź składki ZUS, podatek PIT i koszty pracodawcy.',
  },
  'porownywarka-b2b': {
    headline: 'Porównaj formy opodatkowania B2B',
    subline: 'Skala podatkowa, podatek liniowy i ryczałt w jednym miejscu.',
  },
  'samozatrudnienie': {
    headline: 'Oblicz wynagrodzenie netto na działalności B2B',
    subline: 'Uwzględnij składki ZUS, koszty i próg podatkowy 2026.',
  },
  'faktura-vat': {
    headline: 'Przelicz kwoty netto i brutto z VAT',
    subline: 'Wszystkie stawki: 23%, 8%, 5% i 0%.',
  },
  ikze: {
    headline: 'Oblicz ulgę podatkową z wpłat na IKZE',
    subline: 'Sprawdź limit IKZE i oszczędność podatkową.',
  },
  ike: {
    headline: 'Zaplanuj oszczędności emerytalne IKE',
    subline: 'Symuluj kapitał, stopę zwrotu i regularne wpłaty.',
  },
  obligacje: {
    headline: 'Porównaj zysk z obligacji skarbowych',
    subline: 'Sprawdź realny wynik po podatku Belki.',
  },
}

export const removableCaptureSelectors = [
  '.advert-wrapper',
  '.adsense-wrapper',
  '.adsbygoogle',
  '[data-test="support-project"]',
  '[data-test="support-author"]',
]

const parseFlagMap = (argv) => {
  const flags = {}

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]
    if (!token.startsWith('--')) {
      continue
    }

    const key = token.replace(/^--/, '')
    const value = argv[i + 1]

    if (!value || value.startsWith('--')) {
      throw new Error(`Missing value for --${key}`)
    }

    flags[key] = value
    i += 1
  }

  return flags
}

const assertAllowedValue = (value, allowedValues, optionName) => {
  if (allowedValues.includes(value)) {
    return
  }

  throw new Error(
    `Invalid value for ${optionName}: "${value}". Allowed: ${allowedValues.join(', ')}`,
  )
}

export const resolveScreenshotTypes = (requestedType = 'all') => {
  if (requestedType === 'all') {
    return [...validTypes]
  }

  assertAllowedValue(requestedType, validTypes, '--type')
  return [requestedType]
}

export const resolveThemeForPosition = (position, requestedTheme) => {
  if (requestedTheme === 'mixed') {
    return position % 2 === 0 ? 'dark' : 'light'
  }

  return requestedTheme
}

export const buildScreenshotFileName = (order, slug, theme) => {
  const prefix = String(order).padStart(2, '0')
  return `${prefix}-${slug}-${theme}.png`
}

export const buildCapturePlan = ({
  type = 'all',
  theme = 'mixed',
} = {}) => {
  validateStoreScreenshotMatrix()
  assertAllowedValue(theme, validThemes, '--theme')

  const selectedTypes = resolveScreenshotTypes(type)
  const capturePlan = []

  for (const selectedType of selectedTypes) {
    const entries = screenshotMatrix
      .filter((item) => item.types.includes(selectedType))
      .sort((left, right) => left.order - right.order)

    entries.forEach((entry, index) => {
      const resolvedTheme = resolveThemeForPosition(index, theme)

      capturePlan.push({
        ...entry,
        type: selectedType,
        theme: resolvedTheme,
        fileName: buildScreenshotFileName(
          entry.order,
          entry.slug,
          resolvedTheme,
        ),
      })
    })
  }

  return capturePlan
}

export const getThemeDistribution = (entries) => {
  return entries.reduce(
    (acc, entry) => {
      if (entry.theme === 'light') {
        acc.light += 1
      }

      if (entry.theme === 'dark') {
        acc.dark += 1
      }

      acc.total += 1
      return acc
    },
    {
      light: 0,
      dark: 0,
      total: 0,
    },
  )
}

export const parseStoreScreenshotCliArgs = (
  argv,
  {
    includeOverlay = true,
    includeCaptureOptions = true,
  } = {},
) => {
  const flags = parseFlagMap(argv)
  const type = flags.type ?? 'all'
  const theme = flags.theme ?? 'mixed'
  const style = flags.style ?? 'editorial'
  const copySource = flags['copy-source'] ?? 'landing'

  assertAllowedValue(theme, validThemes, '--theme')
  assertAllowedValue(style, validStyles, '--style')
  assertAllowedValue(copySource, validCopySources, '--copy-source')
  if (type !== 'all') {
    assertAllowedValue(type, validTypes, '--type')
  }

  const parsedArgs = {
    type,
    theme,
    style,
    copySource,
  }

  if (includeOverlay) {
    const overlay = flags.overlay ?? 'off'
    assertAllowedValue(overlay, validOverlayModes, '--overlay')
    parsedArgs.overlay = overlay
  }

  if (includeCaptureOptions) {
    parsedArgs.baseUrl = flags['base-url'] ?? 'http://localhost:9200'
    parsedArgs.debugEndpoint =
      flags['debug-endpoint'] ?? 'http://127.0.0.1:9222/json'
  }

  return parsedArgs
}

export const validateStoreScreenshotMatrix = (matrix = screenshotMatrix) => {
  const orderSet = new Set()
  const slugSet = new Set()

  for (const item of matrix) {
    if (orderSet.has(item.order)) {
      throw new Error(`Duplicate screenshot order: ${item.order}`)
    }
    orderSet.add(item.order)

    if (slugSet.has(item.slug)) {
      throw new Error(`Duplicate screenshot slug: ${item.slug}`)
    }
    slugSet.add(item.slug)

    if (!item.route.startsWith('/')) {
      throw new Error(`Screenshot route must start with "/": ${item.route}`)
    }

    item.types.forEach((type) => {
      assertAllowedValue(type, validTypes, 'matrix.types')
    })

    const copy = screenshotMarketingCopyBySlug[item.slug]
    if (!copy) {
      throw new Error(`Missing marketing copy for slug: ${item.slug}`)
    }

    if (!copy.headline || copy.headline.length < 12 || copy.headline.length > 72) {
      throw new Error(`Invalid headline length for slug: ${item.slug}`)
    }

    if (!copy.subline || copy.subline.length < 12 || copy.subline.length > 98) {
      throw new Error(`Invalid subline length for slug: ${item.slug}`)
    }
  }

  return true
}

export const screenshotConfigConstants = {
  validTypes,
  validThemes,
  validOverlayModes,
  validStyles,
  validCopySources,
}
