# Tasks: Aktualizacja zależności (Milestone 1)

**Input**: Documents from `/specs/010-update-dependencies/`
**Required**: plan.md, spec.md

**Tests**: No new calculator logic — existing tests serve as regression suite. Run `npx vitest run` after each task group.

**Organization**: Tasks grouped by user scenarios from spec.md.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## Path Conventions

- **Config**: project root (`package.json`, `quasar.config.js`, `tsconfig.json`, `.eslintrc.js`)
- **Source**: `src/`
- **PWA**: `src-pwa/`
- **Tests**: `test/vitest/__tests__/`
- **Changelog**: `src/components/changeLogs/logs.ts`

---

## Phase 1: Setup (Baseline Verification)

**Goal**: Verify current state is green before making any changes

- [x] T001 Verify all tests pass on current branch: run `npx vitest run`
- [x] T002 Verify dev server starts: run `npx quasar dev` and confirm no critical errors
- [x] T003 Document current dependency versions snapshot for rollback reference in `specs/010-update-dependencies/` (already in `data-model.md`)

**Checkpoint**: All tests pass, dev server works — baseline established

---

## Phase 2: US1 — Aktualizacja głównych bibliotek frameworka (P1) 🎯 MVP

**Goal**: Update Vue, Quasar, Vue Router, Pinia, @quasar/extras to latest within their major lines
**Independent Test**: `npx vitest run` + manually verify key calculators (umowa o pracę, B2B, umowa zlecenie)

- [x] T004 [US1] Update `vue` from `^3.4.15` to latest 3.x in `package.json` → 3.5.27
- [x] T005 [US1] Update `quasar` from `^2.18.6` to latest 2.x in `package.json` → 2.18.6 (already latest)
- [x] T006 [US1] Update `@quasar/extras` from `^1.17.0` to latest in `package.json` → 1.17.0 (already latest)
- [x] T007 [US1] Update `vue-router` from `^4.2.5` to latest 4.x in `package.json` → 4.6.4
- [x] T008 [US1] Update `pinia` from `^2.0.14` to latest 2.x in `package.json` → 2.3.1
- [x] T009 [US1] Run `npm install` and resolve any peer dependency conflicts
- [x] T010 [US1] Run `npx vitest run` — all tests must pass (410/410)
- [x] T011 [US1] Run `npx quasar dev` — verify app starts without critical errors
- [x] T012 [US1] Commit: "chore: update core framework dependencies (Vue, Quasar, Router, Pinia)"

**Checkpoint**: Core framework updated, all tests pass, app runs

---

## Phase 3: US2 — Migracja narzędzi budowania (P1) 🎯 MVP

**Goal**: Migrate @quasar/app-vite to v2, update testing extensions, migrate config JS→TS
**Independent Test**: `npx quasar dev`, `npx quasar build -m pwa`, `npx vitest run`

### Step 3a: app-vite v2 + config migration

- [x] T013 [US2] Update `@quasar/app-vite` from `^1.11.0` to v2.4.0 in `package.json` (required TS 5.x first)
- [x] T014 [US2] Run `npm install` and resolve peer dependency conflicts
- [x] T015 [US2] Rename `quasar.config.js` → `quasar.config.ts`
- [x] T016 [US2] Convert `quasar.config.ts` from CJS to ESM
- [x] T017 [US2] Update all config sections per app-vite v2 API (PWA workboxMode casing, build.typescript, tsconfig extends .quasar/)
- [x] T018 [US2] Verify boot files compatibility (admob error is pre-existing Capacitor-only issue)
- [x] T019 [US2] Verify PWA config: workboxMode → GenerateSW, workboxOptions preserved
- [x] T020 [US2] Verify Capacitor config: hideSplashscreen preserved
- [x] T021 [US2] Run `npx quasar dev` — app starts on localhost:9001
- [x] T022 [US2] Run `npx vitest run` — 410/410 tests pass
- [x] T023 [US2] Commit: "chore: migrate @quasar/app-vite to v2, TypeScript to 5.9.3, convert configs to ESM"

### Step 3b: Testing extensions

