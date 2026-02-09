# Research: Landing Page SEO

**Feature**: 001-landing-seo
**Date**: 2026-02-08

## R1: Tailwind CSS build pipeline for subpages

**Decision**: Update `tailwind.config.js` content paths to include subdirectory HTML files.

**Rationale**: Current config `content: ['./*.html']` only scans root-level HTML. Subpages in `kalkulator-b2b/index.html` etc. won't have their Tailwind classes included in the compiled CSS. Must change to `['./**/*.html']` or `['./*.html', './**/index.html']`.

**Alternatives considered**:

- Separate Tailwind build per subpage — rejected (unnecessary complexity, all pages share same design system)
- Inline styles instead of Tailwind — rejected (inconsistent with existing approach)

**Note**: `index.html` references `dist/style.css`. Build command unknown (no `package.json` in `landing-page/`). Subpages will reference `../dist/style.css` (relative path up one level).

## R2: Subpage HTML template structure

**Decision**: Each subpage follows a consistent template:

1. `<head>` — unique title, description, canonical, OG tags, Twitter Cards, JSON-LD (BreadcrumbList + HowTo), shared CSS/fonts/GTM
2. `<nav>` — identical sticky nav from main page
3. `<header>` — hero section with H1, subtitle, CTA button to SPA
4. `<main>` — SEO content (H2/H3 sections, lists, FAQ), screenshot of calculator
5. `<aside>` — "Powiązane kalkulatory" section with cross-links
6. `<footer>` — identical footer from main page + sitemap links

**Rationale**: Reusing the same layout (nav, footer, colors, fonts) ensures brand consistency per clarification Q2. Unique content sections target specific keywords per clarification Q3.

**Alternatives considered**:

- Single-page with anchor sections — rejected (no unique URLs for Google)
- Server-side rendering — rejected (unnecessary for 6 static pages)

## R3: Relative paths in subpages

**Decision**: Subpages use relative paths (`../`) for shared assets:

- CSS: `../dist/style.css`
- Images: `../images/...`
- Fonts: absolute Google Fonts URL (no change)
- Nav logo: `../images/app-icon.svg`

**Rationale**: Static HTML files in subdirectories need relative paths to reference shared assets in the parent `landing-page/` directory. Absolute paths would also work but relative paths are more portable.

**Alternatives considered**:

- Absolute URLs (`https://kalkulatorfinansowy.app/images/...`) — viable but less portable for local development
- Duplicating assets per subpage — rejected (maintenance burden)

## R4: sitemap.xml format and content

**Decision**: Standard XML sitemap with all 7 URLs (1 main + 6 subpages):

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://kalkulatorfinansowy.app/</loc>
    <lastmod>2026-02-08</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://kalkulatorfinansowy.app/kalkulator-b2b/</loc>
    <lastmod>2026-02-08</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>
  <!-- ... 5 more subpages -->
</urlset>
```

**Rationale**: Standard sitemaps.org format. Main page gets highest priority. Subpages get `changefreq: yearly` (content changes with tax year). `lastmod` updated on each deploy.

**Alternatives considered**:

- Sitemap index with multiple sitemaps — rejected (overkill for 7 URLs)
- Dynamic sitemap generation — rejected (static site, manual updates sufficient)

## R5: robots.txt content

**Decision**: Simple robots.txt allowing all crawlers, referencing sitemap:

```
User-agent: *
Allow: /
Disallow: /app/

Sitemap: https://kalkulatorfinansowy.app/sitemap.xml
```

**Rationale**: Allow crawling of all landing page content. Disallow `/app/` since SPA with hash routing provides no crawlable content. Reference sitemap for discovery.

**Alternatives considered**:

- Not disallowing `/app/` — considered but SPA hash routes return same HTML for all routes, which could cause duplicate content issues
- Disallowing specific bot user-agents — rejected (no reason to block any crawler)

## R6: JSON-LD structured data patterns

**Decision**: Three types of JSON-LD on subpages:

1. **BreadcrumbList** (all subpages):

```json
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
      "name": "Kalkulator B2B",
      "item": "https://kalkulatorfinansowy.app/kalkulator-b2b/"
    }
  ]
}
```

2. **HowTo** (all subpages — steps to use calculator):

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "Jak obliczyć wynagrodzenie B2B",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Wpisz kwotę",
      "text": "Wpisz kwotę brutto na fakturze"
    },
    {
      "@type": "HowToStep",
      "name": "Wybierz formę opodatkowania",
      "text": "Wybierz skalę podatkową, podatek liniowy lub ryczałt"
    },
    {
      "@type": "HowToStep",
      "name": "Sprawdź wynik",
      "text": "Kalkulator pokaże wynagrodzenie netto, składki ZUS i podatek"
    }
  ]
}
```

3. **WebSite with SearchAction** (main page only):

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Kalkulator finansowy",
  "url": "https://kalkulatorfinansowy.app/",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://kalkulatorfinansowy.app/app/#/{search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
```

**Rationale**: BreadcrumbList enables breadcrumb rich snippets in SERP. HowTo enables how-to rich snippets (step-by-step). WebSite with SearchAction enables sitelinks search box.

**Alternatives considered**:

- FAQPage on subpages — possible addition but HowTo is more relevant for calculator pages
- SoftwareApplication on subpages — rejected (already on main page, would be duplicate)

## R7: Keyword cannibalization prevention strategy

**Decision**: Each page targets a distinct primary keyword cluster:

- Main page: "kalkulator finansowy" (brand + generic)
- Subpages: specific calculator names (see spec keyword table)

Main page stays as navigation hub (short descriptions) per clarification Q4. Subpages contain the deep content. No overlap in H1 tags or primary keywords.

**Rationale**: Google assigns one page per keyword intent. If main page and subpage both target "kalkulator B2B", they compete. Clear separation prevents this.

## R8: GTM ID in public repository

**Decision**: GTM ID (`GTM-MKR8Z54`) is currently hardcoded in `index.html`. For subpages, use the same GTM ID. This is acceptable — GTM container IDs are public by design (visible in page source on any website).

**Rationale**: GTM IDs are not secrets. They are meant to be embedded in HTML. No security risk from having them in a public repo. This differs from API keys (AdSense, AdMob) which should be in environment variables.

**Note**: Per project memory, API keys must be in `.env` with `VITE_` prefix. GTM IDs are an exception — they are public identifiers, not secrets.
