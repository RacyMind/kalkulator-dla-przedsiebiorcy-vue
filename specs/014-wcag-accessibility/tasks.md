# Tasks: Accessibility (WCAG AA)

**Input**: Documents from `/specs/014-wcag-accessibility/`
**Required**: plan.md, spec.md

**Tests**: No new calculator logic — no new tests required. Existing tests (410+) must pass without regression.

**Organization**: Tasks grouped by user scenarios from spec.md.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (US1=Keyboard Nav, US2=Screen Reader, US3=Contrast, US4=Accessible Forms)
- Include exact file paths

## Path Conventions

- **Layout**: `src/layouts/MainLayout.vue`
- **Partials**: `src/components/partials/`
- **CSS**: `src/css/`
- **Modules**: `src/components/[moduleName]/`
- **Changelog**: `src/components/changeLogs/logs.ts`

---

## Phase 1: Setup & Foundation

**Goal**: HTML-level and CSS-level changes that are prerequisites for all user stories. No component logic changes.

- [x] T001 Add `lang="pl"` attribute to `<html>` tag in `index.html` (WCAG 3.1.1, AR-006)
- [x] T002 [P] Add global `:focus-visible` outline styles in `src/css/app.scss` — use `outline: 2px solid var(--color-primary); outline-offset: 2px;` with `.body--dark` variant (R-006, FR-010)
- [x] T003 [P] Add `.skip-to-content` CSS class in `src/css/app.scss` — visually hidden by default (`position: absolute; left: -9999px`), visible on `:focus-visible` (`position: fixed; top: 8px; left: 8px; z-index: 9999; background: var(--color-primary); color: white; padding: 8px 16px; border-radius: var(--radius-md); text-decoration: none;`) (R-003, FR-001)

**Checkpoint**: `npx vitest run` — all existing tests pass

---

## Phase 2: Foundational — Layout Landmarks (blocks US1 + US2)

**Goal**: Add semantic landmarks and skip-to-content link to MainLayout. These are prerequisites for both keyboard navigation (US1) and screen reader (US2) stories.

- [x] T004 Add skip-to-content link `<a href="#main-content" class="skip-to-content">Przejdź do treści</a>` as first child of `<q-layout>` in `src/layouts/MainLayout.vue` (C-001, FR-001)
- [x] T005 Wrap `<q-page-container>` content in `<main id="main-content" tabindex="-1">` element in `src/layouts/MainLayout.vue` — the `<main>` wraps the `<router-view>` and `<ScrollToTop>` (C-001, FR-002)
- [x] T006 Wrap `<Menu>` component inside `<q-scroll-area>` with `<nav aria-label="Menu główne">` in `src/layouts/MainLayout.vue` (C-001, FR-005)
- [x] T007 Add `aria-label="Panel boczny"` to `<q-drawer>` in `src/layouts/MainLayout.vue` (C-001, FR-002)
- [x] T008 Wrap drawer footer section (version + support button `<div>`) with `<footer>` element in `src/layouts/MainLayout.vue` (C-001, FR-002)
- [x] T009 Add `ref` to hamburger `<q-btn>` and implement focus restoration on drawer close — watch `leftDrawerOpen` transition to `false`, call `hamburgerRef.value?.$el?.focus()` in `src/layouts/MainLayout.vue` (R-002, FR-012)

**Checkpoint**: Open app, press Tab — skip-to-content link appears. Screen reader detects landmarks: header, navigation, main, complementary (aside).

---

## Phase 3: User Story 1 — Nawigacja klawiaturą (P1) 🎯 MVP

**Goal**: User can navigate entire calculator flow using only keyboard (Tab, Shift+Tab, Enter, Escape). Focus ring visible on all interactive elements.

**Independent Test**: Open any calculator module. Using only Tab/Shift+Tab/Enter/Escape, navigate through form, submit, and read results — without mouse.