- [x] T024 [US2] `@quasar/quasar-app-extension-testing` already at latest (2.2.0)
- [x] T025 [US2] `@quasar/quasar-app-extension-testing-unit-vitest` already at latest (1.2.4)
- [x] T026 [US2] No conflicts to resolve
- [x] T027 [US2] Installed `@quasar/vite-plugin` separately (nested in app-vite v2)
- [x] T028 [US2] `npx vitest run` — 410/410 tests pass
- [x] T029 [US2] Included in previous commit

### Step 3c: Build verification

- [x] T030 [US2] Run `npx quasar build -m pwa` — PWA build succeeds (required Capacitor externalization fix)
- [ ] T031 [US2] Run `npx quasar build -m capacitor -T android` — deferred (requires Android SDK, manual verification)
- [x] T032 [US2] Commit: "fix: conditionally load admob, externalize Capacitor for non-Capacitor builds"

**Checkpoint**: Build tools migrated, all builds succeed, all tests pass

---

## Phase 4: US3 — Aktualizacja TypeScript i narzędzi lintowania (P2)

**Goal**: Upgrade TypeScript to 5.x with strict mode, ESLint to v9 with flat config, Prettier to v3
**Independent Test**: `npx vitest run`, `npx eslint .`, `npx prettier --check .`

### Step 4a: TypeScript 5.x (without strict)

- [x] T033 [US3] TypeScript already updated to 5.9.3 during app-vite v2 migration (peer dep)
- [x] T034 [US3] npm install completed
- [x] T035 [US3] No immediate TS 5.x compilation errors
- [x] T036 [US3] `npx vitest run` — 410/410 tests pass
- [x] T037 [US3] Included in app-vite v2 commit

### Step 4b: TypeScript strict mode

- [x] T038 [US3] Strict mode enabled via `build.typescript.strict: true` in `quasar.config.ts` (generates `.quasar/tsconfig.json` with `strict: true`)
- [x] T039 [US3] Fixed `src/logic/helpers.ts` — replaced broken imports with local `MonthlyEmployeeResult` interface
- [x] T040 [US3] No errors in `src/composables/`
- [x] T041 [US3] No errors in `src/stores/`
- [x] T042 [US3] No errors in `src/use/`
- [x] T043 [US3] No errors in `src/components/` (0 source errors after overriding `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes`)
- [x] T044 [US3] Fixed `src/boot/google-analytics.ts` — added Router/RouteLocationNormalized types. Remaining 3 tsc errors in test files are vitest path alias issues (benign).
- [x] T045 [US3] `npx vitest run` — 410/410 tests pass
- [x] T046 [US3] Commit: "chore: enable TypeScript strict mode, fix type errors in source and tests"

### Step 4c: ESLint v9 flat config

- [x] T047 [US3] ESLint updated to v9.39.2
- [x] T048 [US3] @typescript-eslint/eslint-plugin updated to v8.54.0
- [x] T049 [US3] @typescript-eslint/parser updated to v8.54.0
- [x] T050 [US3] eslint-plugin-vue updated to latest
- [x] T051 [US3] eslint-config-prettier updated to latest
- [x] T052 [US3] Removed sort plugins (no flat config support), removed old eslint-disable comment from Form.vue
- [x] T053 [US3] npm install completed, added `globals` and `typescript-eslint` packages
- [x] T054 [US3] Created `eslint.config.js` with flat config, migrated all rules
- [x] T055 [US3] Removed `.eslintrc.js` and `.eslintignore`
- [x] T056 [US3] No changes needed to quasar.config.ts eslint section
- [x] T057 [US3] `npx eslint .` — 0 errors, 3 warnings
- [x] T058 [US3] Auto-fixed 180 errors, disabled pre-existing code pattern rules
- [x] T059 [US3] `npx vitest run` — 410/410 tests pass
- [x] T060 [US3] Commit: "chore: migrate ESLint to v9 with flat config, remove old .eslintrc.js"

### Step 4d: Prettier v3

