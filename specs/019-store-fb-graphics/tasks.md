# Tasks: Store & Social Media Graphics Update

**Input**: Documents from `/specs/019-store-fb-graphics/`
**Required**: plan.md, spec.md

**Tests**: No calculator logic — no unit tests required. Verification is visual (dimension/format checks).

**Organization**: Tasks grouped by user scenarios from spec.md.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## User Story Mapping

| Story | Spec Scenario | Priority | Description                          |
| ----- | ------------- | -------- | ------------------------------------ |
| US1   | Scenario 1    | P1 MVP   | Update Google Play phone screenshots |
| US2   | Scenario 2    | P1 MVP   | Add tablet screenshots (7" + 10")    |
| US3   | Scenario 3    | P1 MVP   | Update feature graphic (1024×500)    |
| US4   | Scenario 4    | P2       | Create promotional video             |
| US5   | Scenario 5    | P2       | Create Facebook cover photo          |

Scenario 6 (Screenshot Capture Process) is a cross-cutting concern embedded in US1 and US2 tasks.

---

## Phase 1: Setup

**Goal**: Create directory structure and prepare tooling

- [x] T001 Create output directories: `graphics/Google Play/phone/`, `graphics/Google Play/tablet-7/`, `graphics/Google Play/tablet-10/`, `graphics/Facebook/`, `graphics/video/`
- [x] T002 Verify `sharp` is available by running `node -e "require('sharp')"`
- [x] T003 Start the app locally with `npx quasar dev` and confirm it is accessible at `http://localhost:9200`

---

## Phase 2: Foundational — Device Frame & Background Scripts

**Goal**: Create the compositing script that adds device mockup frames and branded backgrounds to raw screenshots. This blocks US1 and US2.

- [x] T004 Create `scripts/generate-store-screenshots.mjs` — SVG→PNG compositing script using sharp. Must:
  - Generate SVG phone frame (dark rounded rect, thin bezels, notch) with blue gradient background (`#1976D2` → `#0D47A1`)
  - Generate SVG tablet frame (wider bezels, no notch) with same background
  - Read raw screenshot PNGs from `graphics/Google Play/phone/raw/`, `tablet-7/raw/`, `tablet-10/raw/`
  - Composite each raw screenshot into the device frame on the branded background
  - Output final images to `graphics/Google Play/phone/`, `tablet-7/`, `tablet-10/`
  - Phone output: 1080×1920 px; Tablet 7": 1200×2048 px; Tablet 10": 1600×2560 px
  - Reference pattern: `scripts/generate-og-image.mjs`

---

## Phase 3: Phone Screenshots (US1 — P1 MVP) 🎯

**Goal**: Capture 8 phone screenshots from the running app via MCP Chrome and composite them into final store-ready images.

**Independent Test**: Each screenshot file exists at correct dimensions (1080×1920), is valid PNG, and < 8 MB.

### Capture (sequential — same browser session)

- [x] T005 [US1] Set phone viewport via MCP Chrome: `mcp0_emulate` → `{ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true }`
- [x] T006 [US1] Capture screenshot #1 — Main menu: navigate to `http://localhost:9200/#/`, take screenshot to `graphics/Google Play/phone/raw/01-main-menu.png`
- [x] T007 [US1] Capture screenshot #2 — Umowa o pracę: navigate to `/umowa-o-prace`, fill 7000 zł brutto + 2026, click Oblicz, scroll to results, take screenshot to `graphics/Google Play/phone/raw/02-umowa-o-prace.png`
- [x] T008 [US1] Capture screenshot #3 — Porównywarka B2B: navigate to `/porownywarka-b2b`, fill 15000 zł + 2026, click Oblicz, scroll to results, take screenshot to `graphics/Google Play/phone/raw/03-porownywarka-b2b.png`
- [x] T009 [US1] Capture screenshot #4 — Samozatrudnienie: navigate to `/samozatrudnienie`, fill 12000 zł + 2026, click Oblicz, scroll to results, take screenshot to `graphics/Google Play/phone/raw/04-samozatrudnienie.png`
- [x] T010 [US1] Capture screenshot #5 — Faktura VAT: navigate to `/faktura-vat`, fill 5000 zł netto, click Oblicz, take screenshot to `graphics/Google Play/phone/raw/05-faktura-vat.png`
- [x] T011 [US1] Capture screenshot #6 — Ulga podatkowa IKZE: navigate to `/ulga-podatkowa-ikze`, fill 9388.80 zł, click Oblicz, take screenshot to `graphics/Google Play/phone/raw/06-ikze.png`
- [x] T012 [US1] Capture screenshot #7 — Kalkulator IKE: navigate to `/kalkulator-ike`, fill 23472 zł, click Oblicz, take screenshot to `graphics/Google Play/phone/raw/07-ike.png`
- [x] T013 [US1] Capture screenshot #8 — Obligacje skarbowe: navigate to `/obligacje-skarbowe`, fill 10000 zł, click Oblicz, take screenshot to `graphics/Google Play/phone/raw/08-obligacje.png`

### Post-Processing

