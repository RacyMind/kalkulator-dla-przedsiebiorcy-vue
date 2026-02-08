# Contract: useTheme Composable

**Branch**: `012-theme-dark-mode` | **Date**: 2026-02-07

## Overview

No REST/GraphQL APIs in this feature. The primary contract is the `useTheme` composable interface consumed by `MainLayout.vue` and any component needing theme awareness.

## Interface: `useTheme()`

```typescript
type ThemeMode = 'light' | 'dark' | 'auto'

interface UseThemeReturn {
  /** Current user-selected theme mode */
  themeMode: Ref<ThemeMode>

  /** Resolved theme after applying 'auto' logic */
  effectiveTheme: ComputedRef<'light' | 'dark'>

  /** Whether dark mode is currently active */
  isDark: ComputedRef<boolean>

  /** Icon name for the current theme mode */
  themeIcon: ComputedRef<string>

  /** Tooltip text (Polish) for the current theme mode */
  themeTooltip: ComputedRef<string>

  /** Cycle to the next theme: light → dark → auto → light */
  cycleTheme: () => void
}
```

## Behavior Contract

| Input state | Action | Expected output |
|-------------|--------|-----------------|
| `themeMode = 'light'` | `cycleTheme()` | `themeMode = 'dark'`, `Dark.set(true)` |
| `themeMode = 'dark'` | `cycleTheme()` | `themeMode = 'auto'`, `Dark.set('auto')` |
| `themeMode = 'auto'` | `cycleTheme()` | `themeMode = 'light'`, `Dark.set(false)` |
| `themeMode = 'auto'`, system dark | mount | `isDark = true`, `Dark.set('auto')` |
| `themeMode = 'auto'`, system light | mount | `isDark = false`, `Dark.set('auto')` |
| Invalid localStorage value | mount | Falls back to `'auto'` |

## Side Effects

1. Calls `Quasar.Dark.set()` whenever resolved theme changes
2. Calls `useChartColors().refresh()` after theme change (via `nextTick`)
3. Persists `themeMode` to localStorage via `settingStore`

## Consumers

- `MainLayout.vue` — toggle button UI
- `Chart.vue` — dark mode chart options (reads `Dark.isActive`)
- `useChartColors.ts` — refreshed by theme watcher
