# Page Structure Contract: Landing Page

**Branch**: `018-landing-page-redesign` | **Date**: 2026-02-08

## HTML Document Structure

```html
<!DOCTYPE html>
<html lang="pl">
<head>
  <!-- Meta: charset, viewport, title, description, robots, canonical -->
  <!-- Open Graph: og:title, og:description, og:image, og:url, og:type, og:locale, og:site_name -->
  <!-- Twitter Card: twitter:card, twitter:title, twitter:description, twitter:image -->
  <!-- Theme: theme-color (#1565C0) -->
  <!-- Fonts: Google Fonts Roboto (preload, font-display: swap) -->
  <!-- CSS: dist/style.css (purged Tailwind) -->
  <!-- JSON-LD: SoftwareApplication + FAQPage -->
  <!-- GTM: GTM-MKR8Z54 -->
</head>
<body>
  <!-- GTM noscript -->

  <nav>         <!-- Sticky nav: logo + CTA -->
  <header>      <!-- Hero: title, description, CTA buttons, device mockup -->
  <main>
    <section>   <!-- Stats / Social proof -->
    <section>   <!-- Featured: Samozatrudnienie (full-width, text left) -->
    <section>   <!-- Featured: Porównywarka B2B (full-width, text right) -->
    <section>   <!-- Featured: Umowa o pracę (full-width, text left) -->
    <section>   <!-- Featured: Kalkulator IKE (full-width, text right) -->
    <section>   <!-- Grid: remaining modules (cards) -->
    <section>   <!-- FAQ (accordion, schema.org FAQPage) -->
    <section>   <!-- Final CTA -->
  </main>
  <footer>      <!-- Author, LinkedIn, BuyCoffee, copyright -->
</body>
</html>
```

## Section IDs (for anchor links if needed)

| Section          | ID                 | Heading Level  |
| ---------------- | ------------------ | -------------- |
| Nav              | —                  | —              |
| Hero             | `hero`             | h1             |
| Stats            | `stats`            | — (no heading) |
| Samozatrudnienie | `samozatrudnienie` | h2             |
| Porównywarka B2B | `porownywarka-b2b` | h2             |
| Umowa o pracę    | `umowa-o-prace`    | h2             |
| Kalkulator IKE   | `kalkulator-ike`   | h2             |
| Module Grid      | `moduly`           | h2             |
| FAQ              | `faq`              | h2             |
| Final CTA        | `cta`              | h2             |
| Footer           | —                  | —              |

## Responsive Breakpoints

| Breakpoint | Tailwind                         | Layout                           |
| ---------- | -------------------------------- | -------------------------------- |
| Mobile     | default (<640px)                 | 1 column, stacked                |
| Tablet     | `sm:` (640px) / `md:` (768px)    | 1-2 columns                      |
| Desktop    | `lg:` (1024px)                   | 2 columns featured, 2-3 col grid |
| Wide       | `xl:` (1280px) / `2xl:` (1536px) | Max-width container              |

## Image Contract

| Image            | Format   | Max Width | Lazy            | Alt (PL)                                               |
| ---------------- | -------- | --------- | --------------- | ------------------------------------------------------ |
| Hero mockup      | WebP+PNG | 600px     | No (above fold) | "Kalkulator finansowy — widok aplikacji"               |
| Samozatrudnienie | WebP+PNG | 500px     | Yes             | "Kalkulator samozatrudnienia B2B — obliczanie dochodu" |
| Porównywarka B2B | WebP+PNG | 500px     | Yes             | "Porównywarka form opodatkowania B2B"                  |
| Umowa o pracę    | WebP+PNG | 500px     | Yes             | "Kalkulator wynagrodzenia z umowy o pracę"             |
| Kalkulator IKE   | WebP+PNG | 500px     | Yes             | "Kalkulator oszczędności IKE"                          |
| Grid cards       | WebP+PNG | 350px     | Yes             | "[Nazwa modułu] — [krótki opis]"                       |
| OG image         | PNG      | 1200×630  | —               | —                                                      |
| App icon (nav)   | SVG      | 40px      | No              | "Kalkulator finansowy"                                 |

## Color Palette

| Token          | Light Mode                       | Dark Mode                     | Usage                          |
| -------------- | -------------------------------- | ----------------------------- | ------------------------------ |
| primary        | #1565C0                          | #42A5F5                       | CTA buttons, links, accents    |
| primary-dark   | #0D47A1                          | #1565C0                       | Hover states                   |
| bg             | #FFFFFF                          | #121212                       | Page background                |
| bg-alt         | #F5F5F5                          | #1E1E1E                       | Alternating section background |
| text           | #212121                          | #E0E0E0                       | Body text                      |
| text-secondary | #616161                          | #9E9E9E                       | Secondary text                 |
| nav-bg         | #FFFFFF / rgba(255,255,255,0.95) | #121212 / rgba(18,18,18,0.95) | Sticky nav background          |

## External URLs

| Target          | URL                                                                 |
| --------------- | ------------------------------------------------------------------- |
| App (web)       | `https://kalkulatorfinansowy.app/app/`                              |
| Google Play     | `https://play.google.com/store/apps/details?id=racyMind.kalkulator` |
| Author LinkedIn | `https://www.linkedin.com/in/%C5%82ukasz-socha-30083841/`           |
| BuyCoffee       | `https://buycoffee.to/lukaszsocha`                                  |
| Canonical       | `https://kalkulatorfinansowy.app/`                                  |
