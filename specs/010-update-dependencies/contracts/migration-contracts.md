# Migration Contracts: Aktualizacja zależności (Milestone 1)

**Branch**: `010-update-dependencies` | **Date**: 2026-02-06

## Overview

This milestone has no API contracts (no new endpoints or services). Instead, this document defines **migration contracts** — the before/after expectations for each configuration change.

## Contract 1: quasar.config.js → quasar.config.ts

**Before**:
```js
const { configure } = require('quasar/wrappers')
module.exports = configure(function (ctx) { ... })
```

**After**:
```ts
import { defineConfig } from '#q-app/wrappers'
export default defineConfig((ctx) => { ... })
```

**Invariants**:
- All boot files preserved: `['google-analytics', 'admob']`
- Framework config preserved: `lang: 'pl'`, `iconSet: 'material-icons'`, plugins: `['Notify']`
- PWA config preserved: `workboxMode: 'generateSW'`, `skipWaiting`, `clientsClaim`
- Build targets preserved
- Capacitor config preserved

---

## Contract 2: .eslintrc.js → eslint.config.js

**Before**:
```js
module.exports = { root: true, extends: [...], plugins: [...], rules: {...} }
```

**After**:
```js
import { defineConfig } from 'eslint/config'
export default defineConfig([...configs, ...rules])
```

**Invariants**:
- All 30+ custom rules preserved with same severity
- Vue 3 essential rules active
- TypeScript recommended rules active
- Prettier integration active
- Sort imports rule active (or equivalent replacement)
- Environment-based rules preserved (production vs development)

---

## Contract 3: Chart.vue Component

**Before**:
```vue
<Vue3ChartJs :type="type" :data="chart.data" :options="chart.options" />
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
```

**After**:
```vue
<component :is="chartComponent" :data="chartData" :options="chartOptions" />
import { Pie, Bar, Line } from 'vue-chartjs'
```

**Invariants**:
- Same props interface (chartData, chartOptions, type)
- Reactive updates work (chart re-renders on data change)
- All chart types supported: pie, bar, line
- Composables (usePieChart, useBarChart, useLineChart) return compatible data format

---

## Contract 4: date-fns Imports

**Before**:
```ts
import differenceInDays from 'date-fns/differenceInDays'
```

**After**:
```ts
import { differenceInDays } from 'date-fns'
```

**Invariants**:
- All functions maintain same signatures: `format`, `parse`, `isFuture`, `isWeekend`, `getDayOfYear`, `lastDayOfYear`, `subMonths`, `differenceInDays`, `isToday`
- Date formatting output identical

---

## Contract 5: TypeScript Strict Mode

**Before**:
```json
{ "extends": "@quasar/app-vite/tsconfig-preset", "compilerOptions": { "baseUrl": "." } }
```

**After**:
```json
{ "extends": "...", "compilerOptions": { "baseUrl": ".", "strict": true } }
```

**Invariants**:
- All `.ts` and `.vue` files compile without errors
- No runtime behavior changes — strict mode is compile-time only
- All tests pass

---

## Verification Contract (applies to ALL changes)

After each migration step:
1. `npx vitest run` → all tests pass (exit code 0)
2. `quasar dev` → app starts without critical errors
3. No calculation result changes in any of the 29 modules
