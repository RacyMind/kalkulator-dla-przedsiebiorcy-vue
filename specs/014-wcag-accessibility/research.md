# Research: Accessibility (WCAG AA)

**Branch**: `014-wcag-accessibility`  
**Date**: 2026-02-07

## Research Topics

### R-001: Quasar built-in accessibility for q-input validation

**Decision**: Quasar `q-input` with `:rules` automatically renders error messages in a `<div>` below the field. However, it does NOT automatically add `aria-describedby` linking the input to its error message, nor does it add `aria-required`. These must be added manually.

**Rationale**: Quasar focuses on visual UX, not screen reader UX. The `q-input` component renders `label` correctly as a `<label>` element (good), but validation error messages are purely visual `<div class="q-field__messages">` without ARIA linkage.

**Approach**:
- Add `aria-required="true"` to `q-input` fields that have required validation rules — Quasar passes unknown attributes to the underlying `<input>` element
- For `aria-describedby`: Quasar's `q-input` internally generates unique IDs for error message containers. We can leverage the `bottom-slots` and `error-message` props, or use a wrapper approach. The simplest approach is to use Quasar's `error` and `error-message` props which render in a predictable DOM structure, then add `aria-describedby` pointing to a manually set `id` on the error container.
- **Simplest viable approach**: Since Quasar `q-input` passes through HTML attributes, we can add `aria-required="true"` directly. For `aria-describedby`, we create a thin composable or directive that auto-links input to its error message container.

**Alternatives considered**:
- Custom wrapper component around `q-input` — rejected (too invasive, 29+ modules to update)
- Global Vue directive — viable but complex
- Manual `aria-describedby` per field — rejected (too many fields, error-prone)

---

### R-002: Quasar q-drawer Escape key and focus management

**Decision**: Quasar `q-drawer` already handles Escape key to close when in overlay mode (mobile). Focus restoration to the trigger element is NOT automatic — must be implemented manually.

**Rationale**: Tested Quasar docs and source. `q-drawer` emits `@update:model-value` when closed, but does not track which element opened it. The hamburger button in `MainLayout.vue` toggles `leftDrawerOpen` — we need to store a ref to the trigger button and restore focus on close.

**Approach**:
- Add a `ref` to the hamburger `q-btn` in `MainLayout.vue`
- On drawer close (watch `leftDrawerOpen` → false), call `triggerRef.value?.$el?.focus()`
- Quasar's overlay drawer already traps focus and handles Escape — verify this behavior

**Alternatives considered**:
- Custom keyboard event listener for Escape — rejected (Quasar already handles this in overlay mode)
- Focus trap library (e.g., `focus-trap`) — rejected (overkill, Quasar handles overlay focus)

---

### R-003: Skip-to-content link implementation

**Decision**: Add a visually hidden `<a>` as the first focusable element in `MainLayout.vue` template, targeting `#main-content`. Add `id="main-content"` to the `<q-page-container>` or a wrapper `<main>` element.

**Rationale**: Standard WCAG pattern. The link is visually hidden but becomes visible on focus (`:focus-visible`). This is the most common and well-tested approach.

**Approach**:
- Add `<a href="#main-content" class="skip-to-content">Przejdź do treści</a>` as first child of `<q-layout>`
- Add CSS: `.skip-to-content` is `position: absolute; left: -9999px;` normally, but on `:focus` becomes `position: fixed; top: 8px; left: 8px; z-index: 9999;` with visible styling
- Add `id="main-content"` and `tabindex="-1"` to the `<main>` landmark element