- [x] T010 [US1] Verify tab order is logical in `src/components/contractWork/components/Form.vue` — Tab moves through fields top-to-bottom, left-to-right. Fix any `tabindex` issues if found.
- [x] T011 [US1] Verify tab order in `src/components/selfEmployment/components/Form.vue` (complex form with many sections) — ensure FormSection toggles and nested fields are reachable by keyboard
- [x] T012 [US1] Verify Quasar `q-drawer` Escape key behavior in overlay mode (mobile) — confirm drawer closes on Escape and focus returns to hamburger button (T009). Test in `src/layouts/MainLayout.vue`
- [x] T013 [US1] Verify that `:focus-visible` styles from T002 render correctly on `q-input`, `q-btn`, `q-select`, `q-toggle`, `q-expansion-item` — adjust `src/css/app.scss` if Quasar's default styles conflict (override with higher specificity if needed)
- [x] T014 [US1] Verify skip-to-content link (T004) works — Tab from page load lands on skip link, Enter moves focus to `#main-content`. Test on home page and a calculator module page.

**Checkpoint**: Full keyboard-only flow works: Tab → skip link → form fields → "Oblicz" → Enter → results visible. Focus ring visible on every focused element.

---

## Phase 4: User Story 2 — Odczytywanie przez czytnik ekranowy (P1) 🎯 MVP

**Goal**: Screen reader (NVDA) correctly announces landmarks, headings, form labels, expanded/collapsed state, live results, and notifications.

**Independent Test**: Enable NVDA, open a calculator module. Verify: landmarks list (Insert+F7), heading hierarchy, field labels, aria-expanded on sections, aria-live on results.

### Shared Components

- [x] T015 [US2] Add `:aria-expanded="visible"` and `:aria-label="'Przełącz sekcję: ' + props.title"` to the toggle `<q-btn>` in `src/components/partials/form/FormSection.vue` (C-002, FR-006)
- [x] T016 [P] [US2] Add `aria-live="polite"` to the results slot wrapper `<div>` (the one with `v-if="$slots.results"`) in `src/components/partials/ModulePageLayout.vue` (C-004, FR-007)
- [x] T017 [P] [US2] Add `ariaLabel` prop (type `string`, default `'Wykres danych'`) to `src/components/partials/Chart.vue` — add `role="img"` and `:aria-label="ariaLabel"` to the container `<div ref="chartContainer">` (C-003, FR-016)
- [x] T018 [P] [US2] Add `role="list"` to the parent `<q-list>` wrapper and verify `role="listitem"` on `<q-item>` in `src/components/partials/ListRow.vue` — Quasar may already add these; verify and add if missing (FR-004)

### Heading Hierarchy

- [x] T019 [US2] Add visually hidden `<h1>` element with page/module name for screen reader navigation in `src/layouts/MainLayout.vue` — use `.sr-only` class (add to `src/css/app.scss`: `position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0,0,0,0);`) (R-009, AR-005)
- [x] T020 [US2] Audit all module `pages/Index.vue` files (30 files) to verify `<SectionHeader :level="2">` is used for top-level sections ("Wypełnij formularz", "Podsumowanie") and `:level="3"` for subsections. Files to check: `src/components/accountingWithSpouse/pages/Index.vue`, `src/components/b2bComparator/pages/Index.vue`, `src/components/cashRegisterLimit/pages/Index.vue`, `src/components/contractOfEmployment/pages/Index.vue`, `src/components/contractOfMandate/pages/Index.vue`, `src/components/contractWork/pages/Index.vue`, `src/components/currencyConverter/pages/Index.vue`, `src/components/exchangeRates/pages/Index.vue`, `src/components/exchangeRates/pages/Currency.vue`, `src/components/ikeSavings/pages/IkeSavingsPage.vue`, `src/components/ikzeTaxRelief/pages/Index.vue`, `src/components/inflation/pages/Index.vue`, `src/components/inflation/pages/PurchasingPowerOfMoney.vue`, `src/components/interest/pages/Index.vue`, `src/components/investment/pages/Index.vue`, `src/components/invoice/pages/Index.vue`, `src/components/partialZusContributions/pages/Index.vue`, `src/components/polishBonds/pages/Index.vue`, `src/components/realBoughtCosts/pages/Index.vue`, `src/components/rentalProfit/pages/Index.vue`, `src/components/salaryForUnusedHolidays/pages/Index.vue`, `src/components/salaryStats/pages/Index.vue`, `src/components/selfEmployment/pages/Index.vue`, `src/components/sickPay/pages/Index.vue`, `src/components/unregisteredCompany/pages/Index.vue`, `src/components/vatLimit/pages/Index.vue`, `src/components/changeLogs/pages/Index.vue`, `src/components/contact/pages/Index.vue` (AR-005, FR-003)

