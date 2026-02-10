# Quickstart: Landing Page SEO

**Feature**: 001-landing-seo
**Date**: 2026-02-08

## Prerequisites

- Node.js (for Tailwind CSS build)
- Access to `landing-page/` directory

## Implementation Order

### Step 1: Update Tailwind config

Update `landing-page/tailwind.config.js` to scan subdirectory HTML files:

```js
content: ['./**/*.html'],
```

### Step 2: Create subpage template

Create the first subpage (`landing-page/kalkulator-b2b/index.html`) as a reference implementation. Use the template from `contracts/subpage-template.md`. Verify:

- Same nav/footer as main page
- Relative paths (`../`) for assets
- Unique title, description, H1
- JSON-LD BreadcrumbList + HowTo
- CTA linking to SPA
- Min. 300 words SEO content

### Step 3: Create remaining 5 subpages

Clone the template for each calculator, customizing:

- Title, description, H1, canonical URL
- SEO content (unique per page)
- SPA link (`/app/#/...`)
- Related subpages section
- HowTo steps
- Calculator screenshot

Subpages:

1. `kalkulator-b2b/` → `/app/#/samozatrudnienie`
2. `kalkulator-umowa-o-prace/` → `/app/#/umowa-o-prace`
3. `kalkulator-umowa-zlecenie/` → `/app/#/umowa-zlecenie`
4. `kalkulator-umowa-o-dzielo/` → `/app/#/umowa-o-dzielo`
5. `porownywarka-b2b/` → `/app/#/porownywarka-b2b`
6. `kalkulator-vat/` → `/app/#/faktura-vat`

### Step 4: Create robots.txt

Create `landing-page/robots.txt`:

```
User-agent: *
Allow: /
Disallow: /app/

Sitemap: https://kalkulatorfinansowy.app/sitemap.xml
```

### Step 5: Create sitemap.xml

Create `landing-page/sitemap.xml` with all 7 URLs (main + 6 subpages).

### Step 6: Update main page

Modify `landing-page/index.html`:

- Add "Dowiedz się więcej" links to subpages in calculator sections
- Add JSON-LD WebSite with SearchAction
- Expand footer with sitemap links to all subpages

### Step 7: Rebuild Tailwind CSS

```bash
npx @tailwindcss/cli -i style.css -o dist/style.css --minify
```

(Run from `landing-page/` directory)

## Verification

1. Open each subpage in browser — verify layout, content, links
2. Validate JSON-LD: https://search.google.com/test/rich-results
3. Validate sitemap: https://www.xml-sitemaps.com/validate-xml-sitemap.html
4. Check robots.txt: https://www.google.com/webmasters/tools/robots-testing-tool
5. Run PageSpeed Insights on main page and 1 subpage
6. Verify all internal links work (no 404s)
7. Check title/description uniqueness across all pages
