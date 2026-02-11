# AGENTS.md — Codex Agent Guide

## Project Overview

**Kalkulator finansowy** is a Polish-language financial calculator web app (PWA + Android via Capacitor). It computes salaries, taxes, ZUS contributions, investments, bonds, and more under current Polish tax law. The app contains **29 calculator modules**, each self-contained with its own logic, store, interfaces, and UI components.

- **Live**: https://kalkulatorfinansowy.app
- **Android**: Google Play (`racyMind.kalkulator`)

## Tech Stack

| Layer      | Technology                                 |
| ---------- | ------------------------------------------ |
| Framework  | Vue 3.5+ with `<script setup lang="ts">`   |
| UI library | Quasar 2.18+ (components, icons, layout)   |
| State      | Pinia 2.3+                                 |
| Language   | TypeScript 5.9+ (strict mode)              |
| Bundler    | Vite (via `@quasar/app-vite`)              |
| Tests      | Vitest 4.x, `@vue/test-utils`, happy-dom   |
| Charts     | Chart.js + vue-chartjs                     |
| Styling    | SCSS with Quasar variables + design tokens |
| Mobile     | Capacitor (Android)                        |
| CI         | GitHub Actions (lint → test → build)       |

## Repository Layout

```
src/
├── api/                  # External API clients (e.g. NBP)
├── assets/               # Static images, SVGs
├── boot/                 # Quasar boot files (analytics, a11y, admob)
├── components/
│   ├── <module>/         # Each calculator module (see Module Architecture)
│   └── partials/         # Shared UI components (form/, resultList/, statistics/, etc.)
├── composables/          # Vue composables (currencyFormat, lawRuleDate, charts, etc.)
├── css/                  # Global SCSS (_design-tokens.scss, app.scss, quasar.variables.scss)
├── directives/           # Custom Vue directives
├── layouts/              # App layout (MainLayout.vue)
├── logic/                # Shared business logic (BasicCalculator, helpers, taxes/, zus/)
│   ├── interfaces/       # Shared result interfaces (EmployeeResult, EmployerResult, etc.)
│   ├── taxes/            # Tax calculation classes (TaxScale, FlatTax, etc.)
│   └── zus/              # ZUS contribution calculators
├── pages/                # Top-level pages (Index.vue, Error404.vue)
├── router/               # Vue Router routes (routes.ts)
├── services/             # External services (admob/, adsense/)
├── stores/               # Pinia stores (constantsStore, settingStore, etc.)
│   └── constants/        # Year-dependent parameters (types.ts, yearParams.ts)
└── types/                # Shared type aliases (AmountType, AvailableYear, IncomeTaxType)

test/vitest/__tests__/
├── modules/<moduleName>/ # Calculator unit tests per module
├── logic/                # Shared logic tests
├── composables/          # Composable tests
└── services/             # Service tests
```

## Module Architecture

Every calculator module lives in `src/components/<moduleName>/` and follows a consistent structure. **Use `components/contractWork/` as the canonical reference.**

```
src/components/<moduleName>/
├── components/           # Vue components (Form.vue, ResultList.vue, Statistics.vue)
├── interfaces/           # TypeScript interfaces (InputFields.ts, Result.ts)
├── logic/                # Calculator class(es) extending BasicCalculator
├── pages/                # Page component (Index.vue) — registered in router/routes.ts
├── types/                # Module-specific type aliases and enums
└── store.ts              # Pinia store with inputFields state and computed result getter
```

### Key Patterns

**Calculator class** — Every calculator extends `BasicCalculator<InputFields, Result>` and implements `Calculator<InputFields, Result>`:

```typescript
import { BasicCalculator } from 'src/logic/BasicCalculator'
import { Calculator } from 'src/logic/interfaces/Calculator'

export class MyCalculator
  extends BasicCalculator<InputFields, Result>
  implements Calculator<InputFields, Result>
{
  public calculate(): this {
    const input = this.getInputData()
    // ... computation ...
    this.result = {
      /* ... */
    }
    return this
  }
}
```

