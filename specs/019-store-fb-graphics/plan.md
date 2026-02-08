# Implementation Plan: Store & Social Media Graphics Update

**Branch**: `019-store-fb-graphics` | **Date**: 2026-02-08 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/019-store-fb-graphics/spec.md`

## Summary

Update all Google Play store graphics (phone screenshots, tablet screenshots, feature graphic), create a promotional video, and prepare Facebook cover photo. Screenshots are captured from the running app via MCP Chrome DevTools, then composited into device mockup frames with branded backgrounds. The feature graphic and Facebook cover are generated programmatically using SVG→PNG (sharp), following the existing `generate-og-image.mjs` pattern.

## Technical Context

**Task Type**: Design / Graphics generation (no calculator logic)  
**Capture Tool**: MCP Chrome DevTools (screenshot, viewport emulation)  
**Image Processing**: sharp (already a dev dependency, used in `scripts/generate-og-image.mjs`)  
**Graphics Format**: SVG → PNG pipeline  
**Platform**: Node.js scripts in `scripts/` directory  
**UI Language**: Polish  
**Key Dependencies**:

- sharp — SVG/PNG image processing (resize, composite, convert)
- MCP Chrome DevTools — viewport emulation, screenshot capture
- Existing brand assets — app icon SVG (`src/assets/app-icon.svg`), OG image script pattern

**App Modules Available for Screenshots** (from `src/router/routes.ts`):
| Route | Module | Priority |
|-------|--------|----------|
| `/` | Main menu (Index) | P1 — must include |
| `/umowa-o-prace` | Umowa o pracę | P1 |
| `/porownywarka-b2b` | Porównywarka B2B | P1 |
| `/samozatrudnienie` | Samozatrudnienie | P1 |
| `/faktura-vat` | Faktura VAT | P1 |
| `/ulga-podatkowa-ikze` | Ulga podatkowa IKZE | P1 (new module) |
| `/kalkulator-ike` | Kalkulator IKE | P1 (new module) |
| `/obligacje-skarbowe` | Obligacje skarbowe | P2 |
| `/odsetki` | Odsetki | P2 |
| `/rozliczenie-z-malzonkiem` | Rozliczenie z małżonkiem | P2 |
| `/umowa-zlecenie` | Umowa zlecenie | P2 |
| `/dzialalnosc-niezarejestrowana` | Działalność niezarejestrowana | P2 |
| `/zysk-z-najmu` | Zysk z najmu | P2 |
| `/kursy-walut` | Kursy walut | P2 |

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Constitution is not yet configured (template only). No specific gates to enforce.
This feature does not involve calculator logic, so standard calculator gates (BasicCalculator, validationRules, Vitest tests) do not apply.

**Applicable general principles**:

- ✅ UI text in Polish language — all screenshot data and graphics text will be in Polish
- ✅ No new source code modules — only scripts and graphic assets
- ✅ Follow existing patterns — use `scripts/generate-og-image.mjs` as reference for SVG→PNG generation

## Project Structure

### Documentation (this feature)

```text
specs/019-store-fb-graphics/
├── plan.md              # This file
├── research.md          # Research and analysis
├── data-model.md        # Data model (graphic assets inventory)
├── quickstart.md        # Quick start guide
└── tasks.md             # Task list
```

### Output Assets

```text
graphics/
├── Google Play/
│   ├── phone/                    # Phone screenshots (1080×1920)
│   │   ├── 01-main-menu.png
│   │   ├── 02-umowa-o-prace.png
│   │   ├── 03-porownywarka-b2b.png
│   │   ├── 04-samozatrudnienie.png
│   │   ├── 05-faktura-vat.png
│   │   ├── 06-ikze.png
│   │   ├── 07-ike.png
│   │   └── 08-obligacje.png
│   ├── tablet-7/                 # 7-inch tablet screenshots
│   │   ├── 01-main-menu.png
│   │   └── 02-umowa-o-prace.png  # (+ more)
│   ├── tablet-10/                # 10-inch tablet screenshots
│   │   ├── 01-main-menu.png
│   │   └── 02-umowa-o-prace.png  # (+ more)
│   └── feature-graphic.png       # 1024×500 feature graphic
├── Facebook/
│   └── cover-photo.png           # 851×315 cover photo
└── video/
    └── promo-video.mp4           # 30-120s promotional video
```

### Scripts

```text
scripts/
├── generate-og-image.mjs         # Existing — reference pattern
├── generate-store-screenshots.mjs # New — capture & composite phone/tablet screenshots
├── generate-feature-graphic.mjs   # New — generate 1024×500 feature graphic
└── generate-fb-cover.mjs          # New — generate 851×315 FB cover
```

## Pre-Implementation Checklist

- [ ] App running locally (`npx quasar dev`) before screenshot capture
- [ ] sharp installed as dev dependency
- [ ] All text in screenshots in Polish language
- [ ] Realistic sample data entered in forms before capture
- [ ] Phone screenshots: 1080×1920 px (9:16)
- [ ] Tablet 7" screenshots: 800×1280 px (or similar 16:9)
- [ ] Tablet 10" screenshots: 1200×1920 px (or similar 16:9)
- [ ] Feature graphic: exactly 1024×500 px
- [ ] Facebook cover: 851×315 px
- [ ] All files < 8 MB (screenshots) / < 15 MB (feature graphic)
