# Quickstart: System motywów (Light/Dark Mode)

**Branch**: `012-theme-dark-mode` | **Date**: 2026-02-07

## Prerequisites

- Node.js 16+
- `npm install` completed
- Branch `012-theme-dark-mode` checked out

## Implementation Order

### Step 1: Enable Quasar Dark Plugin

In `quasar.config.ts`, add `'Dark'` to `framework.plugins`:
```typescript
plugins: ['Dark', 'Notify']
```

### Step 2: Extend settingStore

In `src/stores/settingStore.ts`, add `themeMode` field:
```typescript
themeMode: useLocalStorage<'light' | 'dark' | 'auto'>('themeMode', 'auto')
```

### Step 3: Create useTheme composable

Create `src/composables/useTheme.ts`:
- Read `themeMode` from `settingStore`
- Watch `themeMode` + `usePreferredColorScheme()` from `@vueuse/core`
- Call `Dark.set()` with resolved value
- Provide `cycleTheme()`: light → dark → auto → light
- Call `useChartColors().refresh()` after each theme change

### Step 4: Add FOUC prevention script

In `index.html`, add inline `<script>` inside `<body>` before `<!-- quasar:entry-point -->`:
- Read `themeMode` from localStorage
- If dark mode should be active, add `.body--dark` to `<body>`

### Step 5: Add toggle button to MainLayout

In `src/layouts/MainLayout.vue`:
- Add `q-btn` in toolbar with dynamic icon based on current theme mode
- Wire to `useTheme().cycleTheme()`
- Replace hardcoded classes: `bg-red-8` → token, `bg-teal-1` → token, `bg-grey-2` → token

### Step 6: Create CSS utility classes

In `src/css/app.scss`, add utility classes:
```scss
.bg-surface { background: var(--color-surface) !important; }
.bg-surface-variant { background: var(--color-surface-variant) !important; }
.bg-surface-elevated { background: var(--color-surface-elevated) !important; }
```

### Step 7: Replace hardcoded color classes in 17 files

Replace all `bg-white`, `bg-grey-2`, `bg-grey-3`, `bg-teal-1`, `bg-red-8` with utility classes from Step 6.

### Step 8: Update _sectionHeader.scss

Replace `color: #ffff` with `color: var(--color-text-on-brand)`.

### Step 9: Update charts for dark mode

- In `useChartColors.ts`: integrate with `useTheme` watcher to auto-refresh
- In `Chart.vue`: add dynamic options for label/legend/axis colors based on `Dark.isActive`

### Step 10: Verify and test

```bash
# Run all tests
npx vitest run

# Dev server for visual verification
npx quasar dev
```

Verify all 29 modules in both light and dark mode.

## Key Commands

```bash
# Run tests
npx vitest run

# Dev server
npx quasar dev

# Lint
npm run lint
```
