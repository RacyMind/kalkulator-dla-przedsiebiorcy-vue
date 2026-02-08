# Tasks: Kalkulator zysku z najmu

**Input**: Documents from `/specs/007-rental-profit-calculator/`
**Required**: plan.md, spec.md

**Tests**: Tests are REQUIRED for calculator logic. Must include all output values.

**Organization**: Tasks grouped by user scenarios.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## Path Conventions

- **Module**: `src/components/rentalProfit/`
- **Logic**: `src/components/rentalProfit/logic/`
- **Tests**: `test/vitest/__tests__/modules/rentalProfit/`
- **Shared**: `src/logic/`
- **Changelog**: `src/components/changeLogs/logs.ts`

## User Story Mapping

| Story | Spec Scenario | Priority | Description |
|-------|--------------|----------|-------------|
| US1 | Scenario 1 + 3 | P1 MVP | Obliczenie zysku rocznego + przekroczenie progu 100k |
| US2 | Scenario 2 | P1 MVP | Projekcja wieloletnia ze skumulowanym zyskiem |
| US3 | Scenario 4 | P2 | Rozliczenie małżonków (próg 200k) |
| US4 | Scenario 5 | P2 | Pustostany (miesiące bez najemcy) |
| US5 | Scenario 6 | P3 | Wiele nieruchomości |

---

## Phase 1: Setup & Module Structure

**Goal**: Create directory structure and shared dependencies

- [x] T001 Add rental tax constants (`rentalTax` block) to `src/logic/constants.ts`
- [x] T002 [P] Create `src/components/rentalProfit/interfaces/InputFields.ts` with InputFields interface per data-model.md
- [x] T003 [P] Create `src/components/rentalProfit/interfaces/Result.ts` with YearResult, Summary, and Result interfaces per data-model.md

**Checkpoint**: Interfaces compile, constants accessible

---

## Phase 2: Core Calculator Logic (P1) 🎯 MVP

**Goal**: Implement RentalProfitCalculator with tax calculation, including two-bracket tax (8.5%/12.5%) and threshold crossing

**Story scope**: US1 (roczny zysk + próg 100k) + US2 (projekcja wieloletnia)

### Tests (REQUIRED — tests first, then implementation)

- [x] T004 [US1] Create test file `test/vitest/__tests__/modules/rentalProfit/RentalProfitCalculator.test.ts` with Pinia setup and helper `getResult()` function
- [x] T005 [US1] Add test: basic annual calculation (monthlyRent=3000, monthlyExpenses=800, refactoredCharges=500, numberOfYears=1) — verify all output values: grossRevenue=36000, taxableRevenue=30000, tax=2550, annualExpenses=9600, netProfit=23850, effectiveTaxRate=7.08
- [x] T006 [US1] Add test: threshold crossing (monthlyRent=15000, refactoredCharges=2000, monthlyExpenses=3000, numberOfYears=1) — verify: grossRevenue=180000, taxableRevenue=156000, tax=15500, netProfit=128500, effectiveTaxRate=8.61
- [x] T007 [US1] Add test: revenue exactly at threshold (taxableRevenue=100000) — verify only 8.5% rate applied
- [x] T008 [US1] Add test: zero revenue — verify netProfit is negative (only expenses)
- [x] T009 [US1] Add test: invalid data — verify errors thrown for undefined input
- [x] T010 [US2] Add test: multi-year projection (numberOfYears=3, monthlyRent=3000, monthlyExpenses=800, refactoredCharges=500) — verify 3 yearResults, each with correct values, cumulativeProfit=[23850, 47700, 71550], summary totals
- [x] T011 [US2] Add test: multi-year with annual rent increase (annualRentIncrease=5, numberOfYears=3) — verify monthlyRent grows each year, tax recalculated per year

### Implementation

- [x] T012 [US1] Create `src/components/rentalProfit/logic/RentalProfitCalculator.ts` extending `BasicCalculator<InputFields, Result>` implementing `Calculator<InputFields, Result>` with `calculate()` method per contracts/calculator-api.md
- [x] T013 [US1] Implement `calculateTax(taxableRevenue, isSpouseSettlement)` private method with two-bracket logic (8.5% up to threshold, 12.5% above)
- [x] T014 [US2] Implement multi-year loop in `calculate()`: iterate years 1..numberOfYears, apply annual rent indexation, accumulate cumulativeProfit, generate Summary

**Checkpoint**: `npx vitest run test/vitest/__tests__/modules/rentalProfit/RentalProfitCalculator.test.ts` — all tests pass

---

## Phase 3: Store & State Management

**Goal**: Pinia store connecting form to calculator

- [x] T015 Create `src/components/rentalProfit/store.ts` with Pinia store per contracts/calculator-api.md (state: inputFields, getter: result computed via RentalProfitCalculator)

**Checkpoint**: Store compiles, getter returns correct Result

---

## Phase 4: UI — Annual Summary (P1) 🎯 MVP

**Goal**: Form + "Podsumowanie roczne" tab — user can input data and see first year results

### Implementation

- [x] T016 [US1] Create `src/components/rentalProfit/components/Form.vue` with all input fields (monthlyRent, monthlyExpenses, refactoredCharges, numberOfYears, isSpouseSettlement, vacancyMonths, annualRentIncrease), validation via `validationRules`, `useLocalStorage` persistence, tooltips per contracts/calculator-api.md, SubmitButton emitting @submit
- [x] T017 [P] [US1] Create `src/components/rentalProfit/components/AnnualResultList.vue` displaying first year results using `list-row` pattern: grossRevenue, taxableRevenue, tax, annualExpenses, netProfit (highlighted), effectiveTaxRate, monthly netProfit
- [x] T018 [US1] Create `src/components/rentalProfit/pages/Index.vue` with ModulePageLayout, SectionHeader, Form, Advert, q-tabs (Tabs enum: AnnualSummary, MultiYearProjection), q-tab-panels — pattern from selfEmployment/pages/Index.vue

