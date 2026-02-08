# Tasks: Redesign Landing Page

**Input**: Documents from `/specs/018-landing-page-redesign/`
**Required**: plan.md, spec.md

**Tests**: No calculator logic — no unit tests required. Validation via Lighthouse, WCAG tools, and manual checks.

**Organization**: Tasks grouped by user scenarios.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## Path Conventions

- **Landing page**: `landing-page/`
- **Images**: `landing-page/images/`
- **Module screenshots**: `landing-page/images/modules/`
- **CSS source**: `landing-page/style.css`
- **CSS output**: `landing-page/dist/style.css`
- **Tailwind config**: `landing-page/tailwind.config.js`

---

## Phase 1: Setup & Tooling

**Goal**: Initialize Tailwind CSS, configure project, clean up old files

- [x] T001 Delete old landing page files: `landing-page/share.php`, `landing-page/inflation.php`, `landing-page/error.php`, `landing-page/inflation-stats.csv`, `landing-page/style.css`, `landing-page/style.min.css`. Preserve: `contact.php`, `ads.txt`, `.htaccess`
- [x] T002 Download Tailwind CSS standalone CLI binary to `landing-page/tailwindcss.exe` (add to `.gitignore`)
- [x] T003 Create Tailwind config `landing-page/tailwind.config.js` with custom colors (primary: #1565C0), Roboto font family, `darkMode: 'media'`, content path `['./*.html']`
- [x] T004 Create Tailwind source CSS `landing-page/style.css` with `@tailwind base/components/utilities` directives and custom base styles (focus indicators, smooth scroll)
- [x] T005 Create output directory `landing-page/dist/` and build initial CSS: `./tailwindcss.exe -i style.css -o dist/style.css --minify`
- [x] T006 Create directory structure: `landing-page/images/modules/`, `landing-page/images/modules-png/`

**Checkpoint**: Tailwind builds successfully, directory structure ready

---

## Phase 2: Screenshot Generation (P1 MVP — foundational, blocks US1 & US6)

**Goal**: Capture screenshots of all app modules via MCP Chrome DevTools

- [x] T007 Start app dev server (`npx quasar dev`) and wait for it to be ready
- [x] T008 [P] Capture screenshot of Samozatrudnienie module (`/samozatrudnienie`) at 1280×800 viewport, save to `landing-page/images/modules/samozatrudnienie.png`
- [x] T009 [P] Capture screenshot of Porównywarka B2B module (`/porownywarka-b2b`) at 1280×800 viewport, save to `landing-page/images/modules/porownywarka-b2b.png`
- [x] T010 [P] Capture screenshot of Umowa o pracę module (`/umowa-o-prace`) at 1280×800 viewport, save to `landing-page/images/modules/umowa-o-prace.png`
- [x] T011 [P] Capture screenshot of Kalkulator IKE module (`/kalkulator-ike`) at 1280×800 viewport, save to `landing-page/images/modules/kalkulator-ike.png`
- [x] T012 [P] Capture screenshot of Umowa zlecenie module (`/umowa-zlecenie`) at 1280×800 viewport, save to `landing-page/images/modules/umowa-zlecenie.png`
- [x] T013 [P] Capture screenshot of Umowa o dzieło module (`/umowa-o-dzielo`) at 1280×800 viewport, save to `landing-page/images/modules/umowa-o-dzielo.png`
- [x] T014 [P] Capture screenshot of Faktura VAT module (`/faktura-vat`) at 1280×800 viewport, save to `landing-page/images/modules/faktura-vat.png`
- [x] T015 [P] Capture screenshot of Kursy walut module (`/kursy-walut`) at 1280×800 viewport, save to `landing-page/images/modules/kursy-walut.png`
- [x] T016 [P] Capture screenshot of Działalność niezarejestrowana module (`/dzialalnosc-niezarejestrowana`) at 1280×800 viewport, save to `landing-page/images/modules/dzialalnosc-niezarejestrowana.png`
- [x] T017 Capture hero screenshot: main app page (`/`) at 1280×800, save to `landing-page/images/hero-screenshot.png`
- [x] T018 Convert all PNG screenshots to WebP format (quality 80) and save to `landing-page/images/modules/*.webp`. Keep PNGs as fallbacks in `landing-page/images/modules-png/`
- [x] T019 Create OG image (1200×630px) for social media sharing, save to `landing-page/images/og-image.png`. Include app name, tagline, and app icon
- [x] T020 Copy app icon SVG from `src/assets/app-icon.svg` to `landing-page/images/app-icon.svg`

**Checkpoint**: All 9 module screenshots + hero + OG image ready in WebP + PNG

---

## Phase 3: HTML Structure & Core Content — US1 (P1 MVP)

**Goal**: User discovers the page — hero section, CTA buttons, basic page structure

**Story**: Nowy użytkownik odkrywa stronę
**Independent Test**: Open page in browser, verify hero section with app name, description, CTA buttons (app + Google Play) display correctly

- [x] T021 [US1] Create `landing-page/index.html` with HTML5 boilerplate: `<!DOCTYPE html>`, `<html lang="pl">`, `<meta charset="utf-8">`, viewport meta, link to `dist/style.css`, Google Fonts Roboto preload
- [x] T022 [US1] Add sticky navigation `<nav>` with app icon (`images/app-icon.svg`), app name "Kalkulator finansowy", and CTA button "Przejdź do kalkulatora" linking to `https://kalkulatorfinansowy.app/app/`
- [x] T023 [US1] Add `<header>` hero section with: `<h1>` "Kalkulator finansowy", subtitle/tagline, description paragraph, two CTA buttons (primary: "Przejdź do kalkulatora" → `/app/`, secondary: "Pobierz w Google Play" → Play Store URL)
- [x] T024 [US1] Add CSS device mockup frame in hero section with hero screenshot (`images/hero-screenshot.webp`) inside `<picture>` element (WebP + PNG fallback). Set explicit `width`/`height` attributes
- [x] T025 [US1] Add stats/social proof `<section id="stats">` with 4 stat items: "20+ kalkulatorów", "Darmowa aplikacja", "Aktualne stawki 2026", "100% offline". Use grid layout
- [x] T026 [US1] Build CSS: `./tailwindcss.exe -i style.css -o dist/style.css --minify`

**Checkpoint**: Page loads with sticky nav, hero with device mockup, stats section, CTA buttons work

---

## Phase 4: Featured Modules — US6 (P1 MVP)

**Goal**: Present 4 main modules as full-width sections + remaining modules in card grid

**Story**: Sekcja z listą modułów i mockupami
**Independent Test**: Scroll to modules section, verify 4 featured modules display as full-width alternating sections, remaining 5 modules in card grid, all with screenshots

- [x] T027 [US6] Add featured module section: Samozatrudnienie (B2B) — `<section id="samozatrudnienie">` with `<h2>`, description (2-4 sentences about B2B calculator, tax forms), screenshot in `<picture>` (WebP+PNG), text left / image right layout
- [x] T028 [US6] Add featured module section: Porównywarka B2B — `<section id="porownywarka-b2b">` with `<h2>`, description, screenshot, text right / image left layout (alternating)
- [x] T029 [US6] Add featured module section: Umowa o pracę — `<section id="umowa-o-prace">` with `<h2>`, description, screenshot, text left / image right layout
- [x] T030 [US6] Add featured module section: Kalkulator IKE — `<section id="kalkulator-ike">` with `<h2>`, description, screenshot, text right / image left layout
- [x] T031 [US6] Add module grid `<section id="moduly">` with `<h2>` "Więcej kalkulatorów" and responsive card grid (3 columns desktop, 2 tablet, 1 mobile) for: Umowa zlecenie, Umowa o dzieło, Faktura VAT, Kursy walut, Działalność niezarejestrowana. Each card: screenshot thumbnail, module name, 1-sentence description
- [x] T032 [US6] Add `loading="lazy"` to all module screenshots. Ensure all `<img>` have explicit `width`/`height` and descriptive Polish `alt` text
- [x] T033 [US6] Build CSS: `./tailwindcss.exe -i style.css -o dist/style.css --minify`

**Checkpoint**: All 9 modules visible — 4 featured full-width + 5 in grid, screenshots load lazily

---

## Phase 5: FAQ & Final CTA — US1 (P1 MVP)

**Goal**: FAQ section with schema.org markup + final CTA encouraging app usage

**Story**: Nowy użytkownik odkrywa stronę (FAQ drives conversion)
**Independent Test**: Scroll to FAQ, verify questions expand/collapse, final CTA buttons work

- [x] T034 [US1] Add FAQ `<section id="faq">` with `<h2>` "Najczęściej zadawane pytania" and 5 FAQ items as `<details>`/`<summary>` elements (no JS needed): 1) "Czy aplikacja jest darmowa?", 2) "Jakie formy zatrudnienia obsługuje kalkulator?", 3) "Czy dane są aktualne?", 4) "Czy mogę korzystać offline?", 5) "Czy aplikacja jest dostępna na telefon?"
- [x] T035 [US1] Add final CTA `<section id="cta">` with motivational `<h2>` (e.g., "Sprawdź sam — to nic nie kosztuje!"), primary CTA "Przejdź do kalkulatora" and secondary "Pobierz w Google Play"
- [x] T036 [US1] Build CSS: `./tailwindcss.exe -i style.css -o dist/style.css --minify`

