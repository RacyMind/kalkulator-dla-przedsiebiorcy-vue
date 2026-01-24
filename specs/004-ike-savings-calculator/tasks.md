# Tasks: Kalkulator IKE – podstawowy symulator oszczędności

**Input**: Documents from `/specs/004-ike-savings-calculator/`  
**Required**: `plan.md`, `spec.md`

**Tests**: Tests are REQUIRED for calculator logic. Must include all output values. Tests have to use the current year (2026).

**Organization**: Tasks grouped by user scenarios (US1–US5).

## Format: `[ID] [P?] [US?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (US1..US5)
- Each task MUST include exact file path

---

## Phase 1: Module Structure & Scaffolding

**Goal**: Create base module structure for `ikeSavings`

- [x] T001 Create module folders `src/components/ikeSavings/components/`, `src/components/ikeSavings/interfaces/`, `src/components/ikeSavings/logic/`, `src/components/ikeSavings/pages/`, `src/components/ikeSavings/types/`
- [x] T002 [P] Create enum `src/components/ikeSavings/types/ContributionType.ts`
- [x] T003 [P] Create interface `src/components/ikeSavings/interfaces/InputFields.ts`
- [x] T004 [P] Create interface `src/components/ikeSavings/interfaces/Result.ts`
- [x] T005 Create Pinia store skeleton `src/components/ikeSavings/store.ts`
- [x] T006 Create page skeleton `src/components/ikeSavings/pages/IkeSavingsPage.vue`
- [x] T007 [P] Create form component skeleton `src/components/ikeSavings/components/FormFields.vue`
- [x] T008 [P] Create results component skeleton `src/components/ikeSavings/components/ResultFields.vue`

---

## Phase 2: Foundational Shared Logic

**Goal**: Provide shared IKE limit logic and validation rules needed by the module

- [x] T009 Create IKE limits helper `src/logic/ikeLimits.ts` (API: `getIkeLimit(dateOfLawRules: Date): number`)
- [x] T010 Add new validation rule `greaterThan` in `src/logic/validationRules.ts`

---

## Phase 3: US1 (P1) MVP — Kapitał IKE (procent składany)

**Goal**: Implement calculator logic that computes `finalCapital` and related base values (savings period, yearly contribution)

### Tests (REQUIRED — tests first)

- [x] T011 [US1] Create test file `test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts`
- [x] T012 [US1] Add test case for yearly calculation (ContributionType.Yearly) in `test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts` asserting ALL output fields
- [x] T013 [US1] Add test case for monthly calculation (ContributionType.Monthly) in `test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts` asserting ALL output fields
- [x] T014 [US1] Ensure tests use current year (2026) and include assertions for `ikeLimit` values derived from `new Date(2026, 0, 1)` in `test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts`

### Implementation

- [x] T015 [US1] Create calculator class `src/components/ikeSavings/logic/IkeSavingsCalculator.ts` extending `BasicCalculator<InputFields, Result>`
- [x] T016 [US1] Implement `calculate()` for `savingsPeriodYears`, `yearlyContribution`, `totalContributions`, `finalCapital`, `investmentGain` in `src/components/ikeSavings/logic/IkeSavingsCalculator.ts`
- [x] T017 [US1] Use `helpers.round(value, 2)` for all monetary rounding in `src/components/ikeSavings/logic/IkeSavingsCalculator.ts`

**Independent Test Command**:
- `npx vitest run test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts`

---

## Phase 4: US2 (P1) MVP — Oszczędność podatkowa (podatek Belki)

**Goal**: Compute `belkaTax` and `taxSaving` based on investment gain

### Tests (extend existing)

- [x] T018 [US2] Extend US1 tests to assert `belkaTax` and `taxSaving` (19% od `investmentGain`) in `test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts`

### Implementation

- [x] T019 [US2] Implement `belkaTax` and `taxSaving` calculation in `src/components/ikeSavings/logic/IkeSavingsCalculator.ts`
- [x] T020 [US2] Ensure `investmentGain` is floored at minimum 0 for Belka tax calculation in `src/components/ikeSavings/logic/IkeSavingsCalculator.ts`

---

## Phase 5: US3 (P1) MVP — Średnia miesięczna emerytura

**Goal**: Compute monthly pension based on withdrawal period without interest during withdrawals

### Tests (extend existing)

- [x] T021 [US3] Extend tests to assert `monthlyPension` using `withdrawalPeriod` in `test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts`
- [x] T022 [US3] Add test case for different `withdrawalPeriod` (e.g. 10 lat) asserting ALL output fields in `test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts`

### Implementation