**Alternatives considered**:
- Using Quasar's `q-page-sticky` — rejected (not semantically correct for skip link)
- Adding to `index.html` — rejected (would be outside Vue's control, harder to maintain)

---

### R-004: Landmarks in Quasar layout

**Decision**: Quasar's `q-header`, `q-drawer`, `q-page-container` render as `<header>`, `<aside>`, and `<div>` respectively. We need to add semantic landmarks explicitly.

**Rationale**: 
- `q-header` renders as `<header>` ✅ — already a landmark
- `q-drawer` renders as `<aside>` ✅ — already a landmark, but needs `aria-label` for identification
- `q-page-container` renders as `<div>` ❌ — needs to be wrapped in or replaced with `<main>`
- `<nav>` is missing — the menu list inside the drawer needs a `<nav>` wrapper
- `<footer>` is missing — the drawer footer section and/or page footer need `<footer>`

**Approach**:
- Wrap `q-page-container` content in `<main id="main-content">` — or add `role="main"` to the container
- Wrap `Menu` component in `<nav aria-label="Menu główne">`
- Add `aria-label="Panel boczny"` to `q-drawer`
- Add `<footer>` around the drawer bottom section (version + support button)
- Verify `q-header` renders as `<header>` (it does by default)

**Alternatives considered**:
- Overriding Quasar's rendered elements with `tag` prop — not all Quasar components support this
- Using `role` attributes instead of semantic elements — rejected (semantic HTML preferred per WCAG)

---

### R-005: Chart.js canvas accessibility

**Decision**: Wrap `Chart.vue` canvas in a `<figure>` with `<figcaption>` and add `role="img"` + `aria-label` to the canvas container. The `aria-label` will be a prop passed by parent components describing the chart data.

**Rationale**: Chart.js renders to `<canvas>` which is opaque to screen readers. The WCAG approach is to provide an accessible name via `aria-label` or `<figcaption>`. A full data table alternative is overkill for this app — the result list already shows the same data in text form.

**Approach**:
- Add optional `ariaLabel` prop to `Chart.vue`
- Add `role="img"` and `:aria-label="ariaLabel"` to the chart container div
- Default `ariaLabel` to a generic "Wykres danych" if not provided
- Parent components can pass descriptive labels like "Wykres podziału wynagrodzenia"

**Alternatives considered**:
- Hidden data table alongside chart — rejected (data already shown in ListRow results)
- `aria-hidden="true"` on chart (treat as decorative) — partially valid since data is in results, but `role="img"` with label is better practice

---

### R-006: Focus ring styling approach

**Decision**: Add global `:focus-visible` styles in `app.scss` that apply a consistent, high-contrast focus ring to all interactive elements. Use `outline` (not `box-shadow`) for best compatibility.

**Rationale**: `:focus-visible` is supported in all modern browsers and only shows the ring for keyboard navigation (not mouse clicks). Using `outline` ensures the ring is visible regardless of element type and doesn't affect layout.

**Approach**:
```css
*:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.body--dark *:focus-visible {
  outline-color: var(--color-primary); /* already lighter in dark mode tokens */
}
```
- Override Quasar's default focus styles where they conflict
- Ensure contrast ratio of focus ring against background meets 3:1 (WCAG 2.4.7)

**Alternatives considered**:
- Per-component focus styles — rejected (inconsistent, hard to maintain)
- `box-shadow` approach — rejected (doesn't work well with `overflow: hidden` elements)
- `:focus` instead of `:focus-visible` — rejected (shows ring on mouse click too)

---

### R-007: aria-live for results section

**Decision**: Add `aria-live="polite"` to the results slot wrapper in `ModulePageLayout.vue`. This ensures screen readers announce when results are updated after calculation.

**Rationale**: The results section is dynamically updated after form submission. Without `aria-live`, screen readers won't announce the change. `polite` (not `assertive`) is appropriate because the update is expected and shouldn't interrupt the user.

**Approach**:
- In `ModulePageLayout.vue`, add `aria-live="polite"` to the results column `<div>`
- Optionally add `aria-atomic="false"` so only changed content is announced (not the entire region)

**Alternatives considered**:
- `aria-live="assertive"` — rejected (too intrusive for expected updates)
- Moving focus to results programmatically — already done by `useScrollToResults`, but `aria-live` is still needed for screen readers that don't follow focus

---

### R-008: FormSection aria-expanded implementation

**Decision**: Add `aria-expanded` bound to the `visible` ref, and `aria-label` with the section title, to the toggle button in `FormSection.vue`.

**Rationale**: The toggle button currently has no accessible name (just an icon) and no state indication. Screen readers need both to communicate the section's state.

**Approach**:
- Add `:aria-expanded="visible"` to the `q-btn`
- Add `:aria-label="'Przełącz sekcję: ' + props.title"` to the `q-btn`
- The `q-slide-transition` content doesn't need ARIA — the `aria-expanded` on the button is sufficient

**Alternatives considered**:
- Using `aria-controls` pointing to content ID — nice-to-have but not required for WCAG AA
- Wrapping in `<details>`/`<summary>` — rejected (conflicts with Quasar's animation approach)

---

### R-009: Heading hierarchy verification

**Decision**: Audit all module Index.vue pages to verify `SectionHeader` `level` prop usage follows h1 → h2 → h3 without skips.

**Rationale**: `SectionHeader.vue` already supports `level` prop (2 or 3). The app title in the header serves as implicit h1. Module pages should use h2 for main sections ("Wypełnij formularz", "Podsumowanie") and h3 for subsections.

**Findings from codebase audit**:
- `vatLimit/pages/Index.vue` uses `<SectionHeader :level="2">` ✅
- Pattern is consistent across modules — `level="2"` for form/results headers
- No h1 is explicitly rendered — the app name in `q-toolbar-title` is not a heading element. This is acceptable since `q-header` is a landmark, but adding a visually hidden h1 could improve screen reader navigation.

**Approach**:
- Verify all modules use `level="2"` for top-level sections
- Add visually hidden `<h1>` with page/module name for screen reader navigation
- Use `level="3"` for subsections within form/results

---

### R-010: lang="pl" on HTML element

**Decision**: Add `lang="pl"` to the `<html>` tag in `index.html`.

**Rationale**: WCAG 3.1.1 requires the default language of the page to be programmatically determinable. Currently missing.

**Approach**: Simple one-line change in `index.html`: `<html>` → `<html lang="pl">`.

No alternatives needed — this is the standard approach.