The `BasicCalculator` provides:

- `setInputData(input)` — stores input, returns `this` for chaining
- `getInputData()` — returns input or throws if undefined
- `getResult()` — returns result or throws if undefined

Usage chain: `new MyCalculator().setInputData(input).calculate().getResult()`

**Pinia store** — Each module store holds `inputFields` in state and computes `result` via a getter:

```typescript
export const useMyStore = defineStore('myStore', {
  state: () => ({ inputFields: undefined }),
  getters: {
    result(state) {
      if (state.inputFields === undefined) return undefined
      return new MyCalculator()
        .setInputData(state.inputFields)
        .calculate()
        .getResult()
    },
  },
})
```

Always include HMR support at the bottom:

```typescript
if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMyStore, import.meta.hot))
}
```

**Page component (Index.vue)** — Uses `ModulePageLayout` with `#form` and `#results` slots:

```vue
<template>
  <ModulePageLayout>
    <template #form>
      <SectionHeader :level="2">Wypełnij formularz</SectionHeader>
      <Form @submit="handleSubmit" />
    </template>
    <template #results>
      <SectionHeader :level="2" ref="scrollTarget">Podsumowanie</SectionHeader>
      <template v-if="store.result">
        <q-list><ResultList :result="store.result" /></q-list>
        <Statistics :result="store.result" />
      </template>
      <div v-else class="q-pa-md">Brak danych</div>
    </template>
  </ModulePageLayout>
</template>
```

**Form component** — Uses `q-form` with Quasar components, `useLocalStorage` for field persistence, `validationRules` from `src/logic/validationRules`, and emits `submit`.

**ResultList component** — Uses `ListRow` from `components/partials/resultList/ListRow.vue` with `#name` and `#value` slots. Currency formatting via `pln()` from `src/composables/currencyFormat`.

**Statistics component** — Uses `PieChart` / `LineChart` from `components/partials/statistics/` with data from composables (`usePieChart`, `useBarChart`, `useLineChart`).

## Constants & Year-Dependent Parameters

- `src/stores/constantsStore.ts` — Central store for all financial constants (tax rates, ZUS rates, wage stats, etc.)
- `src/stores/constants/yearParams.ts` — Year-specific parameter overrides (2021–2026), each year extends the previous
- `src/stores/constants/types.ts` — All constant-related TypeScript types and enums
- `src/stores/settingStore.ts` — Holds `dateOfLawRules` (selected year) and `themeMode`

The `dateOfLawRules` in `settingStore` drives which year's constants are active. When it changes, module stores reset via `lawRuleDateWatcher(store)`.

Available years: `2021 | 2022 | 2023 | 2024 | 2025 | 2026`

## Coding Conventions

### General

- **Minimal comments** — Only add comments for complex logic or edge cases. Do not comment every line.
- **Polish language in UI** — All labels, messages, and user-facing text must be in Polish.
- **Polish diacritics in UI** — Always use Polish diacritics in user-facing text (`ą ć ę ł ń ó ś ź ż`), never ASCII replacements.
- **Single type file per module** — Keep all types for a module in one file (e.g., `types/index.ts` or `types/SomeType.ts`), not split across many files.
- **camelCase** for variables and constants — Do not use UPPER_SNAKE_CASE for JS/TS constants (the legacy `yearParams.ts` is an exception, not a pattern to follow).
- **No semicolons** — ESLint enforces `semi: ['error', 'never']`.
- **Single quotes** — ESLint enforces `quotes: ['warn', 'single']`.
- **Trailing commas** on multiline — `comma-dangle: ['error', 'always-multiline']`.
- **Enums for state values** — Never use static strings like `'loading'`, `'active'`, `'error'` etc. for state. Always define an enum in the module's `types/` directory and use it instead. Example:
  ```typescript
  // types/Status.ts
  export enum Status {
    Idle = 'idle',
    Loading = 'loading',
    Active = 'active',
    Error = 'error',
  }
  ```

