# Quickstart: Nowoczesny UI/UX (Modern UI/UX Redesign)

**Feature**: 013-modern-ui-ux
**Date**: 2026-02-07

---

## Prerequisites

- Node.js >= 20.0.0
- npm >= 6.13.4
- Branch `013-modern-ui-ux` checked out

## Setup

```bash
npm install
```

No new dependencies required — all libraries (`quasar`, `chart.js`, `vue-chartjs`, `@vueuse/core`) are already in `package.json`.

## Development

```bash
npm start
# → quasar dev -m pwa → http://localhost:9000
```

## Implementation Order

### Phase A — Foundation (no visual changes, no module breakage)

1. **Design tokens** — extend `_design-tokens.scss` with spacing + border-radius tokens
2. **CSS transitions** — create `_transitions.scss`, import in `app.scss`
3. **`useRecentlyUsed` composable** — create and unit test
4. **`usePieChart` update** — add optional `cutout` param (backward-compatible)

### Phase B — Layout Shell (MainLayout changes)

5. **`MainLayout.vue`** — persistent sidebar on desktop, always-visible header, breadcrumbs hidden on `/`, page transitions with `<Suspense>` + skeleton
6. **`Menu.vue`** — migrate to `q-expansion-item`, add section icons, active section auto-expand
7. **`RecentlyUsed.vue`** — create component, integrate in Menu/sidebar
8. **`ScrollToTop.vue`** — create `q-page-sticky` component
9. **`SkeletonLoader.vue`** — create skeleton component

### Phase C — Shared Components (migrate partials)

10. **`SectionHeader.vue`** — add `level` prop, render `<h2>`/`<h3>`
11. **`ListRow.vue`** — migrate to `q-item`/`q-list`, add `highlighted` prop
12. **`SubmitButton.vue`** — modern button style, discreet disclaimer
13. **`PieChart.vue`** — donut config, animations, tooltips

### Phase D — Pages

14. **`Index.vue` (Dashboard)** — hero section + tile grid with 6 sections
15. **`menuItems.ts`** — add `icon` and `description` per module/section
16. **`ModulePageLayout.vue`** — `q-card` wrapper, two-column layout, `singleColumn` prop
17. **Module pages migration** — update all 29 modules to use new `form`/`results` slots
18. **Form inputs** — add `outlined` variant to all `q-input`/`q-select` across modules

### Phase E — App Icon & Branding

19. **Design new SVG** (`app-icon.svg`) — new colors (#1565C0), modern style
20. **Generate all PNG variants** — run icon generation script
21. **Update `manifest.json`** — `theme_color`, `background_color`
22. **Update Capacitor assets** — iOS AppIcon, Splash, Android mipmap

### Phase F — Polish & Verification

23. **Dark mode audit** — verify all new components in dark mode
24. **Responsive audit** — test on 320px, 768px, 1024px, 1440px, 2560px
25. **Run all tests** — `npx vitest run` — all 410+ must pass
26. **Changelog** — update `src/components/changeLogs/logs.ts`

## Key Commands

```bash
# Dev server
npm start

# Run all tests
npx vitest run

# Run specific test
npx vitest run test/vitest/__tests__/modules/<moduleName>/<testName>.test.ts

# Build PWA
npm run build

# Build Android
npm run build:android

# Lint
npm run lint-fix

# Generate icons (one-time, after designing SVG)
node scripts/generate-icons.mjs
```

## Key Files to Reference

| File | Purpose |
|------|---------|
| `src/components/contractWork/pages/Index.vue` | Reference module page (migration pattern) |
| `src/components/partials/menu/menuItems.ts` | Module data source for dashboard + menu |
| `src/css/_design-tokens.scss` | Design token system |
| `src/layouts/MainLayout.vue` | Main layout (persistent sidebar target) |
| `src/composables/usePieChart.ts` | Chart composable (donut upgrade) |
| `src/composables/useScrollToResults.ts` | Existing scroll composable |

## Testing Strategy

- **No new calculator tests** — this is a presentation-layer feature
- **Existing tests must pass** — `npx vitest run` (410+ tests)
- **Visual verification** — manual testing on 5 breakpoints + dark mode
- **Composable test** — unit test for `useRecentlyUsed` (add, dedup, max 5, persistence)

## Risk Areas

| Risk | Mitigation |
|------|------------|
| `ModulePageLayout` slot migration breaks modules | Migrate one module at a time, test visually after each |
| `ListRow` q-item migration changes spacing | Compare old/new side-by-side, preserve existing CSS dimensions |
| Persistent sidebar breaks mobile layout | Use `$q.screen.gt.md` to conditionally enable |
| chart.js donut cutout looks wrong | Test with existing chart data before global rollout |
| Icon generation quality loss at small sizes | Verify 16x16 and 32x32 manually |