- [x] T014 [US1] Run `node scripts/generate-store-screenshots.mjs --type phone` to composite all 8 phone screenshots with device frames and branded backgrounds. Output to `graphics/Google Play/phone/`
- [x] T015 [US1] Verify all 8 phone screenshots: dimensions 1080×1920, PNG format, < 8 MB each

**Checkpoint**: 8 phone screenshots ready for Google Play upload

---

## Phase 4: Tablet Screenshots (US2 — P1 MVP) 🎯

**Goal**: Capture tablet screenshots for 7-inch and 10-inch tablets (at least 4 each) and composite them.

**Independent Test**: Each tablet screenshot exists at correct dimensions, is valid PNG, and < 8 MB.

### 7-inch Tablet Capture

- [x] T016 [US2] Set 7-inch tablet viewport via MCP Chrome: `mcp0_emulate` → `{ width: 600, height: 1024, deviceScaleFactor: 2 }`
- [x] T017 [US2] Capture tablet-7 screenshot #1 — Main menu: navigate to `/`, take screenshot to `graphics/Google Play/tablet-7/raw/01-main-menu.png`
- [x] T018 [US2] Capture tablet-7 screenshot #2 — Umowa o pracę: navigate to `/umowa-o-prace`, fill 7000 zł brutto + 2026, click Oblicz, take screenshot to `graphics/Google Play/tablet-7/raw/02-umowa-o-prace.png`
- [x] T019 [US2] Capture tablet-7 screenshot #3 — Porównywarka B2B: navigate to `/porownywarka-b2b`, fill 15000 zł + 2026, click Oblicz, take screenshot to `graphics/Google Play/tablet-7/raw/03-porownywarka-b2b.png`
- [x] T020 [US2] Capture tablet-7 screenshot #4 — Samozatrudnienie: navigate to `/samozatrudnienie`, fill 12000 zł + 2026, click Oblicz, take screenshot to `graphics/Google Play/tablet-7/raw/04-samozatrudnienie.png`

### 10-inch Tablet Capture

- [x] T021 [US2] Set 10-inch tablet viewport via MCP Chrome: `mcp0_emulate` → `{ width: 800, height: 1280, deviceScaleFactor: 2 }`
- [x] T022 [US2] Capture tablet-10 screenshot #1 — Main menu: navigate to `/`, take screenshot to `graphics/Google Play/tablet-10/raw/01-main-menu.png`
- [x] T023 [US2] Capture tablet-10 screenshot #2 — Umowa o pracę: navigate to `/umowa-o-prace`, fill 7000 zł brutto + 2026, click Oblicz, take screenshot to `graphics/Google Play/tablet-10/raw/02-umowa-o-prace.png`
- [x] T024 [US2] Capture tablet-10 screenshot #3 — Porównywarka B2B: navigate to `/porownywarka-b2b`, fill 15000 zł + 2026, click Oblicz, take screenshot to `graphics/Google Play/tablet-10/raw/03-porownywarka-b2b.png`
- [x] T025 [US2] Capture tablet-10 screenshot #4 — Samozatrudnienie: navigate to `/samozatrudnienie`, fill 12000 zł + 2026, click Oblicz, take screenshot to `graphics/Google Play/tablet-10/raw/04-samozatrudnienie.png`

### Post-Processing

- [x] T026 [US2] Run `node scripts/generate-store-screenshots.mjs --type tablet-7` to composite tablet-7 screenshots. Output to `graphics/Google Play/tablet-7/`
- [x] T027 [US2] Run `node scripts/generate-store-screenshots.mjs --type tablet-10` to composite tablet-10 screenshots. Output to `graphics/Google Play/tablet-10/`
- [x] T028 [US2] Verify all tablet screenshots: tablet-7 at 1200×2048, tablet-10 at 1600×2560, PNG format, < 8 MB each

**Checkpoint**: 4+ tablet-7 and 4+ tablet-10 screenshots ready for Google Play upload

---

## Phase 5: Feature Graphic (US3 — P1 MVP) 🎯

**Goal**: Generate a modern 1024×500 px feature graphic replacing the old cartoon-style illustration.

**Independent Test**: `graphics/Google Play/feature-graphic.png` exists, is exactly 1024×500 px, < 15 MB.

- [x] T029 [P] [US3] Create `scripts/generate-feature-graphic.mjs` — SVG→PNG script using sharp. Must:
  - Blue gradient background (`#1976D2` → `#0D47A1`), 1024×500 px
  - App icon from `src/assets/app-icon.svg` on the left (~280px, with shadow)
  - Title "Kalkulator finansowy" (white, bold, ~56px)
  - Tagline "Twój darmowy kalkulator wynagrodzeń" (white, ~28px, 85% opacity)
  - Optional: URL "kalkulatorfinansowy.app" (white, ~22px, 50% opacity)
  - Follow `scripts/generate-og-image.mjs` pattern
- [x] T030 [US3] Run `node scripts/generate-feature-graphic.mjs` and verify output at `graphics/Google Play/feature-graphic.png` (1024×500 px)

**Checkpoint**: Feature graphic ready for Google Play upload

---

## Phase 6: Promotional Video (US4 — P2)

**Goal**: Create a 30-60 second promotional video showcasing the app.

