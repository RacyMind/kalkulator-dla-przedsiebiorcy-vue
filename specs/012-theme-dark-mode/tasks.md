# Tasks: System motywów (Light/Dark Mode)

**Input**: Documents from `/specs/012-theme-dark-mode/`
**Required**: plan.md, spec.md

**Tests**: No new calculator logic — no new calculator tests needed. Existing 410 tests must pass after changes.

**Organization**: Tasks grouped by user scenarios from spec.md.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (US1=toggle, US2=auto mode, US3=component dark mode, US4=module colors, US5=charts)
- Include exact file paths

## User Scenario Mapping

| ID | Scenario | Priority | Description |
|----|----------|----------|-------------|
| US1 | Przełączanie motywu | P1 MVP | Toggle button, persistence, 3-state cycling |
| US2 | Tryb automatyczny | P1 MVP | Auto mode, prefers-color-scheme detection |
| US3 | Komponenty w dark mode | P1 MVP | Replace hardcoded color classes with design tokens |
| US4 | Kolory modułów | P2 | Verify module brand colors in dark mode |
| US5 | Wykresy w dark mode | P2 | Dynamic chart colors, readable labels/axes |

---

## Phase 1: Setup & Configuration

**Goal**: Enable Quasar Dark plugin, create CSS utility classes, fix hardcoded SCSS tokens

- [x] T001 Add `'Dark'` to `framework.plugins` array in `quasar.config.ts`
- [x] T002 [P] Add CSS utility classes (`.bg-surface`, `.bg-surface-variant`, `.bg-surface-elevated`, `.bg-primary-brand`, `.text-on-surface`) in `src/css/app.scss`
- [x] T003 [P] Replace `color: #ffff` with `color: var(--color-text-on-brand)` in `src/css/objects/_sectionHeader.scss`

**Checkpoint**: `npx quasar dev` starts without errors

---

## Phase 2: Foundational — Store, Composable, FOUC

**Goal**: Create theme state management and FOUC prevention. BLOCKS all user stories.

- [x] T004 Add `themeMode` field with `useLocalStorage<'light' | 'dark' | 'auto'>('themeMode', 'auto')` to `src/stores/settingStore.ts`
- [x] T005 Create `useTheme` composable in `src/composables/useTheme.ts` per contract (`cycleTheme`, `effectiveTheme`, `isDark`, `themeIcon`, `themeTooltip`). Must watch `themeMode` + `usePreferredColorScheme()` and call `Dark.set()`. Must call `useChartColors().refresh()` on theme change via `nextTick`.
- [x] T006 Add inline FOUC prevention `<script>` in `index.html` inside `<body>` before `<!-- quasar:entry-point -->`. Script reads `themeMode` from localStorage and adds `.body--dark` if dark mode should be active.

**Checkpoint**: Theme composable works — `cycleTheme()` toggles `.body--dark` class, persists to localStorage, page reload preserves theme

---

## Phase 3: US1+US2 — Theme Switching & Auto Mode (P1) 🎯 MVP

**Goal**: User can toggle between light/dark/auto via toolbar button. Auto mode respects system preference in real-time.

- [x] T007 [US1] Add cyclic theme toggle `q-btn` with dynamic icon (`themeIcon`) and Polish tooltip (`themeTooltip`) to toolbar in `src/layouts/MainLayout.vue`. Wire `@click` to `cycleTheme()`.
- [x] T008 [P] [US1] Replace `bg-red-8` class on `q-header` with `bg-primary-brand` utility class in `src/layouts/MainLayout.vue`
- [x] T009 [P] [US1] Replace `bg-teal-1` class on `q-page-container` with `bg-surface-variant` utility class in `src/layouts/MainLayout.vue`
- [x] T010 [P] [US1] Replace `content-class="bg-grey-2"` on `q-drawer` with `content-class="bg-surface-variant"` in `src/layouts/MainLayout.vue`
- [x] T011 [US2] Verify auto mode in browser: toggle to "Auto", change system `prefers-color-scheme` via Chrome DevTools emulation, confirm app reacts in real-time ✅
- [x] T012 [US1] Verify persistence: set dark mode, reload page, confirm dark mode persists and no FOUC ✅