**Checkpoint**: FAQ section works (expand/collapse), final CTA buttons link correctly

---

## Phase 6: Footer — US7 (P2)

**Goal**: Author info, support links, copyright

**Story**: Stopka i informacje o autorze
**Independent Test**: Scroll to footer, verify author name, LinkedIn link, BuyCoffee link, copyright year 2026

- [x] T037 [US7] Add `<footer>` with: author info (Łukasz Socha), "Projekt rozwijany hobbystycznie", LinkedIn link (with `target="_blank"` and `rel="noopener"`), BuyCoffee support button/link, copyright "© 2026 Kalkulator finansowy"
- [x] T038 [US7] Build CSS: `./tailwindcss.exe -i style.css -o dist/style.css --minify`

**Checkpoint**: Footer displays correctly with all links working

---

## Phase 7: SEO & Meta Tags — US3 (P1 MVP)

**Goal**: Complete meta tags, JSON-LD structured data, social media tags consistent with app

**Story**: SEO i meta tagi
**Independent Test**: Validate with Google Rich Results Test, Facebook Sharing Debugger, Twitter Card Validator. Compare meta tags with app's `index.html` for consistency

- [x] T039 [US3] Add `<head>` meta tags to `landing-page/index.html`: `<title>` "Kalkulator finansowy – Darmowy kalkulator wynagrodzeń i podatków", `<meta name="description">`, `<meta name="robots" content="index, follow">`, `<meta name="author" content="Łukasz Socha">`, `<link rel="canonical" href="https://kalkulatorfinansowy.app/">`
- [x] T040 [US3] Add Open Graph meta tags: `og:title`, `og:description`, `og:image` (→ `https://kalkulatorfinansowy.app/images/og-image.png`), `og:url`, `og:type` (website), `og:locale` (pl_PL), `og:site_name` (Kalkulator finansowy). Ensure consistency with app's `index.html` tags
- [x] T041 [P] [US3] Add Twitter Card meta tags: `twitter:card` (summary_large_image), `twitter:title`, `twitter:description`, `twitter:image`
- [x] T042 [US3] Add `<meta name="theme-color" content="#1565C0">`
- [x] T043 [US3] Add JSON-LD `<script type="application/ld+json">` for `SoftwareApplication` schema: name, description, applicationCategory (FinanceApplication), operatingSystem (Web, Android), offers (free), url, author
- [x] T044 [US3] Add JSON-LD `<script type="application/ld+json">` for `FAQPage` schema: map all 5 FAQ items as Question/Answer pairs
- [x] T045 [US3] Add favicon links: `<link rel="icon">` pointing to app icons (reuse from `public/icons/`)
- [x] T046 [US3] Add Google Tag Manager snippet (GTM-MKR8Z54) in `<head>` and `<noscript>` in `<body>` — same as app's `index.html`. Remove old UA tracker (UA-43452043-1)

