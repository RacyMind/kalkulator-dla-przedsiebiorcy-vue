---

description: "Task list for feature implementation"
---

# Tasks: Stawka godzinowa i urlop w JDG

**Input**: Documents from `/specs/006-stawka-godzinowa-urlop/`
**Required**: plan.md, spec.md

**Tests**: Tests are REQUIRED for calculator logic. Must include all output values.

**Organization**: Tasks grouped by user scenarios.

## Phase 1: Setup

**Goal**: Prepare module for hourly mode changes

- [x] T001 Review existing self-employment input flow in `src/components/selfEmployment/components/Form.vue`
- [x] T002 [P] Review calculator input fields in `src/components/selfEmployment/interfaces/InputFields.ts`
- [x] T003 [P] Review calculation flow in `src/components/selfEmployment/logic/EntrepreneurCalculator.ts` and `src/components/selfEmployment/logic/AnnualEntrepreneurCalculator.ts`

---

## Phase 2: Foundational

**Goal**: Add data shape and helper logic for hourly mode

- [x] T004 Update `src/components/selfEmployment/interfaces/InputFields.ts` to include hourly mode fields (`incomeMode`, `hourlyRate`, `plannedHours`, `deductLeave`, `leaveHours`) with defaults handled in form
- [x] T005 [P] Add helper calculation for billable hours and hourly revenue in `src/components/selfEmployment/logic/helpers.ts` (or a new module-specific helper under `src/components/selfEmployment/logic/`) for reuse in form and tests

---

## Phase 3: User Scenario 1 (P1) — Stawka godzinowa z odliczeniem urlopu 🎯 MVP

**Goal**: User can enter hourly rate, planned hours, and leave hours to reduce revenue

### Tests (REQUIRED - tests first, then implementation)

- [x] T006 [US1] Extend tests in `test/vitest/__tests__/modules/selfEmployment/EntrepreneurCalculator.test.ts` with hourly mode + leave case (include all output values, current year)
- [x] T007 [US1] Add test for validation boundary in `test/vitest/__tests__/modules/selfEmployment/EntrepreneurCalculator.test.ts` where leave hours >= planned hours yields 0 revenue (include all output values)

### Implementation

- [x] T008 [US1] Add hourly mode selection (list rozwijana, domyślnie wersja aktualna) in `src/components/selfEmployment/components/Form.vue`
- [x] T009 [US1] Add inputs for hourly rate, planned hours, and leave toggle + leave hours in `src/components/selfEmployment/components/Form.vue`
- [x] T010 [US1] Implement hourly revenue calculation (stawka * (plan - urlop)) and map to `revenue` when submitting in `src/components/selfEmployment/components/Form.vue`
- [x] T011 [US1] Add validation using `validationRules` for hourly fields and leave hours <= planned hours in `src/components/selfEmployment/components/Form.vue`

**Independent Test Criteria**: Wprowadzenie stawki 120, plan 160, urlop 24 → przychód 16 320 zł, a walidacja blokuje urlop >= plan.

---

## Phase 4: User Scenario 2 (P2) — Stawka godzinowa bez odliczenia urlopu

**Goal**: User can enter hourly rate and planned hours with no leave deduction

### Tests

- [x] T012 [US2] Add test case in `test/vitest/__tests__/modules/selfEmployment/EntrepreneurCalculator.test.ts` for hourly mode without leave (include all output values)

### Implementation

- [x] T013 [US2] Ensure leave fields are hidden/disabled when odliczenie urlopu is off in `src/components/selfEmployment/components/Form.vue`
- [x] T014 [US2] Ensure hourly mode without leave uses planned hours only for `revenue` mapping in `src/components/selfEmployment/components/Form.vue`

**Independent Test Criteria**: Stawka 120, plan 160, urlop wyłączony → przychód 19 200 zł.

---

## Phase 5: Polish & Cross-Cutting

**Goal**: Final consistency and documentation updates

- [x] T015 Update changelog entry in `src/components/changeLogs/logs.ts` (user-visible change)
- [ ] T016 Run targeted tests: `npx vitest run test/vitest/__tests__/modules/selfEmployment/EntrepreneurCalculator.test.ts`

---

## Dependencies and Execution Order

- **Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5**
- Tests must be written before implementation in each story phase.

### Parallel Opportunities

- T002 and T003 can run in parallel.
- T004 and T005 can run in parallel.
- UI tasks T008–T011 can be split across form fields and validation when tests are ready.

---

## Implementation Strategy

1. Start with data model updates (InputFields + helper).
2. Implement hourly mode with leave (MVP, US1) and pass tests.
3. Add no-leave path (US2).
4. Update changelog and run targeted tests.
