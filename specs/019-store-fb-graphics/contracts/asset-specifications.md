# Asset Specifications Contract

**Feature**: 019-store-fb-graphics  
**Date**: 2026-02-08

This feature produces static graphic files, not APIs. This contract defines the exact specifications each asset must meet for acceptance by Google Play Console and Facebook.

## Google Play Console Requirements

### Phone Screenshots

- **Format**: PNG or JPEG
- **Aspect ratio**: 16:9 or 9:16
- **Min dimension**: 320 px (any side)
- **Max dimension**: 3840 px (any side)
- **Max file size**: 8 MB each
- **Quantity**: 2–8 per listing
- **Target**: 1080×1920 px (9:16 portrait)

### Tablet Screenshots (7-inch)

- **Format**: PNG or JPEG
- **Aspect ratio**: 16:9 or 9:16
- **Min dimension**: 320 px
- **Max dimension**: 3840 px
- **Max file size**: 8 MB each
- **Quantity**: 2–8
- **Target**: 1200×2048 px (portrait)

### Tablet Screenshots (10-inch)

- **Format**: PNG or JPEG
- **Aspect ratio**: 16:9 or 9:16
- **Min dimension**: 320 px
- **Max dimension**: 3840 px
- **Max file size**: 8 MB each
- **Quantity**: 2–8
- **Target**: 1600×2560 px (portrait)

### Feature Graphic ("Grafika")

- **Format**: PNG or JPEG
- **Dimensions**: exactly 1024×500 px
- **Max file size**: 15 MB
- **Quantity**: 1
- **Content**: No text required but recommended for clarity

### Promotional Video

- **Format**: YouTube URL (public or unlisted)
- **Duration**: 30–120 seconds recommended
- **Requirements**: No age restrictions, ads disabled
- **Resolution**: 1080p or higher recommended

### App Icon

- **Format**: PNG or JPEG
- **Dimensions**: 512×512 px
- **Max file size**: 1 MB
- **Status**: Already uploaded, no change needed

## Facebook Requirements

### Cover Photo

- **Recommended dimensions**: 851×315 px
- **Minimum dimensions**: 820×312 px
- **Display**: Crops differently on mobile (centered, narrower)
- **Safe zone**: Keep important content in center ~640×315 area
- **Format**: PNG or JPEG (Facebook will compress to JPEG)

## Script Interface Contracts

### generate-feature-graphic.mjs

```
Input:  src/assets/app-icon.svg
Output: graphics/Google Play/feature-graphic.png (1024×500)
Deps:   sharp
Run:    node scripts/generate-feature-graphic.mjs
```

### generate-fb-cover.mjs

```
Input:  src/assets/app-icon.svg
Output: graphics/Facebook/cover-photo.png (851×315)
Deps:   sharp
Run:    node scripts/generate-fb-cover.mjs
```

### Screenshot Capture (manual via MCP Chrome)

```
Input:  Running app at localhost:9200 (or configured port)
Output: graphics/Google Play/phone/*.png
        graphics/Google Play/tablet-7/*.png
        graphics/Google Play/tablet-10/*.png
Tool:   MCP Chrome DevTools (emulate, navigate, screenshot)
Post:   sharp (composite with device frame + background)
```
