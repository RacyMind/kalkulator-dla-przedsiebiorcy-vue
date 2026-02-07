# Tasks: Nowoczesny UI/UX (Modern UI/UX Redesign)

**Input**: Documents from `/specs/013-modern-ui-ux/`
**Required**: plan.md, spec.md

**Tests**: No new calculator tests required — presentation-layer only. Existing 410+ tests MUST pass after all changes.

**Organization**: Tasks grouped by user scenarios from spec.md.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## User Story Mapping

| US | Scenario | Priority | Description |
|----|----------|----------|-------------|
| US8 | Scenario 8 | P1 MVP | Design Tokens: spacing & border-radius |
| US1 | Scenario 1 | P1 MVP | Responsywny layout |
| US3 | Scenario 3 | P1 MVP | Header i sidebar/drawer |
| US4 | Scenario 4 | P1 MVP | Layout stron modułów |
| US2 | Scenario 2 | P1 MVP | Dashboard |
| US9 | Scenario 9 | P1 MVP | Ikona aplikacji |
| US5 | Scenario 5 | P2 | Nowoczesne formularze |
| US6 | Scenario 6 | P2 | Wyniki i wykresy |
| US7 | Scenario 7 | P2 | Nawigacja i mikro-interakcje |

---

## Phase 1: Setup

**Goal**: Prepare project structure and verify baseline

- [x] T001 Verify all existing tests pass: `npx vitest run`
- [x] T002 [P] Create icon generation script `scripts/generate-icons.mjs` (using `sharp` — see research.md R6)
- [x] T003 [P] Install `sharp` as dev dependency: `npm install --save-dev sharp`

**Checkpoint**: Baseline green, tooling ready

---

## Phase 2: US8 — Design Tokens & CSS Foundation (P1) 🎯 MVP

**Goal**: Extend design token system with spacing, border-radius, and page transition CSS. This is foundational — all visual phases depend on it.

**Independent Test**: Open any page, inspect CSS custom properties in DevTools → `--space-xs` through `--space-xl` and `--radius-sm` through `--radius-lg` exist in both `:root` and `.body--dark`.

- [x] T004 [US8] Add spacing tokens (`--space-xs` 4px, `--space-sm` 8px, `--space-md` 16px, `--space-lg` 24px, `--space-xl` 32px) to `:root` and `.body--dark` in `src/css/_design-tokens.scss`
- [x] T005 [P] [US8] Add border-radius tokens (`--radius-sm` 4px, `--radius-md` 8px, `--radius-lg` 16px) to `:root` and `.body--dark` in `src/css/_design-tokens.scss`
- [x] T006 [P] [US8] Create `src/css/_transitions.scss` with fade-scale transition classes (opacity 0→1, scale 0.95→1.0, 200ms) per research.md R3
- [x] T007 [US8] Import `_transitions.scss` in `src/css/app.scss`

**Checkpoint**: Design tokens available, transition CSS loaded

---

## Phase 3: US1 + US3 — Responsive Layout & Sidebar (P1) 🎯 MVP

**Goal**: Persistent sidebar on desktop (>1200px), overlay drawer on mobile/tablet. Header always visible, breadcrumbs hidden on `/`. Menu with `q-expansion-item`, search, recently used, footer.

**Independent Test**: Open app at 320px, 768px, 1440px — verify sidebar behavior, header visibility, breadcrumbs presence/absence, menu sections with icons.

### Composables & Stores

- [x] T008 [US3] Create `src/composables/useRecentlyUsed.ts` — localStorage composable (max 5 modules, reactive, dedup) per research.md R5
- [x] T009 [US3] Write unit test for `useRecentlyUsed` in `test/vitest/__tests__/composables/useRecentlyUsed.test.ts` — test add, dedup, max 5, empty state

### Sidebar Components

