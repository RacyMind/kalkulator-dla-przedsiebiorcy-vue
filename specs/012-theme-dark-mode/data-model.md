# Data Model: System motywów (Light/Dark Mode)

**Branch**: `012-theme-dark-mode` | **Date**: 2026-02-07

## Entities

### ThemeMode

Represents the user's theme preference. Single value per device, persisted in localStorage.

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `themeMode` | `'light' \| 'dark' \| 'auto'` | `'auto'` | User's theme preference |

**Storage**: localStorage key `themeMode` (JSON-serialized by `@vueuse/core` `useLocalStorage`)

**State transitions**:

```
light → (cycle click) → dark
dark  → (cycle click) → auto
auto  → (cycle click) → light
```

**Derived state**:

| Derived | Type | Logic |
|---------|------|-------|
| `effectiveTheme` | `'light' \| 'dark'` | If `themeMode === 'auto'`, resolve via `prefers-color-scheme`. Otherwise use `themeMode` directly. |
| `isDark` | `boolean` | `effectiveTheme === 'dark'` — maps to `Quasar.Dark.isActive` |
| `themeIcon` | `string` | `light` → `light_mode`, `dark` → `dark_mode`, `auto` → `brightness_auto` |

### Design Tokens (CSS)

Already defined in `_design-tokens.scss`. No schema changes needed.

| Scope | Selector | Token example |
|-------|----------|---------------|
| Light (default) | `:root` | `--color-surface: #FFFFFF` |
| Dark | `.body--dark` | `--color-surface: #121212` |

### Chart Colors (Runtime)

Read from CSS custom properties by `useChartColors` composable. Values change automatically when `.body--dark` class toggles.

| Property | Light value | Dark value |
|----------|-------------|------------|
| `--chart-1` | `#1565C0` | `#42A5F5` |
| `--chart-2` | `#E65100` | `#FF9800` |
| ... (8 total) | ... | ... |

## Relationships

```
settingStore.themeMode
    ↓ (watched by useTheme)
useTheme composable
    ↓ (calls Dark.set())
Quasar Dark plugin
    ↓ (toggles class)
document.body.classList → .body--dark
    ↓ (CSS cascade)
_design-tokens.scss (:root / .body--dark)
    ↓ (CSS custom properties change)
useChartColors.refresh() → re-reads CSS vars → chart colors update
```

## Validation Rules

- `themeMode` must be one of: `'light'`, `'dark'`, `'auto'`
- Invalid localStorage values should fall back to `'auto'`
- `useTheme` must handle missing/corrupted localStorage gracefully