### Icon Buttons aria-label

- [x] T021 [US2] Verify all icon-only buttons have `aria-label` — check: hamburger menu button (already has ✅), theme toggle button (already has ✅), scroll-to-top button (already has ✅), FormSection toggle (added in T015), drawer support button in `src/layouts/MainLayout.vue`. Add `aria-label="Wesprzyj twórcę"` to the support `<q-btn>` if missing. (FR-008)

### Notifications

- [x] T022 [US2] Verify Quasar `Notify.create()` in `src/composables/formValidation.ts` includes `role: 'status'` — add it to the Notify config object. Also check `src/composables/useTaxThresholdNotification.ts` for the same. (FR-009)

**Checkpoint**: NVDA announces: landmarks (header, nav, main, complementary), h1→h2 hierarchy, "Przełącz sekcję: [name], rozwinięte/zwinięte", results update after calculation, "wymagane" on required fields.

---

## Phase 5: User Story 3 — Czytelność / kontrast kolorów (P2)

**Goal**: All text, icons, and UI elements meet WCAG AA contrast ratios in both light and dark mode. Lighthouse Accessibility ≥ 90.

**Independent Test**: Run Lighthouse Accessibility audit on home page + 3 calculator modules, in light and dark mode. Run axe-core full scan. Zero critical/serious contrast issues.

- [ ] T023 [US3] Run Lighthouse Accessibility audit on `http://localhost:9000` (home page) in light mode — document score and any issues
- [ ] T024 [P] [US3] Run Lighthouse Accessibility audit on `http://localhost:9000` in dark mode (toggle theme first) — document score and any issues
- [ ] T025 [US3] Run Lighthouse Accessibility audit on 3 calculator module pages (contractWork, selfEmployment, invoice) in light mode — document scores
- [ ] T026 [P] [US3] Run Lighthouse Accessibility audit on same 3 modules in dark mode — document scores
- [ ] T027 [US3] Fix any contrast issues found in T023-T026 by adjusting CSS custom properties in `src/css/_design-tokens.scss` — ensure all text/background pairs meet 4.5:1 for normal text and 3:1 for large text (AR-001, AR-002, AR-003)
- [ ] T028 [US3] Verify `SectionHeader` white text on colored background meets 4.5:1 contrast — check all module brand colors in `src/css/_design-tokens.scss` against `--color-text-on-brand: #FFFFFF` in both light and dark mode. Adjust if needed. (spec Scenario 3, AC 3)
- [ ] T029 [US3] Run axe-core DevTools full scan on home page + 3 modules — verify 0 critical and 0 serious issues. Document results.

**Checkpoint**: Lighthouse Accessibility ≥ 90 on all tested pages (light + dark). axe-core: 0 critical/serious.

---

## Phase 6: User Story 4 — Dostępne formularze z walidacją (P2)

**Goal**: All form fields have proper labels, required fields are marked with `aria-required`, validation messages are linked via `aria-describedby`.

**Independent Test**: Enable NVDA, navigate to a form field — hear label + "required". Submit empty form — hear error message linked to field.

