# Tasks: Rzeczywisty koszt zakupu — wyświetlanie kosztu rzeczywistego

**Input**: Documents from `/specs/021-real-cost-display/`
**Required**: plan.md, spec.md

**Tests**: Tests are REQUIRED for calculator logic. Must include all output values.

**Organization**: Tasks grouped by user scenarios.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## Path Conventions

- **Module**: `src/components/realBoughtCosts/`
- **Logic**: `src/components/realBoughtCosts/logic/`
- **Tests**: `test/vitest/__tests__/modules/realBoughtCost/`
- **Changelog**: `src/components/changeLogs/logs.ts`

---

## Phase 1: Foundational — Interface Extension

**Goal**: Extend the Result interface with the new `realCost` field

- [x] T001 Add `readonly realCost: number` field to `Result` interface in `src/components/realBoughtCosts/interfaces/Result.ts`

**Checkpoint**: TypeScript interface updated, no compilation errors in interface file

---

## Phase 2: Calculator Logic & Tests (P1) 🎯 MVP

**Goal**: Implement `realCost` calculation and update all tests (covers US1 + US2)

### Tests (REQUIRED — update existing tests with new `realCost` assertions)

- [x] T002 [US1] Add `expect(result.realCost).toBe(79)` to test "with the deducted vat and income taxes" in `test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts`
- [x] T003 [P] [US1] Add `expect(result.realCost).toBe(100)` to test "with the deducted vat tax" in `test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts`
- [x] T004 [P] [US2] Add `expect(result.realCost).toBe(82)` to test "with the deducted income tax" in `test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts`
- [x] T005 [P] [US2] Add `expect(result.realCost).toBe(99.1)` to test "with the deducted income flat tax" in `test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts`

### Implementation

- [x] T006 [US1] Add `realCost: helpers.round(this.getInputData().price - savedAmount, 2)` to the result object in `src/components/realBoughtCosts/logic/RealBoughtCostCalculator.ts`

**Checkpoint**: Run `npx vitest run test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts` — all tests pass

---

## Phase 3: Edge Case Tests (P2)

**Goal**: Verify edge case — no deductions at all (US3)

- [x] T007 [US3] Add new test case "with no deductions" to `test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts` with input `deductedVatTaxPart: 0, incomeTaxRate: 0` and assertions: `savedAmount = 0`, `realCost = 123`

**Checkpoint**: Run tests — all pass including new edge case

---

## Phase 4: UI Update

**Goal**: Display "Rzeczywisty koszt zakupu" as highlighted result in the UI

- [x] T008 [US1] Remove `highlight` prop from "Zaoszczędzona kwota" `ListRow` in `src/components/realBoughtCosts/components/ResultList.vue`
- [x] T009 [US1] Add new `ListRow` with `highlight` prop after "Zaoszczędzona kwota" displaying "Rzeczywisty koszt zakupu" with value `props.result.realCost` in `src/components/realBoughtCosts/components/ResultList.vue`

**Checkpoint**: UI shows "Rzeczywisty koszt zakupu" as highlighted last row, "Zaoszczędzona kwota" is no longer highlighted

---

## Phase 5: Integration & Polish

**Goal**: Final verification and changelog

- [x] T010 Run all tests: `npx vitest run test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts`
- [x] T011 Update changelog in `src/components/changeLogs/logs.ts` — add entry: "Dodano wyświetlanie rzeczywistego kosztu zakupu w module Rzeczywisty koszt zakupu"

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Interface)**: No dependencies — start immediately
- **Phase 2 (Logic + Tests)**: Requires Phase 1 — BLOCKS UI
- **Phase 3 (Edge Case)**: Requires Phase 2
- **Phase 4 (UI)**: Requires Phase 1 (interface) and Phase 2 (calculator)
- **Phase 5 (Integration)**: Requires all previous

### Within Each Phase

- Tests MUST be written BEFORE implementation (T002-T005 before T006)
- Interface before implementation (T001 before T006)

### Parallel Opportunities

- T002, T003, T004, T005 — all test assertions can be added in parallel (same file, different test cases)
- T008, T009 — UI changes in same file, sequential
- Phase 3 and Phase 4 can run in parallel after Phase 2

---

## Implementation Strategy

### MVP (Phase 1-2)

1. Extend Result interface (T001)
2. Add test assertions for realCost (T002-T005)
3. Implement realCost calculation (T006)
4. **VALIDATE**: Tests pass

### Full Implementation

1. MVP → logic works with tests
2. Edge case → additional test coverage (T007)
3. UI → display realCost in result list (T008-T009)
4. Integration → changelog, final verification (T010-T011)

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- Tests ALWAYS before implementation
- Tests MUST include all output values
- Use `BasicCalculator` as base class (already used)
- UI in Polish language with Quasar components
- Test command: `npx vitest run test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts`
