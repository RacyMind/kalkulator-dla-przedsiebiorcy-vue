# Data Model: Accessibility (WCAG AA)

**Branch**: `014-wcag-accessibility`  
**Date**: 2026-02-07

## Overview

This feature does not introduce new data entities, database models, or state stores. It modifies existing Vue component templates and CSS to improve accessibility. The "data model" here describes the **component interface changes** — new props, attributes, and CSS classes that form the accessibility contract.

## Component Interface Changes

### 1. Chart.vue — New Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `ariaLabel` | `string` | `'Wykres danych'` | Accessible name for the chart, read by screen readers |

**Template change**: Container `<div>` gets `role="img"` and `:aria-label="ariaLabel"`.

---

### 2. FormSection.vue — ARIA Attributes

| Attribute | Binding | Description |
|---|---|---|
| `aria-expanded` | `:aria-expanded="visible"` | Communicates expanded/collapsed state to screen readers |
| `aria-label` | `:aria-label="'Przełącz sekcję: ' + props.title"` | Accessible name for the toggle button |

No new props — uses existing `visible` ref and `title` prop.

---

### 3. ModulePageLayout.vue — Results Container

| Attribute | Value | Description |
|---|---|---|
| `aria-live` | `"polite"` | Announces result updates to screen readers |

Applied to the results slot wrapper `<div>`.

---

### 4. MainLayout.vue — Landmarks & Skip Link

| Element | Change | Description |
|---|---|---|
| Skip-to-content `<a>` | New element | First focusable element, targets `#main-content` |
| `<main id="main-content">` | Wraps page content | Landmark for main content area |
| `<nav aria-label="Menu główne">` | Wraps Menu component | Landmark for navigation |
| `q-drawer` | Add `aria-label="Panel boczny"` | Labels the aside landmark |
| Drawer footer | Wrap in `<footer>` | Landmark for footer content |

---

### 5. index.html — HTML Attributes

| Attribute | Value | Description |
|---|---|---|
| `lang` | `"pl"` | Document language for screen readers (WCAG 3.1.1) |

---

### 6. Global CSS — New Classes

| Class | Purpose |
|---|---|
| `.skip-to-content` | Visually hidden skip link, visible on `:focus-visible` |
| `*:focus-visible` | Global focus ring style for keyboard navigation |

---

### 7. Form Fields — ARIA Attributes (across all modules)

| Attribute | Applied to | Description |
|---|---|---|
| `aria-required="true"` | `q-input` with required validation rules | Indicates required field to screen readers |

Note: `aria-describedby` for validation messages depends on Quasar's internal DOM structure. Research (R-001) determined that a composable or directive approach is needed to auto-link inputs to their error containers.

## State Transitions

No new state transitions. Existing states affected:

- `FormSection.visible` (boolean) — now exposed via `aria-expanded`
- `MainLayout.leftDrawerOpen` (boolean) — focus restoration on close
- Module results (reactive) — announced via `aria-live="polite"`

## Validation Rules

No changes to `validationRules.ts`. Existing rules continue to work — the accessibility layer adds ARIA attributes to communicate validation state, not to change validation logic.
