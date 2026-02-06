# Data Model: Aktualizacja zależności (Milestone 1)

**Branch**: `010-update-dependencies` | **Date**: 2026-02-06

## Overview

This milestone is an infrastructure update — **no data model changes**. All existing entities, interfaces, and types remain unchanged. Calculation logic is not modified.

## Affected Configuration Entities

### package.json Dependencies

| Entity | Current Version | Target Version | Breaking Changes |
|--------|----------------|----------------|-----------------|
| vue | ^3.4.15 | latest 3.x | None expected |
| quasar | ^2.18.6 | latest 2.x | None expected |
| @quasar/extras | ^1.17.0 | latest | None expected |
| vue-router | ^4.2.5 | latest 4.x | None expected |
| pinia | ^2.0.14 | latest 2.x | None expected |
| @vueuse/core | ^10.7.1 | latest | None expected |
| axios | ^1.6.2 | latest | None expected |
| date-fns | ^2.17.0 | v4.x | ESM-only, import paths |
| @j-t-mcc/vue3-chartjs | ^1.3.0 | **Remove** → vue-chartjs + chart.js v4 | New library |
| @quasar/babel-preset-app | ^2.0.3 | **Remove** | Unused with Vite |
| @quasar/app-vite | ^1.11.0 | v2.x | Config JS→TS |
| typescript | ^4.5.4 | v5.x | Strict mode enabled |
| eslint | ^8.10.0 | v9.x | Flat config |
| @typescript-eslint/* | ^5.10.0 | v8.x | New API |
| eslint-plugin-vue | ^8.5.0 | latest | Flat config support |
| prettier | ^2.5.1 | v3.x | Trailing commas default |
| sass | ^1.97.3 | latest | Deprecation warnings (deferred) |
| vitest | ^2.1.9 | latest | None expected |
| @vue/test-utils | ^2.4.1 | latest | None expected |
| @testing-library/vue | ^6.6.1 | latest | None expected |
| workbox-* | ^6.5.3 | v7.x | API changes (handled by app-vite) |
| @types/node | ^20.17.24 | latest | None |

### Config File Migrations

| File | Change |
|------|--------|
| `quasar.config.js` | Rename to `.ts`, convert CJS→ESM |
| `.eslintrc.js` | Replace with `eslint.config.js` (flat config) |
| `tsconfig.json` | Add `strict: true` |
| `.babelrc` | Remove |
| `babel.config.js` | Remove |

## TypeScript Interfaces

No interface changes. All existing interfaces in `src/components/*/interfaces/` remain as-is. Strict mode may require adding explicit types where `any` was implicit, but no structural changes to interfaces.
