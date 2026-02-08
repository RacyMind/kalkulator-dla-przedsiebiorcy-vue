# Tasks: AdMob Singleton — jednokrotne ładowanie reklamy

**Input**: Documents from `/specs/008-admob-singleton/`
**Required**: plan.md, spec.md

**Tests**: Tests are REQUIRED for AdMobService singleton logic.

**Organization**: Tasks grouped by user scenarios.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## Path Conventions

- **Service**: `src/services/admob/`
- **Boot**: `src/boot/`
- **Tests**: `test/vitest/__tests__/services/admob/`
- **Android config**: `src-capacitor/android/app/src/main/`
- **Changelog**: `src/components/changeLogs/logs.ts`

---

## Phase 1: Setup & Android Configuration

**Goal**: Install plugin, configure Android project, create service directory structure

- [x] T001 Install `@capacitor-community/admob@6` in `src-capacitor/package.json`
- [x] T002 Add AdMob APPLICATION_ID meta-data to `src-capacitor/android/app/src/main/AndroidManifest.xml`
- [x] T003 Add `admob_app_id` string to `src-capacitor/android/app/src/main/res/values/strings.xml`
- [x] T004 Create service directory structure `src/services/admob/`

**Checkpoint**: Plugin installed, Android config ready

---

## Phase 2: Foundational — Types & Config

**Goal**: Define TypeScript types and ad configuration (blocking for all user stories)

- [x] T005 [P] Create TypeScript types in `src/services/admob/types.ts`
- [x] T006 [P] Create ad configuration (Ad Unit IDs, noAdPages list, banner options) in `src/services/admob/adConfig.ts`

**Checkpoint**: Types and config exported, no runtime errors

---

## Phase 3: US1 — Inicjalizacja reklamy przy starcie (P1) 🎯 MVP

**Goal**: AdMob SDK initialized once at app startup, single banner object created

**Independent Test**: Run app on Android emulator, verify in logs that `AdMob.initialize()` and `AdMob.showBanner()` called exactly once.

### Tests

- [x] T007 [US1] Create test file `test/vitest/__tests__/services/admob/AdMobService.test.ts`
- [x] T008 [US1] Add test: initialize() calls AdMob.initialize() exactly once
- [x] T009 [US1] Add test: initialize() calls AdMob.showBanner() with correct options
- [x] T010 [US1] Add test: calling initialize() twice does not create duplicate (idempotent guard)
- [x] T011 [US1] Add test: isNative() returns false on web — initialize() is no-op

### Implementation

- [x] T012 [US1] Implement AdMobService singleton class in `src/services/admob/AdMobService.ts`
- [x] T013 [US1] Implement `initialize()` — AdMob.initialize() + showBanner() with idempotent guard
- [x] T014 [US1] Implement `isNative()` using Capacitor.isNativePlatform()
- [x] T015 [US1] Register BannerAdPluginEvents listeners (Loaded, FailedToLoad, SizeChanged)
- [x] T016 [US1] Create boot file `src/boot/admob.ts` — platform check + singleton init
- [x] T017 [US1] Register boot file in `quasar.config.js` boot array

**Checkpoint**: Tests pass, singleton initializes once on native, no-op on web

---

## Phase 4: US2 — Wyświetlanie bannera na stronach modułów (P1) 🎯 MVP

**Goal**: Banner visible on all module pages, same object reused across navigation (no new requests)

**Independent Test**: Navigate between 3+ modules, verify banner visible on each and NO additional `showBanner()` calls in logs.

### Tests

- [x] T018 [US2] Add test: showAd() calls AdMob.resumeBanner() when banner is loaded and hidden
- [x] T019 [US2] Add test: showAd() is no-op when banner already visible
- [x] T020 [US2] Add test: showAd() is no-op when banner not loaded

### Implementation

- [x] T021 [US2] Implement `showAd()` in `src/services/admob/AdMobService.ts` — resumeBanner() with guards
- [x] T022 [US2] Implement `getBannerHeight()` in `src/services/admob/AdMobService.ts`
- [x] T023 [US2] Add router `afterEach` guard in `src/boot/admob.ts` — call showAd() for module pages
- [x] T024 [US2] Modify `src/components/partials/Advert.vue` — render nothing on native platform (banner is overlay), keep Donate/TaxDonation on web

