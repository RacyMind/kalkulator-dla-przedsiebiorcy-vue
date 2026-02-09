# Tasks: Google Play In-App Review

**Input**: Documents from `/specs/020-google-play-rating/`
**Required**: plan.md, spec.md

**Tests**: Tests are REQUIRED for store logic (shouldShowPrompt conditions).

**Organization**: Tasks grouped by user scenarios.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## Path Conventions

- **Store**: `src/stores/reviewPromptStore.ts`
- **Composable**: `src/composables/useReviewPrompt.ts`
- **Boot**: `src/boot/review-prompt.ts`
- **Menu**: `src/components/partials/menu/menuItems.ts`
- **Tests**: `test/vitest/__tests__/modules/reviewPrompt/`
- **Changelog**: `src/components/changeLogs/logs.ts`

---

## Phase 1: Setup

**Goal**: Install dependency and prepare project configuration

- [x] T001 Install `@capacitor-community/in-app-review` package and run `npx cap sync android`
- [x] T002 Register boot file `review-prompt` in `quasar.config.ts` (boot array)

---

## Phase 2: Foundational — Store & Composable

**Goal**: Create shared state management and composable used by all user stories

### Tests

- [x] T003 Create test file `test/vitest/__tests__/modules/reviewPrompt/reviewPromptStore.test.ts` with tests for:
  - `incrementCalculationCount()` increments counter from 0 to 1
  - `shouldShowPrompt()` returns `false` when `calculationCount < 5`
  - `shouldShowPrompt()` returns `true` when `calculationCount >= 5`, `promptCount < 3`, and no `lastPromptDate`
  - `shouldShowPrompt()` returns `false` when `promptCount >= 3`
  - `shouldShowPrompt()` returns `false` when `lastPromptDate` is less than 90 days ago (use static date 2026-01-01)
  - `shouldShowPrompt()` returns `true` when `lastPromptDate` is 90+ days ago (use static date 2026-01-01 vs 2025-10-01)
  - `recordPromptShown()` sets `lastPromptDate` to current date and increments `promptCount`

### Implementation

- [x] T004 Create Pinia store `src/stores/reviewPromptStore.ts` with:
  - State: `calculationCount`, `lastPromptDate`, `promptCount` (all via `useLocalStorage` with `reviewPrompt/` prefix)
  - Constants: `MIN_CALCULATIONS_FOR_PROMPT = 5`, `COOLDOWN_DAYS = 90`, `MAX_PROMPT_COUNT = 3`
  - Actions: `incrementCalculationCount()`, `shouldShowPrompt()`, `recordPromptShown()`
- [x] T005 [P] Create composable `src/composables/useReviewPrompt.ts` exposing `incrementCalculationCount()` — wraps store, no-op on non-native platforms (check `Capacitor.isNativePlatform()`)
- [x] T006 Run tests: `npx vitest run test/vitest/__tests__/modules/reviewPrompt/reviewPromptStore.test.ts`

**Checkpoint**: All store tests pass

---

## Phase 3: Automatyczny In-App Review (P1) 🎯 MVP

**Goal**: US1 — Dialog Google Play In-App Review wyświetla się automatycznie przy uruchomieniu aplikacji po spełnieniu warunków

**Independent Test**: Uruchomić aplikację na urządzeniu z Androidem, wykonać 5+ obliczeń, zrestartować aplikację — dialog powinien się pojawić

- [x] T007 [US1] Create boot file `src/boot/review-prompt.ts`:
  - Check `Capacitor.isNativePlatform()` — return if false
  - Get store via `useReviewPromptStore()`
  - Call `shouldShowPrompt()` — return if false
  - Call `InAppReview.requestReview()` wrapped in try/catch
  - Call `recordPromptShown()` after request (regardless of success/failure)
  - Catch all errors silently (console.error only)

**Checkpoint**: Boot file runs on app start, triggers In-App Review when conditions met

---

## Phase 4: Ręczne przejście do Google Play Store (P2)

**Goal**: US2 — Opcja „Podoba Ci się? Oceń!" w menu otwiera Google Play Store

**Independent Test**: Uruchomić natywną aplikację, otworzyć menu, kliknąć opcję — powinna otworzyć Google Play Store

- [x] T008 [US2] Update menu item in `src/components/partials/menu/menuItems.ts`:
  - Change `title` from `'Oceń w Google Play'` to `'Podoba Ci się? Oceń!'`
  - Change `caption` from `'Pomóż w rozwoju aplikacji i oceń aplikację w Google Play'` to `'Twoja opinia pomaga innym użytkownikom'`

**Checkpoint**: Menu shows updated text on native Android, link opens Google Play Store

---

## Phase 5: Zliczanie obliczeń — integracja z modułami (P2)

**Goal**: US3 — Każde kliknięcie „Oblicz" w dowolnym module zwiększa licznik obliczeń

**Independent Test**: Wykonać 5 obliczeń w różnych modułach, sprawdzić w localStorage że `reviewPrompt/calculationCount` = 5

### Moduły z `emit('submit')` (14 plików)

