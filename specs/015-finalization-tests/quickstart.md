# Quickstart: Finalizacja i testy (Milestone 6)

**Branch**: `015-finalization-tests`  
**Date**: 2026-02-07

## Prerequisites

- Node.js 18+ installed
- npm installed
- Android SDK + emulator (for Capacitor build)
- Chrome (for Lighthouse audit)

## Step-by-step

### 1. Run regression tests

```bash
npx vitest run
```

Fix any failing tests before proceeding.

### 2. Synchronize version to 6.4.0

Update version in these files:
- `package.json` → `"version": "6.4.0"`
- `src/stores/constantsStore.ts` → `app.version` to `'6.4.0'`
- `src-pwa/manifest.json` → `"version": "6.4.0"`

Update `src-capacitor/capacitor.config.json` → `appName` year range.

### 3. Add changelog entry

Add v6.4.0 entry at the top of `src/components/changeLogs/logs.ts`.

### 4. Update README.md

Rewrite with project description, features list, technology stack, and build instructions.

### 5. Clean up dead code

Search for unused files, orphaned imports, and remove them.

### 6. Build and audit PWA

```bash
npx quasar build -m pwa
```

Serve the `dist/pwa/` directory and run Lighthouse audit. Target: Performance > 90, Accessibility > 90.

### 7. Build Capacitor Android

```bash
npx quasar build -m capacitor -T android
```

Test on emulator: dark mode, AdMob, navigation, various screen sizes.

### 8. Final verification

- [ ] All tests pass
- [ ] Version is `6.4.0` everywhere
- [ ] Changelog has v6.4.0 entry
- [ ] README is updated
- [ ] PWA build succeeds
- [ ] Lighthouse scores meet targets
- [ ] Android build succeeds
- [ ] No dead code or TODO comments remain
