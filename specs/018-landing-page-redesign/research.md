# Research: Redesign Landing Page

**Branch**: `018-landing-page-redesign` | **Date**: 2026-02-08

## 1. Tailwind CSS Standalone CLI

**Decision**: Use Tailwind CSS standalone CLI for styling

**Rationale**:

- No Node.js runtime needed on server — output is plain CSS
- Built-in purge removes unused classes → small CSS bundle (~10-15KB)
- Utility-first approach speeds up development
- Built-in dark mode support via `dark:` prefix + `prefers-color-scheme`
- Built-in responsive breakpoints (`sm:`, `md:`, `lg:`, `xl:`)
- `font-display: swap` configurable in Tailwind config

**Alternatives considered**:

- Pure CSS: Full control but slower development, manual responsive/dark mode
- PicoCSS: Too opinionated, limited customization for hybrid layout
- Bootstrap: Heavier, not needed for a single static page

**Setup**:

- Download `tailwindcss` standalone binary from GitHub releases
- Config: `tailwind.config.js` with custom colors (#1565C0 primary), Roboto font
- Input: `style.css` with `@tailwind base/components/utilities`
- Build: `./tailwindcss -i style.css -o dist/style.css --minify`
- Dark mode: `darkMode: 'media'` (uses `prefers-color-scheme`)

## 2. Screenshot Generation via MCP Chrome DevTools

**Decision**: Use MCP Chrome DevTools `take_screenshot` tool to capture module screenshots

**Rationale**:

- Automated, repeatable process
- Can set viewport size for consistent screenshots
- Can capture specific elements or full pages
- Screenshots reflect actual current app state

**Alternatives considered**:

- Manual screenshots: Inconsistent sizing, manual effort
- Playwright script: Requires additional setup, MCP already available
- CSS mockups: Don't show real app, less trustworthy

**Process**:

1. Start app dev server (`quasar dev`)
2. Navigate to each module page via MCP
3. Set viewport to consistent size (e.g., 1280x800 for desktop shots)
4. Take screenshot of each module
5. Convert to WebP (primary) + keep PNG (fallback)
6. Optimize file sizes (target <100KB per WebP image)

**Modules to screenshot** (9 total):

- Samozatrudnienie (`/samozatrudnienie`) — featured
- Porównywarka B2B (`/porownywarka-b2b`) — featured
- Umowa o pracę (`/umowa-o-prace`) — featured
- Kalkulator IKE (`/kalkulator-ike`) — featured
- Umowa zlecenie (`/umowa-zlecenie`) — grid
- Umowa o dzieło (`/umowa-o-dzielo`) — grid
- Faktura VAT (`/faktura-vat`) — grid
- Kursy walut (`/kursy-walut`) — grid
- Działalność niezarejestrowana (`/dzialalnosc-niezarejestrowana`) — grid

## 3. Device Mockup for Hero Section

**Decision**: CSS-based device frame (no external library)

**Rationale**:

- Pure CSS device frame is lightweight (no additional JS/images)
- Can be responsive and adapt to viewport
- Avoids dependency on third-party mockup libraries
- Can show both phone and laptop frame with CSS

**Alternatives considered**:

- Pre-rendered mockup image: Heavier, not responsive
- Third-party library (e.g., devices.css): Additional dependency
- SVG frame: More complex but possible fallback

**Implementation**:

- CSS border-radius + box-shadow to simulate device frame
- Screenshot placed inside the frame as `<img>`
- Responsive: phone frame on mobile, laptop frame on desktop (or just phone)

## 4. SEO & Structured Data

**Decision**: JSON-LD for SoftwareApplication + FAQPage schemas

**Rationale**:

- JSON-LD is Google's preferred format for structured data
- SoftwareApplication schema enables rich snippets in search results
- FAQPage schema enables FAQ rich results (expandable answers in SERP)
- Both can coexist in the same page

**Implementation**:

- `<script type="application/ld+json">` in `<head>`
- SoftwareApplication: name, description, applicationCategory, operatingSystem, offers (free), url
- FAQPage: array of Question/Answer pairs from FAQ section
- Validate with Google Rich Results Test

**Meta tags alignment with app**:

- `og:site_name`: "Kalkulator finansowy" (same as app)
- `og:title`: "Kalkulator finansowy – Darmowy kalkulator wynagrodzeń i podatków"
- `og:description`: Similar to app but landing-page focused
- `og:image`: New OG image at `https://kalkulatorfinansowy.app/images/og-image.png`
- `og:url`: `https://kalkulatorfinansowy.app/`
- `twitter:card`: `summary_large_image`
- `theme-color`: `#1565C0`

## 5. Image Optimization Strategy

**Decision**: WebP primary + PNG fallback, lazy loading, explicit dimensions

**Rationale**:

- WebP provides 25-35% smaller files than PNG at same quality
- `<picture>` element with `<source type="image/webp">` + `<img>` fallback
- `loading="lazy"` for below-fold images reduces initial load
- Explicit `width`/`height` attributes prevent CLS

**Target sizes**:

- Hero mockup: max 600px wide, ~50-80KB WebP
- Featured module screenshots: max 500px wide, ~40-70KB WebP
- Grid card screenshots: max 350px wide, ~25-40KB WebP
- OG image: 1200x630px, PNG format (social media requirement)

## 6. Analytics Migration

**Decision**: Migrate from old UA (UA-43452043-1) to GTM (GTM-MKR8Z54)

**Rationale**:

- Old landing page uses Universal Analytics (UA-43452043-1) which is deprecated
- App already uses Google Tag Manager (GTM-MKR8Z54)
- GTM provides more flexibility and is the current standard
- Single GTM container for both app and landing page

**Implementation**:

- Remove old `gtag.js` script with UA ID
- Add GTM snippet (same as in app's `index.html`)

## 7. Performance Budget

**Decision**: Target Lighthouse 90+ across all categories

**Rationale**:

- Static HTML + purged Tailwind CSS = minimal CSS payload
- WebP images with lazy loading = fast LCP
- No JavaScript framework = minimal JS payload
- Explicit image dimensions = no CLS
- Preloaded fonts with `font-display: swap` = no FOIT

**Budget**:

- Total HTML: <50KB
- Total CSS (purged): <15KB
- Total JS: <5KB (only GTM + minimal dark mode script)
- Total images (above fold): <150KB
- LCP target: <2.5s on 4G
- CLS target: <0.1