- [x] T009 [P] [US3] Add `incrementCalculationCount()` in `src/components/selfEmployment/components/Form.vue`
- [x] T010 [P] [US3] Add `incrementCalculationCount()` in `src/components/b2bComparator/components/Form.vue`
- [x] T011 [P] [US3] Add `incrementCalculationCount()` in `src/components/contractOfEmployment/components/Form.vue`
- [x] T012 [P] [US3] Add `incrementCalculationCount()` in `src/components/contractOfMandate/components/Form.vue`
- [x] T013 [P] [US3] Add `incrementCalculationCount()` in `src/components/contractWork/components/Form.vue`
- [x] T014 [P] [US3] Add `incrementCalculationCount()` in `src/components/ikzeTaxRelief/components/Form.vue`
- [x] T015 [P] [US3] Add `incrementCalculationCount()` in `src/components/partialZusContributions/components/Form.vue`
- [x] T016 [P] [US3] Add `incrementCalculationCount()` in `src/components/polishBonds/components/Form.vue`
- [x] T017 [P] [US3] Add `incrementCalculationCount()` in `src/components/realBoughtCosts/components/Form.vue`
- [x] T018 [P] [US3] Add `incrementCalculationCount()` in `src/components/rentalProfit/components/Form.vue`
- [x] T019 [P] [US3] Add `incrementCalculationCount()` in `src/components/salaryForUnusedHolidays/components/Form.vue`
- [x] T020 [P] [US3] Add `incrementCalculationCount()` in `src/components/sickPay/components/Form.vue`
- [x] T021 [P] [US3] Add `incrementCalculationCount()` in `src/components/unregisteredCompany/components/Form.vue`
- [x] T022 [P] [US3] Add `incrementCalculationCount()` in `src/components/accountingWithSpouse/components/Form.vue`

### Moduły z `emit('save')` lub innym wzorcem (5 plików)

- [x] T023 [P] [US3] Add `incrementCalculationCount()` in `save()` function in `src/components/invoice/Form.vue`
- [x] T024 [P] [US3] Add `incrementCalculationCount()` in `save()` function in `src/components/interest/Form.vue`
- [x] T025 [P] [US3] Add `incrementCalculationCount()` in `save()` function in `src/components/investment/Form.vue`
- [x] T026 [P] [US3] Add `incrementCalculationCount()` in `save()` function in `src/components/cashRegisterLimit/Form.vue`
- [x] T027 [P] [US3] Add `incrementCalculationCount()` in `save()` function in `src/components/vatLimit/Form.vue`

**Checkpoint**: All 19 calculator modules increment the counter on form submit

---

## Phase 6: Zachowanie na platformie PWA/Web (P3)

**Goal**: US4 — Mechanizm In-App Review i opcja menu NIE działają na platformie PWA/Web

**Independent Test**: Uruchomić aplikację w przeglądarce, sprawdzić że opcja „Podoba Ci się? Oceń!" nie jest widoczna w menu i dialog oceny się nie pojawia

- [x] T028 [US4] Verify boot file `src/boot/review-prompt.ts` returns early on non-native platform (already handled by `Capacitor.isNativePlatform()` check in T007)
- [x] T029 [US4] Verify composable `src/composables/useReviewPrompt.ts` is no-op on non-native platform (already handled in T005)
- [x] T030 [US4] Verify menu item visibility guard in `src/components/partials/menu/menuItems.ts` — existing `Platform.is.nativeMobile && Platform.is.android` condition already handles this

**Checkpoint**: No review-related UI or behavior on PWA/Web

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Final integration, changelog, verification

- [x] T031 Update changelog in `src/components/changeLogs/logs.ts` — add entry describing: automatyczna prośba o ocenę w Google Play, zaktualizowana opcja w menu
- [x] T032 Verify changelog renders correctly in `src/pages/ChangeLogs.vue`
- [x] T033 Run all review prompt tests: `npx vitest run test/vitest/__tests__/modules/reviewPrompt/`
- [x] T034 Manual test on Android device: verify full flow (5 calculations → restart → In-App Review dialog)
- [x] T035 Manual test on PWA: verify no review UI or behavior

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────► Phase 2 (Store & Composable)
                                                │
                                    ┌───────────┼───────────┐
                                    ▼           ▼           ▼
                              Phase 3       Phase 4     Phase 5
                              (US1:Boot)    (US2:Menu)  (US3:Forms)
                                    │           │           │
                                    └───────────┼───────────┘
                                                ▼
                                          Phase 6 (US4:PWA verify)
                                                │
                                                ▼
                                          Phase 7 (Polish)
```

- **Phase 1**: No dependencies — start immediately
- **Phase 2**: Requires Phase 1 — BLOCKS all user stories
- **Phase 3 (US1)**: Requires Phase 2 — boot file uses store
- **Phase 4 (US2)**: Requires Phase 1 only — independent of store (text change only)
- **Phase 5 (US3)**: Requires Phase 2 — Form.vue files use composable
- **Phase 6 (US4)**: Requires Phase 3, 4, 5 — verification phase
- **Phase 7**: Requires all previous

### Parallel Opportunities

- **Phase 3 + Phase 4 + Phase 5**: Can run in parallel after Phase 2
- **T009–T027**: All 19 Form.vue modifications are independent — fully parallelizable
- **T004 + T005**: Store and composable can be created in parallel (composable depends on store interface, not implementation)

---

## Implementation Strategy

### MVP (Phase 1–3)

1. Install plugin, register boot file
2. Create store with tests, create composable
3. Create boot file triggering In-App Review
4. **VALIDATE**: Store tests pass, boot file runs on Android

### Full Implementation

1. MVP → In-App Review works on app start
2. Menu update → UX-friendly text
3. Form integration → calculation counting across all 19 modules
4. PWA verification → no side effects on web
5. Polish → changelog, final testing

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- Tests REQUIRED for store logic (shouldShowPrompt conditions)
- Use static dates in tests (e.g., 2026-01-01) — avoid `new Date().getFullYear()`
- `contact/Form.vue` and `exchangeRates/Form.vue` are excluded (not calculators)
- `currencyConverter/Form.vue` is excluded (currency conversion, not a financial calculation)
- Test command: `npx vitest run test/vitest/__tests__/modules/reviewPrompt/reviewPromptStore.test.ts`