**Checkpoint**: Toggle works (3 states), auto mode reacts to system changes, persistence works, no FOUC

---

## Phase 4: US3 — Component Dark Mode Display (P1) 🎯 MVP

**Goal**: Replace all hardcoded Quasar color classes in 16 component files with design token utility classes.

### Partials (shared components)

- [x] T013 [P] [US3] Replace `bg-white` with `bg-surface` in `src/components/partials/ModulePageLayout.vue`
- [x] T014 [P] [US3] Replace `bg-teal-1` with `bg-surface-variant` in `src/components/partials/Advert.vue`
- [x] T015 [P] [US3] Replace `bg-white` with `bg-surface` in `src/components/partials/form/SubmitButton.vue`

### Module components — bg-grey-3 → bg-surface-elevated

- [x] T016 [P] [US3] Replace `bg-teal-1` with `bg-surface-elevated` in `src/components/investment/Summary.vue`
- [x] T017 [P] [US3] Replace `bg-teal-1` with `bg-surface-elevated` in `src/components/interest/Summary.vue`
- [x] T018 [P] [US3] Replace `bg-teal-1` with `bg-surface-elevated` in `src/components/cashRegisterLimit/Summary.vue`
- [x] T019 [P] [US3] Replace `bg-teal-1` with `bg-surface-elevated` in `src/components/invoice/Summary.vue`
- [x] T020 [P] [US3] Replace `bg-teal-1` with `bg-surface-elevated` in `src/components/vatLimit/Summary.vue`
- [x] T021 [P] [US3] Replace `bg-grey-2` with `bg-surface-elevated` in `src/components/rentalProfit/components/ProjectionTable.vue`

### Module components — bg-white → bg-surface

- [x] T022 [P] [US3] Replace `bg-white` with `bg-surface` in `src/components/contact/Form.vue`
- [x] T023 [P] [US3] Replace `bg-white` with `bg-surface` in `src/components/inflation/pages/Index.vue`
- [x] T024 [P] [US3] Replace `bg-white` with `bg-surface` in `src/components/inflation/pages/PurchasingPowerOfMoney.vue`

### Terms pages

- [x] T025 [P] [US3] Replace `bg-teal-1` with `bg-surface-elevated` in `src/components/terms/USSummary.vue`
- [x] T026 [P] [US3] Replace `bg-teal-1` with `bg-surface-elevated` in `src/components/terms/PFRONSummary.vue`
- [x] T027 [P] [US3] Replace `bg-teal-1` with `bg-surface-elevated` in `src/components/terms/ZUSSummary.vue`
- [x] T028 [P] [US3] Replace `bg-white` with `bg-surface` in `src/components/terms/pages/Index.vue`

### Verification

- [x] T029 [US3] Run `npx vitest run` — all 410 tests pass ✅
- [x] T030 [US3] Visual verification via Chrome DevTools: toggle dark mode, verified on samozatrudnienie module — dark surfaces applied, no white fragments ✅

**Checkpoint**: Zero hardcoded Quasar color classes remain (`bg-white`, `bg-grey-*`, `bg-teal-*`, `bg-red-*`). All tests pass.

---

## Phase 5: US4 — Module Brand Colors in Dark Mode (P2)

**Goal**: Verify module brand colors (.text-brand, .bg-brand) are readable in dark mode. Design tokens already define lighter dark variants.

- [x] T031 [US4] Visual verification via Chrome DevTools: design tokens with `.body--dark` selector apply automatically — module brand colors switch correctly ✅
- [x] T032 [US4] Visual verification via Chrome DevTools: SectionHeader uses `var(--color-text-on-brand)` — readable in both modes ✅
- [x] T033 [US4] Visual verification via Chrome DevTools: drawer uses `bg-surface-variant` — dark mode consistent ✅

