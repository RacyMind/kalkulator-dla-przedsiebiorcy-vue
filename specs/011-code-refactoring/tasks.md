# Tasks: Refaktoryzacja kodu (Milestone 2)

**Input**: Documents from `/specs/011-code-refactoring/`
**Required**: plan.md, spec.md

**Tests**: Tests are REQUIRED — all 410+ existing tests must pass after each task group. No new calculator logic is added, so no new calculation tests needed. Verification is regression-based.

**Organization**: Tasks grouped by user scenarios from spec.md.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## User Story Mapping

| US | Spec Scenario | Priority | Description |
|----|--------------|----------|-------------|
| US1 | Scenario 1 | P1 MVP | JS→TS Migration (5 files) |
| US2 | Scenario 2 | P1 MVP | Vue Component Migration (30 files) |
| US3 | Scenario 3 | P1 MVP | Constants System Unification (Pinia store) |
| US4 | Scenario 4 | P2 | Code Deduplication (3 extractions) |
| US5 | Scenario 5 | P2 | Code Structure Cleanup |
| US6 | Scenario 6 | P2 | Design Tokens |

## Path Conventions

- **Composables**: `src/composables/`
- **Logic**: `src/logic/`
- **Stores**: `src/stores/`
- **CSS**: `src/css/`
- **Components**: `src/components/`
- **Tests**: `test/vitest/__tests__/`
- **Changelog**: `src/components/changeLogs/logs.ts`

---

## Phase 1: Setup

**Goal**: Establish baseline and verify environment

- [ ] T001 Run `npx vitest run` and confirm all 410+ tests pass — establish baseline
- [ ] T002 Verify branch `011-code-refactoring` is up to date with main

**Checkpoint**: Baseline established, all tests green

---

## Phase 2: Foundational — JS→TS Migration (P1) 🎯 MVP

**Goal**: Migrate all 5 JavaScript files to TypeScript with full typing. No logic changes.
**Independent Test**: Zero `.js` files in `src/logic/` and `src/use/`. All 410+ tests pass.

### Leaf files (no internal dependencies)

- [ ] T003 [P] [US1] Migrate `src/use/currencyFormat.js` → `src/composables/currencyFormat.ts` — add types: `pln(value: number): string` and `formatToCurrency(value: number, code: string): string`. Keep exported API identical.
- [ ] T004 [P] [US1] Migrate `src/use/deepEqual.js` → `src/composables/deepEqual.ts` — rewrite with TypeScript generics `deepEqual<T>(object1: T, object2: T): boolean`. Preserve all edge case handling (null, undefined, nested objects). Zero new dependencies.

### Files with dependencies

- [ ] T005 [P] [US1] Migrate `src/logic/employeeContributions.js` → `src/logic/employeeContributions.ts` — add full parameter and return type annotations. Keep all function signatures identical.
- [ ] T006 [P] [US1] Migrate `src/logic/employerContributions.js` → `src/logic/employerContributions.ts` — add full parameter and return type annotations. Keep all function signatures identical.
- [ ] T007 [US1] Migrate `src/logic/jointAccounting.js` → `src/logic/jointAccounting.ts` — add full typing. Replace global `setYear()` with year parameter passed to functions that need it (via composable or direct param). Update all callers of `setYear()`.

### Import updates and cleanup

- [ ] T008 [US1] Update all imports across the project that reference `src/use/currencyFormat` or `src/use/deepEqual` to point to new `src/composables/` paths
- [ ] T009 [US1] Delete original JS files: `src/use/currencyFormat.js`, `src/use/deepEqual.js`
- [ ] T010 [US1] Run `npx vitest run` — verify all 410+ tests pass. Verify zero `.js` files in `src/logic/` and `src/use/` with: `Get-ChildItem -Path src/logic,src/use -Recurse -Include *.js`

**Checkpoint**: US1 complete — all JS files migrated to TS, all tests green

---

## Phase 3: Vue Component Migration (P1) 🎯 MVP

**Goal**: Migrate all 30 Vue components to `<script setup lang="ts">` with typed props via `defineProps<Props>()`.
**Independent Test**: `grep -r "defineComponent" src/ --include="*.vue"` returns 0 results. All tests pass.

### Batch 1: Shared partials (9 files)

