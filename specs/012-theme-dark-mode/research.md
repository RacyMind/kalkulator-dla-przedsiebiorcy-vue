# Research: System motywów (Light/Dark Mode)

**Branch**: `012-theme-dark-mode` | **Date**: 2026-02-07

## Research Tasks

### R1: Quasar Dark Plugin — integration pattern

**Decision**: Use `Quasar.Dark.set(value)` where value is `true`, `false`, or `'auto'`.

**Rationale**: Quasar's Dark plugin natively manages the `.body--dark` class on `<body>`. It supports boolean values for explicit light/dark and `'auto'` for system preference detection. This aligns perfectly with FR-001 (3 modes). The plugin is already bundled with Quasar — just needs to be enabled in config.

**Alternatives considered**:
- Manual `document.body.classList.toggle('body--dark')` — works but bypasses Quasar's internal dark mode reactivity (some Quasar components check `Dark.isActive` internally)
- `@vueuse/core` `useDark()` — provides its own dark mode management but would conflict with Quasar's built-in system

### R2: FOUC prevention — inline script pattern

**Decision**: Add an inline `<script>` block in `index.html` `<body>` tag that reads `themeMode` from localStorage and applies `.body--dark` class before Vue mounts.

**Rationale**: The inline script runs synchronously before any rendering. It reads the persisted theme preference and, if dark mode should be active (explicit dark or auto + system preference), adds the class immediately. This prevents the flash of light theme.

**Implementation pattern**:
```javascript
(function() {
  try {
    var stored = localStorage.getItem('themeMode');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === '"dark"' || ((!stored || stored === '"auto"') && prefersDark)) {
      document.body.classList.add('body--dark');
    }
  } catch(e) {}
})();
```

Note: `useLocalStorage` from `@vueuse/core` stores values JSON-serialized, so `'dark'` is stored as `'"dark"'` in localStorage.

**Alternatives considered**:
- CSS `@media (prefers-color-scheme: dark)` on `:root` — only handles system preference, not user's explicit choice
- Boot file — runs after Vue mount, too late for FOUC prevention

### R3: useTheme composable — architecture

**Decision**: Create a standalone composable `src/composables/useTheme.ts` that:
1. Reads `themeMode` from `settingStore` (persisted via `useLocalStorage`)
2. Watches `themeMode` + system preference and calls `Dark.set()` accordingly
3. Provides a `cycleTheme()` function: light → dark → auto → light
4. Calls `useChartColors().refresh()` after theme change to update chart colors

**Rationale**: Keeping theme logic in a composable (not the store) follows the existing project pattern where stores hold state and composables hold behavior. The `settingStore` already uses `useLocalStorage` for `dateOfLawRules`, so adding `themeMode` follows the same pattern.

**Alternatives considered**:
- All logic in settingStore actions — mixes concerns; store should be state-only
- Boot file with global watcher — less reusable, harder to test

### R4: Chart dark mode — label/axis colors

**Decision**: Extend `Chart.vue` `mergedOptions` to include dynamic text colors for legends, labels, and axes based on `Dark.isActive`. The `useChartColors` composable already reads CSS custom properties that change with `.body--dark`, but chart.js text options need explicit color configuration.

**Rationale**: Chart.js does not automatically inherit CSS colors for text elements (labels, legends, tick marks). These must be set via chart options. Using `Dark.isActive` (reactive ref from Quasar) to toggle between `--color-text-primary` light vs dark values ensures consistency.

**Alternatives considered**:
- Global Chart.js defaults (`ChartJS.defaults.color`) — works but is not reactive; would need manual reset on theme change
- Per-chart color props — too much duplication across 29 modules

### R5: Hardcoded color class replacement — full audit

**Decision**: Replace all Quasar hardcoded color classes with inline styles using CSS custom properties or utility classes.

**Files requiring changes** (from grep audit):

| File | Current class | Replacement |
|------|--------------|-------------|
| `MainLayout.vue` | `bg-red-8` (header) | `.bg-primary-brand` utility class |
| `MainLayout.vue` | `bg-teal-1` (page-container) | `.bg-surface-variant` utility class |
| `MainLayout.vue` | `bg-grey-2` (drawer content-class) | `.bg-surface-variant` utility class |
| `ModulePageLayout.vue` | `bg-white` | `.bg-surface` utility class |
| `investment/Summary.vue` | `bg-grey-3` | `.bg-surface-elevated` utility class |
| `interest/Summary.vue` | `bg-grey-3` | `.bg-surface-elevated` utility class |
| `cashRegisterLimit/Summary.vue` | `bg-grey-3` | `.bg-surface-elevated` utility class |
| `invoice/Summary.vue` | `bg-grey-3` | `.bg-surface-elevated` utility class |
| `vatLimit/Summary.vue` | `bg-grey-3` | `.bg-surface-elevated` utility class |
| `rentalProfit/ProjectionTable.vue` | `bg-grey-3` | `.bg-surface-elevated` utility class |
| `contact/Form.vue` | `bg-white` | `.bg-surface` utility class |
| `inflation/pages/Index.vue` | `bg-white` | `.bg-surface` utility class |
| `inflation/pages/PurchasingPowerOfMoney.vue` | `bg-white` | `.bg-surface` utility class |
| `terms/USSummary.vue` | `bg-white` / `bg-grey-3` | `.bg-surface` / `.bg-surface-elevated` utility classes |
| `terms/PFRONSummary.vue` | `bg-grey-3` | `.bg-surface-elevated` utility class |
| `terms/ZUSSummary.vue` | `bg-grey-3` | `.bg-surface-elevated` utility class |
| `terms/pages/Index.vue` | `bg-white` | `.bg-surface` utility class |
| `partials/Advert.vue` | `bg-white` | `.bg-surface` utility class |
| `partials/form/SubmitButton.vue` | `bg-white` | `.bg-surface` utility class |

**Rationale**: Utility classes like `bg-white` are Quasar-generated and don't respond to `.body--dark`. CSS custom properties from `_design-tokens.scss` automatically switch values when the dark class is active.

**Alternatives considered**:
- Creating custom Quasar-style utility classes (`.bg-surface`, `.bg-surface-variant`, `.bg-surface-elevated`) in `app.scss` — cleaner than inline styles, preferred approach
- Overriding Quasar's built-in color classes — too invasive, could break other Quasar components

**Final approach**: Create utility classes in `app.scss` (`.bg-surface`, `.bg-surface-variant`, `.bg-surface-elevated`, `.bg-primary-brand`, `.text-on-surface`) and use those instead of inline styles. This is cleaner and more maintainable. No inline `style="..."` attributes — classes only.