- [x] T010 [US3] Create `src/components/partials/menu/RecentlyUsed.vue` — `q-expansion-item` with max 5 `q-item` links, hidden when empty, uses `useRecentlyUsed()`
- [x] T011 [US3] Refactor `src/components/partials/menu/Menu.vue` — replace `<h6>` section headers with `q-expansion-item` per section, add section icons, active section auto-expanded based on current route per research.md R2
- [x] T012 [US3] Update `src/components/partials/menu/menuItems.ts` — add `icon` field per section (e.g., `mdi-domain` for Firma, `mdi-cash` for Podatki, `mdi-briefcase` for Praca, `mdi-piggy-bank` for Oszczędzanie, `mdi-currency-usd` for Waluty, `mdi-information` for Informacje, `mdi-application` for Aplikacja)
- [x] T013 [US3] Integrate `RecentlyUsed.vue` at the top of `Menu.vue` (above search or below search, before sections)

### MainLayout

- [x] T014 [US1] Refactor `src/layouts/MainLayout.vue` — dynamic `q-layout` view string: persistent sidebar `"lHh Lpr lFf"` on `$q.screen.gt.md`, overlay `"lHh lpr lFf"` on mobile/tablet per research.md R1
- [x] T015 [US1] Update `q-drawer` in `MainLayout.vue` — `:model-value="$q.screen.gt.md || drawerOpen"`, `:overlay="!$q.screen.gt.md"`, `:breakpoint="0"`, add scrollable content area
- [x] T016 [US1] Update `q-header` in `MainLayout.vue` — remove `v-if="breadcrumbStore.items.length"`, make header always visible. Hide hamburger button when `$q.screen.gt.md`
- [x] T017 [US3] Update breadcrumbs in `MainLayout.vue` — hide breadcrumbs section when on route `/` (home page), show on all other routes
- [x] T018 [US3] Add sidebar footer inside `q-drawer` in `MainLayout.vue` — app version + "Wesprzyj projekt" button (move from `Footer.vue`)
- [x] T019 [US3] Call `useRecentlyUsed().addRecent()` in `MainLayout.vue` on route change (watch `$route.path`) to track module visits

**Checkpoint**: Layout is responsive, sidebar persistent on desktop, menu has expansion items with icons, recently used works, header always visible

---

## Phase 4: US4 — Module Page Components (P1) 🎯 MVP

**Goal**: Redesign shared module components: `ModulePageLayout` (q-card, two-column, 1200px), `SectionHeader` (semantic heading), `ListRow` (q-item migration).

**Independent Test**: Open a single module (e.g., `/umowa-o-dzielo`) on desktop and mobile — verify q-card wrappers, two columns on desktop, single column on mobile, section headers as `<h2>`.

- [x] T020 [US4] Refactor `src/components/partials/ModulePageLayout.vue` — replace single default slot with named `form`/`results` slots, wrap each in `q-card` with `q-card-section`, set `max-width: 1200px`, implement two-column layout (`col-12 col-lg-5` / `col-12 col-lg-7`) with `singleColumn` prop per contracts/component-api.md
- [x] T021 [P] [US4] Refactor `src/components/partials/SectionHeader.vue` — add `level` prop (default `2`), render `<h2>` or `<h3>` instead of `<div>`, preserve brand color styling per contracts/component-api.md
- [x] T022 [P] [US4] Refactor `src/components/partials/ListRow.vue` — migrate from custom `<div>` to `q-item` inside `q-list`, add `highlighted` prop with accent background, preserve existing API (`name`, `value`, `inline`, `nested`) per contracts/component-api.md
- [x] T023 [US4] Migrate reference module `src/components/contractWork/pages/Index.vue` to new `ModulePageLayout` slots (`#form` / `#results`) and verify two-column layout works
- [x] T024 [US4] Run all tests after reference module migration: `npx vitest run`

**Checkpoint**: Shared components redesigned, reference module (contractWork) works with new layout, all tests pass

---

## Phase 5: US2 — Dashboard (P1) 🎯 MVP

**Goal**: New home page with hero section and responsive tile grid (6 sections, 1/2/3 columns).

**Independent Test**: Open `/` — verify hero section with logo, tile grid with module cards grouped in 6 sections, responsive columns (1 on mobile, 2 on tablet, 3 on desktop), click tile → navigates to module.