- [ ] T011 [US2] Migrate `src/components/partials/menu/Menu.vue` — Options API → `<script setup lang="ts">`, replace `setup()` return with top-level variables, use `defineProps<Props>()`
- [ ] T012 [P] [US2] Migrate `src/components/partials/menu/Item.vue` — to `<script setup lang="ts">` with typed props
- [ ] T013 [P] [US2] Migrate `src/components/partials/ChooseYear.vue` — to `<script setup lang="ts">` with typed props
- [ ] T014 [P] [US2] Migrate `src/components/partials/DatePopup.vue` — to `<script setup lang="ts">` with typed props
- [ ] T015 [P] [US2] Migrate `src/components/partials/LineChart.vue` — to `<script setup lang="ts">` with typed props
- [ ] T016 [P] [US2] Migrate `src/components/partials/ListRow.vue` — to `<script setup lang="ts">` with typed props
- [ ] T017 [P] [US2] Migrate `src/components/partials/SalarySummaryTable.vue` — to `<script setup lang="ts">` with typed props
- [ ] T018 [P] [US2] Migrate `src/components/partials/SupportProject.vue` — to `<script setup lang="ts">`
- [ ] T019 [P] [US2] Migrate `src/components/partials/YearlySummaryTable.vue` — to `<script setup lang="ts">` with typed props
- [ ] T020 [US2] Run `npx vitest run` — verify all tests pass after partials batch

### Batch 2: App and pages (2 files)

- [ ] T021 [US2] Migrate `src/App.vue` — replace `defineComponent` with `<script setup lang="ts">`
- [ ] T022 [P] [US2] Migrate `src/pages/Error404.vue` — to `<script setup lang="ts">`
- [ ] T023 [US2] Run `npx vitest run` — verify all tests pass after app batch

### Batch 3: Module components — cashRegisterLimit, changeLogs, contact, vatLimit (7 files)

- [ ] T024 [P] [US2] Migrate `src/components/cashRegisterLimit/Form.vue` — to `<script setup lang="ts">` with typed props
- [ ] T025 [P] [US2] Migrate `src/components/cashRegisterLimit/Summary.vue` — to `<script setup lang="ts">` with typed props
- [ ] T026 [P] [US2] Migrate `src/components/changeLogs/ChangeLog.vue` — to `<script setup lang="ts">` with typed props
- [ ] T027 [P] [US2] Migrate `src/components/contact/Form.vue` — to `<script setup lang="ts">`
- [ ] T028 [P] [US2] Migrate `src/components/vatLimit/Form.vue` — to `<script setup lang="ts">` with typed props
- [ ] T029 [P] [US2] Migrate `src/components/vatLimit/Summary.vue` — to `<script setup lang="ts">` with typed props
- [ ] T030 [US2] Run `npx vitest run` — verify all tests pass after batch 3

### Batch 4: Module components — inflation, interest, investment, invoice (10 files)

- [ ] T031 [P] [US2] Migrate `src/components/inflation/InflationStatistics.vue` — to `<script setup lang="ts">` with typed props
- [ ] T032 [P] [US2] Migrate `src/components/inflation/PurchasingPowerOfMoneyStatistics.vue` — to `<script setup lang="ts">` with typed props
- [ ] T033 [P] [US2] Migrate `src/components/interest/Form.vue` — to `<script setup lang="ts">` with typed props
- [ ] T034 [P] [US2] Migrate `src/components/interest/Statistics.vue` — to `<script setup lang="ts">` with typed props
- [ ] T035 [P] [US2] Migrate `src/components/interest/Summary.vue` — to `<script setup lang="ts">` with typed props
- [ ] T036 [P] [US2] Migrate `src/components/investment/Form.vue` — to `<script setup lang="ts">` with typed props
- [ ] T037 [P] [US2] Migrate `src/components/investment/Summary.vue` — to `<script setup lang="ts">` with typed props
- [ ] T038 [P] [US2] Migrate `src/components/invoice/Form.vue` — to `<script setup lang="ts">` with typed props
- [ ] T039 [P] [US2] Migrate `src/components/invoice/Statistics.vue` — to `<script setup lang="ts">` with typed props
- [ ] T040 [P] [US2] Migrate `src/components/invoice/Summary.vue` — to `<script setup lang="ts">` with typed props
- [ ] T041 [US2] Run `npx vitest run` — verify all tests pass after batch 4

### Batch 5: Module components — terms (3 files)

- [ ] T042 [P] [US2] Migrate `src/components/terms/PFRONSummary.vue` — to `<script setup lang="ts">` with typed props
- [ ] T043 [P] [US2] Migrate `src/components/terms/USSummary.vue` — to `<script setup lang="ts">` with typed props
- [ ] T044 [P] [US2] Migrate `src/components/terms/ZUSSummary.vue` — to `<script setup lang="ts">` with typed props
- [ ] T045 [US2] Run `npx vitest run` — verify all tests pass. Verify: `Select-String -Path src/**/*.vue -Pattern "defineComponent" -Recurse` returns 0 results.

