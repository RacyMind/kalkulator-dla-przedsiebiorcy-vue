# Tasks: Dodanie obligacji ROS i ROD

**Input**: Documents from `/specs/001-obligacje-ros-rod/`  
**Required**: plan.md, spec.md  
**Optional used**: research.md, data-model.md, contracts/, quickstart.md

**Tests**: Tests are REQUIRED for calculator logic. Must include all output values. Tests must use the current year (2026) for `dateOfLawRules`.

**Organization**: Tasks grouped by user scenarios.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (US1, US2)
- Include exact file paths

---

## Phase 1: Setup & Baseline

**Goal**: Prepare for safe extension of existing `polishBonds` module and ensure baseline tests are green.

- [x] T001 Read existing module entry points and flow in `src/components/polishBonds/components/Form.vue` and `src/components/polishBonds/pages/Index.vue`
- [x] T002 Verify current test baseline by running one existing test file (e.g. `npx vitest run test/vitest/__tests__/modules/polishBonds/CoiCalculator.test.ts`)

---

## Phase 2: Foundational (blocking prerequisites)

**Goal**: Add shared types/constants/interfaces needed by both ROS and ROD.

- [x] T003 Extend bond type union to include ROS/ROD in `src/components/polishBonds/store.ts`
- [x] T004 Extend store state to hold ROS/ROD-specific input fields in `src/components/polishBonds/store.ts`
- [x] T005 [P] Create input interfaces `src/components/polishBonds/interfaces/RosInputFields.ts` and `src/components/polishBonds/interfaces/RodInputFields.ts`
- [x] T006 Add ROS/ROD product params (maturity, margin, default initial interest rate for year 1) in `src/components/polishBonds/logic/BondConstants.ts`

---

## Phase 3: User Scenario 1 (P1) 🎯 MVP — Obliczenie zysków dla ROS lub ROD

**Goal**: User can select ROS or ROD, fill inputs, run calculation, and see results.

### Tests (REQUIRED — tests first, then implementation)

- [x] T007 [P] [US1] Create test file `test/vitest/__tests__/modules/polishBonds/RosCalculator.test.ts` (set `dateOfLawRules = new Date(2026, 0, 1)` and active Pinia)
- [x] T008 [P] [US1] Create test file `test/vitest/__tests__/modules/polishBonds/RodCalculator.test.ts` (set `dateOfLawRules = new Date(2026, 0, 1)` and active Pinia)
- [x] T009 [US1] Add ROS test cases that assert **all output values** for representative months (e.g. month 0, month 11, and final month 71) in `test/vitest/__tests__/modules/polishBonds/RosCalculator.test.ts`
- [x] T010 [US1] Add ROD test cases that assert **all output values** for representative months (e.g. month 0, month 11, and final month 143) in `test/vitest/__tests__/modules/polishBonds/RodCalculator.test.ts`
- [x] T011 [US1] Add edge test coverage (negative inflation, belkaTax enabled/disabled) in `test/vitest/__tests__/modules/polishBonds/RosCalculator.test.ts` and `test/vitest/__tests__/modules/polishBonds/RodCalculator.test.ts`

### Calculator implementation

- [x] T012 [P] [US1] Implement `src/components/polishBonds/logic/RosCalculator.ts` extending `BasicCalculator` (72 months, yearly capitalization, payout at final month, belka tax at final month only)
- [x] T013 [P] [US1] Implement `src/components/polishBonds/logic/RodCalculator.ts` extending `BasicCalculator` (144 months, yearly capitalization, payout at final month, belka tax at final month only)
- [x] T014 [US1] Ensure ROS/ROD interest rules (year 1 from input; year 2+ uses `max(0, yearlyInflationRate) + margin`) in `src/components/polishBonds/logic/RosCalculator.ts` and `src/components/polishBonds/logic/RodCalculator.ts`

### UI: forms and integration

- [x] T015 [P] [US1] Create ROS form with defaulted+editable year-1 rate and validation in `src/components/polishBonds/components/bondForms/RosForm.vue`
- [x] T016 [P] [US1] Create ROD form with defaulted+editable year-1 rate and validation in `src/components/polishBonds/components/bondForms/RodForm.vue`
- [x] T017 [US1] Add ROS/ROD options and dynamic form mapping in `src/components/polishBonds/components/Form.vue`
- [x] T018 [US1] Persist and save ROS/ROD-specific form fields into store on submit in `src/components/polishBonds/components/Form.vue`
- [x] T019 [US1] Add calculation handlers and switch cases for ROS/ROD in `src/components/polishBonds/pages/Index.vue` (create input, call calculator, set result)
- [x] T020 [US1] Update bond description component to include ROS/ROD copy (if descriptions are shown per bond type) in `src/components/polishBonds/components/BondDescription.vue`

### Checkpoint

- [x] T021 [US1] Run ROS tests: `npx vitest run test/vitest/__tests__/modules/polishBonds/RosCalculator.test.ts`
- [x] T022 [US1] Run ROD tests: `npx vitest run test/vitest/__tests__/modules/polishBonds/RodCalculator.test.ts`

---

## Phase 4: User Scenario 2 (P2) — Porównanie ROS i ROD na tych samych danych

**Goal**: Switching between ROS and ROD and recalculating produces correct results and does not leak state.

- [x] T023 [US2] Ensure switching bond type between ROS and ROD keeps common fields consistent and produces correct result length (ROS 72, ROD 144) in `src/components/polishBonds/components/Form.vue` and `src/components/polishBonds/pages/Index.vue`
- [x] T024 [US2] Add/adjust a small test that validates result length for ROS vs ROD on same inputs (can be part of `RosCalculator.test.ts` / `RodCalculator.test.ts`)

---

## Phase 5: Polish & Cross-cutting

**Goal**: Documentation, changelog, and regression safety.

- [x] T025 Update changelog entry in `src/components/changeLogs/logs.ts` (user-visible: added ROS/ROD in obligacje skarbowe)
- [x] T026 Run regression tests `npx vitest run test/vitest/__tests__/modules/polishBonds/CoiCalculator.test.ts` and `npx vitest run test/vitest/__tests__/modules/polishBonds/EdoCalculator.test.ts`
- [x] T027 Verify UI manually per `specs/001-obligacje-ros-rod/quickstart.md` (user verification needed)

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1**: No dependencies
- **Phase 2**: Blocks US1 implementation
- **Phase 3 (US1)**: Requires Phase 2
- **Phase 4 (US2)**: Requires Phase 3
- **Phase 5**: Requires Phase 3 (and ideally Phase 4)

### Parallel Opportunities

- [ ] T028 [P] Parallelization note: T005 can run independently (interfaces) in `src/components/polishBonds/interfaces/*`
- [ ] T029 [P] Parallelization note: T007 and T008 can run independently (test scaffolding) in `test/vitest/__tests__/modules/polishBonds/*`
- [ ] T030 [P] Parallelization note: T012 and T013 can run independently (calculator implementations) in `src/components/polishBonds/logic/*`
- [ ] T031 [P] Parallelization note: T015 and T016 can run independently (form components) in `src/components/polishBonds/components/bondForms/*`

## MVP Scope Suggestion

- MVP = **Phase 1 + Phase 2 + Phase 3 (US1)**.
- US2 and Polish tasks can follow once ROS/ROD calculations and UI selection work end-to-end.
