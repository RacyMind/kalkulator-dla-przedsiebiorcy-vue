# Component Contracts: Accessibility (WCAG AA)

**Branch**: `014-wcag-accessibility`  
**Date**: 2026-02-07

## Overview

This feature has no REST/GraphQL API contracts. All changes are frontend component modifications. This document defines the **component interface contracts** — the expected props, attributes, and behaviors that each modified component must satisfy.

---

## Contract C-001: MainLayout.vue — Landmarks & Skip Link

### Input
No new props.

### Expected DOM Output
```html
<q-layout>
  <a href="#main-content" class="skip-to-content">Przejdź do treści</a>
  <q-header><!-- existing header --></q-header>
  <q-drawer aria-label="Panel boczny">
    <nav aria-label="Menu główne">
      <Menu />
    </nav>
    <footer><!-- version + support button --></footer>
  </q-drawer>
  <q-page-container>
    <main id="main-content" tabindex="-1">
      <!-- router-view -->
    </main>
  </q-page-container>
</q-layout>
```

### Behavior
- Skip link is visually hidden, visible on `:focus-visible`
- Skip link targets `#main-content`
- Drawer close (Escape or overlay click) restores focus to hamburger button
- All landmarks are identifiable by screen readers

---

## Contract C-002: FormSection.vue — Accessible Toggle

### Input Props (unchanged)
| Prop | Type | Required | Default |
|---|---|---|---|
| `title` | `string` | no | — |
| `hideSeparator` | `boolean` | no | `false` |

### Expected DOM Output
```html
<div class="q-py-sm">
  <div class="row">
    <div class="col">
      <h3 class="sectionHeader text-brand">{{ title }}</h3>
    </div>
    <div class="col-shrink">
      <q-btn
        :aria-expanded="visible"
        :aria-label="'Przełącz sekcję: ' + title"
        ...existing props...
      />
    </div>
  </div>
  <q-slide-transition>
    <div v-show="visible">
      <slot />
    </div>
  </q-slide-transition>
</div>
```

### Behavior
- `aria-expanded` reflects current `visible` state (true/false)
- `aria-label` includes section title for context
- Toggle button is keyboard-accessible (Enter/Space)

---

## Contract C-003: Chart.vue — Accessible Chart

### Input Props
| Prop | Type | Required | Default | New? |
|---|---|---|---|---|
| `chartData` | `Object` | yes | — | existing |
| `chartOptions` | `Object` | no | — | existing |
| `type` | `string` | yes | — | existing |
| `ariaLabel` | `string` | no | `'Wykres danych'` | **NEW** |

### Expected DOM Output
```html
<div ref="chartContainer"
     role="img"
     :aria-label="ariaLabel"
     style="position: relative; width: 100%;">
  <component :is="chartComponent" ... />
</div>
```

### Behavior
- Screen readers announce the chart as an image with the provided label
- Canvas content is not read (opaque to assistive tech) — label provides context
- Parent components should pass descriptive labels (e.g., "Wykres podziału wynagrodzenia")

---

## Contract C-004: ModulePageLayout.vue — Live Results

### Input Props (unchanged)
| Prop | Type | Required | Default |
|---|---|---|---|
| `singleColumn` | `boolean` | no | `false` |

### Expected DOM Output (results slot)
```html
<div v-if="$slots.results"
     :class="resultsColumnClass"
     aria-live="polite">
  <q-card flat class="module-card module-card--padded">
    <slot name="results" />
  </q-card>
</div>
```

### Behavior
- Screen readers announce content changes in the results region
- `aria-live="polite"` — waits for current speech to finish before announcing
- Only the results slot has `aria-live`, not the form slot

---

## Contract C-005: index.html — Language Declaration

### Expected Change
```html
<html lang="pl">
```

### Behavior
- Screen readers use correct Polish pronunciation rules
- Browser auto-translation features detect the language correctly

---

## Contract C-006: Global CSS — Focus & Skip Styles

### Expected Classes

```css
/* Skip-to-content link */
.skip-to-content {
  /* Visually hidden by default */
  /* Visible and styled on :focus-visible */
}

/* Global focus ring */
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Behavior
- Focus ring appears only on keyboard navigation (not mouse clicks)
- Focus ring has ≥ 3:1 contrast ratio against adjacent backgrounds
- Skip link appears at top-left of viewport when focused

---

## Contract C-007: Form Fields — Required Attribute

### Expected Change (per module Form.vue)
```html
<q-input
  ...existing props...
  :rules="[validationRules.requiredAmount]"
  aria-required="true"
/>
```

### Scope
All `q-input` fields across 29 modules that have required validation rules (`:rules` containing `required`, `requiredAmount`, or similar).

### Behavior
- Screen readers announce "required" when the field receives focus
- No change to visual appearance or validation logic
