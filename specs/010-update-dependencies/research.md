# Research: Aktualizacja zależności (Milestone 1)

**Branch**: `010-update-dependencies` | **Date**: 2026-02-06

## 1. @quasar/app-vite v1 → v2

**Decision**: Migrate to v2 with config file conversion JS→TS

**Rationale**: v2 is the current supported version. v1 will stop receiving updates. The migration is well-documented by the Quasar team.

**Key Changes**:
- `quasar.config.js` → `quasar.config.ts` (ESM + TypeScript)
- `const { configure } = require('quasar/wrappers')` → `import { defineConfig } from '#q-app/wrappers'`
- `module.exports = configure(function (ctx) { ... })` → `export default defineConfig((ctx) => { ... })`
- Build target config format may change
- `eslint` section in quasar config may need adjustments for flat config
- PWA `workboxMode` and `workboxOptions` API may change
- Capacitor config structure may change

**Current Config Analysis** (`quasar.config.js`):
- Boot files: `google-analytics`, `admob`
- Framework plugins: `Notify`
- PWA mode: `generateSW` with `skipWaiting` + `clientsClaim`
- Capacitor: `hideSplashscreen: true`
- Build target: `es2019`, multiple browsers
- Uses `publicPath: ctx.dev ? '' : 'app'`

**Migration Steps**:
1. Rename `quasar.config.js` → `quasar.config.ts`
2. Convert CJS to ESM syntax
3. Update API calls per v2 migration guide
4. Verify all sections (boot, build, pwa, capacitor, eslint)

**Alternatives Considered**: Stay on v1 — rejected (EOL, blocks future updates)

---

## 2. ESLint v8 → v9 (Flat Config)

**Decision**: Migrate to ESLint v9 with flat config (`eslint.config.js`)

**Rationale**: ESLint v8 is deprecated. Flat config is the only supported format in v9.

**Current Config Analysis** (`.eslintrc.js`):
- Parser: `@typescript-eslint/parser` via `parserOptions`
- Extends: `plugin:@typescript-eslint/recommended`, `plugin:vue/vue3-essential`, `prettier`
- Plugins: `sort-imports-es6-autofix`, `sort-keys-fix`, `@typescript-eslint`, `vue`
- 30+ custom rules configured
- Environment-based rules (`NODE_ENV` for console, debugger, unused vars)

**Key Changes**:
- `.eslintrc.js` → `eslint.config.js` (ESM flat config array)
- `extends` → import configs and spread in flat array
- `plugins` → import and register explicitly
- `env` → `languageOptions.globals`
- `parserOptions.parser` → `languageOptions.parser`
- `@typescript-eslint/eslint-plugin` v5 → v8 (new API, renamed rules)
- `eslint-plugin-vue` v8 → latest (supports flat config)
- `eslint-config-prettier` → check flat config compatibility
- `sort-imports-es6-autofix` and `sort-keys-fix` — verify flat config support, may need replacement

**Plugin Compatibility**:
- `sort-imports-es6-autofix` — may not support flat config; evaluate `eslint-plugin-import` or built-in sort
- `sort-keys-fix` — may not support flat config; evaluate alternatives

**Migration Steps**:
1. Update `eslint` to v9, `@typescript-eslint/*` to v8, `eslint-plugin-vue` to latest
2. Create `eslint.config.js` from scratch based on current rules
3. Migrate each extends/plugin to flat config equivalent
4. Migrate custom rules (preserve all 30+ rules)
5. Remove `.eslintrc.js`
6. Update `quasar.config.ts` eslint section if needed
7. Verify: `npx eslint .`

**Alternatives Considered**: ESLint v8 with `@eslint/eslintrc` compat — rejected (temporary, still deprecated)

---

## 3. TypeScript 4.5 → 5.x + strict mode

**Decision**: Upgrade to TS 5.x and enable `strict: true`

**Rationale**: TS 5 has better performance, new features. Strict mode catches bugs early (user decision from clarification).