- [x] T023 [US3] Implement `monthlyPension = finalCapital / (withdrawalPeriod * 12)` in `src/components/ikeSavings/logic/IkeSavingsCalculator.ts`

---

## Phase 6: US4 (P2) — Walidacja limitu IKE

**Goal**: Compare yearly contribution against IKE limit and surface warning in UI and results

### Tests (extend existing)

- [x] T024 [US4] Add test case that exceeds IKE limit and asserts `exceedsIkeLimit === true` and `ikeLimit` value in `test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts`

### Implementation

- [x] T025 [US4] Compute `ikeLimit` using `getIkeLimit(dateOfLawRules)` in `src/components/ikeSavings/logic/IkeSavingsCalculator.ts`
- [x] T026 [US4] Compute `exceedsIkeLimit` based on `yearlyContribution > ikeLimit` in `src/components/ikeSavings/logic/IkeSavingsCalculator.ts`

---

## Phase 7: US5 (P2) — Wybór typu składki (miesięczna/roczna)

**Goal**: Implement input UX that switches between monthly and yearly contribution

- [x] T027 [US5] Implement store getter `result` in `src/components/ikeSavings/store.ts` to compute results reactively (pattern from `src/components/contractWork/store.ts`)
- [x] T028 [US5] Implement contribution type switching UI in `src/components/ikeSavings/components/FormFields.vue` (Quasar control + input)
- [x] T029 [US5] Implement mapping to `InputFields` in `src/components/ikeSavings/components/FormFields.vue` ensuring `contributionType` and `contributionAmount` are always set

---

## Phase 8: UI Assembly (Cross-cutting)

**Goal**: Complete page UX with validation and results display (Quasar, Polish)

- [x] T030 Implement page composition (Form + Results) in `src/components/ikeSavings/pages/IkeSavingsPage.vue`
- [x] T031 [P] Implement validation rules on inputs in `src/components/ikeSavings/components/FormFields.vue` using `src/logic/validationRules.ts`
- [x] T032 [P] Implement results UI (kapitał, oszczędność podatkowa, emerytura) in `src/components/ikeSavings/components/ResultFields.vue`
- [x] T033 Implement limit warning UI when `exceedsIkeLimit` in `src/components/ikeSavings/components/ResultFields.vue`
- [x] T034 Ensure all UI text is Polish in `src/components/ikeSavings/pages/IkeSavingsPage.vue`
- [x] T035 Ensure all UI text is Polish in `src/components/ikeSavings/components/FormFields.vue`
- [x] T036 Ensure all UI text is Polish in `src/components/ikeSavings/components/ResultFields.vue`

---

## Phase 9: Application Integration

**Goal**: Make module accessible from app router and menu

- [x] T037 Add route `/ike-savings` to `src/router/routes.ts` pointing to `src/components/ikeSavings/pages/IkeSavingsPage.vue`
- [x] T038 Add menu item "Kalkulator IKE" in `src/components/partials/menu/menuItems.ts` linking to `/ike-savings`

---

## Phase 10: Polish & Release Hygiene

**Goal**: Ensure quality, docs, changelog, and targeted tests

- [x] T039 Update changelog entry in `src/components/changeLogs/logs.ts` describing new module
- [x] T040 Run targeted tests `npx vitest run test/vitest/__tests__/modules/ikeSavings/IkeSavingsCalculator.test.ts`

---

## Dependencies and Execution Order

### Story Order

- **US1** → **US2** → **US3** are MVP P1 and should be implemented first (logic + tests).
- **US4** depends on IKE limits logic from Phase 2.
- **US5** depends on having the store + form wiring.

### Phase Dependencies

- Phase 1 blocks everything else.
- Phase 2 blocks US4 and parts of UI validation.
- US1 blocks US2/US3/US4 (they all extend the same calculator output).
- UI phases can start once calculator and store are stable.

## Parallel Opportunities

- T002–T004 can run in parallel.
- T007 and T008 can run in parallel.
- T031 and T032 can run in parallel.

## Independent Test Criteria per User Scenario

- **US1**: `finalCapital`, `totalContributions`, `investmentGain`, `savingsPeriodYears`, `yearlyContribution` correct for both monthly/yearly inputs.
- **US2**: `belkaTax` and `taxSaving` match 19% of `investmentGain`.
- **US3**: `monthlyPension` equals `finalCapital / (withdrawalPeriod * 12)`.
- **US4**: `exceedsIkeLimit` flips to true when annual contribution exceeds `ikeLimit` (for year 2026).
- **US5**: Switching contribution type updates the computed results without errors.

## MVP Suggestion

Implement through **Phase 5 (US1–US3)** plus minimal store wiring (T027) to expose results. UI and integration can follow after calculator correctness is locked in.
