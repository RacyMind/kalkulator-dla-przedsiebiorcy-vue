---

description: "Task list template for feature implementation"
---

# Tasks: [FEATURE NAME]

**Input**: Documents from `/specs/[###-feature-name]/`
**Required**: plan.md, spec.md

**Tests**: Tests are REQUIRED for calculator logic. Must include all output values.

**Organization**: Tasks grouped by user scenarios.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## Path Conventions

- **Module**: `src/components/[moduleName]/`
- **Logic**: `src/components/[moduleName]/logic/`
- **Tests**: `test/vitest/__tests__/modules/[moduleName]/`
- **Shared**: `src/logic/`
- **Changelog**: `src/components/changeLogs/logs.ts`

<!-- 
  ============================================================================
  IMPORTANT: Tasks below are EXAMPLES.
  The /speckit.tasks command MUST replace them with actual tasks.
  ============================================================================
-->

## Phase 1: Module Structure

**Goal**: Create directory structure for new calculator

- [ ] T001 Create structure `src/components/[moduleName]/`
- [ ] T002 [P] Create `interfaces/` with TypeScript interfaces
- [ ] T003 [P] Create `types/` with types

---

## Phase 2: Calculator Logic (P1) 🎯 MVP

**Goal**: Implement business logic extending BasicCalculator

### Tests (REQUIRED - tests first, then implementation)

- [ ] T004 [US1] Create test file `test/vitest/__tests__/modules/[moduleName]/[Calculator].test.ts`
- [ ] T005 [US1] Add test cases with all output values

### Implementation

- [ ] T006 [US1] Create calculator class in `src/components/[moduleName]/logic/[Calculator].ts`
- [ ] T007 [US1] Extend `BasicCalculator`
- [ ] T008 [US1] Implement main calculation method
- [ ] T009 [US1] Add constants to `src/logic/constants.ts` (if needed)

**Checkpoint**: Tests pass, logic works correctly

---

## Phase 3: Store and State (P2)

**Goal**: Module state management

- [ ] T010 [US2] Create `src/components/[moduleName]/store.ts` (Pinia)
- [ ] T011 [US2] Define form and results state

---

## Phase 4: UI (P3)

**Goal**: User interface with Quasar components

- [ ] T012 [US3] Create main page in `src/components/[moduleName]/pages/`
- [ ] T013 [P] [US3] Create form component in `components/`
- [ ] T014 [P] [US3] Create results component in `components/`
- [ ] T015 [US3] Add validation using `validationRules`
- [ ] T016 [US3] Ensure all UI text is in Polish

---

## Phase 5: Integration

**Goal**: Connect with rest of application

- [ ] T017 Add routing in `src/router/`
- [ ] T018 Add to navigation (if needed)
- [ ] T019 Run tests: `npx vitest run test/vitest/__tests__/modules/[moduleName]/`
- [ ] T020 Update changelog in `src/components/changeLogs/logs.ts` (add entry describing user-visible changes)
- [ ] T021 Verify changelog renders correctly in `src/pages/ChangeLogs.vue`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Structure)**: No dependencies - can start immediately
- **Phase 2 (Logic)**: Requires Phase 1 - BLOCKS UI
- **Phase 3 (Store)**: Can run in parallel with Phase 2
- **Phase 4 (UI)**: Requires Phase 2 and 3
- **Phase 5 (Integration)**: Requires all previous

### Within Each Phase

- Tests MUST be written BEFORE implementation
- Tests MUST include all output values
- Interfaces before implementation
- Logic before UI

### Parallel Opportunities

- Tasks marked [P] can run in parallel
- Interfaces and types can be created in parallel
- UI components can be created in parallel

---

## Implementation Strategy

### MVP (Phase 1-2)

1. Create module structure
2. Write tests with output values
3. Implement calculator logic
4. **VALIDATE**: Tests pass

### Full Implementation

1. MVP → logic works
2. Store → state management
3. UI → user interface
4. Integration → add to application

---

## Notes

- [P] = different files, no dependencies - can run in parallel
- [US?] = assignment to user scenario
- Tests ALWAYS before implementation
- Tests MUST include all output values
- Use `BasicCalculator` as base class
- Validation via `validationRules`
- UI in Polish language with Quasar components
- Commit after each task or logical group
- Test command: `npx vitest run test/vitest/__tests__/modules/[moduleName]/[testName].test.ts`
