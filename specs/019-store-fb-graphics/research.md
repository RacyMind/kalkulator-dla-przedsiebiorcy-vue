# Research: Store & Social Media Graphics Update

**Feature**: 019-store-fb-graphics  
**Date**: 2026-02-08

## 1. Screenshot Capture Approach

**Decision**: Use MCP Chrome DevTools to capture screenshots from the running app with viewport emulation.

**Rationale**: MCP Chrome provides `emulate` (viewport resize), `navigate_page`, `take_screenshot` tools — all needed for capturing at exact device dimensions. This gives pixel-perfect screenshots of the actual app UI without needing Puppeteer or Playwright scripts.

**Process**:

1. Start app locally (`npx quasar dev`)
2. Use `mcp0_emulate` to set viewport to target device size
3. Navigate to each module route
4. Fill in realistic sample data via `mcp0_fill`
5. Take screenshot via `mcp0_take_screenshot`
6. Post-process with sharp (add device frame, branded background)

**Alternatives considered**:

- Puppeteer/Playwright script — more automation but requires separate setup; MCP Chrome is already available
- Manual screenshots — error-prone, inconsistent sizing

## 2. Device Viewport Sizes

**Decision**: Use the following viewport sizes for each device category.

| Device     | Viewport (CSS px) | Output Image | Aspect Ratio |
| ---------- | ----------------- | ------------ | ------------ |
| Phone      | 390×844           | 1080×1920    | 9:16         |
| Tablet 7"  | 600×1024          | 1200×2048    | ~9:16        |
| Tablet 10" | 800×1280          | 1600×2560    | ~9:16        |

**Rationale**: These are standard device sizes that Google Play accepts. The viewport is set in CSS pixels; the output is scaled up for high-DPI display. All meet Google Play's 320-3840px constraint.

**Alternatives considered**:

- Pixel-exact device sizes (e.g., Samsung Galaxy Tab) — unnecessary precision, standard sizes work fine

## 3. Device Mockup Frames

**Decision**: Generate device frames programmatically using SVG (rounded rectangles with shadows) rather than using photographic device images.

**Rationale**:

- No licensing issues with device photos
- Consistent style across all screenshots
- Easy to adjust colors/sizes
- Matches the modern flat design trend (DR-007, DR-008)
- Existing `generate-og-image.mjs` already uses SVG generation pattern

**Design**:

- Phone frame: dark rounded rectangle with notch, thin bezels
- Tablet frame: similar style, wider bezels, no notch
- Background: gradient using app brand colors (blue `#1976D2` → `#0D47A1`, matching the new app icon)

**Alternatives considered**:

- Stock device mockup PNGs — licensing concerns, harder to customize
- No frames (raw screenshots) — less professional appearance

## 4. Background Style

**Decision**: Update from solid red to a blue gradient matching the new app icon colors (`#1976D2` → `#0D47A1`).

**Rationale**: The old red background matched the old app icon. The new icon uses blue (`#1976D2`), so the background should be consistent. This also matches the OG image style already generated.

**Alternatives considered**:

- Keep red — inconsistent with new branding
- Dark/neutral background — less distinctive, doesn't reinforce brand

## 5. Dark Mode vs Light Mode

**Decision**: Capture screenshots in the app's default theme. If the app defaults to system preference, use dark mode as the primary showcase with 1-2 light mode screenshots for variety.

**Rationale**: Dark mode is the newer feature (spec 012) and is visually more striking in store listings. Showing both demonstrates the app's flexibility.

## 6. Feature Graphic Design

**Decision**: Create a 1024×500 px graphic using SVG→PNG with:

- Blue gradient background (matching app icon)
- App icon on the left
- App name "Kalkulator finansowy" as title
- Tagline "Twój darmowy kalkulator wynagrodzeń" below
- Optional: small phone mockup showing the app on the right side

**Rationale**: Follows the same visual language as the OG image (`generate-og-image.mjs`), ensuring brand consistency. The layout is similar but adapted to the wider 1024×500 format.

**Alternatives considered**:

- Keep cartoon-style illustration — outdated, doesn't match new branding
- Photo-based design — harder to maintain, inconsistent with SVG pipeline

## 7. Facebook Cover Photo

**Decision**: Create an 851×315 px graphic with similar branding to the feature graphic — blue gradient, app icon, app name, and a brief value proposition.

**Rationale**: Consistent branding across platforms. The wider format (851×315) allows for more horizontal layout with the icon on one side and text on the other.

## 8. Promotional Video

**Decision**: Create a screen recording of the app in action using MCP Chrome DevTools, then edit into a 30-60 second video.

**Approach**:

1. Record screen while navigating through key modules (main menu → UoP → results → B2B comparator → results)
2. Add text overlays in Polish describing each feature
3. Add background music (royalty-free)
4. Export as MP4, upload to YouTube

**Rationale**: Screen recording of the actual app is the most authentic approach. Google Play recommends showing real app UI in videos.

**Alternatives considered**:

- Animated presentation (slides) — less authentic
- Professional video production — overkill for this app's scale

**Note**: Video creation requires tools beyond MCP Chrome (video editing). This is marked as P2 and may need manual effort or a separate tool like ffmpeg.

## 9. Sample Data for Screenshots

**Decision**: Use the following realistic sample data across all screenshots:

| Module                       | Key Input            | Value                  |
| ---------------------------- | -------------------- | ---------------------- |
| Umowa o pracę                | Wynagrodzenie brutto | 7 000 zł               |
| Porównywarka B2B             | Przychód (bez VAT)   | 15 000 zł              |
| Samozatrudnienie             | Przychód             | 12 000 zł              |
| Faktura VAT                  | Kwota netto          | 5 000 zł               |
| IKZE                         | Wpłata roczna        | 9 388,80 zł (max 2026) |
| IKE                          | Wpłata roczna        | 23 472 zł (max 2026)   |
| Obligacje                    | Kwota inwestycji     | 10 000 zł              |
| Data obowiązywania przepisów | Rok                  | 2026                   |

**Rationale**: Values are realistic for the Polish market, not too high or low. Using 2026 data ensures screenshots are current.

## 10. File Organization

**Decision**: Organize output files in subdirectories within `graphics/Google Play/` to separate phone, tablet, and other assets.

```
graphics/
├── Google Play/
│   ├── phone/           # 8 phone screenshots
│   ├── tablet-7/        # 2-4 tablet 7" screenshots
│   ├── tablet-10/       # 2-4 tablet 10" screenshots
│   └── feature-graphic.png
├── Facebook/
│   └── cover-photo.png
└── video/
    └── (video files)
```

**Rationale**: Cleaner organization than flat files. The old screenshots in the root `graphics/Google Play/` directory can be archived or removed.