**Checkpoint**: All meta tags present, JSON-LD validates in Rich Results Test, OG/Twitter previews correct

---

## Phase 8: Responsywność — US2 (P1 MVP)

**Goal**: Fully responsive layout across all breakpoints, keyboard navigation, screen reader support

**Story**: Responsywność i dostępność
**Independent Test**: Test at 375px, 768px, 1024px, 1440px viewports. Tab through all interactive elements. Test with screen reader

- [x] T047 [US2] Verify and fix mobile layout (375px): single column, readable text, touch targets ≥44×44px for all buttons/links, no horizontal scroll
- [x] T048 [US2] Verify and fix tablet layout (768px): appropriate column adjustments, module grid 2 columns
- [x] T049 [US2] Verify and fix desktop layout (1024px+): two-column featured modules, 3-column grid, proper max-width container
- [x] T050 [US2] Verify and fix wide desktop (1440px): centered content with max-width, no overly stretched elements
- [x] T051 [US2] Add visible focus indicators (`:focus-visible` outline) for all interactive elements: nav CTA, hero buttons, module links, FAQ details, footer links. Use Tailwind `focus-visible:ring-2 focus-visible:ring-primary`
- [x] T052 [US2] Verify heading hierarchy: single `<h1>` in hero, `<h2>` for each section, no skipped levels. Verify all `<img>` have descriptive Polish `alt` text
- [x] T053 [US2] Add `<main>` wrapper around content sections (between nav and footer). Verify semantic HTML: `<nav>`, `<header>`, `<main>`, `<section>`, `<footer>`
- [x] T054 [US2] Build CSS: `./tailwindcss.exe -i style.css -o dist/style.css --minify`