### TypeScript

- Always use the `BasicCalculator` class for calculator logic.
- Use `interfaces/` directory for `InputFields` and `Result` types within each module.
- Use `types/` directory for type aliases and enums within each module.
- Shared types go in `src/types/`.
- Import paths use Vite aliases: `src/`, `components/`, `stores/`, `composables/`, `logic/`, etc. (not relative `../` paths).

### Vue Components

- Use `<script setup lang="ts">` exclusively.
- Use Quasar components (`q-input`, `q-select`, `q-toggle`, `q-form`, `q-card`, `q-list`, etc.).
- Use shared partials from `components/partials/` (FormSection, SubmitButton, AmountTypeSelect, ListRow, etc.).
- Form validation rules come from `src/logic/validationRules` — never define inline validation.
- Form field persistence uses `useLocalStorage` from `@vueuse/core` with keys like `'<moduleName>/form/<fieldName>'`.
- PascalCase for component names in templates (enforced by ESLint).

### Routing

- Routes are defined in `src/router/routes.ts` with lazy-loaded components.
- URL paths use Polish kebab-case (e.g., `/umowa-o-dzielo`, `/zasilek-chorobowy`).

## Testing

### Running Tests

```bash
# Run all tests
npx vitest run

# Run a specific module's test
npx vitest run test/vitest/__tests__/modules/<moduleName>/<testName>.test.ts
```

### Test Structure

Tests live in `test/vitest/__tests__/modules/<moduleName>/`. The setup file (`test/vitest/setup-file.ts`) initializes Pinia before each test.

### Test Conventions

- **Use a static year** (e.g., 2026) — never use `new Date().getFullYear()` in tests.
- **Set the law rules date** in `beforeEach`:
  ```typescript
  beforeEach(() => {
    const settingStore = useSettingStore()
    settingStore.dateOfLawRules = new Date(2026, 0, 1)
  })
  ```
- **All output values must be asserted** — every field of the Result interface must appear in expectations.
- **Use numbers for comparison** — `expect(result.netAmount).toBe(904)`, not string comparisons.
- **Test invalid data** — verify that `getResult()` and `calculate().getResult()` throw when called without input.
- **Test pattern**:

  ```typescript
  import { createPinia, setActivePinia } from 'pinia'
  setActivePinia(createPinia())

  const getResult = (input: InputFields): Result => {
    return new MyCalculator().setInputData(input).calculate().getResult()
  }

  describe('Calculator for MyModule on 1.01.2026', () => {
    beforeEach(() => {
      const settingStore = useSettingStore()
      settingStore.dateOfLawRules = new Date(2026, 0, 1)
    })

    it('The invalid data', () => {
      expect(() => new MyCalculator().getResult()).toThrowError('undefined')
      expect(() => new MyCalculator().calculate().getResult()).toThrowError(
        'undefined',
      )
    })

    it('basic scenario', () => {
      const result = getResult(defaultInput)
      expect(result.field1).toBe(123)
      expect(result.field2).toBe(456)
      // ... assert ALL result fields
    })
  })
  ```

### Test Environment

- **happy-dom** (not jsdom)
- Vitest config: `vitest.config.ts` with the same path aliases as the main app
- Quasar plugin loaded in test via `@quasar/vite-plugin`

## Environment Variables

API keys must be in `.env` (never hardcoded). Quasar/Vite requires `VITE_` prefix:

```
VITE_GTM_ID=
VITE_ADSENSE_PUBLISHER_ID=
VITE_ADMOB_BANNER_ID=
VITE_ADSENSE_AD_SLOT=
VITE_ADSENSE_LAYOUT_KEY=
```

