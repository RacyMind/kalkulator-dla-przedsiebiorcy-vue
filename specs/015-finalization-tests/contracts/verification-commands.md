# Verification Commands Contract: Finalizacja i testy (Milestone 6)

**Branch**: `015-finalization-tests`  
**Date**: 2026-02-07

## Overview

This milestone does not introduce new API endpoints. Instead, the "contracts" are the verification commands and their expected outcomes that define the acceptance criteria.

## Commands

### 1. Unit Test Regression

```bash
npx vitest run
```

**Expected outcome**: Exit code 0, all tests pass.

---

### 2. PWA Production Build

```bash
npx quasar build -m pwa
```

**Expected outcome**: Build completes without errors. Output in `dist/pwa/`.

---

### 3. Capacitor Android Build

```bash
npx quasar build -m capacitor -T android
```

**Expected outcome**: Build completes without errors. APK generated.

---

### 4. Lighthouse Audit

Run on the production build served locally.

**Expected outcomes**:
- Performance > 90
- Accessibility > 90

---

### 5. Version Consistency Check

All of the following must contain `6.4.0`:

| File | Field |
|------|-------|
| `package.json` | `version` |
| `src/stores/constantsStore.ts` | `app.version` |
| `src-pwa/manifest.json` | `version` |
