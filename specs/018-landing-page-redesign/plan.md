# Implementation Plan: Redesign Landing Page

**Branch**: `018-landing-page-redesign` | **Date**: 2026-02-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/018-landing-page-redesign/spec.md`

## Summary

Redesign the landing page at `landing-page/` with modern UI/UX, WCAG AA compliance, SEO optimization (meta tags, JSON-LD, FAQ schema), and auto-generated screenshots from the app. Static HTML + Tailwind CSS (standalone CLI). Hybrid layout: 4 featured modules as full-width sections + remaining modules in a card grid. Sticky nav, social proof stats, FAQ section, dark mode support.

## Technical Context

**Language/Version**: HTML5 / CSS3 / Vanilla JS (minimal)
**CSS Framework**: Tailwind CSS 3.x (standalone CLI, build-time purge)
**Build Tool**: Tailwind standalone CLI (`tailwindcss` binary, no Node.js runtime required on server)
**Screenshot Tool**: MCP Chrome DevTools (automated screenshots of app modules)
**Image Format**: WebP (primary) + PNG (fallback)
**Hosting**: Static files on `kalkulatorfinansowy.app` (root domain)
**App URL**: `https://kalkulatorfinansowy.app/app/`
**Platform**: Static website (no backend, no SPA framework)
**UI Language**: Polish
**Key Dependencies**:

- Tailwind CSS standalone CLI — CSS utility framework
- Google Fonts (Roboto) — typography consistency with app
- Google Tag Manager (GTM-MKR8Z54) — analytics (migrated from old UA tracker)

**Existing files to preserve**:

- `landing-page/contact.php` — used by app's contact form
- `landing-page/ads.txt` — ad network config
- `landing-page/.htaccess` — server config

**App meta tags reference** (from `index.html`):

- `og:title`: "Kalkulator finansowy – Twój darmowy kalkulator wynagrodzeń"
- `og:site_name`: "Kalkulator finansowy"
- `og:description`: "Darmowy kalkulator wynagrodzeń z umowy o pracę, umowy zlecenie, B2B i umowy o dzieło..."
- `og:image`: `https://kalkulatorfinansowy.app/app/images/og-image.png`
- `theme_color`: #1565C0

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution is not configured (template only). No specific gates to enforce. Proceeding with standard best practices:

- ✅ Static site — no backend complexity
- ✅ Polish language UI — consistent with app
- ✅ WCAG AA compliance — accessibility standard
- ✅ SEO optimization — meta tags consistent with app
- ✅ Performance targets — Lighthouse scores defined

## Project Structure

### Documentation (this feature)

```text
specs/018-landing-page-redesign/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Research and analysis
├── data-model.md        # Data model (page sections/content)
├── quickstart.md        # Quick start guide
├── checklists/
│   └── requirements.md  # Quality checklist
└── contracts/
    └── README.md        # Page structure contract
```

### Landing Page Source

```text
landing-page/
├── index.html           # Main landing page (NEW)
├── style.css            # Tailwind source CSS (NEW)
├── dist/
│   └── style.css        # Built/purged Tailwind output (NEW)
├── images/
│   ├── og-image.png     # OG image 1200x630 (NEW)
│   ├── app-icon.svg     # App icon for nav (NEW)
│   ├── hero-mockup.webp # Hero device mockup (NEW)
│   ├── modules/         # Module screenshots (NEW)
│   │   ├── samozatrudnienie.webp
│   │   ├── porownywarka-b2b.webp
│   │   ├── umowa-o-prace.webp
│   │   ├── kalkulator-ike.webp
│   │   ├── umowa-zlecenie.webp
│   │   ├── umowa-o-dzielo.webp
│   │   ├── faktura-vat.webp
│   │   ├── kursy-walut.webp
│   │   └── dzialalnosc-niezarejestrowana.webp
│   └── modules-png/     # PNG fallbacks (NEW)
├── contact.php          # PRESERVED (used by app)
├── ads.txt              # PRESERVED
├── .htaccess            # PRESERVED
└── tailwind.config.js   # Tailwind config (NEW, build-time only)
```

### Files to DELETE (old landing page)

```text
landing-page/
├── style.min.css        # Old CSS
├── share.php            # Old PHP
├── inflation.php        # Old PHP
├── error.php            # Old PHP
├── inflation-stats.csv  # Old data
└── images/              # Old screenshots (replace with new)
    ├── kalkulator-finansowy.png / @2.png
    ├── samozatrudnienie.png / @2.png
    ├── porownywarka-b2b.png / @2.png
    ├── rozliczenie-z-malzonkiem.png / @2.png
    ├── dzialalnosc-niezarejestrowana.png / @2.png
    ├── umowa-o-prace.png / @2.png
    ├── faktura-vat.png / @2.png
    ├── odsetki.png / @2.png
    ├── kursy-walut.png / @2.png
    ├── bg_header.png
    └── avatar.jpg
```

## Pre-Implementation Checklist

- [ ] Tailwind CSS standalone CLI downloaded and configured
- [ ] All module screenshots captured via MCP Chrome DevTools
- [ ] Screenshots converted to WebP + PNG fallback
- [ ] OG image created (1200x630px)
- [ ] HTML structure uses semantic elements (header, main, section, footer, nav)
- [ ] All images have descriptive alt text (Polish)
- [ ] Meta tags consistent with app's `index.html`
- [ ] JSON-LD schema (SoftwareApplication + FAQPage) valid
- [ ] Keyboard navigation works (Tab order, focus indicators)
- [ ] Color contrast meets WCAG AA (4.5:1 text, 3:1 large text)
- [ ] Dark mode via `prefers-color-scheme: dark`
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] Lighthouse: Performance ≥90, Accessibility ≥95, SEO ≥95, Best Practices ≥90
- [ ] Old files cleaned up (PHP, old CSS, old images)
- [ ] `contact.php`, `ads.txt`, `.htaccess` preserved
- [ ] Google Tag Manager (GTM-MKR8Z54) integrated
- [ ] UI text in Polish language