**Checkpoint**: Tests pass, banner visible on module pages, reused across navigation

---

## Phase 5: US3 — Brak reklamy na stronach informacyjnych (P2)

**Goal**: Banner hidden on informational pages (home, privacy policy, contact, changelog)

**Independent Test**: Navigate to privacy policy page — banner disappears. Return to module — banner reappears.

### Tests

- [x] T025 [US3] Add test: hideAd() calls AdMob.hideBanner() when banner is visible
- [x] T026 [US3] Add test: hideAd() is no-op when banner already hidden
- [x] T027 [US3] Add test: router guard calls hideAd() for paths in noAdPages list

### Implementation

- [x] T028 [US3] Implement `hideAd()` in `src/services/admob/AdMobService.ts` — hideBanner() with guards
- [x] T029 [US3] Update router `afterEach` guard in `src/boot/admob.ts` — call hideAd() for noAdPages paths

**Checkpoint**: Tests pass, banner hidden on informational pages, shown on module pages

---

## Phase 6: US4 — Obsługa błędów ładowania reklamy (P2)

**Goal**: App works normally when ad fails to load, no error messages shown to user

**Independent Test**: Disable network on emulator, launch app — no crash, no error UI, calculators work.

### Tests

- [x] T030 [US4] Add test: FailedToLoad listener sets lastError and logs error
- [x] T031 [US4] Add test: showAd() does not throw when banner not loaded (graceful degradation)
- [x] T032 [US4] Add test: Advert.vue shows Donate/TaxDonation fallback on web regardless of ad state

### Implementation

- [x] T033 [US4] Implement error handling in FailedToLoad listener in `src/services/admob/AdMobService.ts`
- [x] T034 [US4] Ensure all public methods have try-catch — never throw to caller

**Checkpoint**: Tests pass, app resilient to ad load failures

---

## Phase 7: Polish & Integration

**Goal**: Final integration, changelog, verification

- [x] T035 Add margin-bottom to app content when banner is visible (handle SizeChanged event) in `src/boot/admob.ts` or global CSS
- [x] T036 Run all AdMob tests: `npx vitest run test/vitest/__tests__/services/admob/AdMobService.test.ts`
- [x] T037 Update changelog in `src/components/changeLogs/logs.ts` — add entry for AdMob integration
- [x] T038 Manual test on Android emulator: verify 1 request, banner visible, hide/show on navigation

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies — start immediately
- **Phase 2 (Types & Config)**: Requires Phase 1
- **Phase 3 (US1 — Init)**: Requires Phase 2 — BLOCKS US2, US3, US4
- **Phase 4 (US2 — Show on modules)**: Requires Phase 3
- **Phase 5 (US3 — Hide on info pages)**: Requires Phase 4
- **Phase 6 (US4 — Error handling)**: Can run in parallel with Phase 5
- **Phase 7 (Polish)**: Requires all previous

### Within Each Phase

- Tests MUST be written BEFORE implementation
- Types and config before service logic
- Service logic before boot file
- Boot file before UI changes

### Parallel Opportunities

- T005 + T006: Types and config in parallel
- Phase 5 (US3) + Phase 6 (US4): Independent — can run in parallel after Phase 4
- T025-T027 + T030-T032: Test tasks in parallel phases

---

## Implementation Strategy

### MVP (Phase 1-4)

1. Install plugin, configure Android
2. Create types and config
3. Implement singleton with initialize()
4. Add show/hide + router guard + Advert.vue modification
5. **VALIDATE**: Banner shows on modules, 1 request only

### Full Implementation

1. MVP → banner works on module pages
2. US3 → hide on informational pages
3. US4 → error handling and resilience
4. Polish → margin, changelog, manual verification

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- Tests ALWAYS before implementation
- Banner is **native overlay** (BOTTOM_CENTER) — not inline in WebView
- `showBanner()` called once, `hideBanner()`/`resumeBanner()` for visibility control
- `removeBanner()` is NEVER called in normal flow
- On web/PWA: entire AdMob flow is skipped, Advert.vue unchanged
- Test command: `npx vitest run test/vitest/__tests__/services/admob/AdMobService.test.ts`
