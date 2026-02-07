# Data Model: Nowoczesny UI/UX (Modern UI/UX Redesign)

**Feature**: 013-modern-ui-ux
**Date**: 2026-02-07

---

> Note: This feature is presentation-layer only — no backend, no database. The "data model" describes component interfaces, localStorage structures, and design token schemas.

## Entities

### 1. RecentModule (localStorage)

Persisted in `localStorage` key: `recently-used-modules`

| Field | Type | Description |
|-------|------|-------------|
| `path` | `string` | Route path (e.g., `/umowa-o-dzielo`) |
| `name` | `string` | Module display name (e.g., `Umowa o dzieło`) |
| `timestamp` | `number` | `Date.now()` of last visit |

**Rules**:
- Max 5 entries
- Sorted by `timestamp` descending (most recent first)
- Duplicate `path` is overwritten (timestamp updated, moved to top)
- Empty array on first visit → section hidden in sidebar

**Lifecycle**: Entry created on module page mount → list trimmed to 5 → persisted to localStorage

---

### 2. MenuItem (from `menuItems.ts`)

Extended with new fields for dashboard and sidebar.

| Field | Type | Status | Description |
|-------|------|--------|-------------|
| `name` | `string` | EXISTING | Module name |
| `to` | `string` | EXISTING | Route path |
| `icon` | `string` | **NEW** | Quasar icon name (e.g., `mdi-calculator`) |
| `description` | `string` | **NEW** | Short description for dashboard tile |

---

### 3. MenuSection (from `menuItems.ts`)

Extended with icon for `q-expansion-item`.

| Field | Type | Status | Description |
|-------|------|--------|-------------|
| `name` | `string` | EXISTING | Section name (Firma, Praca, etc.) |
| `items` | `MenuItem[]` | EXISTING | Section items |
| `icon` | `string` | **NEW** | Section icon for `q-expansion-item` |
| `color` | `string` | **NEW** | CSS custom property name (e.g., `--module-work`) |

---

### 4. Design Tokens (CSS Custom Properties)

Extended in `_design-tokens.scss`.

#### New spacing tokens (`:root` and `.body--dark`)

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps (icon margins) |
| `--space-sm` | `8px` | Small gaps (list item padding) |
| `--space-md` | `16px` | Medium gaps (card padding, section margins) |
| `--space-lg` | `24px` | Large gaps (section separators) |
| `--space-xl` | `32px` | Extra large gaps (page sections) |

#### New border-radius tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `4px` | Subtle rounding (buttons, inputs) |
| `--radius-md` | `8px` | Standard rounding (cards) |
| `--radius-lg` | `16px` | Strong rounding (tiles, hero) |

---

### 5. ModulePageLayout Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `singleColumn` | `boolean` | `false` | Disables two-column layout on desktop |

**Slots**:
- `form` — left column (or full width on mobile / singleColumn)
- `results` — right column (or below form on mobile / singleColumn)

---

### 6. SectionHeader Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `level` | `2 \| 3` | `2` | Semantic heading level (`<h2>` or `<h3>`) |

**Slots**:
- `default` — heading text content

---

### 7. ListRow Props (backward-compatible)

| Prop | Type | Default | Status | Description |
|------|------|---------|--------|-------------|
| `name` | `string` | — | EXISTING | Label text |
| `value` | `string` | — | EXISTING | Value text |
| `inline` | `boolean` | `true` | EXISTING | Inline (name + value on same line) vs block |
| `nested` | `boolean` | `false` | EXISTING | Indented row |
| `highlighted` | `boolean` | `false` | **NEW** | Gradient/color background for key results |

---

## Relationships

```
MainLayout
├── Header (always visible)
│   ├── Logo → navigates to /
│   ├── Breadcrumbs (hidden on /)
│   └── ThemeToggle
├── Sidebar/Drawer
│   ├── SearchInput
│   ├── RecentlyUsed (hidden if empty)
│   │   └── RecentModule[] (max 5, from localStorage)
│   ├── MenuSection[] (q-expansion-item)
│   │   └── MenuItem[] (q-item, clickable)
│   └── Footer (version + "Wesprzyj projekt")
└── PageContainer
    ├── Index.vue (Dashboard)
    │   ├── HeroSection (logo + description)
    │   └── TileGrid (6 sections × N modules)
    │       └── ModuleTile (q-card with icon, name, description, color)
    └── ModulePageLayout
        ├── FormColumn (slot: form)
        │   ├── SectionHeader
        │   └── Form fields (q-input outlined)
        └── ResultsColumn (slot: results)
            ├── SectionHeader
            ├── ListRow[] (q-item/q-list)
            └── PieChart (donut)
```
