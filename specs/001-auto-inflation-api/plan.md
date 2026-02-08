# Implementation Plan: Automatyczne pobieranie danych inflacyjnych z ECB SDMX API

**Branch**: `001-auto-inflation-api` | **Date**: 2026-02-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-auto-inflation-api/spec.md`

## Summary

Zamiana źródła danych inflacyjnych z własnego API (`kalkulatorfinansowy.app/inflation.php`) na publiczne ECB SDMX API (`data-api.ecb.europa.eu`). API dostarcza miesięczne dane HICP dla Polski w formacie JSON, już jako % zmiany rok do roku. Zmiana dotyczy wyłącznie warstwy danych — UI pozostaje bez zmian (poza aktualizacją źródła danych w stopce).

## Technical Context

**Language/Version**: TypeScript 4.5+ / Vue 3.4+  
**Framework**: Quasar 2.18+ (UI components)  
**State Management**: Pinia 2.x  
**Testing**: Vitest 2.x  
**Platform**: PWA (Progressive Web App) + Cordova (Android/iOS)  
**Project Type**: Single-page application (SPA)  
**UI Language**: Polish  
**HTTP Client**: axios (already in project)  
**Key Dependencies**:
- axios - HTTP client for API calls
- Quasar components - UI components

**External API**:
- ECB SDMX API: `https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR`
- Format: `jsondata`
- No API key required
- CORS enabled

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Constitution is not configured (template only) — no gates to enforce. PASS.

## Project Structure

### Documentation (this feature)

```text
specs/001-auto-inflation-api/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Research and analysis (API comparison)
├── data-model.md        # Data model (EcbSdmxResponse, InflationEntry)
├── quickstart.md        # Quick start guide
├── contracts/
│   └── ecb-sdmx-api.md # ECB API contract
├── checklists/
│   └── requirements.md  # Quality checklist
└── tasks.md             # Task list (to be generated)
```

### Source Code (files to modify)

```text
src/components/inflation/
├── inflation.ts                    # MODIFY: Replace API call with ECB SDMX
├── interfaces/
│   ├── InflationApiResponse.ts     # MODIFY: Replace with EcbSdmxResponse
│   └── InflationEntry.ts           # NO CHANGE
├── InflationStatistics.vue         # MODIFY: Update data source link in footer
├── PurchasingPowerOfMoneyStatistics.vue  # MODIFY: Update data source link in footer
└── pages/
    ├── Index.vue                   # NO CHANGE
    └── PurchasingPowerOfMoney.vue  # NO CHANGE

test/vitest/__tests__/modules/inflation/
└── Inflation.test.ts               # MODIFY: Update mocked API responses
```

## Design Decisions

See [research.md](./research.md) for full analysis. Key decisions:

1. **ECB SDMX API** chosen over GUS DBW/BDL APIs — only source with monthly data in usable JSON format
2. **Client-side calls** — direct browser requests, no proxy needed (CORS enabled)
3. **No index conversion** — ECB returns % change directly (ANR suffix)
4. **In-memory cache** with 24h TTL — stale cache served silently on API failure
5. **HICP vs CPI** — minimal methodological differences, acceptable for calculator purposes

## Pre-Implementation Checklist

- [x] N/A - Calculator logic extends `BasicCalculator` (no calculator in this feature)
- [x] UI components use Quasar (no UI changes)
- [x] UI text in Polish language
- [x] N/A - Validation uses `validationRules` (no form changes)
- [ ] Tests include all output values
- [x] N/A - Constants added to `src/logic/constants.ts`
- [ ] Changelog updated in `src/components/changeLogs/logs.ts` (describe user-visible changes)
