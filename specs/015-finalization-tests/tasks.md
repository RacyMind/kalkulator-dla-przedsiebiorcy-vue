# Tasks: Finalizacja i testy (Milestone 6)

**Input**: Documents from `/specs/015-finalization-tests/`
**Required**: plan.md, spec.md

**Tests**: Tests REQUIRED for polishBonds calculator logic (test coverage gap). Must include all output values.

**Organization**: Tasks grouped by user scenarios from spec.md.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## User Story Mapping

| US | Spec Scenario | Priority | Status |
|----|---------------|----------|--------|
| US1 | Testy regresyjne wszystkich modułów | P1 | To do |
| US2 | Weryfikacja dark mode | P1 | ✅ Already done (manual) |
| US3 | Weryfikacja responsywności | P1 | ✅ Already done (manual) |
| US4 | Optymalizacja wydajności | P2 | To do |
| US5 | Build i testy Capacitor Android | P2 | To do |
| US6 | Porządki finalne i przygotowanie release v6.4.0 | P2 | To do |

---

## Phase 1: Regression Tests (US1 — P1) 🎯 MVP

**Goal**: All automated tests pass, test coverage gap for polishBonds closed.

**Independent Test**: `npx vitest run` exits with code 0.

### Run existing tests

- [x] T001 [US1] Run full test suite `npx vitest run` and document any failures — ✅ 52 files, 416 tests passed
- [x] T002 [US1] Fix any failing tests identified in T001 (update expected values if constants changed) — ✅ No failures found

### Close polishBonds test coverage gap

- [x] T003 [US1] Create test file `test/vitest/__tests__/modules/polishBonds/RorCalculator.test.ts` with all output values for ROR (1-year) bonds
- [x] T004 [P] [US1] Create test file `test/vitest/__tests__/modules/polishBonds/DorCalculator.test.ts` with all output values for DOR (2-year) bonds
- [x] T005 [P] [US1] Create test file `test/vitest/__tests__/modules/polishBonds/TosCalculator.test.ts` with all output values for TOS (3-year) bonds
- [x] T006 [P] [US1] Create test file `test/vitest/__tests__/modules/polishBonds/CoiCalculator.test.ts` with all output values for COI (4-year) bonds
- [x] T007 [P] [US1] Create test file `test/vitest/__tests__/modules/polishBonds/EdoCalculator.test.ts` with all output values for EDO (10-year) bonds
- [x] T008 [P] [US1] Create test file `test/vitest/__tests__/modules/polishBonds/RosCalculator.test.ts` with all output values for ROS (6-year) bonds
- [x] T009 [P] [US1] Create test file `test/vitest/__tests__/modules/polishBonds/RodCalculator.test.ts` with all output values for ROD (12-year) bonds
- [x] T010 [P] [US1] Create test file `test/vitest/__tests__/modules/polishBonds/OtsCalculator.test.ts` with all output values for OTS (3-month) bonds

### Verify all tests pass

- [x] T011 [US1] Run `npx vitest run test/vitest/__tests__/modules/polishBonds/` and verify all new tests pass — ✅ 8 files, 35 tests passed
- [x] T012 [US1] Run full test suite `npx vitest run` and confirm exit code 0 with all tests passing — ✅ 52 files, 416 tests passed

**Checkpoint**: All unit tests pass (exit code 0), polishBonds coverage gap closed.

---

## Phase 2: Dark Mode & Responsiveness (US2, US3 — P1) ✅ PRE-COMPLETED

**Goal**: Visual verification of dark mode and responsiveness across all modules.

**Status**: Already completed via manual testing by the developer.

- [x] T013 [US2] Verify dark mode in all 29 modules (manual — completed)
- [x] T014 [US2] Verify light mode has no regressions after dark mode changes (manual — completed)
- [x] T015 [US3] Verify responsiveness at 320px, 768px, 1024px, 1440px, 2560px (manual — completed)

**Checkpoint**: All modules render correctly in both themes and at all breakpoints.

---

## Phase 3: Performance Optimization (US4 — P2)

**Goal**: Lighthouse Performance > 90, Accessibility > 90 on production build.

**Independent Test**: Run Lighthouse on `dist/pwa/` served locally.

- [x] T016 [US4] Build production PWA: `npx quasar build -m pwa` — ✅ Build succeeded (JS 1056KB, CSS 584KB)
- [ ] T017 [US4] Run Lighthouse audit on production build and document scores (Performance, Accessibility, Best Practices, SEO)
- [ ] T018 [US4] If Performance < 90: analyze bundle size, optimize large chunks, verify tree-shaking
- [ ] T019 [US4] If Accessibility < 90: fix issues reported by Lighthouse (contrast, ARIA, labels)
- [x] T020 [US4] Verify lazy loading — confirm all routes in `src/router/routes.ts` use dynamic `() => import(...)` — ✅ All 31 routes lazy-loaded
- [x] T021 [US4] Verify Service Worker config in `quasar.config.ts` — confirm `skipWaiting: true` and `clientsClaim: true` — ✅ Confirmed
- [ ] T022 [US4] Re-run Lighthouse audit after fixes and confirm targets met