**Current Config** (`tsconfig.json`):
- Extends `@quasar/app-vite/tsconfig-preset` — strict settings come from the preset
- Only custom option: `baseUrl: "."`
- After app-vite v2 migration, the preset path may change

**Key Impact**:
- The Quasar tsconfig preset for app-vite v2 may already include stricter defaults
- Adding `strict: true` enables: `strictNullChecks`, `strictFunctionTypes`, `strictBindCallApply`, `strictPropertyInitialization`, `noImplicitAny`, `noImplicitThis`, `alwaysStrict`
- Scope: All `.ts` and `.vue` files under `src/` — potentially hundreds of type errors
- Most common fixes: add `| undefined` to optional values, add explicit types to function params, fix `any` usage

**Migration Steps**:
1. First upgrade TS to 5.x (without strict)
2. Verify build and tests pass
3. Enable `strict: true` in `tsconfig.json`
4. Fix type errors iteratively (by module/folder)
5. Run full test suite

**Alternatives Considered**: Incremental strict flags — rejected by user (full strict preferred)

---

## 4. date-fns v2 → v4

**Decision**: Upgrade to v4 with import path changes

**Rationale**: v4 is ESM-only with cleaner API. v2 is no longer maintained.

**Impact Analysis** (12 imports across 11 files):
- Functions used: `format`, `parse`, `isFuture`, `isWeekend`, `getDayOfYear`, `lastDayOfYear`, `subMonths`, `differenceInDays`, `isToday`
- One deep import: `date-fns/differenceInDays` (in `interest/Form.vue`) — must change to named import from `date-fns`
- All other imports use named imports from `date-fns` — should work with v4

**Key Changes v2→v4**:
- ESM-only (no CJS) — already using ESM imports, so minimal impact
- Deep imports (`date-fns/xxx`) removed — change to `import { xxx } from 'date-fns'`
- `parse()` signature unchanged (string, formatString, referenceDate)
- `format()` signature unchanged (date, formatString)
- Most functions maintain same API

**Files to Update**:
1. `src/components/interest/Form.vue` — change `import differenceInDays from 'date-fns/differenceInDays'` to `import { differenceInDays } from 'date-fns'`
2. All other 10 files — verify compatibility (likely no changes needed)

**Alternatives Considered**: Stay on v2 — rejected (unmaintained, security risk)

---

## 5. Chart Library: @j-t-mcc/vue3-chartjs → vue-chartjs + chart.js v4

**Decision**: Replace with `vue-chartjs` + `chart.js` v4

**Rationale**: `@j-t-mcc/vue3-chartjs` is unmaintained. `vue-chartjs` is the official Vue wrapper for Chart.js.

**Current Architecture**:
- `Chart.vue` — wrapper component using `Vue3ChartJs`, handles reactive updates via `watch` + `chartRef.value.update()`
- `usePieChart.ts` — returns data config (labels, datasets with colors)
- `useBarChart.ts` — returns data config (labels, datasets with label and colors)
- `useLineChart.ts` — returns data config (labels, datasets with line styling)
- Data format is standard Chart.js format — composables return `{ labels, datasets }` objects

**vue-chartjs Migration**:
- Import specific chart components: `import { Pie, Bar, Line } from 'vue-chartjs'`
- Register Chart.js components: `import { Chart, registerables } from 'chart.js'; Chart.register(...registerables)`
- `Chart.vue` becomes simpler — `vue-chartjs` handles reactivity natively (no manual `update()` call)
- Composables (`usePieChart`, `useBarChart`, `useLineChart`) need minimal changes — data format is identical
- Props: `vue-chartjs` components accept `data` and `options` props directly

**Migration Steps**:
1. `npm uninstall @j-t-mcc/vue3-chartjs`
2. `npm install vue-chartjs chart.js`
3. Rewrite `Chart.vue` to use `vue-chartjs` components
4. Register Chart.js components globally or per-component
5. Update composables if needed (likely minimal)
6. Verify all chart-using modules visually

**Alternatives Considered**: `@j-t-mcc/vue3-chartjs` fork — rejected (no community support)

---

## 6. Workbox v6 → v7