- [x] T025 [US2] Update `src/components/partials/menu/menuItems.ts` — add `description` field per module item (short Polish text for dashboard tiles)
- [x] T026 [US2] Redesign `src/pages/Index.vue` — hero section with app logo (`app-icon.svg`) + description text, responsive tile grid using `q-card` per section
- [x] T027 [US2] Implement tile grid in `Index.vue` — iterate 6 sections (filter out "Aplikacja"), render section header + `q-card` tiles with icon, name, description, module color from design tokens. Grid: `col-12` mobile, `col-6` tablet, `col-4` desktop
- [x] T028 [US2] Add entry animations to dashboard tiles — intersection observer + CSS transition (fade-in on scroll) per ROADMAP.md
- [x] T029 [US2] Verify dashboard renders all modules (29+) from `menuItems.ts` data source, no duplicate data

**Checkpoint**: Dashboard shows all modules in responsive grid, navigation works

---

## Phase 6: US9 — App Icon & Branding (P1) 🎯 MVP

**Goal**: New app icon with `#1565C0` primary color, modern style, all PNG/ICO variants generated.

**Independent Test**: Open app in browser — verify new favicon in tab. Install PWA on phone — verify new icon on home screen. Check `manifest.json` theme_color.

- [x] T030 [US9] Design new `src/assets/app-icon.svg` — use `#1565C0` as primary color, modern clean style, keep PIT/VAT/+/% motif for brand recognition
- [ ] T031 [US9] Run `node scripts/generate-icons.mjs` to generate all PNG variants in `public/icons/` (favicons 16/32/96/128/512, PWA 128/192/256/384/512, Apple 120/152/167/180, MS 144)
- [ ] T032 [P] [US9] Update `public/favicon.ico` and `public/icons/safari-pinned-tab.svg` with new design
- [ ] T033 [P] [US9] Update `src/assets/favicon-512x512.png` with new icon
- [x] T034 [US9] Update `src-pwa/manifest.json` — set `background_color` and `theme_color` to `#1565C0`
- [ ] T035 [P] [US9] Update Capacitor iOS assets: `src-capacitor/ios/App/App/Assets.xcassets/AppIcon.appiconset/` (all sizes) and `Splash.imageset/` (3 sizes)
- [ ] T036 [P] [US9] Update Apple launch screens in `public/icons/` (10 `apple-launch-*` files) with new branding colors

**Checkpoint**: New icon visible in browser tab, PWA manifest updated, all icon variants generated

---

## Phase 7: US5 — Modern Forms (P2)

**Goal**: Consistent `outlined` variant on all form inputs, modern submit button.

**Independent Test**: Open any module with a form — verify all `q-input`/`q-select` have `outlined` variant, submit button has rounded corners and primary color.

- [x] T037 [US5] Refactor `src/components/partials/form/SubmitButton.vue` — modern button style (`rounded`, `unelevated`, primary color from tokens), discreet disclaimer (`text-caption` class) per contracts/component-api.md
- [x] T038 [US5] Add global `outlined` variant to all `q-input` and `q-select` components — either via Quasar plugin defaults in `quasar.config.ts` or per-component update across modules

**Checkpoint**: All form inputs have `outlined` variant, submit button is modern

---

## Phase 8: US6 — Results & Charts (P2)

**Goal**: Donut charts with animations and tooltips, responsive charts.

**Independent Test**: Open a module with a chart (e.g., `/umowa-o-dzielo`) — verify donut (not filled pie), hover shows tooltip, chart resizes with window.

- [x] T039 [US6] Update `src/composables/usePieChart.ts` — add optional `cutout` parameter (default `'60%'`) per research.md R4
- [x] T040 [US6] Update `src/components/partials/statistics/PieChart.vue` — add chart options: `responsive: true`, `maintainAspectRatio: true`, `animation.animateRotate: true` (600ms), `plugins.tooltip.enabled: true`, `plugins.legend.position: 'bottom'` per research.md R4
- [x] T041 [P] [US6] Update `src/components/partials/Chart.vue` — ensure responsive options are set globally for all chart types

**Checkpoint**: Charts render as donuts with animations and tooltips

---

## Phase 9: US7 — Navigation & Micro-interactions (P2)

**Goal**: Scroll-to-top button, skeleton loader for lazy modules, fade+scale page transitions.

**Independent Test**: Scroll down on any module page — verify "Powrót na górę" button appears. Navigate between modules — verify fade+scale transition. Navigate to a module for the first time — verify skeleton loader flashes briefly.