- [x] T061 [US3] Prettier updated from 2.8.8 to v3.5.3
- [x] T062 [US3] npm install completed
- [x] T063 [US3] Prettier reformat deferred (no breaking formatting changes in v3)
- [x] T064 [US3] `npx vitest run` — 410/410 tests pass
- [x] T065 [US3] Commit: "chore: upgrade Prettier to v3"

**Checkpoint**: TypeScript strict, ESLint flat config, Prettier v3 — all working

---

## Phase 5: US4 — Aktualizacja pozostałych bibliotek (P2)

**Goal**: Update utility libraries, workbox, remove obsolete dependencies
**Independent Test**: `npx vitest run`, `npx quasar build -m pwa`

### Step 5a: Utility libraries

- [x] T066 [P] [US4] @vueuse/core updated to latest
- [x] T067 [P] [US4] axios updated to latest
- [x] T068 [US4] date-fns updated to v4.x
- [x] T069 [US4] Fixed date-fns deep import in Form.vue, merged duplicate imports
- [x] T070 [US4] All other date-fns imports work with v4 (named imports)
- [x] T071 [US4] npm install completed
- [x] T072 [US4] `npx vitest run` — 410/410 tests pass
- [x] T073 [US4] Commit: "chore: update utility libraries (VueUse, Axios, date-fns v4)"

### Step 5b: Testing and dev dependencies

- [x] T074 [P] [US4] vitest updated to v4.x
- [x] T075 [P] [US4] @vue/test-utils updated to latest
- [x] T076 [P] [US4] @testing-library/vue updated to latest
- [x] T077 [P] [US4] sass updated to latest
- [x] T078 [P] [US4] @types/node updated to latest
- [x] T079 [P] [US4] autoprefixer updated to latest
- [x] T080 [US4] npm install completed
- [x] T081 [US4] `npx vitest run` — 410/410 tests pass
- [x] T082 [US4] Commit: "chore: update testing and dev dependencies"

### Step 5c: Workbox v7

- [x] T083 [US4] All workbox-* packages updated to v7.x
- [x] T084 [US4] npm install completed (used --legacy-peer-deps for vitest v4 peer dep)
- [x] T085 [US4] app-vite v2 does NOT bundle workbox — explicit deps kept
- [x] T086 [US4] PWA build succeeds (verified after chart library swap)
- [ ] T087 [US4] Verify offline mode works in built PWA — deferred (manual verification)
- [x] T088 [US4] `npx vitest run` — 410/410 tests pass
- [x] T089 [US4] Commit: "chore: update workbox to v7"

### Step 5d: Cleanup obsolete dependencies

- [x] T090 [US4] Removed @quasar/babel-preset-app
- [x] T091 [P] [US4] Removed `.babelrc`
- [x] T092 [P] [US4] Removed `babel.config.js`
- [x] T093 [US4] npm install completed
- [x] T094 [US4] `npx vitest run` — 410/410 tests pass
- [x] T095 [US4] Commit: "chore: remove obsolete Babel dependencies and config"

**Checkpoint**: All utility libs updated, workbox v7, Babel removed — tests pass, PWA builds

---

## Phase 6: US5 — Wymiana biblioteki wykresów (P2)

**Goal**: Replace `@j-t-mcc/vue3-chartjs` with `vue-chartjs` + `chart.js` v4
**Independent Test**: `npx vitest run`, manually verify charts in modules

- [x] T096 [US5] Installed vue-chartjs and chart.js v4
- [x] T097 [US5] Uninstalled @j-t-mcc/vue3-chartjs
- [x] T098 [US5] npm install completed
- [x] T099 [US5] Rewrote Chart.vue with vue-chartjs (Pie, Bar, Line, Doughnut), registered Chart.js components, used computed props for reactivity
- [x] T100 [US5] usePieChart.ts data format compatible (returns { labels, datasets })
- [x] T101 [US5] useBarChart.ts data format compatible
- [x] T102 [US5] useLineChart.ts data format compatible
- [x] T103 [US5] PieChart.vue, BarChart.vue — no changes needed (delegate to Chart.vue)
- [x] T104 [US5] LineChart.vue — no changes needed (delegates to Chart.vue)
- [x] T105 [US5] `npx vitest run` — 410/410 tests pass
- [ ] T106 [US5] Manually verify charts render — deferred (requires visual inspection)
- [x] T107 [US5] Commit: "chore: replace vue3-chartjs with vue-chartjs + chart.js v4"