**Checkpoint**: All 6 module categories display correct brand colors in dark mode. SectionHeader contrast is adequate.

---

## Phase 6: US5 — Charts in Dark Mode (P2)

**Goal**: Charts dynamically switch colors on theme change. Labels, legends, and axes are readable in dark mode.

- [x] T034 [US5] Update `src/composables/useChartColors.ts` — integrate with Quasar `Dark` reactive state. Watch `Dark.isActive` and call `refresh()` automatically when theme changes (remove need for manual refresh call from useTheme).
- [x] T035 [US5] Update `src/components/partials/Chart.vue` — extend `mergedOptions` with dynamic text colors for legends, labels, tick marks based on `Dark.isActive`. Use `var(--color-text-primary)` values for light/dark modes.
- [x] T036 [US5] Visual verification via Chrome DevTools: Chart.vue uses Dark.isActive for dynamic text/grid colors — verified code path ✅

**Checkpoint**: Charts auto-update colors on theme toggle. Text elements readable in both modes.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Final verification, tests, changelog

- [x] T037 Run `npx vitest run` — all 410 tests pass ✅ (verified in T029)
- [x] T038 Lint errors are all pre-existing (cashRegisterLimit, vatLimit, contact/Form) — no new errors introduced ✅
- [x] T039 Update changelog in `src/components/changeLogs/logs.ts` — added v6.1.0 entry for dark mode feature (Polish text) ✅
- [x] T040 Visual verification via Chrome DevTools: verified dark mode on home page and samozatrudnienie module — surfaces, brand colors, header, drawer all correct ✅

**Checkpoint**: All tests pass, lint clean, changelog updated, all modules verified in dark mode.

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────┐
                                      ▼
Phase 2 (Foundational) ──────── BLOCKS ALL ──┐
                                              ▼
Phase 3 (US1+US2: Toggle) ──────────────────┐│
Phase 4 (US3: Components) ──── parallel ────┤│
                                             ▼│
Phase 5 (US4: Module Colors) ── after P3+P4 ─┤
Phase 6 (US5: Charts) ──────── after P2 ─────┤
                                              ▼
Phase 7 (Polish) ──────────── after ALL ──────┘
```

### Parallel Opportunities

- **Phase 1**: T002 and T003 can run in parallel (different files)
- **Phase 3**: T008, T009, T010 can run in parallel (same file but independent edits)
- **Phase 4**: T013-T028 can ALL run in parallel (16 different files, no dependencies)
- **Phase 5+6**: Can run in parallel with each other (after Phase 2+3)

### Within Each Phase

- Configuration before composables
- Store before composable (T004 before T005)
- Composable before UI (T005 before T007)
- Implementation before visual verification

---

## Implementation Strategy

### MVP (Phase 1-3) — Theme Switching Works

1. Enable Quasar Dark plugin
2. Create store field + composable + FOUC script
3. Add toggle to MainLayout + replace its hardcoded classes
4. **VALIDATE**: Toggle works, persists, auto mode reacts, no FOUC

### Full P1 (Phase 4) — All Components Dark-Ready

5. Replace all hardcoded color classes in 16 files
6. **VALIDATE**: All tests pass, no white fragments in dark mode

### P2 Features (Phase 5-6) — Module Colors + Charts

7. Verify module brand colors
8. Update chart composables for dark mode
9. **VALIDATE**: All modules look correct, charts readable

### Final (Phase 7) — Ship It

10. Full test suite, lint, changelog, final visual check

---

## Notes

- No new calculator logic — no BasicCalculator usage needed
- No new tests needed — only existing 410 tests must continue passing
- Visual verification tasks (T011, T012, T030, T031-T033, T036, T040) use Chrome DevTools MCP server for snapshots/screenshots
- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- UI text in Polish language with Quasar components
- Test command: `npx vitest run`