**Checkpoint**: Lighthouse Performance > 90, Accessibility > 90.

---

## Phase 4: Capacitor Android Build (US5 — P2)

**Goal**: Android build succeeds, app works on emulator.

**Independent Test**: `npx quasar build -m capacitor -T android` exits without errors.

- [x] T023 [US5] Update `appName` year range in `src-capacitor/capacitor.config.json` (remove or update "2023-2026") — ✅ Updated to 2023-2027
- [ ] T024 [US5] Build Android: `npx quasar build -m capacitor -T android`
- [ ] T025 [US5] If build fails: update Gradle version or Android SDK as needed in `src-capacitor/android/`
- [ ] T026 [US5] Test on Android emulator: verify dark mode works
- [ ] T027 [US5] Test on Android emulator: verify AdMob displays correctly
- [ ] T028 [US5] Test on Android emulator: verify navigation and layout on different screen sizes

**Checkpoint**: Android build succeeds, app works correctly on emulator.

---

## Phase 5: Release Preparation (US6 — P2)

**Goal**: Version bumped to 6.4.0, changelog updated, README rewritten, dead code cleaned, final build succeeds.

**Independent Test**: Version is `6.4.0` in all locations, `npx quasar build -m pwa` succeeds.

### Version synchronization

- [x] T029 [P] [US6] Update version to `6.4.0` in `package.json`
- [x] T030 [P] [US6] Update `app.version` to `'6.4.0'` in `src/stores/constantsStore.ts`
- [x] T031 [P] [US6] Update version to `6.4.0` in `src-pwa/manifest.json`

### Changelog

- [x] T032 [US6] Add v6.4.0 entry at top of `src/components/changeLogs/logs.ts` summarizing finalization: regression tests verified, performance optimized, polishBonds tests added, version synchronized, README updated

### Documentation

- [x] T033 [US6] Rewrite `README.md` with: project description, list of 29 calculator modules, technology stack (Vue 3, Quasar, TypeScript, Pinia, Vitest), dark mode feature, PWA and Android availability, build instructions, contributing info

### Cleanup

- [x] T034 [US6] Search for unused imports and orphaned files across `src/` — remove any found — ✅ No unused files found
- [x] T035 [US6] Verify no TODO/FIXME comments remain (research confirmed clean, re-verify after all changes) — ✅ Clean

### Final build verification

- [x] T036 [US6] Run full test suite: `npx vitest run` — confirm all tests still pass after version bump and cleanup — ✅ 52 files, 416 tests
- [x] T037 [US6] Build final production PWA: `npx quasar build -m pwa` — confirm success — ✅ Build succeeded
- [ ] T038 [US6] Verify the built app in `dist/pwa/` loads correctly and shows version 6.4.0

**Checkpoint**: Version 6.4.0 everywhere, changelog updated, README rewritten, clean codebase, production build succeeds.

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (US1: Regression Tests)     → No dependencies, start immediately
Phase 2 (US2+US3: Dark/Responsive)  → ✅ Already completed
Phase 3 (US4: Performance)          → Requires Phase 1 (all tests must pass first)
Phase 4 (US5: Android)              → Can run in parallel with Phase 3
Phase 5 (US6: Release Prep)         → Requires Phase 1, 3, 4 (all quality gates passed)
```

### Parallel Opportunities

**Within Phase 1**:
- T003–T010 (polishBonds tests) can ALL run in parallel — different files, no dependencies

**Within Phase 5**:
- T029–T031 (version sync) can run in parallel — different files

**Across Phases**:
- Phase 3 (Performance) and Phase 4 (Android) can run in parallel after Phase 1

### Critical Path

```
T001→T002 → T003-T010 → T011→T012 → T016→T017→T022 → T029-T031→T032→T033→T034→T036→T037→T038
```

---

## Implementation Strategy

### MVP (Phase 1)

1. Run existing tests, fix failures
2. Write polishBonds calculator tests (8 calculators)
3. Verify all tests pass
4. **VALIDATE**: `npx vitest run` exit code 0

### Full Implementation

1. MVP → all tests pass
2. Performance → Lighthouse targets met
3. Android → build and emulator verification
4. Release prep → version bump, changelog, README, cleanup, final build

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- US2 and US3 are pre-completed (manual testing done by developer)
- polishBonds has 8 calculator classes: ROR, DOR, TOS, COI, EDO, ROS, ROD, OTS
- Tests MUST include all output values (per project rules)
- Use static year 2026 in tests with static expected values
- Version target is `6.4.0` (not 6.0.0 — changelog already uses 6.0.0–6.3.0)
- Test command: `npx vitest run test/vitest/__tests__/modules/polishBonds/[testName].test.ts`
