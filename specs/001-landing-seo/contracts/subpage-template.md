# Contract: Subpage HTML Template

**Feature**: 001-landing-seo
**Date**: 2026-02-08

> This is not an API contract — it defines the HTML structure contract for each calculator subpage.

## Template Structure

Each subpage (`landing-page/{slug}/index.html`) MUST follow this structure:

```html
<!DOCTYPE html>
<html lang="pl">
  <head>
    <!-- Required meta -->
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{unique_title} – max 60 chars</title>
    <meta name="description" content="{unique_description} – max 160 chars" />
    <meta name="robots" content="index, follow" />
    <meta name="author" content="Łukasz Socha" />
    <link rel="canonical" href="https://kalkulatorfinansowy.app/{slug}/" />
    <meta name="theme-color" content="#1565C0" />

    <!-- Open Graph -->
    <meta property="og:title" content="{unique_title}" />
    <meta property="og:description" content="{unique_description}" />
    <meta
      property="og:image"
      content="https://kalkulatorfinansowy.app/images/og-image.png"
    />
    <meta property="og:url" content="https://kalkulatorfinansowy.app/{slug}/" />
    <meta property="og:type" content="website" />
    <meta property="og:locale" content="pl_PL" />
    <meta property="og:site_name" content="Kalkulator finansowy" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="{unique_title}" />
    <meta name="twitter:description" content="{unique_description}" />
    <meta
      name="twitter:image"
      content="https://kalkulatorfinansowy.app/images/og-image.png"
    />

    <!-- Favicons (same as main page, relative paths) -->
    <link rel="icon" type="image/svg+xml" href="../images/app-icon.svg" />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="../images/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="../images/favicon-16x16.png"
    />
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="../images/apple-touch-icon.png"
    />
    <link rel="shortcut icon" href="../images/favicon.ico" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
    />

    <!-- CSS -->
    <link rel="stylesheet" href="../dist/style.css" />

    <!-- JSON-LD: BreadcrumbList -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Strona główna",
            "item": "https://kalkulatorfinansowy.app/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "{page_name}",
            "item": "https://kalkulatorfinansowy.app/{slug}/"
          }
        ]
      }
    </script>

    <!-- JSON-LD: HowTo -->
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "{how_to_title}",
        "step": [
          {
            "@type": "HowToStep",
            "name": "{step1_name}",
            "text": "{step1_text}"
          },
          {
            "@type": "HowToStep",
            "name": "{step2_name}",
            "text": "{step2_text}"
          },
          {
            "@type": "HowToStep",
            "name": "{step3_name}",
            "text": "{step3_text}"
          }
        ]
      }
    </script>

    <!-- Google Tag Manager -->
    <script>
      ...
    </script>
  </head>
  <body
    class="bg-white text-gray-800 font-sans dark:bg-gray-900 dark:text-gray-100"
  >
    <!-- GTM noscript -->

    <!-- Nav (identical to main page) -->
    <nav>...</nav>

    <!-- Breadcrumb (visible) -->
    <div class="max-w-6xl mx-auto px-4 pt-20 pb-2">
      <nav aria-label="Breadcrumb">
        <ol class="flex text-sm text-gray-500">
          <li><a href="../">Strona główna</a></li>
          <li class="mx-2">/</li>
          <li class="text-gray-900">{page_name}</li>
        </ol>
      </nav>
    </div>

    <!-- Hero with H1 + CTA -->
    <header>
      <h1>{unique_h1}</h1>
      <p>{subtitle}</p>
      <a href="{spa_link}">Przejdź do kalkulatora</a>
    </header>

    <!-- Calculator screenshot -->
    <section>
      <picture>
        <source srcset="{screenshot_webp}" type="image/webp" />
        <img
          src="{screenshot_png}"
          alt="{screenshot_alt}"
          width="640"
          height="400"
          loading="lazy"
        />
      </picture>
    </section>

    <!-- SEO Content (min. 300 words) -->
    <main>
      <article>
        <h2>{content_section_1}</h2>
        <p>...</p>

        <h2>{content_section_2}</h2>
        <p>...</p>
        <ul>
          ...
        </ul>

        <h3>{content_subsection}</h3>
        <p>...</p>
      </article>
    </main>

    <!-- CTA repeat -->
    <section>
      <a href="{spa_link}">Oblicz teraz — za darmo</a>
    </section>

    <!-- Related calculators -->
    <aside>
      <h2>Powiązane kalkulatory</h2>
      <!-- 2-3 links to related subpages -->
    </aside>

    <!-- Footer (identical to main page + sitemap links) -->
    <footer>...</footer>
  </body>
</html>
```

## Validation Rules

| Rule                        | Constraint                                  |
| --------------------------- | ------------------------------------------- |
| `<title>` length            | max 60 characters                           |
| `<meta description>` length | max 160 characters                          |
| `<h1>`                      | exactly 1 per page, unique across all pages |
| Canonical URL               | must match page's actual URL                |
| OG tags                     | all required tags present                   |
| BreadcrumbList JSON-LD      | valid, 2 items (home + current)             |
| HowTo JSON-LD               | valid, 3+ steps                             |
| SEO content word count      | min. 300 words                              |
| Related subpages            | min. 2 links                                |
| CTA to SPA                  | at least 1 prominent link                   |
| Language                    | all text in Polish                          |
| Assets                      | relative paths (`../`) to shared assets     |