- [x] T042 [US7] Create `src/components/partials/ScrollToTop.vue` — `q-page-sticky` bottom-right, visible when scroll > 300px, smooth scroll to top on click, icon `mdi-chevron-up`
- [x] T043 [US7] Add `ScrollToTop` component to `src/layouts/MainLayout.vue`
- [x] T044 [US7] Create `src/components/partials/SkeletonLoader.vue` — `q-skeleton` elements mimicking two-column module layout (form card + results card) per research.md R9
- [x] T045 [US7] Wrap `<router-view>` in `MainLayout.vue` with `<Suspense>` + `<transition name="fade-scale">` — use `SkeletonLoader` as fallback per research.md R9
- [x] T046 [US7] Verify page transitions work correctly with Vue Router navigation (forward, back, direct URL)

**Checkpoint**: Scroll-to-top visible, skeleton loaders on lazy load, fade+scale transitions on navigation

---

## Phase 10: Module Migration

**Goal**: Migrate all 29 module pages to new `ModulePageLayout` named slots (`#form` / `#results`), apply `outlined` inputs, verify each module visually.

**Independent Test**: Open every module — verify two-column layout on desktop, single column on mobile, no visual regressions, all forms have `outlined` inputs.

### Batch 1 — Praca (Work)

- [x] T047 Migrate `src/components/contractOfEmployment/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T048 [P] Migrate `src/components/contractOfMandate/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T049 [P] Migrate `src/components/sickPay/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T050 [P] Migrate `src/components/salaryForUnusedHolidays/pages/Index.vue` to new `ModulePageLayout` slots

### Batch 2 — Firma (Business)

- [x] T051 [P] Migrate `src/components/selfEmployment/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T052 [P] Migrate `src/components/invoice/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T053 [P] Migrate `src/components/unregisteredCompany/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T054 [P] Migrate `src/components/cashRegisterLimit/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T055 [P] Migrate `src/components/vatLimit/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T056 [P] Migrate `src/components/partialZusContributions/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T057 [P] Migrate `src/components/rentalProfit/pages/Index.vue` to new `ModulePageLayout` slots

### Batch 3 — Podatki & Porównywarki (Taxes & Comparators)

- [x] T058 [P] Migrate `src/components/b2bComparator/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T059 [P] Migrate `src/components/accountingWithSpouse/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T060 [P] Migrate `src/components/realBoughtCosts/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T061 [P] Migrate `src/components/ikzeTaxRelief/pages/Index.vue` to new `ModulePageLayout` slots

### Batch 4 — Oszczędzanie & Waluty (Savings & Currencies)

- [x] T062 [P] Migrate `src/components/investment/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T063 [P] Migrate `src/components/interest/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T064 [P] Migrate `src/components/polishBonds/pages/Index.vue` to new `ModulePageLayout` slots
- [x] T065 [P] Migrate `src/components/ikeSavings/pages/IkeSavingsPage.vue` to new `ModulePageLayout` slots
- [x] T066 [P] Migrate `src/components/currencyConverter/pages/Index.vue` to new `ModulePageLayout` slots (`singleColumn`)
- [x] T067 [P] Migrate `src/components/exchangeRates/pages/Index.vue` to new `ModulePageLayout` slots (`singleColumn`)
- [x] T068 [P] Migrate `src/components/exchangeRates/pages/Currency.vue` to new `ModulePageLayout` slots (`singleColumn`)

### Batch 5 — Informacje & Aplikacja (Info pages — singleColumn)

- [x] T069 [P] Migrate `src/components/inflation/pages/Index.vue` to new `ModulePageLayout` slots (`singleColumn`)
- [x] T070 [P] Migrate `src/components/inflation/pages/PurchasingPowerOfMoney.vue` to new `ModulePageLayout` slots (`singleColumn`)
- [x] T071 [P] Migrate `src/components/salaryStats/pages/Index.vue` to new `ModulePageLayout` slots (`singleColumn`)
- [x] T072 [P] Migrate `src/components/terms/pages/Index.vue` to new `ModulePageLayout` slots (`singleColumn`)

### Verification

- [x] T073 Run all tests after full migration: `npx vitest run`
- [x] T074 Visual audit — open every module on desktop (1440px) and mobile (375px), verify layout, no regressions

**Checkpoint**: All 29 modules migrated, all tests pass, visual audit complete

---

