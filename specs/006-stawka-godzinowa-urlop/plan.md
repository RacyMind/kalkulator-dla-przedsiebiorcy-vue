# Implementation Plan: Stawka godzinowa i urlop w JDG

**Branch**: `[006-stawka-godzinowa-urlop]` | **Date**: 2026-02-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/006-stawka-godzinowa-urlop/spec.md`

**Note**: This template is filled by the `/speckit.plan` command.

## Summary

Rozszerzenie modułu samozatrudnienia (JDG/B2B) o tryb wprowadzania stawki godzinowej z planowaną liczbą godzin pracy oraz opcją odliczenia urlopu/zwolnienia. Użytkownik wybiera tryb przychodu z listy rozwijanej (domyślnie wersja aktualna), a kalkulator przelicza przychód miesięczny na podstawie stawki godzinowej i godzin (z możliwością wartości dziesiętnych).

## Technical Context

**Language/Version**: TypeScript 4.5+ / Vue 3.4+  
**Framework**: Quasar 2.18+ (UI components)  
**State Management**: Pinia 2.x  
**Testing**: Vitest 2.x  
**Platform**: PWA (Progressive Web App) + Cordova (Android/iOS)  
**Project Type**: Single-page application (SPA)  
**UI Language**: Polish  
**Key Dependencies**:
- BasicCalculator - base class for all calculators
- validationRules - form validation rules
- Quasar components - UI components

**Reference Pattern**:
- `src/components/contractWork/` — wzorzec modułu (FormSection, SubmitButton, walidacja)
- `src/components/selfEmployment/` — bieżący moduł samozatrudnienia do rozszerzenia

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Brak nowych bibliotek / technologii (Vue/Quasar/Pinia/Vitest już w repo)
- [x] UI w języku polskim
- [x] Walidacja oparta o `validationRules`
- [x] Logika obliczeń realizowana przez klasę dziedziczącą po `BasicCalculator`
- [x] Testy jednostkowe zawierają wszystkie wartości wyjściowe

Uwagi: `constitution.md` w repo jest szablonem; bramki powyżej wynikają z wymagań feature i standardów repo.

## Project Structure

### Documentation (this feature)

```text
specs/006-stawka-godzinowa-urlop/
├── plan.md              # This file
├── research.md          # Research and analysis
├── data-model.md        # Data model
├── quickstart.md        # Quick start
├── contracts/           # Contract notes
└── tasks.md             # Task list
```

### Source Code

```text
src/
├── components/
│   └── selfEmployment/         # Existing module to extend
│       ├── components/         # Module-specific Vue components
│       ├── interfaces/         # TypeScript interfaces
│       ├── logic/              # Business logic (extends BasicCalculator)
│       ├── pages/              # Vue pages
│       └── store.ts            # Pinia store
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

- [ ] Calculator logic extends `BasicCalculator`
- [ ] UI components use Quasar
- [ ] UI text in Polish language
- [ ] Validation uses `validationRules`
- [ ] Tests include all output values
- [ ] Constants added to `src/logic/constants.ts` (if needed)
- [ ] Changelog updated in `src/components/changeLogs/logs.ts` (describe user-visible changes)
