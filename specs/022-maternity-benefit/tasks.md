# Tasks: Kalkulator zasiłku macierzyńskiego

**Input**: Documents from `/specs/022-maternity-benefit/`
**Required**: plan.md, spec.md

**Tests**: Tests are REQUIRED for calculator logic. Must include all output values.

**Organization**: Tasks grouped by user scenarios.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## Path Conventions

- **Module**: `src/components/maternityBenefit/`
- **Logic**: `src/components/maternityBenefit/logic/`
- **Tests**: `test/vitest/__tests__/modules/maternityBenefit/`
- **Shared**: `src/logic/`
- **Changelog**: `src/components/changeLogs/logs.ts`

## User Story Mapping

| US  | Spec Scenario | Priority  | Description                                       |
| --- | ------------- | --------- | ------------------------------------------------- |
| US1 | Scenario 1    | P1 🎯 MVP | UoP — obliczenie zasiłku dla umowy o pracę        |
| US2 | Scenario 2    | P1 🎯 MVP | DG duży ZUS — obliczenie zasiłku dla działalności |
| US3 | Scenario 3    | P1 🎯 MVP | DG ZUS preferencyjny                              |
| US4 | Scenario 4    | P1 🎯 MVP | DG inna podstawa składek                          |
| US5 | Scenario 5    | P2        | Poród mnogi — wymiary urlopów 2–5+ dzieci         |
| US6 | Scenario 6    | P2        | Dodatkowy 9-tygodniowy urlop drugiego rodzica     |

---

## Phase 1: Module Structure

**Goal**: Create directory structure and foundational types/interfaces

- [x] T001 Create directory structure `src/components/maternityBenefit/{components,interfaces,logic,pages,types}`
- [x] T002 [P] Create `EmploymentType` enum in `src/components/maternityBenefit/types/EmploymentType.ts`
- [x] T003 [P] Create `ZusType` enum in `src/components/maternityBenefit/types/ZusType.ts`
- [x] T004 [P] Create `ChildrenCount` type in `src/components/maternityBenefit/types/ChildrenCount.ts`
- [x] T005 [P] Create `InputFields` interface in `src/components/maternityBenefit/interfaces/InputFields.ts`
- [x] T006 [P] Create `LeavePeriodsResult`, `VariantResult`, and `Result` interfaces in `src/components/maternityBenefit/interfaces/Result.ts`
- [x] T007 [P] Create leave periods config (maternity/parental weeks per children count, rates) in `src/components/maternityBenefit/logic/leavePeriodsConfig.ts`

---

## Phase 2: Calculator Logic + Tests (P1) 🎯 MVP

**Goal**: Implement `MaternityBenefitCalculator` with TDD — tests first, then implementation

### Tests (REQUIRED — tests first)

- [x] T008 [US1] Create test file `test/vitest/__tests__/modules/maternityBenefit/MaternityBenefitCalculator.test.ts` with test for UoP: średnia pensja brutto = 5 583,33 zł, 1 dziecko — verify all output values: `benefitBasis`, `dailyRate`, `leavePeriods`, `variantA` (maternityDailyRate, maternityLeaveAmount, parentalDailyRate, parentalLeaveAmount, totalAmount), `variantB` (all fields), `secondParentDailyRate`, `secondParentDays`, `secondParentBenefit`
- [x] T009 [US2] Add test case for DG duży ZUS: podstawa = 5 652,00 zł (2026), 1 dziecko — verify all output values
- [x] T010 [US3] Add test case for DG ZUS preferencyjny: podstawa = 1 441,80 zł (2026), 1 dziecko — verify all output values
- [x] T011 [US4] Add test case for DG inna podstawa: podstawa = 10 000,00 zł, 1 dziecko — verify all output values

### Implementation

- [x] T012 [US1] Create `MaternityBenefitCalculator` class extending `BasicCalculator<InputFields, Result>` implementing `Calculator<InputFields, Result>` in `src/components/maternityBenefit/logic/MaternityBenefitCalculator.ts`
- [x] T013 [US1] Implement `calculate()` method: compute `benefitBasis` (averageBasis × (1 - socialContributionRate)), `dailyRate` (benefitBasis / 30), leave periods from config, variantA (81,5%), variantB (100%/70%), secondParentBenefit (70% × 63 days). Use `helpers.round(value, 2)` for all amounts. Read social contribution rate dynamically from `useConstantsStore()` (pension + disability + sick)

**Checkpoint**: Run `npx vitest run test/vitest/__tests__/modules/maternityBenefit/MaternityBenefitCalculator.test.ts` — all US1–US4 tests pass

---

## Phase 3: Store

**Goal**: Pinia store for state management (pattern from `contractWork/store.ts`)

- [x] T014 [US1] Create Pinia store in `src/components/maternityBenefit/store.ts` with `inputFields` state and `result` computed getter calling `MaternityBenefitCalculator`

---

## Phase 4: UI — Form & Results (P1) 🎯 MVP

**Goal**: User interface with Quasar components, Polish language, two-column result display

- [x] T015 [US1] Create `Form.vue` in `src/components/maternityBenefit/components/Form.vue`:
  - `q-select` for `employmentType` (Umowa o pracę / Działalność gospodarcza)
  - `q-select` for `zusType` (Duży ZUS / ZUS preferencyjny / Inny) — visible only when `selfEmployment`
  - `q-input` for `averageBasis` (auto-filled and disabled for big/preferential ZUS, editable for UoP and custom)
  - `q-select` for `childrenCount` (dropdown: 1, 2, 3, 4, 5+)
  - Validation with `validationRules.requiredAmount` + custom rule for max basis (250% × `wageStats.projectedAverageWage()`)
  - `useLocalStorage` for field persistence
  - Use `FormSection`, `SubmitButton`, `LawRuleDate` shared components