**Decision**: Upgrade to workbox v7

**Rationale**: v7 is current, v6 no longer receives patches.

**Current Setup**:
- PWA uses `workboxMode: 'generateSW'` (auto-generated service worker)
- Options: `skipWaiting: true`, `clientsClaim: true`
- `register-service-worker.ts` uses `register-service-worker` package (standard Quasar PWA setup)
- No custom service worker code (all commented out in register file)

**Key Changes v6→v7**:
- API mostly compatible for `generateSW` mode
- Config options in `workboxOptions` may have minor renames
- `register-service-worker` package may need update for compatibility
- Since using `generateSW` (not `injectManifest`), migration is minimal — Quasar handles workbox config internally

**Impact**: Low — `@quasar/app-vite` v2 will handle workbox integration. Manual workbox packages in `devDependencies` may become unnecessary if app-vite v2 bundles them.

**Migration Steps**:
1. Update all `workbox-*` packages to v7
2. Check if `@quasar/app-vite` v2 bundles workbox (may remove need for explicit deps)
3. Verify PWA build and offline mode

**Alternatives Considered**: None — straightforward upgrade

---

## 7. Quasar Testing Extensions

**Decision**: Update both extensions alongside app-vite v2

**Rationale**: Testing extensions are tightly coupled to app-vite version. Required for test runner setup.

**Current Packages**:
- `@quasar/quasar-app-extension-testing` ^2.2.0
- `@quasar/quasar-app-extension-testing-unit-vitest` ^1.2.4

**Key Points**:
- These extensions configure vitest integration with Quasar
- `vitest.config.ts` imports `@quasar/vite-plugin` — may change path in v2
- The testing extension may need reinstallation via `quasar ext add` after app-vite v2
- `@vitejs/plugin-vue` import in vitest.config.ts should remain compatible

**Migration Steps**:
1. After app-vite v2 migration, check if testing extensions need update
2. Run `quasar ext add @quasar/testing-unit-vitest` if needed
3. Verify `vitest.config.ts` still works
4. Run full test suite

---

## 8. Remaining Dependencies

### Prettier v2 → v3
- **Change**: Trailing commas default to `all` (was `es5`)
- **Impact**: Formatting changes across codebase — run `prettier --write` once
- **Risk**: Low — cosmetic changes only

### sass (latest)
- **Decision**: Update, accept deprecation warnings (deferred to Milestone 2)
- **Impact**: `/` division operator warnings, `@import` → `@use` warnings
- **Risk**: Low — warnings only, no functional impact

### @vueuse/core (latest)
- **Impact**: Minimal — API stable across minor versions
- **Risk**: Low

### axios (latest)
- **Impact**: Minimal — stable API
- **Risk**: Low

### @types/node (latest)
- **Impact**: None — type definitions only
- **Risk**: None

### autoprefixer (latest)
- **Impact**: Minimal — PostCSS plugin, stable API
- **Risk**: Low

### Remove @quasar/babel-preset-app
- **Rationale**: Project uses Vite, not Babel. This dependency is unused.
- **Risk**: None

### Remove .babelrc / babel.config.js
- **Rationale**: Vite-based project doesn't use Babel config files
- **Risk**: None — verify no tooling references them

---

## Migration Order (Recommended)

Based on dependency analysis, the recommended order is:

1. **Core framework** (Vue, Quasar, Vue Router, Pinia, @quasar/extras) — foundation
2. **Build tools** (@quasar/app-vite v2 + config migration) — enables everything else
3. **Testing extensions** — required immediately after build tools
4. **TypeScript 5.x** (without strict first) — needed before strict mode
5. **TypeScript strict mode** — separate step for easier debugging
6. **ESLint v9 + flat config** — can run independently
7. **Prettier v3** — cosmetic, low risk
8. **Utility libs** (VueUse, Axios, date-fns, sass, @types/node, autoprefixer)
9. **Chart library swap** — isolated change
10. **Workbox v7** — may be handled by app-vite v2
11. **Cleanup** — remove babel, unused deps