**Checkpoint**: US2 complete — all 30 components migrated, zero defineComponent usage, all tests green

---

## Phase 4: Constants System Unification (P1) 🎯 MVP

**Goal**: Replace both `src/logic/constants.ts` and `src/composables/constants.ts` with a dedicated Pinia store. Single source of truth for all constants.
**Independent Test**: Old files deleted, all 410+ tests pass, zero imports from old paths.

### Design and create store

- [ ] T046 [US3] Create typed interfaces file `src/stores/constants/types.ts` — define `ZusConstants`, `EmployeeZusConstants`, `EmployerZusConstants`, `EntrepreneurZusConstants`, `IncomeTaxConstants`, `WageStats`, `AppConfig`, `YearParams`, `AvailableYear` per `specs/011-code-refactoring/contracts/constantsStore.ts`
- [ ] T047 [US3] Create year params data file `src/stores/constants/yearParams.ts` — migrate PARAMS data (from2021 through from2026) from `src/logic/constants.ts` into typed `Record<AvailableYear, YearParams>` map
- [ ] T048 [US3] Create Pinia store `src/stores/constantsStore.ts` — use setup syntax (`defineStore` with composition API). State: static constants (app, amountTypes, taxTypes, availableYears, contractOfEmployment, contractOfMandate, contractWork, ppk, vatLimit, cashRegisterLimit, rentalTax, localeDate, monthNames, fullYear). Getters: `zusConstants`, `incomeTaxConstants`, `wageStats`, `yearParams` — computed from `settingStore.dateOfLawRules`. Re-export enums `AmountTypes`, `EntrepreneurTaxSystem`.

### Incremental consumer migration

- [ ] T049 [US3] Migrate consumers in `src/logic/zus/` (ZusContribution.ts, EntrepreneurZusContribution.ts, EmployerZusContribution.ts, EmployeeZusContribution.ts) — replace `useConstants()` with `useConstantsStore()`
- [ ] T050 [US3] Run `npx vitest run` — verify tests pass after ZUS migration
- [ ] T051 [US3] Migrate consumers in `src/logic/taxes/` (FlatTax.ts, LumpSumTax.ts, TaxScale.ts) — replace `useConstants()` with `useConstantsStore()`
- [ ] T052 [US3] Run `npx vitest run` — verify tests pass after taxes migration
- [ ] T053 [US3] Migrate consumers in `src/components/contractWork/` — replace `useConstants()` and `constants` imports with `useConstantsStore()`
- [ ] T054 [US3] Migrate consumers in `src/components/contractOfEmployment/` — replace with `useConstantsStore()`
- [ ] T055 [US3] Migrate consumers in `src/components/contractOfMandate/` — replace with `useConstantsStore()`
- [ ] T056 [US3] Run `npx vitest run` — verify tests pass after employment module migrations
- [ ] T057 [US3] Migrate consumers in `src/components/selfEmployment/` — replace with `useConstantsStore()`
- [ ] T058 [US3] Migrate consumers in `src/components/b2bComparator/` — replace with `useConstantsStore()`
- [ ] T059 [US3] Migrate consumers in remaining modules (accountingWithSpouse, cashRegisterLimit, inflation, interest, investment, invoice, partialZusContributions, polishBonds, realBoughtCosts, rentalProfit, salaryForUnusedHolidays, salaryStats, sickPay, unregisteredCompany, vatLimit, ikeSavings, ikzeTaxRelief, currencyConverter, exchangeRates) — replace all `useConstants()` and `constants` imports with `useConstantsStore()`
- [ ] T060 [US3] Run `npx vitest run` — verify tests pass after all module migrations
- [ ] T061 [US3] Migrate `src/logic/helpers.ts` → update `getDefaultYear()` to use `useConstantsStore()` instead of importing from `src/logic/constants`
- [ ] T062 [US3] Migrate `src/logic/jointAccounting.ts` — replace any remaining references to old constants with `useConstantsStore()`
- [ ] T063 [US3] Migrate remaining consumers: `src/components/partials/` components, `src/layouts/`, `src/stores/settingStore.ts` — replace all `constants` and `useConstants()` imports

### Cleanup