### aria-required on required fields (26 form files, 52 occurrences)

- [x] T030 [P] [US4] Add `aria-required="true"` to all `q-input` fields with required validation rules in `src/components/contractWork/components/Form.vue` (1 field) (C-007, FR-014)
- [x] T031 [P] [US4] Add `aria-required="true"` to required fields in `src/components/selfEmployment/components/Form.vue` (4 fields) (C-007, FR-014)
- [x] T032 [P] [US4] Add `aria-required="true"` to required fields in `src/components/rentalProfit/components/Form.vue` (6 fields) (C-007, FR-014)
- [x] T033 [P] [US4] Add `aria-required="true"` to required fields in `src/components/ikeSavings/components/FormFields.vue` (5 fields) (C-007, FR-014)
- [x] T034 [P] [US4] Add `aria-required="true"` to required fields in `src/components/interest/Form.vue` (4 fields) (C-007, FR-014)
- [x] T035 [P] [US4] Add `aria-required="true"` to required fields in `src/components/salaryForUnusedHolidays/components/Form.vue` (4 fields) (C-007, FR-014)
- [x] T036 [P] [US4] Add `aria-required="true"` to required fields in `src/components/investment/Form.vue` (3 fields) (C-007, FR-014)
- [x] T037 [P] [US4] Add `aria-required="true"` to required fields in `src/components/contact/Form.vue` (2 fields) (C-007, FR-014)
- [x] T038 [P] [US4] Add `aria-required="true"` to required fields in `src/components/exchangeRates/Form.vue` (2 fields) (C-007, FR-014)
- [x] T039 [P] [US4] Add `aria-required="true"` to required fields in `src/components/ikzeTaxRelief/components/Form.vue` (2 fields) (C-007, FR-014)
- [x] T040 [P] [US4] Add `aria-required="true"` to required fields in `src/components/sickPay/components/Form.vue` (2 fields) (C-007, FR-014)
- [x] T041 [P] [US4] Add `aria-required="true"` to required fields in `src/components/polishBonds/components/bondForms/DorForm.vue` (2 fields) (C-007, FR-014)
- [x] T042 [P] [US4] Add `aria-required="true"` to required fields in `src/components/polishBonds/components/bondForms/RorForm.vue` (2 fields) (C-007, FR-014)
- [x] T043 [P] [US4] Add `aria-required="true"` to required fields in remaining polishBonds bond forms: `src/components/polishBonds/components/bondForms/CoiForm.vue`, `EdoForm.vue`, `OtsForm.vue`, `RodForm.vue`, `RosForm.vue`, `TosForm.vue`, `CommonFields.vue` (1 field each, 7 files) (C-007, FR-014)
- [x] T044 [P] [US4] Add `aria-required="true"` to required fields in remaining modules: `src/components/cashRegisterLimit/Form.vue`, `src/components/currencyConverter/Form.vue`, `src/components/inflation/PurchasingPowerOfMoneyStatistics.vue`, `src/components/invoice/Form.vue`, `src/components/polishBonds/components/Form.vue`, `src/components/vatLimit/Form.vue` (1 field each, 6 files) (C-007, FR-014)

### Validation message accessibility

- [x] T045 [US4] Verify that all `q-input` fields with `:rules` have a visible `label` prop (not just placeholder) — audit the 26 form files listed in T030-T044. Fix any fields using placeholder-only labels. (FR-013)
- [x] T046 [US4] Investigate Quasar's `q-input` DOM structure for validation error messages — check if `q-field__messages` div has an `id` that can be referenced by `aria-describedby`. If not, create a lightweight Vue directive `v-aria-describedby` in `src/directives/ariaDescribedby.ts` that auto-links input to its error container after validation triggers. Register it globally in `src/App.vue` or a boot file. (R-001, FR-015)

**Checkpoint**: NVDA announces "required" on required fields. Validation error messages are announced when field has error.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Goal**: Final verification, regression testing, changelog update.

