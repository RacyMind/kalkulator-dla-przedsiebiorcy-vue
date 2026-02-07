# Component API Contracts: Nowoczesny UI/UX

**Feature**: 013-modern-ui-ux
**Date**: 2026-02-07

---

## Modified Components

### 1. `ModulePageLayout.vue`

**Current API**: Single default slot, `max-width: 800px`
**New API**:

```vue
<ModulePageLayout :single-column="false">
  <template #form>
    <!-- Form content -->
  </template>
  <template #results>
    <!-- Results content -->
  </template>
</ModulePageLayout>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `singleColumn` | `boolean` | `false` | Force single column on desktop |

| Slot | Description |
|------|-------------|
| `form` | Left column (desktop) / top section (mobile) — wrapped in `q-card` |
| `results` | Right column (desktop) / bottom section (mobile) — wrapped in `q-card` |

**Breaking change**: Replaces single `default` slot with named `form`/`results` slots. All 29 module pages need migration.

**Migration pattern** (per module):
```vue
<!-- BEFORE -->
<ModulePageLayout>
  <SectionHeader>Dane</SectionHeader>
  <Form />
  <SectionHeader>Wyniki</SectionHeader>
  <ResultList />
</ModulePageLayout>

<!-- AFTER -->
<ModulePageLayout>
  <template #form>
    <SectionHeader :level="2">Dane</SectionHeader>
    <Form />
  </template>
  <template #results>
    <SectionHeader :level="2">Wyniki</SectionHeader>
    <ResultList />
  </template>
</ModulePageLayout>
```

---

### 2. `SectionHeader.vue`

**Current API**: Default slot, styled `<div>`
**New API**:

```vue
<SectionHeader :level="2">Dane do obliczeń</SectionHeader>
```

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `2 \| 3` | `2` | Renders `<h2>` or `<h3>` |

| Slot | Description |
|------|-------------|
| `default` | Heading text content |

**Breaking change**: None — `level` prop has default value. Existing usage works without changes. Rendering changes from `<div>` to `<h2>`/`<h3>` (visual styling preserved).

---

### 3. `ListRow.vue`

**Current API**: Props `name`, `value`, `inline`, `nested`
**New API**:

```vue
<ListRow name="Wynagrodzenie netto" value="3 500,00 zł" :highlighted="true" />
```

| Prop | Type | Default | Status | Description |
|------|------|---------|--------|-------------|
| `name` | `string` | — | EXISTING | Label text |
| `value` | `string` | — | EXISTING | Value text |
| `inline` | `boolean` | `true` | EXISTING | Name + value on same line |
| `nested` | `boolean` | `false` | EXISTING | Indented sub-row |
| `highlighted` | `boolean` | `false` | **NEW** | Accent background from design tokens |

**Breaking change**: None — existing props preserved. Internal rendering migrates from `<div>` to `<q-item>` inside `<q-list>`.

---

### 4. `SubmitButton.vue`

**Current API**: Full-width teal button with disclaimer text
**New API**: Same props/events, visual changes only.

| Change | Before | After |
|--------|--------|-------|
| Button style | Flat color | `rounded`, `unelevated`, primary color from tokens |
| Disclaimer | Full text visible | Smaller text, `text-caption` class |

**Breaking change**: None — visual only.

---

### 5. `Menu.vue`

**Current API**: Receives filtered items, renders `<h6>` headers + `Item` components
**New API**:

```vue
<Menu :sections="menuSections" :search-text="searchText" />
```

Internal structure changes:
- Sections rendered as `q-expansion-item` with icons
- Active section auto-expanded based on current route
- `RecentlyUsed` component rendered at top (hidden if empty)
- Search input filters across all sections

**Breaking change**: Internal restructuring. External API (used only in `MainLayout.vue`) may change — verify during implementation.

---

### 6. `PieChart.vue` (statistics)

**Current API**: Renders pie chart from `usePieChart` data
**New API**: Same props, visual changes:

| Change | Before | After |
|--------|--------|-------|
| Chart type | Pie | Donut (cutout 60%) |
| Animation | None | `animateRotate: true`, 600ms |
| Tooltips | Basic | Interactive with formatted values |
| Responsive | Fixed size | `responsive: true`, `maintainAspectRatio: true` |

**Breaking change**: None — visual only. `usePieChart` composable gains optional `cutout` param with backward-compatible default.

---

## New Components

### 7. `ScrollToTop.vue`

```vue
<ScrollToTop />
```

No props. Uses `q-page-sticky` positioned bottom-right. Visible when scroll position > 300px. Smooth scrolls to top on click.

---

### 8. `SkeletonLoader.vue`

```vue
<SkeletonLoader />
```

No props. Renders `q-skeleton` elements mimicking the two-column module layout (form card + results card).

---

### 9. `RecentlyUsed.vue`

```vue
<RecentlyUsed />
```

No props. Uses `useRecentlyUsed()` composable. Renders `q-expansion-item` with `q-item` links. Hidden when list is empty.

---

## New Composables

### 10. `useRecentlyUsed.ts`

```ts
interface RecentModule {
  path: string
  name: string
  timestamp: number
}

function useRecentlyUsed(): {
  recentModules: ComputedRef<RecentModule[]>
  addRecent: (path: string, name: string) => void
}
```

**Usage**: Call `addRecent()` on module page mount. Read `recentModules` in `RecentlyUsed.vue`.

---

## New CSS

### 11. `_transitions.scss`

```scss
.fade-scale-enter-active,
.fade-scale-leave-active { ... }
.fade-scale-enter-from,
.fade-scale-leave-to { ... }
```

Imported in `app.scss`.

### 12. Design Tokens Extension (`_design-tokens.scss`)

New tokens added to both `:root` and `.body--dark`:
- `--space-xs` through `--space-xl`
- `--radius-sm` through `--radius-lg`