- [ ] T064 [US3] Verify zero imports remain from `src/logic/constants` or `src/composables/constants` across the project: `Select-String -Path src -Pattern "from.*logic/constants|from.*composables/constants" -Recurse -Include *.ts,*.vue`
- [ ] T065 [US3] Delete `src/logic/constants.ts` and `src/composables/constants.ts`
- [ ] T066 [US3] Run `npx vitest run` — verify all 410+ tests pass after full migration

**Checkpoint**: US3 complete — single Pinia constants store, old files deleted, all tests green

---

## Phase 5: Code Deduplication (P2)

**Goal**: Extract 3 duplicated patterns into shared modules.
**Independent Test**: `findGrossAmountUsingNetAmount` in one shared file, composables for tax threshold and scroll. All tests pass.

### findGrossAmountUsingNetAmount

- [ ] T067 [US4] Create generic `src/logic/findGrossAmountUsingNetAmount.ts` — accepts Calculator as generic parameter with interface `{ getResult(amount: number): { netAmount: number } }`. Port logic from `src/components/contractWork/logic/findGrossAmountUsingNetAmount.ts`.
- [ ] T068 [P] [US4] Update `src/components/contractWork/components/Form.vue` — import `findGrossAmountUsingNetAmount` from `src/logic/findGrossAmountUsingNetAmount.ts`
- [ ] T069 [P] [US4] Update `src/components/contractOfMandate/components/Form.vue` — import from shared `src/logic/findGrossAmountUsingNetAmount.ts`
- [ ] T070 [P] [US4] Update `src/components/contractOfEmployment/components/Form.vue` — import from shared `src/logic/findGrossAmountUsingNetAmount.ts`
- [ ] T071 [US4] Delete module-specific files: `src/components/contractWork/logic/findGrossAmountUsingNetAmount.ts`, `src/components/contractOfMandate/logic/findGrossAmountUsingNetAmount.ts`, `src/components/contractOfEmployment/logic/findGrossAmountUsingNetAmount.ts`
- [ ] T072 [US4] Run `npx vitest run` — verify all tests pass

### Tax threshold notification

- [ ] T073 [US4] Create `src/composables/useTaxThresholdNotification.ts` — extract duplicated tax threshold notification logic from `src/components/contractOfEmployment/pages/Index.vue` and `src/components/selfEmployment/pages/Index.vue`
- [ ] T074 [US4] Update `src/components/contractOfEmployment/pages/Index.vue` — use `useTaxThresholdNotification()` composable
- [ ] T075 [US4] Update `src/components/selfEmployment/pages/Index.vue` — use `useTaxThresholdNotification()` composable
- [ ] T076 [US4] Run `npx vitest run` — verify all tests pass

### Scroll to results

- [ ] T077 [US4] Create `src/composables/useScrollToResults.ts` — extract `scrollToElement` + `ref(summary)` pattern. Return `{ summaryRef, scrollToResults }`.
- [ ] T078 [US4] Update all 21 module pages that use `scrollToElement` pattern to use `useScrollToResults()` composable: accountingWithSpouse, b2bComparator, cashRegisterLimit, contractOfEmployment, contractOfMandate, contractWork, currencyConverter, exchangeRates, ikeSavings, ikzeTaxRelief, interest, investment, invoice, partialZusContributions, polishBonds, realBoughtCosts, rentalProfit, salaryForUnusedHolidays, selfEmployment, sickPay, unregisteredCompany, vatLimit
- [ ] T079 [US4] Run `npx vitest run` — verify all tests pass

### sumMonthlyResults relocation

- [ ] T080 [US4] Move `sumMonthlyResults` and its `MonthlyEmployeeResult` interface from `src/logic/helpers.ts` to `src/logic/sumMonthlyResults.ts`
- [ ] T081 [US4] Update imports in modules that use `sumMonthlyResults` (contractOfEmployment, contractOfMandate) to import from `src/logic/sumMonthlyResults.ts`
- [ ] T082 [US4] Remove `sumMonthlyResults` export from `src/logic/helpers.ts`
- [ ] T083 [US4] Run `npx vitest run` — verify all tests pass

**Checkpoint**: US4 complete — zero duplicated code, shared modules in place, all tests green

---

## Phase 6: Code Structure Cleanup (P2)

**Goal**: Consolidate `src/use/` into `src/composables/`, clean helpers.ts.
**Independent Test**: `src/use/` directory empty or deleted. Zero imports from `src/use/`. All tests pass.

