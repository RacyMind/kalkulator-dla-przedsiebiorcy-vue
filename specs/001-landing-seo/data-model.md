# Data Model: Landing Page SEO

**Feature**: 001-landing-seo
**Date**: 2026-02-08

> This feature uses static HTML files — no database, no API, no runtime state. The "data model" describes the structure of pages and their metadata.

## Entity: Subpage

Each calculator subpage is a static HTML file with the following metadata:

| Field              | Type     | Constraints                               | Example                                                      |
| ------------------ | -------- | ----------------------------------------- | ------------------------------------------------------------ |
| slug               | string   | URL-safe, unique                          | `kalkulator-b2b`                                             |
| directory          | path     | `landing-page/{slug}/index.html`          | `landing-page/kalkulator-b2b/index.html`                     |
| title              | string   | max 60 chars, contains keyword + year     | `Kalkulator B2B 2026 – Oblicz wynagrodzenie netto`           |
| description        | string   | max 160 chars, contains CTA + keyword     | `Darmowy kalkulator B2B 2026. Oblicz wynagrodzenie netto...` |
| h1                 | string   | unique, contains primary keyword          | `Kalkulator samozatrudnienia B2B 2026`                       |
| canonicalUrl       | URL      | `https://kalkulatorfinansowy.app/{slug}/` | `https://kalkulatorfinansowy.app/kalkulator-b2b/`            |
| spaLink            | URL      | hash route to SPA calculator              | `https://kalkulatorfinansowy.app/app/#/samozatrudnienie`     |
| primaryKeyword     | string   | main SEO keyword                          | `kalkulator B2B 2026`                                        |
| supportingKeywords | string[] | 2-4 supporting keywords                   | `[kalkulator samozatrudnienie, wynagrodzenie netto B2B]`     |
| relatedSubpages    | slug[]   | 2-3 related subpage slugs                 | `[porownywarka-b2b, kalkulator-umowa-o-prace]`               |
| ogImage            | URL      | shared OG image or per-page               | `https://kalkulatorfinansowy.app/images/og-image.png`        |
| screenshotWebp     | path     | calculator screenshot (WebP)              | `../images/modules/samozatrudnienie.webp`                    |
| screenshotPng      | path     | calculator screenshot (PNG fallback)      | `../images/modules/samozatrudnienie.png`                     |

## Subpage Instances

| slug                        | spaLink                   | primaryKeyword                    | relatedSubpages                                         |
| --------------------------- | ------------------------- | --------------------------------- | ------------------------------------------------------- |
| `kalkulator-b2b`            | `/app/#/samozatrudnienie` | kalkulator B2B 2026               | `porownywarka-b2b`, `kalkulator-umowa-o-prace`          |
| `kalkulator-umowa-o-prace`  | `/app/#/umowa-o-prace`    | kalkulator umowa o pracę 2026     | `kalkulator-b2b`, `kalkulator-umowa-zlecenie`           |
| `kalkulator-umowa-zlecenie` | `/app/#/umowa-zlecenie`   | kalkulator umowa zlecenie 2026    | `kalkulator-umowa-o-prace`, `kalkulator-umowa-o-dzielo` |
| `kalkulator-umowa-o-dzielo` | `/app/#/umowa-o-dzielo`   | kalkulator umowa o dzieło 2026    | `kalkulator-umowa-zlecenie`, `kalkulator-umowa-o-prace` |
| `porownywarka-b2b`          | `/app/#/porownywarka-b2b` | porównanie form opodatkowania B2B | `kalkulator-b2b`, `kalkulator-vat`                      |
| `kalkulator-vat`            | `/app/#/faktura-vat`      | kalkulator VAT 2026               | `kalkulator-b2b`, `porownywarka-b2b`                    |

## Entity: MainPage (modified)

The existing `landing-page/index.html` is modified to:

| Change              | Description                                                             |
| ------------------- | ----------------------------------------------------------------------- |
| Add subpage links   | Each calculator section gets a "Dowiedz się więcej" link to its subpage |
| Add WebSite JSON-LD | New `<script type="application/ld+json">` with WebSite + SearchAction   |
| Expand footer       | Add sitemap links to all 6 subpages                                     |

## Entity: sitemap.xml

| Field                 | Value                      |
| --------------------- | -------------------------- |
| Format                | XML, sitemaps.org standard |
| URLs                  | 7 (1 main + 6 subpages)    |
| Main page priority    | 1.0                        |
| Subpage priority      | 0.8                        |
| changefreq (main)     | monthly                    |
| changefreq (subpages) | yearly                     |

## Entity: robots.txt

| Field      | Value                                       |
| ---------- | ------------------------------------------- |
| User-agent | \*                                          |
| Allow      | /                                           |
| Disallow   | /app/                                       |
| Sitemap    | https://kalkulatorfinansowy.app/sitemap.xml |

## JSON-LD Schemas per Page

| Page            | Schemas                                                               |
| --------------- | --------------------------------------------------------------------- |
| Main page (`/`) | SoftwareApplication (existing), FAQPage (existing), **WebSite** (new) |
| Each subpage    | **BreadcrumbList** (new), **HowTo** (new)                             |
