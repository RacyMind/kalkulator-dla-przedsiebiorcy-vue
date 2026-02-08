# Quick Start: Store & Social Media Graphics Update

**Feature**: 019-store-fb-graphics  
**Date**: 2026-02-08

## Prerequisites

- Node.js 18+
- `sharp` installed (`npm install` — already in devDependencies)
- App running locally: `npx quasar dev` (default port 9200)
- MCP Chrome DevTools connected to the browser

## Step-by-Step

### 1. Start the App

```bash
npx quasar dev
```

Wait for the app to be available at `http://localhost:9200`.

### 2. Capture Phone Screenshots (via MCP Chrome)

For each module in the screenshot matrix:

1. Set mobile viewport:

   ```
   mcp0_emulate → viewport: { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }
   ```

2. Navigate to the module route:

   ```
   mcp0_navigate_page → url: http://localhost:9200/#/<route>
   ```

3. Fill in sample data using `mcp0_fill` / `mcp0_fill_form`

4. Click "Oblicz" (calculate) to show results

5. Take screenshot:
   ```
   mcp0_take_screenshot → filePath: graphics/Google Play/phone/<nn>-<name>.png
   ```

**Modules to capture** (in order):
| # | Route | Sample Data |
|---|-------|-------------|
| 1 | `/` (main menu) | — |
| 2 | `/umowa-o-prace` | 7000 zł brutto, 2026 |
| 3 | `/porownywarka-b2b` | 15000 zł, 2026 |
| 4 | `/samozatrudnienie` | 12000 zł, 2026 |
| 5 | `/faktura-vat` | 5000 zł netto |
| 6 | `/ulga-podatkowa-ikze` | 9388.80 zł |
| 7 | `/kalkulator-ike` | 23472 zł |
| 8 | `/obligacje-skarbowe` | 10000 zł |

### 3. Capture Tablet Screenshots (via MCP Chrome)

Repeat the process with tablet viewports:

- **7-inch tablet**: `{ width: 600, height: 1024, deviceScaleFactor: 2 }`
- **10-inch tablet**: `{ width: 800, height: 1280, deviceScaleFactor: 2 }`

Capture at least modules #1–#4 for each tablet size.

### 4. Post-Process Screenshots

Run the compositing script to add device frames and branded backgrounds:

```bash
node scripts/generate-store-screenshots.mjs
```

This reads raw captures from `graphics/Google Play/phone/`, `tablet-7/`, `tablet-10/` and outputs final composited images.

### 5. Generate Feature Graphic

```bash
node scripts/generate-feature-graphic.mjs
```

Output: `graphics/Google Play/feature-graphic.png` (1024×500 px)

### 6. Generate Facebook Cover Photo

```bash
node scripts/generate-fb-cover.mjs
```

Output: `graphics/Facebook/cover-photo.png` (851×315 px)

### 7. Create Promotional Video (P2)

1. Screen-record app navigation through key modules
2. Add text overlays in Polish
3. Add royalty-free background music
4. Export as MP4 (1080p, 30-60 seconds)
5. Upload to YouTube (public or unlisted, no ads)
6. Copy YouTube URL to Google Play Console → Video field

### 8. Upload to Google Play Console

1. Go to Google Play Console → Store listing → Graphics
2. Upload phone screenshots from `graphics/Google Play/phone/`
3. Upload 7-inch tablet screenshots from `graphics/Google Play/tablet-7/`
4. Upload 10-inch tablet screenshots from `graphics/Google Play/tablet-10/`
5. Replace feature graphic with `graphics/Google Play/feature-graphic.png`
6. Paste YouTube URL in Video field

### 9. Upload Facebook Cover

1. Go to Facebook profile → Edit cover photo
2. Upload `graphics/Facebook/cover-photo.png`
3. Adjust positioning if needed (safe zone: center ~640×315 area)

## Verification

- [ ] All phone screenshots display correctly in Google Play Console preview
- [ ] All tablet screenshots display correctly in both 7" and 10" slots
- [ ] Feature graphic displays correctly (1024×500)
- [ ] Video plays correctly from store listing
- [ ] Facebook cover photo looks good on both desktop and mobile
- [ ] All text is in Polish
- [ ] All data shows 2026 values
- [ ] Branding is consistent (blue gradient, app icon)
