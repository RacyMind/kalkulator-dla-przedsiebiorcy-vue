# Research: Nowoczesny UI/UX (Modern UI/UX Redesign)

**Feature**: 013-modern-ui-ux
**Date**: 2026-02-07

---

## R1: Quasar `q-layout` — persistent sidebar vs overlay drawer

**Decision**: Use dynamic `q-layout` `view` string based on screen width.

**Rationale**: Quasar's `q-layout` accepts a `view` prop that controls header/footer/drawer positioning. By switching between `"lHh Lpr lFf"` (persistent sidebar) on desktop and `"lHh lpr lFf"` (overlay drawer) on mobile, we get native Quasar behavior without custom CSS hacks. Use `$q.screen.gt.md` (>1200px) to toggle.

**Implementation**:
```vue
<q-layout :view="$q.screen.gt.md ? 'lHh Lpr lFf' : 'lHh lpr lFf'">
  <q-drawer :model-value="$q.screen.gt.md || drawerOpen" :overlay="!$q.screen.gt.md" :breakpoint="0">
```

**Alternatives considered**:
- CSS `position: fixed` sidebar — rejected: doesn't integrate with Quasar layout system
- Quasar `mini` mode — considered for tablet, but adds complexity; deferred to P2

---

## R2: Quasar `q-expansion-item` for menu sections

**Decision**: Replace current `<h6>` section headers with `q-expansion-item` per section, using `v-model` bound to computed that tracks the active route's section.

**Rationale**: `q-expansion-item` provides built-in expand/collapse animation, icon slot, and header customization. Using `default-opened` or `v-model` allows programmatic control for "active section expanded" behavior.

**Implementation**:
```vue
<q-expansion-item
  v-for="section in menuSections"
  :key="section.name"
  :icon="section.icon"
  :label="section.name"
  :default-opened="isActiveSection(section)"
  header-class="text-weight-bold"
>
  <q-item v-for="item in section.items" clickable :to="item.to">
    <q-item-section>{{ item.name }}</q-item-section>
  </q-item>
</q-expansion-item>
```

**Alternatives considered**:
- Custom accordion component — rejected: Quasar provides this natively
- `q-list` with `q-item` group headers — rejected: no built-in expand/collapse

---

## R3: Page transition — fade + scale

**Decision**: Use Vue `<transition>` with custom CSS class for fade + subtle scale (opacity 0→1, scale 0.95→1.0, 200ms).

**Rationale**: CSS-only transitions are performant and don't require JavaScript animation libraries. Vue Router's `<router-view v-slot>` pattern supports this natively.

**Implementation** (`_transitions.scss`):
```scss
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}
.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
```

Usage in `MainLayout.vue`:
```vue
<router-view v-slot="{ Component }">
  <transition name="fade-scale" mode="out-in">
    <component :is="Component" />
  </transition>
</router-view>
```

**Alternatives considered**:
- Slide left/right — rejected: requires direction tracking, not suitable for non-linear navigation
- Simple fade — rejected: less modern feel than fade+scale
- Quasar built-in transitions (`q-transition`) — considered, but custom CSS gives more control over timing

---

## R4: chart.js donut configuration

**Decision**: Modify `usePieChart` composable to accept optional `cutout` parameter (default 60%) and enable tooltip plugin.

**Rationale**: chart.js pie chart becomes a donut chart by setting `cutout: '60%'` in dataset options. The existing `usePieChart` composable returns chart data — adding cutout and animation config is non-breaking.

**Implementation**:
```ts
export function usePieChart(labels: string[], values: number[], cutout = '60%') {
  const { chartColors } = useChartColors()
  const colors = Object.values(chartColors.value)

  return {
    datasets: [{
      backgroundColor: colors.slice(0, values.length),
      data: values,
      cutout,
    }],
    labels,
  }
}
```

Chart options (in `PieChart.vue`):
```ts
const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  animation: { animateRotate: true, duration: 600 },
  plugins: {
    tooltip: { enabled: true },
    legend: { position: 'bottom' },
  },
}
```

**Alternatives considered**:
- Separate `useDonutChart` composable — rejected: unnecessary duplication, donut is just a pie with cutout
- Different chart library (ApexCharts) — rejected: chart.js already in use, no need for migration

---

## R5: localStorage for "Recently Used" modules

**Decision**: Use `@vueuse/core` `useLocalStorage` composable for reactive localStorage binding. Store array of `{ path: string, name: string, timestamp: number }`, max 5, sorted by most recent.

**Rationale**: `@vueuse/core` is already a project dependency and provides reactive localStorage with SSR safety, type inference, and automatic serialization.

**Implementation** (`useRecentlyUsed.ts`):
```ts
import { useLocalStorage } from '@vueuse/core'
import { computed } from 'vue'

interface RecentModule {
  path: string
  name: string
  timestamp: number
}

const MAX_RECENT = 5

export function useRecentlyUsed() {
  const recent = useLocalStorage<RecentModule[]>('recently-used-modules', [])

  const addRecent = (path: string, name: string) => {
    const filtered = recent.value.filter(m => m.path !== path)
    filtered.unshift({ path, name, timestamp: Date.now() })
    recent.value = filtered.slice(0, MAX_RECENT)
  }

  const recentModules = computed(() => recent.value)

  return { recentModules, addRecent }
}
```

