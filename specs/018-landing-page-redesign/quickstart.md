# Quickstart: Redesign Landing Page

**Branch**: `018-landing-page-redesign` | **Date**: 2026-02-08

## Prerequisites

- Tailwind CSS standalone CLI binary ([download](https://github.com/tailwindlabs/tailwindcss/releases))
- Running app dev server (`quasar dev`) for screenshot generation
- MCP Chrome DevTools for automated screenshots
- Image conversion tool for WebP (e.g., `cwebp` from libwebp)

## Setup

### 1. Download Tailwind standalone CLI

```powershell
# Download for Windows
Invoke-WebRequest -Uri "https://github.com/tailwindlabs/tailwindcss/releases/latest/download/tailwindcss-windows-x64.exe" -OutFile "landing-page/tailwindcss.exe"
```

### 2. Initialize Tailwind config

```powershell
cd landing-page
./tailwindcss.exe init
```

Configure `tailwind.config.js`:

```js
module.exports = {
  content: ['./*.html'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#1565C0', dark: '#0D47A1', light: '#42A5F5' },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

### 3. Create source CSS

Create `landing-page/style.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Build CSS

```powershell
cd landing-page
./tailwindcss.exe -i style.css -o dist/style.css --minify
```

Watch mode during development:

```powershell
./tailwindcss.exe -i style.css -o dist/style.css --watch
```

## Screenshot Generation

### 1. Start app dev server

```powershell
npx quasar dev
```

### 2. Capture screenshots via MCP Chrome DevTools

For each module, use MCP tools:

1. `navigate_page` to module URL (e.g., `http://localhost:9000/#/samozatrudnienie`)
2. `resize_page` to 1280×800
3. `take_screenshot` to save to `landing-page/images/modules/`

### 3. Convert to WebP

```powershell
# Using cwebp (install libwebp first)
Get-ChildItem landing-page/images/modules/*.png | ForEach-Object {
    cwebp $_.FullName -q 80 -o ($_.FullName -replace '\.png$', '.webp')
}
```

## Development Workflow

1. Edit `landing-page/index.html`
2. Run Tailwind in watch mode
3. Open `landing-page/index.html` in browser (or use live server)
4. Verify responsive layouts at 375px, 768px, 1024px, 1440px
5. Check dark mode with browser DevTools (toggle prefers-color-scheme)

## Validation

### Lighthouse

Run Lighthouse audit in Chrome DevTools:

- Performance ≥ 90
- Accessibility ≥ 95
- SEO ≥ 95
- Best Practices ≥ 90

### WCAG

- Tab through all interactive elements — verify focus indicators
- Check color contrast with browser DevTools
- Verify alt text on all images
- Test at 200% zoom

### SEO

- Validate JSON-LD with [Google Rich Results Test](https://search.google.com/test/rich-results)
- Check OG tags with [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)
- Check Twitter Card with [Twitter Card Validator](https://cards-dev.twitter.com/validator)

## File Cleanup

After new landing page is complete, delete old files:

```powershell
cd landing-page
Remove-Item share.php, inflation.php, error.php, inflation-stats.csv, style.min.css
# Old images will be replaced by new ones in images/modules/
```

**DO NOT delete**: `contact.php`, `ads.txt`, `.htaccess`
