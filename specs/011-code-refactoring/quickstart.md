# Quickstart: Refaktoryzacja kodu (Milestone 2)

**Branch**: `011-code-refactoring` | **Date**: 2026-02-07

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed: `npm install`
- All tests passing: `npx vitest run` (410+ tests)
- On branch `011-code-refactoring`

## Phase Order

Execute phases sequentially. Run `npx vitest run` after each phase to verify no regressions.

### Phase 1: JS→TS Migration

1. Rename and type `src/use/currencyFormat.js` → `src/composables/currencyFormat.ts`
2. Rename and type `src/use/deepEqual.js` → `src/composables/deepEqual.ts`
3. Rename and type `src/logic/employeeContributions.js` → `.ts`
4. Rename and type `src/logic/employerContributions.js` → `.ts`
5. Rename and type `src/logic/jointAccounting.js` → `.ts` (remove `setYear()`)
6. Update imports across the project
7. Verify: `npx vitest run`

### Phase 2: Vue Component Migration

Migrate 30 `.vue` files to `<script setup lang="ts">`. Work in batches:
1. `src/components/partials/` (9 files)
2. `src/App.vue` + `src/pages/Error404.vue` (2 files)
3. Module components: cashRegisterLimit, changeLogs, contact, vatLimit (7 files)
4. Module components: inflation, interest, investment, invoice (10 files)
5. Module components: terms (3 files)

Reference: `src/components/contractWork/components/Form.vue`

Verify after each batch: `npx vitest run`

### Phase 3: Constants Store

1. Create `src/stores/constantsStore.ts` (see data-model.md for interfaces)
2. Migrate consumers one module at a time
3. Delete old files: `src/logic/constants.ts`, `src/composables/constants.ts`
4. Verify: `npx vitest run`

### Phase 4: Code Deduplication

1. Create `src/logic/findGrossAmountUsingNetAmount.ts` (generic)
2. Create `src/composables/useTaxThresholdNotification.ts`
3. Create `src/composables/useScrollToResults.ts`
4. Move `sumMonthlyResults` to `src/logic/sumMonthlyResults.ts`
5. Update all consumers
6. Verify: `npx vitest run`

### Phase 5: Code Structure Cleanup

1. Move remaining files from `src/use/` to `src/composables/`
2. Update imports
3. Delete `src/use/`
4. Verify: `npx vitest run`

### Phase 6: Design Tokens

1. Design new WCAG AA compliant color palette
2. Create `src/css/_design-tokens.scss`
3. Update `src/css/quasar.variables.scss`
4. Update 7 `src/css/components/_*.scss` files
5. Create `src/composables/useChartColors.ts`
6. Remove COLORS from constants store
7. Update chart composables
8. Verify: `npx vitest run` + visual check in browser

## Verification Commands

```bash
# Run all tests
npx vitest run

# Check no JS files remain in logic/use
Get-ChildItem -Path src/logic,src/use -Recurse -Include *.js

# Check no defineComponent in Vue files
Select-String -Path src/**/*.vue -Pattern "defineComponent" -Recurse

# Check no src/use/ imports remain
Select-String -Path src -Pattern "from.*src/use/" -Recurse -Include *.ts,*.vue
```

## Key Decisions (from Clarifications)

| Decision | Choice |
|----------|--------|
| Constants architecture | Dedicated Pinia store |
| COLORS object | Replace with `useChartColors()` composable |
| deepEqual.js | TS rewrite with generics, no new deps |
| Component migration scope | All components in project (30 files) |
| Primary brand color | Full redesign (not tied to #d12526) |