## Phase 11: Polish & Verification

**Goal**: Dark mode audit, responsive audit, changelog, final test run.

- [x] T075 Dark mode audit — verify all new components (q-card shadows, gradients, dashboard tiles, donut charts, skeleton loaders) in dark mode
- [x] T076 Responsive audit — test on 5 breakpoints (320px, 768px, 1024px, 1440px, 2560px), verify layout, sidebar, dashboard grid, module pages
- [x] T077 Update changelog in `src/components/changeLogs/logs.ts` — add entry for v6.0.0 describing: new dashboard, responsive layout, persistent sidebar, modern components, new app icon
- [x] T078 Final test run: `npx vitest run` — all 410+ tests MUST pass
- [x] T079 Performance check — verify First Input Delay is not degraded, no new heavy JS bundles

**Checkpoint**: All quality gates pass, ready for release

---

## Dependencies and Execution Order

### Phase Dependencies

```
Phase 1 (Setup)
  └─→ Phase 2 (US8 Design Tokens) ──── BLOCKS ALL VISUAL PHASES
        ├─→ Phase 3 (US1+US3 Layout & Sidebar)
        │     ├─→ Phase 5 (US2 Dashboard)
        │     └─→ Phase 9 (US7 Navigation UX)
        ├─→ Phase 4 (US4 Module Components)
        │     └─→ Phase 10 (Module Migration) ←── also needs Phase 7, 8
        ├─→ Phase 6 (US9 App Icon) ──── INDEPENDENT
        ├─→ Phase 7 (US5 Forms)
        └─→ Phase 8 (US6 Charts)

Phase 10 (Module Migration) ←── needs Phase 3, 4, 7, 8 complete
  └─→ Phase 11 (Polish)
```

### Parallel Opportunities

| Parallel group | Tasks | Condition |
|----------------|-------|-----------|
| Design tokens + transitions | T004, T005, T006 | All in different CSS sections |
| Sidebar components | T010, T011, T012 | Different files, can develop simultaneously |
| Module page components | T021, T022 | SectionHeader and ListRow are independent files |
| Icon generation | T032, T033, T035, T036 | All independent file updates after T031 |
| Phase 6 (US9) | Entire phase | Independent of Phase 3, 4, 5 |
| Module migration batches | T047–T072 | All modules independent of each other |

### User Story Independence

| Story | Can start after | Independent test |
|-------|----------------|-----------------|
| US8 (Tokens) | Phase 1 | Inspect CSS custom properties in DevTools |
| US1+US3 (Layout) | US8 | Resize browser, check sidebar/header behavior |
| US2 (Dashboard) | US1+US3 | Open `/`, check tiles and navigation |
| US4 (Module Layout) | US8 | Open reference module, check cards and columns |
| US9 (Icon) | Phase 1 | Check favicon in browser tab |
| US5 (Forms) | US8 | Open any form, check `outlined` variant |
| US6 (Charts) | US8 | Open module with chart, check donut |
| US7 (Nav UX) | US1+US3 | Scroll, navigate, check transitions |

---

## Implementation Strategy

### MVP (Phase 1–6) — P1 Stories

1. Design tokens foundation
2. Responsive layout with persistent sidebar
3. Module page redesign (reference module)
4. Dashboard with tile grid
5. New app icon
6. **VALIDATE**: All tests pass, layout works on 5 breakpoints

### Full Implementation (Phase 7–11) — P2 Stories + Migration

7. Modern forms (outlined inputs)
8. Donut charts with tooltips
9. Navigation UX (scroll-to-top, skeleton, transitions)
10. Migrate all 29 modules
11. Polish, dark mode audit, final verification

### Suggested MVP Scope

Start with **Phase 1 → Phase 2 → Phase 3 → Phase 4** (T001–T024). This gives you:
- Working responsive layout with persistent sidebar
- Modern module page with two-column layout
- One fully migrated reference module (contractWork)
- All existing tests passing

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- No new calculator logic — presentation layer only
- All 410+ existing tests must pass after every phase
- Use `src/components/contractWork/` as reference for module migration pattern
- `singleColumn` modules: exchangeRates, currencyConverter, inflation, salaryStats, terms
- Test command: `npx vitest run`
- Dev server: `npm start` → http://localhost:9000