## CI Pipeline

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main` and `develop`:

1. **Lint** — `npm run lint`
2. **Test** — `npx vitest run`
3. **Build** — `npx quasar build -m pwa` (only after lint + test pass)

Node 20, `npm ci --legacy-peer-deps`.

## Git Conventions

- **Conventional Commits** enforced via commitlint (`@commitlint/config-conventional`)
- **Husky hooks**: `pre-commit` (lint-staged), `commit-msg` (commitlint), `pre-push`
- **lint-staged**: ESLint + Prettier on `*.ts`, `*.vue`; Prettier on `*.scss`, `*.md`, `*.json`

## Key Shared Utilities

| Utility                | Location                                | Purpose                                                  |
| ---------------------- | --------------------------------------- | -------------------------------------------------------- |
| `BasicCalculator`      | `src/logic/BasicCalculator.ts`          | Abstract base for all calculators                        |
| `Calculator` interface | `src/logic/interfaces/Calculator.ts`    | Contract: `calculate()`, `setInputData()`, `getResult()` |
| `helpers`              | `src/logic/helpers.ts`                  | `round()`, `sum()`, `formatNumber()`, `getDefaultYear()` |
| `validationRules`      | `src/logic/validationRules.ts`          | Reusable form validation rules                           |
| `pln()`                | `src/composables/currencyFormat.ts`     | Format number as PLN currency                            |
| `useLocalStorage`      | `@vueuse/core`                          | Persistent form field values                             |
| `lawRuleDateWatcher`   | `src/composables/lawRuleDate.ts`        | Reset store when law rules year changes                  |
| `useScrollToResults`   | `src/composables/useScrollToResults.ts` | Scroll to results after form submit                      |
| `useConstantsStore`    | `src/stores/constantsStore.ts`          | All financial constants and year-dependent params        |
| `useSettingStore`      | `src/stores/settingStore.ts`            | App settings (selected year, theme)                      |

## Shared UI Components (Partials)

| Component          | Path                                 | Usage                                                   |
| ------------------ | ------------------------------------ | ------------------------------------------------------- |
| `ModulePageLayout` | `partials/ModulePageLayout.vue`      | Two-column layout with `#form` and `#results` slots     |
| `FormSection`      | `partials/form/FormSection.vue`      | Titled section wrapper for form groups                  |
| `SubmitButton`     | `partials/form/SubmitButton.vue`     | Standard submit button                                  |
| `AmountTypeSelect` | `partials/form/AmountTypeSelect.vue` | Gross/Net selector                                      |
| `LawRuleDate`      | `partials/LawRuleDate.vue`           | Year selector for law rules                             |
| `SectionHeader`    | `partials/SectionHeader.vue`         | Section heading with level prop                         |
| `ListRow`          | `partials/resultList/ListRow.vue`    | Result row with `#name`, `#value`, `#description` slots |
| `PieChart`         | `partials/statistics/PieChart.vue`   | Pie chart wrapper                                       |
| `Advert`           | `partials/Advert.vue`                | Ad placement component                                  |

## Adding a New Calculator Module

1. Create `src/components/<moduleName>/` with subdirectories: `components/`, `interfaces/`, `logic/`, `pages/`, `types/`
2. Define `interfaces/InputFields.ts` and `interfaces/Result.ts`
3. Create calculator class in `logic/` extending `BasicCalculator` and implementing `Calculator`
4. Create `store.ts` with Pinia store (state: `inputFields`, getter: `result`)
5. Build `components/Form.vue` using Quasar components and `validationRules`
6. Build `components/ResultList.vue` using `ListRow` partial
7. Build `components/Statistics.vue` using chart composables (optional)
8. Create `pages/Index.vue` using `ModulePageLayout`
9. Register route in `src/router/routes.ts` (lazy import, Polish kebab-case path)
10. Write tests in `test/vitest/__tests__/modules/<moduleName>/` — assert all result fields, use static year 2026
