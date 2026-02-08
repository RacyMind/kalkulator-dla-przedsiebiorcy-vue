# Data Model: Redesign Landing Page

**Branch**: `018-landing-page-redesign` | **Date**: 2026-02-08

## Overview

This is a static landing page — no database or API. The "data model" describes the content structure of the page sections and the entities rendered in HTML.

## Page Sections

### 1. StickyNav

| Field    | Type      | Description                            |
| -------- | --------- | -------------------------------------- |
| logo     | SVG/Image | App icon (app-icon.svg)                |
| appName  | string    | "Kalkulator finansowy"                 |
| ctaUrl   | URL       | `https://kalkulatorfinansowy.app/app/` |
| ctaLabel | string    | "Przejdź do kalkulatora"               |

### 2. HeroSection

| Field        | Type         | Description                              |
| ------------ | ------------ | ---------------------------------------- |
| title        | string       | h1: "Kalkulator finansowy"               |
| subtitle     | string       | Tagline describing app value             |
| description  | string       | 1-2 sentences about the app              |
| ctaPrimary   | {label, url} | "Przejdź do kalkulatora" → `/app/`       |
| ctaSecondary | {label, url} | "Pobierz w Google Play" → Play Store URL |
| heroImage    | Image        | Device mockup with app screenshot        |

### 3. StatsSection (Social Proof)

| Field         | Type       | Description          |
| ------------- | ---------- | -------------------- |
| stats[]       | Array      | List of stat items   |
| stats[].value | string     | e.g., "20+"          |
| stats[].label | string     | e.g., "kalkulatorów" |
| stats[].icon  | string/SVG | Optional icon        |

**Example stats**:

- "20+" / "kalkulatorów"
- "Darmowa" / "aplikacja"
- "2026" / "aktualne stawki"
- "100%" / "offline"

### 4. FeaturedModule (×4, full-width)

| Field         | Type              | Description                                |
| ------------- | ----------------- | ------------------------------------------ |
| name          | string            | Module name (h2)                           |
| slug          | string            | URL path in app (e.g., "samozatrudnienie") |
| description   | string            | 2-4 sentences describing the module        |
| features      | string[]          | Optional bullet list of key features       |
| screenshot    | Image             | WebP screenshot from app                   |
| screenshotAlt | string            | Descriptive alt text (Polish)              |
| appUrl        | URL               | Direct link to module in app               |
| position      | "left" \| "right" | Text/image alternating layout              |

**Featured modules (in order)**:

1. Samozatrudnienie (B2B) — position: left
2. Porównywarka B2B — position: right
3. Umowa o pracę — position: left
4. Kalkulator IKE — position: right

### 5. ModuleGrid (remaining modules)

| Field                   | Type   | Description               |
| ----------------------- | ------ | ------------------------- |
| modules[]               | Array  | List of grid card items   |
| modules[].name          | string | Module name               |
| modules[].slug          | string | URL path in app           |
| modules[].description   | string | 1-2 sentences             |
| modules[].screenshot    | Image  | WebP screenshot (smaller) |
| modules[].screenshotAlt | string | Descriptive alt text      |
| modules[].appUrl        | URL    | Direct link to module     |

**Grid modules**:

- Umowa zlecenie
- Umowa o dzieło
- Faktura VAT
- Kursy walut
- Działalność niezarejestrowana

### 6. FAQSection

| Field            | Type   | Description                        |
| ---------------- | ------ | ---------------------------------- |
| title            | string | h2: "Najczęściej zadawane pytania" |
| items[]          | Array  | FAQ Q&A pairs                      |
| items[].question | string | Question text                      |
| items[].answer   | string | Answer text (can contain HTML)     |

**Example FAQ items**:

- "Czy aplikacja jest darmowa?" → "Tak, Kalkulator finansowy jest w pełni darmowy..."
- "Jakie formy zatrudnienia obsługuje kalkulator?" → "Umowa o pracę, umowa zlecenie, umowa o dzieło, B2B..."
- "Czy dane są aktualne?" → "Tak, stawki podatkowe i składki ZUS są aktualizowane na bieżący rok..."
- "Czy mogę korzystać offline?" → "Tak, aplikacja działa jako PWA i jest dostępna offline..."
- "Czy aplikacja jest dostępna na telefon?" → "Tak, w Google Play oraz jako PWA w przeglądarce..."

### 7. CTASection (final)

| Field        | Type         | Description                          |
| ------------ | ------------ | ------------------------------------ |
| title        | string       | h2: Motivational heading             |
| ctaPrimary   | {label, url} | "Przejdź do kalkulatora" → `/app/`   |
| ctaSecondary | {label, url} | "Pobierz w Google Play" → Play Store |

### 8. FooterSection

| Field             | Type   | Description                        |
| ----------------- | ------ | ---------------------------------- |
| authorName        | string | "Łukasz Socha"                     |
| authorDescription | string | "Projekt rozwijany hobbystycznie"  |
| linkedInUrl       | URL    | Author's LinkedIn profile          |
| buyCoffeeUrl      | URL    | `https://buycoffee.to/lukaszsocha` |
| copyrightYear     | number | Current year (2026)                |

## Meta Tags Entity

| Field               | Value                                                                                                                                                        |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| title               | "Kalkulator finansowy – Darmowy kalkulator wynagrodzeń i podatków"                                                                                           |
| description         | "Darmowy kalkulator wynagrodzeń z umowy o pracę, umowy zlecenie, B2B i umowy o dzieło. Oblicz składki ZUS, podatek PIT, VAT i więcej. Aktualne stawki 2026." |
| canonical           | `https://kalkulatorfinansowy.app/`                                                                                                                           |
| robots              | "index, follow"                                                                                                                                              |
| og:title            | "Kalkulator finansowy – Darmowy kalkulator wynagrodzeń i podatków"                                                                                           |
| og:description      | "Darmowy kalkulator wynagrodzeń z umowy o pracę, umowy zlecenie, B2B i umowy o dzieło. Oblicz składki ZUS, podatek PIT, VAT i więcej."                       |
| og:image            | `https://kalkulatorfinansowy.app/images/og-image.png`                                                                                                        |
| og:url              | `https://kalkulatorfinansowy.app/`                                                                                                                           |
| og:type             | "website"                                                                                                                                                    |
| og:locale           | "pl_PL"                                                                                                                                                      |
| og:site_name        | "Kalkulator finansowy"                                                                                                                                       |
| twitter:card        | "summary_large_image"                                                                                                                                        |
| twitter:title       | (same as og:title)                                                                                                                                           |
| twitter:description | (same as og:description)                                                                                                                                     |
| twitter:image       | (same as og:image)                                                                                                                                           |
| theme-color         | "#1565C0"                                                                                                                                                    |

## JSON-LD Schemas

### SoftwareApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Kalkulator finansowy",
  "description": "Darmowy kalkulator wynagrodzeń z umowy o pracę, umowy zlecenie, B2B i umowy o dzieło.",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "Web, Android",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "PLN"
  },
  "url": "https://kalkulatorfinansowy.app/app/",
  "author": {
    "@type": "Person",
    "name": "Łukasz Socha"
  }
}
```

### FAQPage

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Czy aplikacja jest darmowa?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Tak, Kalkulator finansowy jest w pełni darmowy..."
      }
    }
  ]
}
```