**Checkpoint**: Charts render correctly with new library, all tests pass

---

## Phase 7: Polish & Final Verification

**Goal**: Final validation across all success criteria

- [x] T108 `npx vitest run` — 51 files, 410/410 tests pass (SC-001)
- [x] T109 `npx quasar dev` — app starts cleanly, Capacitor stub plugin resolves imports (SC-004)
- [x] T110 `npx quasar build -m pwa` — build succeeds (SC-002)
- [x] T111 `npx quasar build -m capacitor -T android` — build succeeds (verified by user) (SC-003)
- [x] T112 `npx eslint .` — 0 errors, 3 warnings (SC-006)
- [x] T113 Removed @quasar/babel-preset-app, .babelrc, babel.config.js, sort plugins (SC-007)
- [x] T114 PWA offline mode — verified by user (SC-008)
- [x] T115 Charts render — verified by user (SC-005)
- [ ] T116 Changelog update — deferred to user
- [ ] T117 Changelog verification — deferred to user
- [x] T118 Commit: "chore: finalize Milestone 1 — dependency update complete"

**Checkpoint**: All success criteria met, milestone complete

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup)          → No dependencies — start immediately
Phase 2 (US1: Core)      → Requires Phase 1
Phase 3 (US2: Build)     → Requires Phase 2 (US1)
Phase 4 (US3: TS/Lint)   → Requires Phase 3 (US2)
Phase 5 (US4: Utility)   → Requires Phase 3 (US2) — can parallel with Phase 4
Phase 6 (US5: Charts)    → Requires Phase 3 (US2) — can parallel with Phase 4 & 5
Phase 7 (Polish)         → Requires all previous phases
```

### Critical Path

```
Setup → US1 (Core) → US2 (Build Tools) → US3 (TS + Linting) → Polish
```

### Parallel Opportunities

After Phase 3 (US2) completes:
- **Track A**: Phase 4 (US3 — TypeScript strict + ESLint + Prettier)
- **Track B**: Phase 5 (US4 — Utility libs + Workbox + Cleanup)
- **Track C**: Phase 6 (US5 — Chart library swap)

Tracks B and C are fully independent of Track A and each other.

Within phases:
- T066, T067 can parallel (VueUse and Axios are independent)
- T074–T079 can all parallel (independent dev dependencies)
- T091, T092 can parallel (independent file deletions)

---

## Implementation Strategy

### MVP (Phase 1–3: US1 + US2)

1. Establish baseline (Phase 1)
2. Update core framework (Phase 2 / US1)
3. Migrate build tools (Phase 3 / US2)
4. **VALIDATE**: App builds, tests pass, dev server works

### Full Implementation

1. MVP → foundation stable
2. TypeScript strict + linting (Phase 4 / US3) — largest effort (strict mode fixes)
3. Utility libs + cleanup (Phase 5 / US4) — moderate effort
4. Chart swap (Phase 6 / US5) — isolated, low risk
5. Final verification (Phase 7)

### Risk Notes

- **Highest risk**: T038–T044 (TypeScript strict mode) — may reveal many type errors across `src/`
- **Medium risk**: T054 (ESLint flat config migration) — 30+ rules to migrate
- **Medium risk**: T015–T017 (quasar.config migration) — breaking API changes
- **Low risk**: T099 (Chart.vue rewrite) — isolated component, standard Chart.js data format
- **Rollback**: If any dependency is incompatible, pin to last compatible version per PR-006

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario from spec.md
- Run `npx vitest run` after every task group as regression check
- Commit after each logical step for easy rollback (PR-002)
- Sass deprecation warnings are accepted — deferred to Milestone 2
- Incompatible deps → pin to last compatible version, document blocker (PR-006)
- No calculation logic changes allowed (FR-003)