**Checkpoint**: Dev server shows form + "Podsumowanie roczne" tab with correct results

---

## Phase 5: UI — Multi-Year Projection (P1) 🎯 MVP

**Goal**: "Projekcja wieloletnia" tab with year-by-year table

- [x] T019 [US2] Create `src/components/rentalProfit/components/ProjectionTable.vue` displaying table with columns: Rok, Przychód, Podatek, Koszty, Zysk netto, Skumulowany zysk — one row per year, summary row at bottom with totals from Result.summary
- [x] T020 [US2] Wire ProjectionTable into Index.vue second tab panel

**Checkpoint**: Both tabs work, projection table shows correct multi-year data

---

## Phase 6: Spouse Settlement (P2)

**Goal**: US3 — toggle for spouse settlement changes threshold to 200 000 zł

### Tests

- [x] T021 [US3] Add test: spouse settlement ON, taxableRevenue=150000 — verify tax=12750 (all at 8.5%, below 200k threshold)
- [x] T022 [US3] Add test: spouse settlement OFF, taxableRevenue=150000 — verify tax=14750 (8500 + 6250)

### Implementation

- [x] T023 [US3] Verify isSpouseSettlement toggle in Form.vue works and passes to store; verify calculateTax uses spouseThreshold when enabled (should already work from T013 implementation)

**Checkpoint**: `npx vitest run test/vitest/__tests__/modules/rentalProfit/RentalProfitCalculator.test.ts` — spouse tests pass

---

## Phase 7: Vacancy Months (P2)

**Goal**: US4 — vacancy months reduce revenue but not expenses

### Tests

- [x] T024 [US4] Add test: vacancyMonths=1, monthlyRent=3000, monthlyExpenses=800, refactoredCharges=500, numberOfYears=1 — verify: grossRevenue=33000 (3000×11), taxableRevenue=27500 (33000-500×11), annualExpenses=9600 (800×12), netProfit calculated correctly
- [x] T025 [US4] Add test: vacancyMonths=12 — verify grossRevenue=0, netProfit=-9600 (only expenses)

### Implementation

- [x] T026 [US4] Verify vacancyMonths field in Form.vue works and calculator uses `activeMonths = 12 - vacancyMonths` for revenue calculation (should already work from T012 implementation)

**Checkpoint**: `npx vitest run test/vitest/__tests__/modules/rentalProfit/RentalProfitCalculator.test.ts` — vacancy tests pass

---

## Phase 8: Integration & Polish

**Goal**: Connect module to app, final touches

- [x] T027 Add route `'zysk-z-najmu'` to `src/router/routes.ts` with lazy-loaded import of `src/components/rentalProfit/pages/Index.vue`
- [x] T028 Update changelog in `src/components/changeLogs/logs.ts` — add entry describing "Kalkulator zysku z najmu" feature
- [x] T029 Run full test suite: `npx vitest run test/vitest/__tests__/modules/rentalProfit/RentalProfitCalculator.test.ts`
- [x] T030 Verify all UI text is in Polish, tooltips display correctly, mobile responsive

**Checkpoint**: Module accessible at `/zysk-z-najmu`, all tests pass, changelog updated

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup) ─────────────────────────────────────> Phase 8 (Integration)
    │                                                       ▲
    ├──> Phase 2 (Calculator Logic) ──> Phase 3 (Store) ────┤
    │         │                              │              │
    │         └──> Phase 4 (Annual UI) ──────┘              │
    │         └──> Phase 5 (Projection UI) ─────────────────┤
    │                                                       │
    ├──> Phase 6 (Spouse) ──────────────────────────────────┤
    └──> Phase 7 (Vacancy) ────────────────────────────────┘
```

- **Phase 1**: No dependencies — start immediately
- **Phase 2**: Requires Phase 1 (interfaces + constants)
- **Phase 3**: Requires Phase 2 (calculator class)
- **Phase 4**: Requires Phase 2 + 3 (store + calculator)
- **Phase 5**: Requires Phase 3 + 4 (store + page structure)
- **Phase 6**: Requires Phase 2 (calculator) — tests only, logic already implemented
- **Phase 7**: Requires Phase 2 (calculator) — tests only, logic already implemented
- **Phase 8**: Requires all previous phases

### Parallel Opportunities

- **T002 + T003**: Interfaces can be created in parallel
- **T016 + T017**: Form and AnnualResultList can be created in parallel
- **Phase 6 + Phase 7**: Independent of each other, can run in parallel after Phase 2

---

## Implementation Strategy

### MVP (Phase 1–5): 20 tasks

1. Setup: constants + interfaces (T001–T003)
2. Tests first: all calculator tests (T004–T011)
3. Calculator logic (T012–T014)
4. Store (T015)
5. UI: Form + Annual tab + Projection tab (T016–T020)
6. **VALIDATE**: All tests pass, both tabs work

### Full Implementation (Phase 6–8): 10 tasks

1. Spouse settlement tests + verification (T021–T023)
2. Vacancy months tests + verification (T024–T026)
3. Integration: route, changelog, final verification (T027–T030)

### Deferred (US5 — P3: Wiele nieruchomości)

Not included in this task list. Requires separate spec refinement for multi-property UI/UX and shared tax threshold logic.

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- Tests ALWAYS before implementation
- Tests MUST include all output values
- Use `BasicCalculator` as base class
- Validation via `validationRules`
- UI in Polish language with Quasar components
- Test command: `npx vitest run test/vitest/__tests__/modules/rentalProfit/RentalProfitCalculator.test.ts`