**Alternatives considered**:
- Raw `localStorage` API — rejected: no reactivity, manual JSON parsing
- Pinia store with `localStorage` plugin — rejected: overkill for a simple list
- `sessionStorage` — rejected: data should persist across browser sessions

---

## R6: Icon generation pipeline (SVG → PNG variants)

**Decision**: Design new SVG manually, then use `sharp` (Node.js) or Inkscape CLI to batch-generate all PNG sizes. One-time script, not part of build process.

**Rationale**: The project needs ~26 PNG files at specific sizes plus favicon.ico. A simple Node.js script using `sharp` can read the SVG and output all sizes programmatically. This is faster and more consistent than manual export.

**Implementation** (one-time script):
```js
// scripts/generate-icons.mjs
import sharp from 'sharp'
const sizes = {
  'favicon-16x16.png': 16, 'favicon-32x32.png': 32,
  'favicon-96x96.png': 96, 'favicon-128x128.png': 128,
  'favicon-512x512.png': 512,
  'icon-128x128.png': 128, 'icon-192x192.png': 192,
  'icon-256x256.png': 256, 'icon-384x384.png': 384,
  'icon-512x512.png': 512,
  'apple-icon-120x120.png': 120, 'apple-icon-152x152.png': 152,
  'apple-icon-167x167.png': 167, 'apple-icon-180x180.png': 180,
  'ms-icon-144x144.png': 144,
}
for (const [name, size] of Object.entries(sizes)) {
  await sharp('src/assets/app-icon.svg').resize(size, size).png().toFile(`public/icons/${name}`)
}
```

**Alternatives considered**:
- Figma export — rejected: requires Figma license and manual work
- Inkscape CLI — viable alternative but requires Inkscape installation
- Online generators (realfavicongenerator.net) — rejected: less control, external dependency

---

## R7: Quasar breakpoint alignment

**Decision**: Use Quasar's built-in breakpoints via `$q.screen` API and SCSS variables. Map spec breakpoints to Quasar: mobile = `xs`+`sm` (<600px), tablet = `md` (600–1200px), desktop = `lg`+`xl` (>1200px).

**Rationale**: Quasar provides `$q.screen.lt.md`, `$q.screen.gt.md`, etc., plus SCSS `$breakpoint-*` variables. Using these ensures consistency with Quasar's grid system (`col-xs-12 col-md-6 col-lg-4`).

**Mapping**:
| Spec breakpoint | Quasar | `$q.screen` |
|----------------|--------|-------------|
| Mobile (<600px) | xs, sm | `$q.screen.lt.md` |
| Tablet (600–1200px) | md | `$q.screen.md` |
| Desktop (>1200px) | lg, xl | `$q.screen.gt.md` |
| Ultra-wide (>2560px) | Custom | `$q.screen.width > 2560` |

**Alternatives considered**:
- Custom CSS media queries — rejected: Quasar already has a breakpoint system
- Tailwind-style breakpoints — rejected: project uses Quasar, not Tailwind

---

## R8: Two-column module layout implementation

**Decision**: Use Quasar's `row`/`col` grid classes inside `ModulePageLayout`. Default: `col-lg-5` (form) + `col-lg-7` (results). Prop `singleColumn` forces `col-12` for both.

**Rationale**: Quasar's flexbox grid is responsive by default. Using `col-12 col-lg-5` means mobile gets full-width, desktop gets two columns — no custom media queries needed.

**Implementation sketch**:
```vue
<template>
  <q-page class="q-pa-md">
    <div class="row q-col-gutter-md" style="max-width: 1200px; margin: 0 auto;">
      <div :class="columnClass">
        <slot name="form" />
      </div>
      <div :class="columnClass">
        <slot name="results" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
const props = defineProps({ singleColumn: { type: Boolean, default: false } })
const columnClass = computed(() => props.singleColumn ? 'col-12' : 'col-12 col-lg-5')
</script>
```

**Alternatives considered**:
- CSS Grid — viable but Quasar's flexbox grid is more consistent with rest of app
- Fixed pixel widths — rejected: not responsive

---

## R9: Skeleton loader for lazy-loaded modules

**Decision**: Use Quasar's `q-skeleton` component to create a `SkeletonLoader.vue` that mimics the module page layout (form card + results card shapes).

**Rationale**: Quasar provides `q-skeleton` with type variants (text, rect, QInput, QBtn). A skeleton that matches the two-column module layout gives the best perceived performance.

**Implementation**: Wrap `<Suspense>` around `<router-view>` with `#fallback` slot containing the skeleton loader.

```vue
<router-view v-slot="{ Component }">
  <Suspense>
    <template #default>
      <transition name="fade-scale" mode="out-in">
        <component :is="Component" />
      </transition>
    </template>
    <template #fallback>
      <SkeletonLoader />
    </template>
  </Suspense>
</router-view>
```

**Alternatives considered**:
- Loading spinner — rejected: skeleton loaders give better UX
- Per-module loading state — rejected: too granular, `Suspense` handles all lazy components