- [x] T047 Run full test suite: `npx vitest run` — verify all 410+ tests pass with 0 failures (SC-007) ✅ 416/416 passed
- [ ] T048 Run final Lighthouse Accessibility audit on home page + contractWork + selfEmployment + invoice in light and dark mode — all must score ≥ 90 (SC-001, AR-007) — MANUAL
- [ ] T049 Run final axe-core full scan on same pages — 0 critical and 0 serious issues (SC-002) — MANUAL
- [ ] T050 Manual keyboard navigation test: open contractWork module, Tab through entire flow (skip link → form → submit → results) without mouse (SC-003) — MANUAL
- [ ] T051 Manual NVDA test: verify landmarks, headings, field labels, expanded/collapsed states, live results announcement, notification role (SC-005) — MANUAL
- [x] T052 Update changelog in `src/components/changeLogs/logs.ts` — add entry for accessibility improvements: "Dostępność WCAG AA — semantyczny HTML, nawigacja klawiaturą, atrybuty ARIA, weryfikacja kontrastu"

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup)          → No dependencies — start immediately
Phase 2 (Landmarks)      → Requires Phase 1 (CSS classes used by landmarks)
Phase 3 (US1: Keyboard)  → Requires Phase 2 (skip link, focus ring, landmarks)
Phase 4 (US2: Screen Reader) → Requires Phase 2 (landmarks must exist)
Phase 5 (US3: Contrast)  → Independent — can run in parallel with Phase 3/4
Phase 6 (US4: Forms)     → Independent — can run in parallel with Phase 3/4/5
Phase 7 (Polish)         → Requires ALL previous phases
```

### Parallel Opportunities

- **Phase 1**: T002 and T003 are parallel (different CSS sections in same file)
- **Phase 3 + Phase 4**: Can run in parallel (different files, different concerns)
- **Phase 4**: T016, T017, T018 are parallel (different component files)
- **Phase 5 + Phase 6**: Can run in parallel (contrast audit vs form attributes)
- **Phase 6**: T030-T044 are ALL parallel (different form files, identical pattern)

### Within Phase 4 (Screen Reader)

```
T015 (FormSection) ──┐
T016 (ModulePageLayout) ──┤── all parallel
T017 (Chart) ──┤
T018 (ListRow) ──┘
T019 (h1) → T020 (heading audit) ── sequential
T021 (icon buttons) ── independent
T022 (notifications) ── independent
```

---

## Implementation Strategy

### MVP (Phase 1-3): Keyboard Navigation

1. Setup: `lang="pl"`, focus ring CSS, skip-to-content CSS
2. Landmarks: `<main>`, `<nav>`, `<footer>`, skip link, drawer focus
3. Keyboard verification: tab order, focus ring, Escape behavior
4. **VALIDATE**: Full keyboard-only flow works

### Increment 2 (Phase 4): Screen Reader Support

1. ARIA attributes on shared components (FormSection, Chart, ModulePageLayout, ListRow)
2. Heading hierarchy audit + visually hidden h1
3. Icon button labels, notification roles
4. **VALIDATE**: NVDA announces all elements correctly

### Increment 3 (Phase 5-6): Contrast + Forms

1. Lighthouse/axe-core audits, contrast fixes
2. `aria-required` across 26 form files
3. Validation message accessibility
4. **VALIDATE**: Lighthouse ≥ 90, axe-core 0 critical/serious

### Final (Phase 7): Regression + Changelog

1. Full test suite, final audits, manual tests
2. Changelog update

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario (US1=Keyboard, US2=Screen Reader, US3=Contrast, US4=Forms)
- No new calculator logic — no new tests needed
- Existing 410+ tests must pass after every phase
- All UI text in Polish language
- This feature modifies ~35 existing files, creates 0 new component files
- The `aria-required` tasks (T030-T044) are mechanical — same pattern applied to 26 files
- Commit after each phase or logical group of tasks
