# Quickstart: Aktualizacja zależności (Milestone 1)

**Branch**: `010-update-dependencies` | **Date**: 2026-02-06

## Prerequisites

- Node.js >= 20.0.0
- npm >= 6.13.4
- Git (for branch management and rollback)
- Android SDK (for Capacitor build verification)

## Before Starting

```bash
# Ensure you're on the correct branch
git checkout 010-update-dependencies

# Verify all tests pass on current state
npx vitest run

# Verify app starts
npx quasar dev
```

## Migration Steps (Execute in Order)

### Step 1: Core Framework Dependencies

```bash
npm install vue@latest quasar@latest @quasar/extras@latest vue-router@latest pinia@latest
npx vitest run
```

### Step 2: Build Tools (@quasar/app-vite v2)

```bash
npm install -D @quasar/app-vite@latest
```

Then manually:
1. Rename `quasar.config.js` → `quasar.config.ts`
2. Convert CJS to ESM (see `contracts/migration-contracts.md` Contract 1)
3. Verify:
```bash
npx quasar dev
npx vitest run
```

### Step 3: Quasar Testing Extensions

```bash
npm install -D @quasar/quasar-app-extension-testing@latest @quasar/quasar-app-extension-testing-unit-vitest@latest
npx vitest run
```

### Step 4: TypeScript 5.x

```bash
npm install -D typescript@latest
npx vitest run
```

### Step 5: TypeScript Strict Mode

Add `"strict": true` to `tsconfig.json` compilerOptions. Fix all type errors.

```bash
npx vitest run
```

### Step 6: ESLint v9 + Flat Config

```bash
npm install -D eslint@latest @typescript-eslint/eslint-plugin@latest @typescript-eslint/parser@latest eslint-plugin-vue@latest eslint-config-prettier@latest
```

Then manually:
1. Create `eslint.config.js` (flat config) from `.eslintrc.js` rules
2. Remove `.eslintrc.js`
3. Verify:
```bash
npx eslint .
npx vitest run
```

### Step 7: Prettier v3

```bash
npm install -D prettier@latest
npx prettier --write "**/*.{js,ts,vue,scss,html,md,json}" --ignore-path .gitignore
npx vitest run
```

### Step 8: Utility Libraries

```bash
npm install @vueuse/core@latest axios@latest date-fns@latest
npm install -D vitest@latest @vue/test-utils@latest @testing-library/vue@latest sass@latest @types/node@latest autoprefixer@latest
```

Fix `date-fns` deep import in `src/components/interest/Form.vue`:
- Change `import differenceInDays from 'date-fns/differenceInDays'` → `import { differenceInDays } from 'date-fns'`

```bash
npx vitest run
```

### Step 9: Chart Library Swap

```bash
npm uninstall @j-t-mcc/vue3-chartjs
npm install vue-chartjs chart.js
```

Rewrite `src/components/partials/Chart.vue` to use `vue-chartjs`. See `contracts/migration-contracts.md` Contract 3.

```bash
npx vitest run
```

### Step 10: Workbox v7

```bash
npm install -D workbox-build@latest workbox-cacheable-response@latest workbox-core@latest workbox-expiration@latest workbox-precaching@latest workbox-routing@latest workbox-strategies@latest
```

Verify PWA build:
```bash
npx quasar build -m pwa
```

### Step 11: Cleanup

```bash
npm uninstall @quasar/babel-preset-app
```

Remove files:
- `.babelrc` (if exists)
- `babel.config.js`

```bash
npx vitest run
```

## Final Verification

```bash
# All tests
npx vitest run

# Dev mode
npx quasar dev

# PWA build
npx quasar build -m pwa

# Android build
npx quasar build -m capacitor -T android

# Linting
npx eslint .
```

## Rollback

Each step is a separate commit. To rollback any step:

```bash
git revert <commit-hash>
```

If a dependency is incompatible with target version, pin to last compatible version and document the blocker in a follow-up issue.