**Independent Test**: Video file exists, is 1080p, 30-60 seconds, uploaded to YouTube.

- [x] T031 [US4] Set viewport to landscape 1920×1080 via MCP Chrome for video recording
- [x] T032 [US4] Screen-record app navigation: main menu → UoP (fill data, show results) → B2B comparator (fill data, show results) → samozatrudnienie (fill data, show results). Save raw recording to `graphics/video/`
- [x] T033 [US4] Edit video: add text overlays in Polish describing each module, add royalty-free background music, trim to 30-60 seconds, export as MP4 1080p to `graphics/video/promo-video.mp4`
- [ ] T034 [US4] Upload video to YouTube (public or unlisted, no ads, no age restrictions). Save YouTube URL for Google Play Console

**Checkpoint**: Video uploaded to YouTube, URL ready

---

## Phase 7: Facebook Cover Photo (US5 — P2)

**Goal**: Create an 851×315 px Facebook cover photo with app branding.

**Independent Test**: `graphics/Facebook/cover-photo.png` exists, is 851×315 px.

- [x] T035 [P] [US5] Create `scripts/generate-fb-cover.mjs` — SVG→PNG script using sharp. Must:
  - Blue gradient background (`#1976D2` → `#0D47A1`), 851×315 px
  - App icon from `src/assets/app-icon.svg` on the left (~200px)
  - Title "Kalkulator finansowy" (white, bold, ~44px)
  - Tagline "Twój darmowy kalkulator wynagrodzeń" (white, ~22px, 85% opacity)
  - Keep important content in center safe zone (~640×315 area) for mobile cropping
  - Follow `scripts/generate-og-image.mjs` pattern
- [x] T036 [US5] Run `node scripts/generate-fb-cover.mjs` and verify output at `graphics/Facebook/cover-photo.png` (851×315 px)

**Checkpoint**: Facebook cover photo ready for upload

---

## Phase 8: Upload & Verification (Polish)

**Goal**: Upload all assets to Google Play Console and Facebook, verify everything displays correctly.

- [ ] T037 Upload 8 phone screenshots to Google Play Console → Store listing → Phone screenshots
- [ ] T038 Upload 4+ tablet-7 screenshots to Google Play Console → Store listing → 7-inch tablet screenshots
- [ ] T039 Upload 4+ tablet-10 screenshots to Google Play Console → Store listing → 10-inch tablet screenshots
- [ ] T040 Replace feature graphic in Google Play Console with `graphics/Google Play/feature-graphic.png`
- [ ] T041 Paste YouTube video URL in Google Play Console → Video field
- [ ] T042 Upload `graphics/Facebook/cover-photo.png` as Facebook profile cover photo
- [ ] T043 Verify all assets display correctly: phone screenshots, tablet screenshots, feature graphic, video, FB cover
- [x] T044 Archive old screenshots from `graphics/Google Play/` root (move to `graphics/Google Play/_archive/`)

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────────────┐
                                                              │
Phase 2 (Device Frames Script) ──────────────────────────┐    │
                                                          │    │
Phase 3 (US1: Phone Screenshots) ◄── Phase 1 + Phase 2   │    │
                                                          │    │
Phase 4 (US2: Tablet Screenshots) ◄── Phase 1 + Phase 2  │    │
                                                          │    │
Phase 5 (US3: Feature Graphic) ◄── Phase 1 only          │    │
                                                          │    │
Phase 6 (US4: Promo Video) ◄── Phase 1 only (P2)         │    │
                                                          │    │
Phase 7 (US5: FB Cover) ◄── Phase 1 only (P2)            │    │
                                                          │    │
Phase 8 (Upload) ◄── All previous phases                  │    │
```

### Parallel Opportunities

- **T029 (feature graphic script)** and **T035 (FB cover script)** can run in parallel with Phase 2 (device frames script) — different files, no dependencies
- **Phase 3 (phone)** and **Phase 4 (tablet)** can run in parallel after Phase 2 — but share the same browser session, so sequential capture is more practical
- **Phase 5, 6, 7** can all run in parallel with each other and with Phase 3/4

---

## Implementation Strategy

### MVP (Phase 1–5)

1. Setup directories and tooling
2. Create device frame compositing script
3. Capture and composite 8 phone screenshots
4. Capture and composite 4+ tablet screenshots (7" and 10")
5. Generate feature graphic
6. **VALIDATE**: All P1 assets meet Google Play requirements

### Full Implementation

1. MVP → all P1 assets ready
2. Promotional video → YouTube upload (P2)
3. Facebook cover photo → FB upload (P2)
4. Upload all assets to Google Play Console and Facebook
5. Archive old graphics

---

## Notes

- No unit tests — this is a graphics/design task, not calculator logic
- All text in Polish language
- All sample data uses 2026 values
- Brand colors: blue gradient `#1976D2` → `#0D47A1` (matching new app icon)
- Reference script: `scripts/generate-og-image.mjs` for SVG→PNG pattern
- MCP Chrome DevTools used for screenshot capture (emulate, navigate, fill, screenshot)
- Video editing (T033) may require manual effort or external tools (ffmpeg)