- [x] T016 [US1] Create `ResultList.vue` in `src/components/maternityBenefit/components/ResultList.vue`:
  - Display `benefitBasis` and `dailyRate` as header info
  - Two columns/sections side-by-side: Wariant A (81,5%) | Wariant B (100%/70%)
  - Each column shows: urlop macierzyński (weeks, daily rate, amount), urlop rodzicielski (weeks, daily rate, amount), łącznie
  - Section for second parent benefit (9 weeks, 70%, amount)
  - Use Quasar components (`q-card`, `q-list`, `q-item`)
  - All text in Polish
- [x] T017 [US1] Create page `MaternityBenefitPage.vue` in `src/components/maternityBenefit/pages/MaternityBenefitPage.vue` composing Form + ResultList

---

## Phase 5: Tests — Multiple Children (P2)

**Goal**: Add test cases for multiple births and verify leave period calculations

- [x] T018 [US5] Add test cases for multiple children in `test/vitest/__tests__/modules/maternityBenefit/MaternityBenefitCalculator.test.ts`:
  - 2 dzieci: macierzyński = 31 tyg. (217 dni), rodzicielski = 34 tyg. (238 dni), łącznie = 65 tyg.
  - 3 dzieci: macierzyński = 33 tyg. (231 dni), rodzicielski = 34 tyg. (238 dni), łącznie = 67 tyg.
  - 4 dzieci: macierzyński = 35 tyg. (245 dni), rodzicielski = 34 tyg. (238 dni), łącznie = 69 tyg.
  - 5+ dzieci: macierzyński = 37 tyg. (259 dni), rodzicielski = 34 tyg. (238 dni), łącznie = 71 tyg.
  - Use fixed basis (e.g., 5 583,33 zł UoP) and verify all output values including amounts for both variants

**Checkpoint**: Run `npx vitest run test/vitest/__tests__/modules/maternityBenefit/MaternityBenefitCalculator.test.ts` — all US5 tests pass

---

## Phase 6: Tests — Second Parent Benefit (P2)

**Goal**: Verify second parent benefit calculation

- [x] T019 [US6] Add test case for second parent benefit in `test/vitest/__tests__/modules/maternityBenefit/MaternityBenefitCalculator.test.ts`: verify `secondParentDailyRate` = dailyRate × 0.7, `secondParentDays` = 63, `secondParentBenefit` = secondParentDailyRate × 63 — use basis 4 817,86 zł (already computed in US1 test)

**Checkpoint**: Run `npx vitest run test/vitest/__tests__/modules/maternityBenefit/MaternityBenefitCalculator.test.ts` — all tests pass

---

## Phase 7: Integration & Polish

**Goal**: Connect module to application, add routing, changelog

- [x] T020 Add route for maternity benefit calculator in `src/router/` (follow existing module routing pattern)
- [x] T021 Add module to navigation menu (follow existing pattern for other calculators)
- [x] T022 Update changelog in `src/components/changeLogs/logs.ts` — add entry describing new maternity benefit calculator module
- [x] T023 Run full test suite: `npx vitest run test/vitest/__tests__/modules/maternityBenefit/MaternityBenefitCalculator.test.ts` — verify all tests pass
- [x] T024 Verify UI renders correctly on mobile and desktop viewports

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Structure) ─────────────────────────────────────┐
    │                                                     │
    ▼                                                     │
Phase 2 (Calculator + Tests US1–US4) ◄────────────────────┘
    │
    ├──► Phase 3 (Store) ──────────┐
    │                              │
    │                              ▼
    ├──► Phase 4 (UI) ◄───── Phase 3
    │
    ├──► Phase 5 (Tests US5) [P] ──┐
    │                              │
    ├──► Phase 6 (Tests US6) [P] ──┤
    │                              │
    ▼                              ▼
Phase 7 (Integration) ◄─── All previous phases
```

### Within Each Phase

- Tests MUST be written BEFORE implementation (Phase 2)
- Interfaces and types before calculator logic
- Calculator logic before store
- Store before UI

### Parallel Opportunities

- T002, T003, T004, T005, T006, T007 — all types/interfaces/config can be created in parallel
- T008–T011 — test cases can be written in parallel (different describe blocks)
- Phase 5 and Phase 6 — can run in parallel with Phase 4 (different files/concerns)

---

## Implementation Strategy

### MVP (Phase 1–4): UoP + DG all variants

1. Create module structure + types + interfaces
2. Write tests with all output values (US1–US4)
3. Implement `MaternityBenefitCalculator`
4. **VALIDATE**: Tests pass
5. Create store
6. Create UI (Form + ResultList + Page)
7. **VALIDATE**: Manual test in browser

### Full Implementation (Phase 5–7)

1. Add multiple children test cases (US5)
2. Add second parent benefit test (US6)
3. **VALIDATE**: All tests pass
4. Add routing + navigation + changelog
5. **VALIDATE**: End-to-end in browser

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- Tests ALWAYS before implementation
- Tests MUST include all output values
- Tests MUST use static year 2026 (not `new Date().getFullYear()`)
- Use `BasicCalculator` as base class
- Validation via `validationRules`
- UI in Polish language with Quasar components
- Social contribution rate (13,71%) calculated dynamically from `constantsStore`
- ZUS basis values from `constantsStore` (not hardcoded)
- Leave period constants in module-level config (not `constantsStore`)
- Test command: `npx vitest run test/vitest/__tests__/modules/maternityBenefit/MaternityBenefitCalculator.test.ts`
