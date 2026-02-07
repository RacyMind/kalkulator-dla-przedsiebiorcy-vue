# Quickstart: Accessibility (WCAG AA)

**Branch**: `014-wcag-accessibility`  
**Date**: 2026-02-07

## Prerequisites

- Node.js 18+
- npm 9+
- NVDA screen reader (Windows) — for manual testing

## Setup

```bash
git checkout 014-wcag-accessibility
npm install
```

## Development

```bash
npx quasar dev
```

App runs at `http://localhost:9000` (default Quasar port).

## Implementation Order

### Phase 1: Foundation (no visual changes)

1. **`index.html`** — Add `lang="pl"` to `<html>` tag
2. **`app.scss`** — Add global `:focus-visible` styles and `.skip-to-content` class
3. **`MainLayout.vue`** — Add skip-to-content link, landmarks (`<main>`, `<nav>`, `<footer>`), drawer `aria-label`

### Phase 2: Shared Components

4. **`FormSection.vue`** — Add `aria-expanded`, `aria-label` to toggle button
5. **`Chart.vue`** — Add `ariaLabel` prop, `role="img"` on container
6. **`ModulePageLayout.vue`** — Add `aria-live="polite"` on results slot
7. **`ListRow.vue`** — Verify/add ARIA roles for result lists

### Phase 3: Form Accessibility (across modules)

8. **Module Forms** — Add `aria-required="true"` to required `q-input` fields
9. **Heading hierarchy** — Audit and fix `SectionHeader` `level` prop usage across all modules

### Phase 4: Verification

10. **Run existing tests** — `npx vitest run` (must be 410+ pass, 0 fail)
11. **Lighthouse audit** — `npx quasar build -m pwa` then audit with Chrome DevTools
12. **axe-core audit** — Install browser extension, run on key pages
13. **NVDA manual test** — Navigate through a calculator module using keyboard + screen reader

## Key Files to Modify

| File | Change |
|---|---|
| `index.html` | `lang="pl"` |
| `src/css/app.scss` | Focus ring, skip-to-content styles |
| `src/layouts/MainLayout.vue` | Skip link, landmarks, drawer a11y |
| `src/components/partials/form/FormSection.vue` | `aria-expanded`, `aria-label` |
| `src/components/partials/Chart.vue` | `ariaLabel` prop, `role="img"` |
| `src/components/partials/ModulePageLayout.vue` | `aria-live="polite"` |
| `src/components/partials/ListRow.vue` | ARIA roles |
| Module Form.vue files (29 modules) | `aria-required` on required fields |

## Testing

### Automated

```bash
# Run all unit tests
npx vitest run

# Run specific module test
npx vitest run test/vitest/__tests__/modules/<moduleName>/<testName>.test.ts
```

### Manual — Keyboard Navigation

1. Open any calculator module
2. Press Tab — should land on skip-to-content link
3. Press Tab again — should move through form fields in order
4. Fill form, press Enter on "Oblicz" — results should appear
5. Press Escape when drawer is open — should close and return focus

### Manual — Screen Reader (NVDA)

1. Start NVDA
2. Open app in browser
3. Press Insert+F7 — verify landmarks list shows: header, navigation, main, complementary
4. Navigate to a form field — verify label and required state are announced
5. Submit form — verify results are announced via aria-live

### Manual — Contrast

1. Open Chrome DevTools → Lighthouse → Accessibility
2. Run audit in light mode — target ≥ 90
3. Toggle dark mode, run again — target ≥ 90
4. Install axe DevTools extension, run full scan — target 0 critical/serious issues

## Changelog

After completing all changes, update `src/components/changeLogs/logs.ts` with:
- Version: appropriate next version
- Description: "Dostępność WCAG AA — semantyczny HTML, nawigacja klawiaturą, atrybuty ARIA, weryfikacja kontrastu"
