# Implementation Plan: Ujednolicenie UI modułów

**Branch**: `[001-unify-module-ui]` | **Date**: 2026-01-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-unify-module-ui/spec.md`

**Note**: This template is filled by the `/speckit.plan` command.

## Summary

Ujednolicić warstwę UI/UX (układ sekcji, formularze, walidacja, prezentacja wyników) w modułach: Faktura VAT, Limit sprzedaży dla zwolnienia z VAT, Lokata, Odsetki, Waluty, tak aby były spójne z modułami o zaktualizowanym UI.

Zakres prac obejmuje refaktor istniejących stron modułów do wspólnego wzorca layoutu oraz komponentów formularza/wyników, bez zmiany reguł obliczeń.

## Technical Context

**Language/Version**: TypeScript 4.5+ / Vue 3.4+  
**Framework**: Quasar 2.18+ (UI components)  
**State Management**: Pinia 2.x  
**Testing**: Vitest 2.x  
**Platform**: PWA (Progressive Web App) + Cordova (Android/iOS)  
**Project Type**: Single-page application (SPA)  
**UI Language**: Polish  
**Storage**: LocalStorage (persistencja wartości formularzy w modułach referencyjnych) + Pinia store (stan wyników)
**Primary Dependencies**: Vue 3 + Quasar 2 + Pinia 2 + Vitest 2
**Key Dependencies**:
- `components/partials/ModulePageLayout.vue` (wspólny layout strony modułu)
- `components/partials/SectionHeader.vue` (nagłówki sekcji)
- `components/partials/form/FormSection.vue` (sekcje formularza, wzorzec z nowych modułów)
- `src/logic/validationRules` (spójne zasady walidacji)
- `components/partials/resultList/*` (spójne listy wyników; używane w modułach referencyjnych)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Brak zmiany reguł obliczeń (feature jest UI/UX refaktorem)
- [x] Brak nowych technologii / bibliotek
- [x] Zachowanie zgodności PWA/Cordova (layout responsive)
- [x] Teksty UI pozostają po polsku
- [x] Walidacja i komunikaty błędów pozostają spójne między modułami

Uwagi: Plik constitution jest szablonem i nie definiuje dodatkowych twardych bramek. Powyższe bramki wynikają z aktualnego standardu repo oraz specyfikacji feature.

## Project Structure

### Documentation (this feature)

```text
specs/001-unify-module-ui/
├── plan.md              # This file
├── research.md          # Research and analysis
├── data-model.md        # Data model
├── quickstart.md        # Quick start
├── contracts/           # Contract notes (no API changes)
└── tasks.md             # Task list
```

### Source Code

```text
src/
├── components/
│   ├── contractWork/           # Referencja nowego UI
│   ├── invoice/
│   ├── vatLimit/
│   ├── investment/
│   ├── interest/
│   ├── exchangeRates/
│   └── currencyConverter/
├── logic/                      # Shared logic
│   ├── BasicCalculator.ts      # Base calculator class
│   ├── constants.ts            # Constants (taxes, ZUS, etc.)
│   ├── validationRules.ts      # Validation rules
│   └── helpers.ts              # Helper functions
├── pages/                      # Main app pages
├── router/                     # Router configuration
└── stores/                     # Global Pinia stores

test/vitest/__tests__/
├── modules/
│   └── [moduleName]/           # Module tests
│       └── [Calculator].test.ts
└── logic/                      # Shared logic tests
```

**Module Pattern**: Use `src/components/contractWork/` as reference implementation

## Pre-Implementation Checklist

- [ ] Widoki stron modułów (`src/pages/*.vue`) przechodzą na wspólny wzorzec layoutu
- [ ] Formularze używają spójnego wzorca sekcji i walidacji
- [ ] Wyniki prezentowane spójnie (podsumowanie / lista / wykresy jeżeli istnieją)
- [ ] Brak zmian w logice obliczeń
- [ ] UI działa na mobile i desktop
