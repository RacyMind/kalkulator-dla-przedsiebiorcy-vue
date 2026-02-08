# Research: Finalizacja i testy (Milestone 6)

**Branch**: `015-finalization-tests`  
**Date**: 2026-02-07

## Research Tasks

### 1. Version Synchronization — Where are all version references?

**Decision**: Version must be updated to `6.4.0` in 4 locations.

**Findings**:

| File | Field | Current Value | Target |
|------|-------|---------------|--------|
| `package.json` | `version` | `5.11.0` | `6.4.0` |
| `src/stores/constantsStore.ts` | `app.version` | `5.11.0` | `6.4.0` |
| `src-pwa/manifest.json` | `version` | `5.6.0` (outdated!) | `6.4.0` |
| `src-capacitor/capacitor.config.json` | `appName` | "...2023-2026" | "...2023-2027" or remove year range |

**Rationale**: The changelog already has entries for v6.0.0 through v6.3.0, so the next release version should be `6.4.0` to maintain consistency. The manifest.json is significantly behind — it was never updated during Milestones 1–5.

**Alternatives considered**: Using `6.0.0` as target — rejected because changelog already uses 6.0.0–6.3.0 for incremental releases during development.

---

### 2. Test Coverage Gap Analysis — Which modules lack tests?

**Decision**: Only `polishBonds` has calculator logic without tests. Other untested modules are informational/static.

**Findings**:

| Module | Has Calculator Logic? | Has Tests? | Action |
|--------|----------------------|------------|--------|
| `polishBonds` | ✅ 8 calculators (COI, DOR, EDO, OTS, ROD, ROR, ROS, TOS) | ❌ | **Needs tests** |
| `exchangeRates` | ❌ (API data display only) | ❌ | No tests needed |
| `salaryStats` | ❌ (static data display) | ❌ | No tests needed |
| `terms` | ❌ (static content — US/ZUS/PFRON dates) | ❌ | No tests needed |
| `changeLogs` | ❌ (static log entries) | ❌ | No tests needed |
| `contact` | ❌ (contact form, no calculations) | ❌ | No tests needed |
| `privacyPolicy` | ❌ (static text) | ❌ | No tests needed |

**Rationale**: Testing effort should focus on modules with business logic. Informational modules are verified through manual testing (already done).

---

### 3. TODO/FIXME/Dead Code Audit

**Decision**: Codebase is clean — no TODO, FIXME, HACK, or XXX comments found.

**Findings**:
- Searched all `.ts`, `.vue`, `.scss` files in `src/` — zero results
- No dead code markers detected

**Action**: Still need to check for unused files (imports that are never used, orphaned components).

---

### 4. Lazy Loading Verification

**Decision**: All modules already use lazy loading — no changes needed.

**Findings**: `src/router/routes.ts` uses `() => import(...)` for all 29+ routes. Only `Error404` is statically imported (acceptable — it's the fallback route).

---

### 5. Service Worker / PWA Caching Strategy

**Decision**: Current configuration is correct for auto-updates — no changes needed.

**Findings**:
- `quasar.config.ts` → `pwa.workboxMode: 'GenerateSW'`
- `workboxOptions: { skipWaiting: true, clientsClaim: true }`
- This ensures new Service Worker activates immediately without waiting for all tabs to close
- `src-pwa/register-service-worker.ts` handles registration lifecycle

**Rationale**: `skipWaiting + clientsClaim` is the recommended strategy for apps that should always show the latest version.

---

### 6. Changelog Consolidation Strategy

**Decision**: Add a new v6.4.0 entry that serves as the "finalization" release, keeping existing v6.0.0–v6.3.0 entries as development history.

**Findings**: Current changelog entries:
- `6.3.0` (2026-02-15) — WCAG accessibility
- `6.2.0` (2026-02-14) — Modern UI/UX redesign
- `6.1.0` (2026-02-07) — Dark mode
- `6.0.0` (2026-01-26) — Code refactoring, Pinia migration

**Rationale**: Users see the changelog in the app. Keeping granular entries provides transparency about what changed. The v6.4.0 entry will document the finalization work (tests, performance, cleanup).

**Alternatives considered**: Squashing all into single v6.0.0 entry — rejected because entries are already published and visible to users.

---

### 7. README Update Scope

**Decision**: Full rewrite needed. Current README is a basic Quasar scaffold.

**Findings**: Current README contains only generic install/build/lint commands. Missing:
- Project description and features
- List of 29 calculator modules
- Dark mode mention
- PWA and Android availability
- Screenshots or feature highlights
- Technology stack
- Contributing guidelines

---

### 8. Capacitor Android Build Considerations

**Decision**: Need to verify Android SDK compatibility and update `appName`.

**Findings**:
- `src-capacitor/capacitor.config.json` → `appName: "Kalkulator finansowy - oblicz wynagrodzenie z UoP, B2B 2023-2026"`
- Year range "2023-2026" should be updated to "2023-2027" or made year-agnostic
- Gradle and Android SDK versions need to be verified at build time
- AdMob integration configured via `src/boot/admob.ts`

## Summary of Unknowns Resolved

| Unknown | Resolution |
|---------|-----------|
| Version target | `6.4.0` across all locations |
| Test gaps | Only `polishBonds` needs tests (8 calculators) |
| Dead code | None found (clean codebase) |
| Lazy loading | Already implemented ✅ |
| Service Worker | Correctly configured ✅ |
| Changelog strategy | Add v6.4.0 entry, keep existing entries |
| README scope | Full rewrite needed |
| Capacitor config | Update appName year range |
