# Research: Refaktoryzacja kodu (Milestone 2)

**Branch**: `011-code-refactoring` | **Date**: 2026-02-07

## Research Topics

All NEEDS CLARIFICATION items were resolved during the `/speckit.clarify` session. This document consolidates the research findings and best practices for each major decision.

---

## 1. Pinia Store for Constants — Architecture Pattern

**Decision**: Replace both `src/logic/constants.ts` and `src/composables/constants.ts` with a dedicated Pinia store.

**Rationale**:
- Pinia is already the project's state management solution (v2.3.1)
- A store provides reactive getters (replacing `computed()` in the composable), actions for mutations, and devtools integration
- Adding a new year becomes a single data entry — the store's getters compute everything else
- The `settingStore.dateOfLawRules` dependency is cleanly handled via store-to-store access
- Consumers use `useConstantsStore()` — same ergonomics as the current `useConstants()` composable

**Alternatives considered**:
- **Keep both files, composable as public API**: Lower risk but perpetuates the split-brain architecture. Rejected because it doesn't simplify future year additions.
- **Merge into single file composable**: Viable but misses Pinia devtools, persistence, and testability benefits.

**Best practices**:
- Use `defineStore` with setup syntax (composition API style) for complex computed logic
- Export typed interfaces alongside the store (e.g., `ZusConstants`, `IncomeTaxConstants`, `WageStats`)
- Year-dependent data should be organized as a `Record<AvailableYear, YearParams>` map
- Static constants (APP, AMOUNT_TYPES, TAX_TYPES) as plain `state`
- Dynamic constants (ZUS rates, tax thresholds) as `getters` that read `settingStore.dateOfLawRules`

---

## 2. Chart Colors — CSS Custom Properties + Composable

**Decision**: Remove `COLORS` object from constants, create `useChartColors()` composable reading CSS custom properties.

**Rationale**:
- Single source of truth: colors defined once in `_design-tokens.scss`
- Dark mode support is automatic — `.body--dark` overrides the same CSS variables
- Chart.js requires JS color values, so a composable bridge is needed
- `getComputedStyle(document.documentElement).getPropertyValue('--chart-1')` is the standard approach

**Alternatives considered**:
- **Keep COLORS as JS object, manually sync**: Leads to drift between CSS and JS colors. Rejected.
- **Auto-generate from SCSS at build time**: Adds build complexity (Vite plugin or PostCSS). Overkill for ~20 tokens.

**Best practices**:
- Composable should cache colors and only re-read on theme change (watch `Dark.isActive` from Quasar)
- Return typed object: `{ chart1: string, chart2: string, ..., moduleWork: string, ... }`
- Provide a `refresh()` method for theme transitions
- In tests, mock with static values (no DOM needed)

---

## 3. deepEqual — TypeScript Rewrite

**Decision**: Rewrite `deepEqual.js` to `deepEqual.ts` with TypeScript generics, zero new dependencies.

**Rationale**:
- Current implementation is ~40 lines handling null, undefined, nested objects
- Adding `lodash` for one function increases bundle size unnecessarily
- `structuredClone` clones objects but doesn't compare them — not applicable
- TypeScript generics provide type safety: `deepEqual<T>(a: T, b: T): boolean`

**Alternatives considered**:
- **lodash/isEqual**: Adds dependency (~5KB gzipped). Overkill for one function.
- **Native replacement**: No native deep comparison exists in JS/TS.

**Best practices**:
- Use `unknown` for internal recursion, generic `T` for public API
- Handle all edge cases from original: null vs null, null vs non-null, undefined, nested objects
- Add unit tests specifically for `deepEqual.ts` if not already present

---

## 4. Vue Component Migration — Full Project Scope

**Decision**: Migrate ALL `.vue` files in the project to `<script setup lang="ts">`.

**Rationale**:
- 30 components still use `defineComponent` or Options API
- Consistent codebase reduces cognitive load
- `<script setup>` is the recommended Vue 3 pattern
- Many components already use it (e.g., contractWork) — proven pattern in project

**Migration inventory** (30 files by category):
- Partials (9): Menu, Item, ChooseYear, DatePopup, LineChart, ListRow, SalarySummaryTable, SupportProject, YearlySummaryTable
- App/Pages (2): App.vue, Error404.vue
- Module components (16): cashRegisterLimit (2), changeLogs (1), contact (1), inflation (2), interest (3), investment (2), invoice (3), vatLimit (2)
- Terms (3): PFRONSummary, USSummary, ZUSSummary

**Best practices**:
- Use `defineProps<Props>()` with type-only syntax (no runtime overhead)
- Use `defineEmits<{...}>()` with type-only syntax
- Replace `setup() { return {...} }` with top-level declarations
- Use `defineExpose()` only when parent access is needed
- Reference implementation: `src/components/contractWork/components/Form.vue`

---

## 5. Primary Brand Color — Full Redesign

**Decision**: Redesign primary color from scratch, not tied to current `#d12526`.

**Rationale**:
- Current `#d12526` has ~4.0:1 contrast on white — below WCAG AA (4.5:1)
- Full redesign provides freedom to choose an optimal palette
- Module colors are also inconsistent (e.g., work: `#ed6d13` in JS, `#B45309` in CSS)

**Alternatives considered**:
- **Keep #d12526, fix in M5**: Creates tech debt, Design Tokens would be built on non-compliant base.
- **Darken slightly**: Preserves red identity but limits palette options.

**Best practices for new palette**:
- Use a systematic approach: pick primary hue, derive secondary/accent via color theory
- Verify every token pair against WCAG AA (text ≥ 4.5:1, UI ≥ 3:1)
- Design both light and dark variants simultaneously
- Use tools: WebAIM Contrast Checker, Realtime Colors, Coolors
- Module brand colors should be distinguishable from each other and from primary
- Chart colors (CHART1-8) should be distinguishable for color-blind users (use varied luminance, not just hue)

---

## 6. applyMixins — Keep or Replace

**Research finding**: `applyMixins` is actively used by 5 files:
- `src/logic/taxes/FlatTax.ts`
- `src/logic/taxes/LumpSumTax.ts`
- `src/logic/taxes/TaxScale.ts`
- `src/logic/zus/EmployerZusContribution.ts`
- `src/logic/zus/EntrepreneurZusContribution.ts`

**Decision**: Keep `applyMixins` in `helpers.ts`. Removing it would require refactoring the entire tax/ZUS class hierarchy — out of scope for this milestone.

---

## 7. sumMonthlyResults — Relocation Strategy

**Research finding**: `sumMonthlyResults` is tightly coupled to `MonthlyEmployeeResult` interface (fields like `basisForRentAndPensionContributions`, `pensionContribution`, `healthContribution`). Used by ContractOfEmployment and ContractOfMandate modules.

**Decision**: Move `sumMonthlyResults` and its `MonthlyEmployeeResult` interface from `helpers.ts` to a shared location near the modules that use it — e.g., `src/logic/sumMonthlyResults.ts` or keep in `helpers.ts` but with explicit documentation that it serves only employment-type modules.

**Rationale**: Moving to `src/logic/sumMonthlyResults.ts` provides clear ownership while keeping it importable from both modules. This avoids duplicating it in two places.