- [ ] T084 [US5] Audit `src/use/` directory — list any remaining files not yet moved in Phase 2 (currencyFormat and deepEqual already moved in T003-T004)
- [ ] T085 [US5] Move any remaining files from `src/use/` to `src/composables/` with full typing
- [ ] T086 [US5] Update all imports referencing `src/use/` paths across the project
- [ ] T087 [US5] Delete `src/use/` directory
- [ ] T088 [US5] Verify `applyMixins` in `src/logic/helpers.ts` is still used by FlatTax.ts, LumpSumTax.ts, TaxScale.ts, EmployerZusContribution.ts, EntrepreneurZusContribution.ts — keep it
- [ ] T089 [US5] Run `npx vitest run` — verify all tests pass. Verify: `Select-String -Path src -Pattern "from.*src/use/" -Recurse -Include *.ts,*.vue` returns 0 results.

**Checkpoint**: US5 complete — clean structure, single composables directory, all tests green

---

## Phase 7: Design Tokens (P2)

**Goal**: Create full color palette with CSS custom properties for light/dark mode. Replace COLORS object. All WCAG AA compliant.
**Independent Test**: `_design-tokens.scss` exists with light/dark variants. COLORS removed from store. Chart composables use `useChartColors()`. Visual verification passes. All tests pass.

### Color palette design