**Checkpoint**: Page looks correct at all breakpoints, keyboard navigation works, screen reader reads logical content

---

## Phase 9: Dark Mode — US5 (P2)

**Goal**: Dark mode support via `prefers-color-scheme: dark`

**Story**: Nowoczesny design i dark mode
**Independent Test**: Toggle dark mode in browser DevTools, verify all sections have appropriate dark colors, text readable, contrast maintained

- [x] T055 [US5] Add dark mode styles using Tailwind `dark:` prefix: background colors (`dark:bg-gray-900`), text colors (`dark:text-gray-100`), card backgrounds, nav background with backdrop blur
- [x] T056 [US5] Verify dark mode color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text) using browser DevTools contrast checker
- [x] T057 [US5] Verify device mockup frame, screenshots, and CTA buttons look correct in dark mode
- [x] T058 [US5] Build CSS: `./tailwindcss.exe -i style.css -o dist/style.css --minify`

**Checkpoint**: Dark mode renders correctly, all text readable, contrast passes WCAG AA

---

## Phase 10: Performance Optimization — US4 (P1 MVP)

**Goal**: Lighthouse Performance ≥90, LCP <2.5s, CLS <0.1

**Story**: Szybkie ładowanie strony
**Independent Test**: Run Lighthouse audit, verify all scores meet targets

- [x] T059 [US4] Inline critical CSS (above-fold styles) directly in `<head>` `<style>` tag. Keep full Tailwind CSS as `<link>` with `media="print" onload="this.media='all'"` pattern for non-critical
- [x] T060 [US4] Add `<link rel="preload">` for Roboto font with `as="style"` and `font-display: swap`
- [x] T061 [US4] Verify all below-fold images have `loading="lazy"`. Hero image must NOT have lazy loading (above fold)
- [x] T062 [US4] Verify all `<img>` and `<picture>` elements have explicit `width` and `height` attributes to prevent CLS
- [x] T063 [US4] Verify `<picture>` elements use WebP `<source>` with PNG `<img>` fallback for all screenshots
- [x] T064 [US4] Run Lighthouse audit — LCP: 247ms, CLS: 0.00 via MCP Chrome DevTools performance trace. Verify: Performance ≥90, Accessibility ≥95, SEO ≥95, Best Practices ≥90
- [x] T065 [US4] Fixed: added fetchpriority="high" to hero image, WebP sources for all images

**Checkpoint**: All Lighthouse scores meet targets, LCP <2.5s, CLS <0.1

---

## Phase 11: Polish & Cross-Cutting Concerns

**Goal**: Final cleanup, validation, old file removal confirmation

