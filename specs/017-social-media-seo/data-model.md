# Data Model: Social Media & SEO

**Branch**: `017-social-media-seo`  
**Date**: 2026-02-08

## Overview

Ten feature nie wprowadza nowych encji danych ani modeli. Zmiany dotyczą wyłącznie:

- Statycznych meta tagów HTML w `index.html`
- Parametrów URL w komponentach Vue (share links)
- Tekstów UI w komponentach Vue
- Pliku graficznego (OG image)

## Entities (istniejące, modyfikowane)

### Meta Tags (index.html)

Zestaw tagów `<meta>` i `<link>` w sekcji `<head>` pliku `index.html`.

| Tag                   | Typ               | Wartość                               | Status                    |
| --------------------- | ----------------- | ------------------------------------- | ------------------------- |
| `og:title`            | `<meta property>` | `Kalkulator finansowy`                | Istniejący → aktualizacja |
| `og:description`      | `<meta property>` | Opis SEO z kluczowymi frazami         | Istniejący → aktualizacja |
| `og:image`            | `<meta property>` | URL do grafiki OG 1200×630            | Istniejący → aktualizacja |
| `og:url`              | `<meta property>` | `https://kalkulatorfinansowy.app/app` | Istniejący → aktualizacja |
| `og:type`             | `<meta property>` | `website`                             | **Nowy**                  |
| `og:locale`           | `<meta property>` | `pl_PL`                               | **Nowy**                  |
| `og:site_name`        | `<meta property>` | `Kalkulator finansowy`                | **Nowy**                  |
| `twitter:card`        | `<meta name>`     | `summary_large_image`                 | **Nowy**                  |
| `twitter:title`       | `<meta name>`     | `Kalkulator finansowy`                | **Nowy**                  |
| `twitter:description` | `<meta name>`     | Opis SEO                              | **Nowy**                  |
| `twitter:image`       | `<meta name>`     | URL do grafiki OG                     | **Nowy**                  |
| `description`         | `<meta name>`     | Opis SEO (istniejący)                 | Istniejący → aktualizacja |
| `robots`              | `<meta name>`     | `index, follow`                       | **Nowy**                  |
| `author`              | `<meta name>`     | `Łukasz Socha`                        | **Nowy**                  |
| `canonical`           | `<link rel>`      | `https://kalkulatorfinansowy.app/app` | **Nowy**                  |

### Share URLs (SupportProject.vue)

Parametry URL-i udostępniania w komponentcie `SupportProject.vue`.

| Platforma           | Bazowy URL                                   | Parametry                          |
| ------------------- | -------------------------------------------- | ---------------------------------- |
| Facebook            | `https://www.facebook.com/sharer/sharer.php` | `u` = URL aplikacji                |
| LinkedIn            | `https://www.linkedin.com/shareArticle`      | `mini=true`, `url` = URL aplikacji |
| X (dawniej Twitter) | `https://x.com/intent/tweet`                 | `url`, `text`, `hashtags`          |

### OG Image (nowy plik)

| Atrybut       | Wartość                                                   |
| ------------- | --------------------------------------------------------- |
| Ścieżka       | `public/images/og-image.png`                              |
| Wymiary       | 1200 × 630 px                                             |
| Format        | PNG                                                       |
| Max rozmiar   | < 1 MB                                                    |
| Publiczny URL | `https://kalkulatorfinansowy.app/app/images/og-image.png` |

## Relationships

```
index.html
  └── og:image → public/images/og-image.png
  └── twitter:image → public/images/og-image.png (ten sam plik)

SupportProject.vue
  └── url (const) → 'https://kalkulatorfinansowy.app/app'
  └── Facebook share → sharer.php?u={url}
  └── LinkedIn share → shareArticle?mini=true&url={url}
  └── X share → intent/tweet?url={url}&text={text}&hashtags={hashtags}
```