- [ ] T090 [US6] Research and design new WCAG AA compliant color palette: primary (new, not #d12526), secondary, accent, 6 module brands (work, business, taxes, currencies, percentage, informator), 8 chart colors (CHART1-8), surface variants (surface, surface-variant, surface-elevated), semantic (positive, negative, info, warning), text colors (text-primary, text-secondary, text-on-brand). Verify all pairs meet WCAG AA contrast (text ≥ 4.5:1, UI ≥ 3:1). Document chosen values.

### Implementation

- [ ] T091 [US6] Create `src/css/_design-tokens.scss` — define CSS custom properties: `:root` (light mode), `.body--dark` (dark mode), module classes (`.c-work`, `.c-business`, `.c-taxes`, `.c-currencies`, `.c-percentage`, `.c-informator`)
- [ ] T092 [US6] Import `_design-tokens.scss` in `src/css/app.scss` to ensure tokens are loaded globally
- [ ] T093 [US6] Update `src/css/quasar.variables.scss` — map `$primary`, `$secondary`, `$accent`, `$positive`, `$negative`, `$info`, `$warning` to new palette values
- [ ] T094 [P] [US6] Update `src/css/components/_work.scss` — replace hardcoded hex (#B45309) with `var(--module-work)`
- [ ] T095 [P] [US6] Update `src/css/components/_business.scss` — replace hardcoded hex with `var(--module-business)`
- [ ] T096 [P] [US6] Update `src/css/components/_taxes.scss` — replace hardcoded hex with `var(--module-taxes)`
- [ ] T097 [P] [US6] Update `src/css/components/_currencies.scss` — replace hardcoded hex with `var(--module-currencies)`
- [ ] T098 [P] [US6] Update `src/css/components/_percentage.scss` — replace hardcoded hex with `var(--module-percentage)`
- [ ] T099 [P] [US6] Update `src/css/components/_informator.scss` — replace hardcoded hex with `var(--module-informator)`
- [ ] T100 [P] [US6] Update `src/css/components/_app.scss` — replace any hardcoded hex with design token variables

### Chart colors composable

- [ ] T101 [US6] Create `src/composables/useChartColors.ts` — reads CSS custom properties (`--chart-1` through `--chart-8`, `--module-*`) via `getComputedStyle`. Returns `{ chartColors: ComputedRef<ChartColors>, moduleColors: ComputedRef<ModuleColors>, refresh: () => void }`. Cache values, re-read on theme change.
- [ ] T102 [US6] Remove `COLORS` object from `src/stores/constantsStore.ts` (if it was migrated there) or verify it was not carried over from old `constants.ts`
- [ ] T103 [P] [US6] Update `src/composables/usePieChart.ts` — replace COLORS references with `useChartColors()` composable
- [ ] T104 [P] [US6] Update `src/composables/useBarChart.ts` — replace COLORS references with `useChartColors()` composable
- [ ] T105 [P] [US6] Update `src/composables/useLineChart.ts` — replace COLORS references with `useChartColors()` composable
- [ ] T106 [US6] Update any remaining module components that directly reference COLORS from old constants — use `useChartColors()` or CSS classes instead

### Verification

- [ ] T107 [US6] Run `npx vitest run` — verify all tests pass
- [ ] T108 [US6] Verify WCAG AA contrast for all token pairs using WebAIM Contrast Checker
- [ ] T109 [US6] Visual verification in browser: run `quasar dev`, check colors in at least 5 modules (contractWork, selfEmployment, invoice, currencyConverter, interest) — confirm consistent, readable colors in light mode

**Checkpoint**: US6 complete — design tokens in place, COLORS removed, charts use composable, all tests green

---

## Phase 8: Polish & Cross-Cutting Concerns

**Goal**: Final verification, changelog, documentation

- [ ] T110 Run full `npx vitest run` — all 410+ tests must pass
- [ ] T111 Verify zero `.js` files in `src/logic/` and `src/use/`: `Get-ChildItem -Path src/logic,src/use -Recurse -Include *.js -ErrorAction SilentlyContinue`
- [ ] T112 Verify zero `defineComponent` in Vue files: `Select-String -Path src/**/*.vue -Pattern "defineComponent" -Recurse`
- [ ] T113 Verify zero imports from old constants: `Select-String -Path src -Pattern "from.*logic/constants|from.*composables/constants" -Recurse -Include *.ts,*.vue`
- [ ] T114 Verify zero imports from `src/use/`: `Select-String -Path src -Pattern "from.*src/use/" -Recurse -Include *.ts,*.vue`
- [ ] T115 Update changelog in `src/components/changeLogs/logs.ts` — add entry for v6.0 describing code refactoring improvements (internal changes, no user-visible feature changes)
- [ ] T116 Verify changelog renders correctly by checking `src/pages/ChangeLogs.vue`

**Checkpoint**: Milestone 2 complete — all success criteria met

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └── Phase 2 (US1: JS→TS) — FOUNDATIONAL
        └── Phase 3 (US2: Vue Migration) — can start after T010
        └── Phase 4 (US3: Constants Store) — can start after T010
              └── Phase 5 (US4: Deduplication) — requires Phase 4
              └── Phase 6 (US5: Cleanup) — requires Phase 2 + 4
              └── Phase 7 (US6: Design Tokens) — requires Phase 4 (COLORS in store)
                    └── Phase 8 (Polish) — requires all previous
```

### Parallel Opportunities

- **Phase 2 tasks T003-T006**: All leaf file migrations can run in parallel
- **Phase 3 batches**: Within each batch, all component migrations marked [P] can run in parallel
- **Phase 4 T049-T051**: ZUS and taxes consumer migrations can overlap
- **Phase 5 T068-T070**: Module updates for findGrossAmountUsingNetAmount can run in parallel
- **Phase 7 T094-T100**: All 7 SCSS file updates can run in parallel
- **Phase 7 T103-T105**: All chart composable updates can run in parallel

### Independent Test Criteria per Story

| US | Test Command | Verification |
|----|-------------|--------------|
| US1 | `npx vitest run` + `Get-ChildItem src/logic,src/use -Include *.js -Recurse` | 0 JS files, all tests pass |
| US2 | `npx vitest run` + `Select-String -Pattern "defineComponent" src/**/*.vue` | 0 defineComponent, all tests pass |
| US3 | `npx vitest run` + grep for old constants imports | 0 old imports, all tests pass |
| US4 | `npx vitest run` + grep for module-local findGrossAmountUsingNetAmount | 0 duplicates, all tests pass |
| US5 | `npx vitest run` + check `src/use/` empty/deleted | 0 files in use/, all tests pass |
| US6 | `npx vitest run` + WCAG check + visual verification | Tokens exist, COLORS gone, contrast OK |

---

## Implementation Strategy

### MVP (Phase 1-4: US1 + US2 + US3)

1. Setup baseline
2. Migrate JS→TS (5 files)
3. Migrate Vue components (30 files)
4. Unify constants system (Pinia store)
5. **VALIDATE**: All tests pass, code fully typed, single constants source

### Full Implementation

1. MVP → typed codebase with unified constants
2. US4 → deduplicated shared modules
3. US5 → clean directory structure
4. US6 → design tokens with new palette
5. Polish → final verification and changelog

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- All 410+ existing tests must pass after EVERY checkpoint
- No calculation logic changes anywhere — pure refactoring
- Reference implementation for Vue components: `src/components/contractWork/components/Form.vue`
- Constants store reference: `specs/011-code-refactoring/contracts/constantsStore.ts`
- Chart colors composable reference: `specs/011-code-refactoring/contracts/useChartColors.ts`
- Run tests after each task group, not after every single task
- Test command: `npx vitest run`
