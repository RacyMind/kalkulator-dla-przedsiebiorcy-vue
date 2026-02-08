# Data Model: Store & Social Media Graphics Update

**Feature**: 019-store-fb-graphics  
**Date**: 2026-02-08

## Graphic Assets Inventory

This feature produces static graphic files (no database entities). The "data model" describes the asset specifications and relationships.

### Asset Types

#### 1. Phone Screenshot

| Property    | Value                                                    |
| ----------- | -------------------------------------------------------- |
| Format      | PNG                                                      |
| Dimensions  | 1080×1920 px (9:16)                                      |
| Max size    | 8 MB                                                     |
| Quantity    | 8                                                        |
| Location    | `graphics/Google Play/phone/`                            |
| Composition | Branded background + phone mockup frame + app screenshot |

**Components**:

- **Background**: Blue gradient (`#1976D2` → `#0D47A1`), 1080×1920 px
- **Device frame**: SVG-generated phone frame (dark, rounded, thin bezels, notch)
- **App capture**: Raw screenshot at 390×844 CSS px (scaled to fit frame)

#### 2. Tablet Screenshot (7-inch)

| Property    | Value                                                     |
| ----------- | --------------------------------------------------------- |
| Format      | PNG                                                       |
| Dimensions  | 1200×2048 px (~9:16)                                      |
| Max size    | 8 MB                                                      |
| Quantity    | 2–4                                                       |
| Location    | `graphics/Google Play/tablet-7/`                          |
| Composition | Branded background + tablet mockup frame + app screenshot |

**Components**:

- **Background**: Blue gradient, 1200×2048 px
- **Device frame**: SVG-generated tablet frame (wider bezels, no notch)
- **App capture**: Raw screenshot at 600×1024 CSS px

#### 3. Tablet Screenshot (10-inch)

| Property    | Value                                                     |
| ----------- | --------------------------------------------------------- |
| Format      | PNG                                                       |
| Dimensions  | 1600×2560 px (~9:16)                                      |
| Max size    | 8 MB                                                      |
| Quantity    | 2–4                                                       |
| Location    | `graphics/Google Play/tablet-10/`                         |
| Composition | Branded background + tablet mockup frame + app screenshot |

**Components**:

- **Background**: Blue gradient, 1600×2560 px
- **Device frame**: SVG-generated tablet frame
- **App capture**: Raw screenshot at 800×1280 CSS px

#### 4. Feature Graphic

| Property    | Value                                                 |
| ----------- | ----------------------------------------------------- |
| Format      | PNG or JPEG                                           |
| Dimensions  | 1024×500 px (exact)                                   |
| Max size    | 15 MB                                                 |
| Quantity    | 1                                                     |
| Location    | `graphics/Google Play/feature-graphic.png`            |
| Composition | Blue gradient background + app icon + title + tagline |

**Components**:

- **Background**: Blue gradient (`#1976D2` → `#0D47A1`)
- **App icon**: From `src/assets/app-icon.svg` (scaled ~280px)
- **Title**: "Kalkulator finansowy" (white, bold, ~56px)
- **Tagline**: "Twój darmowy kalkulator wynagrodzeń" (white, ~28px, 85% opacity)

#### 5. Facebook Cover Photo

| Property    | Value                                                           |
| ----------- | --------------------------------------------------------------- |
| Format      | PNG or JPEG                                                     |
| Dimensions  | 851×315 px                                                      |
| Max size    | N/A (Facebook handles compression)                              |
| Quantity    | 1                                                               |
| Location    | `graphics/Facebook/cover-photo.png`                             |
| Composition | Blue gradient background + app icon + title + value proposition |

#### 6. Promotional Video

| Property   | Value                                                 |
| ---------- | ----------------------------------------------------- |
| Format     | MP4 (uploaded to YouTube)                             |
| Resolution | 1080p (1920×1080) landscape                           |
| Duration   | 30–60 seconds                                         |
| Quantity   | 1                                                     |
| Location   | `graphics/video/promo-video.mp4`                      |
| Content    | Screen recording of app navigation with text overlays |

## Brand Assets (Shared)

| Asset                    | Source                         | Colors                              |
| ------------------------ | ------------------------------ | ----------------------------------- |
| App icon SVG             | `src/assets/app-icon.svg`      | Blue gradient `#1976D2` → `#1565C0` |
| Primary gradient         | Background for all graphics    | `#1976D2` → `#0D47A1`               |
| Text color               | White                          | `#FFFFFF`                           |
| Text opacity (secondary) | Taglines, URLs                 | 85% (`opacity: 0.85`)               |
| Font                     | Arial / Helvetica / sans-serif | —                                   |

## Screenshot Content Matrix

| #   | Module              | Route                  | Sample Data           | View               |
| --- | ------------------- | ---------------------- | --------------------- | ------------------ |
| 1   | Menu główne         | `/`                    | —                     | Full menu list     |
| 2   | Umowa o pracę       | `/umowa-o-prace`       | 7 000 zł brutto, 2026 | Results            |
| 3   | Porównywarka B2B    | `/porownywarka-b2b`    | 15 000 zł, 2026       | Results comparison |
| 4   | Samozatrudnienie    | `/samozatrudnienie`    | 12 000 zł, 2026       | Results            |
| 5   | Faktura VAT         | `/faktura-vat`         | 5 000 zł netto        | Results            |
| 6   | Ulga podatkowa IKZE | `/ulga-podatkowa-ikze` | 9 388,80 zł           | Results            |
| 7   | Kalkulator IKE      | `/kalkulator-ike`      | 23 472 zł             | Results            |
| 8   | Obligacje skarbowe  | `/obligacje-skarbowe`  | 10 000 zł             | Results            |

Tablet screenshots use the same modules (subset: #1, #2, #3, #4 minimum).