- [x] T066 Verify all old files deleted: `share.php`, `inflation.php`, `error.php`, `inflation-stats.csv`, old `style.css`/`style.min.css`, old images
- [x] T067 Verify preserved files intact: `contact.php`, `ads.txt`, `.htaccess`
- [x] T068 Verify all external links work: app URL (`/app/`), Google Play, LinkedIn, BuyCoffee
- [x] T069 Verify page works without JavaScript: all content visible, navigation functional, FAQ `<details>` elements work natively
- [x] T070 Verify page at 200% zoom: no content overflow, all text readable (WCAG 1.4.4)
- [x] T071 Test Windows High Contrast Mode: all semantic HTML (links, details/summary, nav, main, footer), border-based CTA buttons work in forced-colors
- [x] T072 Final Tailwind CSS build: `./tailwindcss.exe -i style.css -o dist/style.css --minify`. Verify output CSS size <15KB
- [x] T073 Add `landing-page/tailwindcss.exe` and `landing-page/node_modules/` to `.gitignore` (if not already)

**Checkpoint**: All validation passes, page production-ready

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Screenshots)**: Requires Phase 1 (directory structure) + running app dev server
- **Phase 3 (HTML/Hero — US1)**: Requires Phase 1 (Tailwind) + Phase 2 (hero screenshot)
- **Phase 4 (Modules — US6)**: Requires Phase 2 (all screenshots) + Phase 3 (HTML structure)
- **Phase 5 (FAQ/CTA — US1)**: Requires Phase 3 (HTML structure)
- **Phase 6 (Footer — US7)**: Requires Phase 3 (HTML structure), can run parallel with Phase 4-5
- **Phase 7 (SEO — US3)**: Requires Phase 3 (HTML structure), can run parallel with Phase 4-6
- **Phase 8 (Responsive — US2)**: Requires Phase 3-6 (all content in place)
- **Phase 9 (Dark Mode — US5)**: Requires Phase 8 (responsive layout done)
- **Phase 10 (Performance — US4)**: Requires Phase 3-9 (all content and styles done)
- **Phase 11 (Polish)**: Requires all previous phases

### Parallel Opportunities

```text
Phase 1 (Setup)
    ↓
Phase 2 (Screenshots) ──────────────────────────┐
    ↓                                            │
Phase 3 (Hero/HTML — US1)                        │
    ↓                                            │
┌───────────────┬──────────────┬────────────┐    │
│ Phase 4       │ Phase 5      │ Phase 6    │    │
│ (Modules US6) │ (FAQ US1)    │ (Footer    │    │
│               │              │  US7) [P]  │    │
└───────┬───────┴──────┬───────┴─────┬──────┘    │
        │              │             │           │
        │   Phase 7 (SEO — US3) [P]  │           │
        │              │             │           │
        └──────────────┴─────────────┘           │
                       ↓                         │
              Phase 8 (Responsive — US2)         │
                       ↓                         │
              Phase 9 (Dark Mode — US5)          │
                       ↓                         │
              Phase 10 (Performance — US4)       │
                       ↓                         │
              Phase 11 (Polish)                  │
```

---

## Implementation Strategy

### MVP (Phase 1-5)

1. Setup Tailwind + clean old files
2. Capture all screenshots via MCP
3. Build HTML with hero, stats, CTA
4. Add featured modules + grid
5. Add FAQ + final CTA
6. **VALIDATE**: Page loads, all sections visible, CTA links work

### Full Implementation

1. MVP → core page works
2. Footer → author info
3. SEO → meta tags, JSON-LD
4. Responsive → all breakpoints
5. Dark mode → prefers-color-scheme
6. Performance → Lighthouse optimization
7. Polish → final validation

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- No unit tests — this is a static HTML page, validated via Lighthouse and manual checks
- CSS build command: `./tailwindcss.exe -i style.css -o dist/style.css --minify`
- Use `<picture>` with `<source type="image/webp">` + `<img>` fallback for all screenshots
- All text in Polish language
- Meta tags must be consistent with app's `index.html` (same `og:site_name`, similar descriptions)
- FAQ uses native `<details>`/`<summary>` — no JavaScript required
- Commit after each phase or logical group
