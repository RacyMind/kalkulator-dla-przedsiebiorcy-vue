# Data Model: Finalizacja i testy (Milestone 6)

**Branch**: `015-finalization-tests`  
**Date**: 2026-02-07

## Overview

This milestone does not introduce new data entities. It focuses on synchronizing existing version metadata, verifying test coverage, and preparing release artifacts. The "data model" here describes the version metadata locations and their relationships.

## Entities

### VersionMetadata

Represents the application version stored across multiple files that must be kept in sync.

| Location | Field | Type | Current | Target |
|----------|-------|------|---------|--------|
| `package.json` | `version` | `string` (semver) | `5.11.0` | `6.4.0` |
| `src/stores/constantsStore.ts` | `app.version` | `string` (semver) | `5.11.0` | `6.4.0` |
| `src-pwa/manifest.json` | `version` | `string` (semver) | `5.6.0` | `6.4.0` |
| `src-capacitor/capacitor.config.json` | `appName` | `string` | includes "2023-2026" | update year range |

**Validation Rules**:
- All version fields MUST contain the same semver value
- Version MUST follow `MAJOR.MINOR.PATCH` format
- Version MUST be greater than any existing changelog entry version

**State Transitions**:
```
5.11.0 (package.json)     → 6.4.0
5.11.0 (constantsStore)   → 6.4.0
5.6.0  (manifest.json)    → 6.4.0
```

### ChangelogEntry

Represents a single entry in `src/components/changeLogs/logs.ts`.

| Field | Type | Description |
|-------|------|-------------|
| `version` | `string` | Semver version (e.g., `6.4.0`) |
| `publish_date` | `string` | ISO date (e.g., `2026-02-15`) |
| `content` | `string` | HTML string with `<ul><li>` items describing changes |

**Existing entries** (v6.x):
- `6.3.0` — WCAG accessibility
- `6.2.0` — Modern UI/UX redesign
- `6.1.0` — Dark mode
- `6.0.0` — Code refactoring, Pinia migration

**New entry** (to be added):
- `6.4.0` — Finalization: regression tests verified, performance optimized, version synchronized, README updated, dead code cleaned

### TestModule

Represents a calculator module and its test coverage status.

| Module | Calculator Classes | Test Directory | Status |
|--------|--------------------|----------------|--------|
| accountingWithSpouse | ✅ | ✅ | Covered |
| b2bComparator | ✅ | ✅ | Covered |
| cashRegisterLimit | ✅ | ✅ | Covered |
| contractOfEmployment | ✅ | ✅ | Covered |
| contractOfMandate | ✅ | ✅ | Covered |
| contractWork | ✅ | ✅ | Covered |
| currencyConverter | ✅ | ✅ | Covered |
| ikeSavings | ✅ | ✅ | Covered |
| ikzeTaxRelief | ✅ | ✅ | Covered |
| inflation | ✅ | ✅ | Covered |
| interest | ✅ | ✅ | Covered |
| investment | ✅ | ✅ | Covered |
| invoice | ✅ | ✅ | Covered |
| partialZusContributions | ✅ | ✅ | Covered |
| polishBonds | ✅ (8 calculators) | ❌ | **GAP** |
| realBoughtCosts | ✅ | ✅ | Covered |
| rentalProfit | ✅ | ✅ | Covered |
| salaryForUnusedHolidays | ✅ | ✅ | Covered |
| selfEmployment | ✅ | ✅ | Covered |
| sickPay | ✅ | ✅ | Covered |
| unregisteredCompany | ✅ | ✅ | Covered |
| vatLimit | ✅ | ✅ | Covered |
| exchangeRates | ❌ (API display) | ❌ | N/A |
| salaryStats | ❌ (static data) | ❌ | N/A |
| terms | ❌ (static content) | ❌ | N/A |
| changeLogs | ❌ (static logs) | ❌ | N/A |
| contact | ❌ (form, no calc) | ❌ | N/A |
| privacyPolicy | ❌ (static text) | ❌ | N/A |

### LighthouseAudit

Represents the target metrics for the production build audit.

| Metric | Target | Measurement Tool |
|--------|--------|-----------------|
| Performance | > 90 | Lighthouse |
| Accessibility | > 90 | Lighthouse |
| Best Practices | > 90 | Lighthouse (informational) |
| SEO | > 90 | Lighthouse (informational) |

## Relationships

```
VersionMetadata ──sync──> package.json
                ──sync──> constantsStore.ts
                ──sync──> manifest.json
                ──sync──> capacitor.config.json

ChangelogEntry  ──references──> VersionMetadata.version

TestModule      ──tested-by──> test/vitest/__tests__/modules/{name}/
```
