
# Implementation Plan: Kalkulator ulgi podatkowej IKZE

**Branch**: `[003-ikze-ulga-podatkowa]` | **Date**: 2026-01-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-ikze-ulga-podatkowa/spec.md`

**Note**: This template is filled by the `/speckit.plan` command.

## Summary

Dodać nowy moduł „Kalkulator ulgi podatkowej IKZE”, który:

- pozwala wybrać datę obowiązywania przepisów (2023-2026) oraz status limitu (umowa o pracę / działalność gospodarcza),
- wyświetla konkretną kwotę limitu IKZE dla wybranego roku i statusu,
- nie pozwala wprowadzić wpłaty powyżej limitu,
- wylicza podatek „przed” i „po” zastosowaniu odliczenia IKZE oraz oszczędność podatkową,
- dla statusu umowa o pracę ukrywa wybór formy opodatkowania i przyjmuje skalę podatkową;
  dla działalności gospodarczej pozwala wybrać skala/liniowy/ryczałt.

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
- `src/components/contractWork/` — referencja najbardziej aktualnego wzorca modułu (FormSection, SubmitButton, walidacja)

**Law rules date selection (existing)**:
- `stores/settingStore` → `dateOfLawRules`
- Komponent wyboru: `src/components/partials/LawRuleDate.vue`
- Dostępne daty: `src/composables/lawRuleDate.ts` (2023-2026)

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
specs/003-ikze-ulga-podatkowa/
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
│   └── ikzeTaxRelief/          # New calculator module
│       ├── components/         # Module-specific Vue components
│       ├── interfaces/         # TypeScript interfaces
│       ├── logic/              # Business logic (extends BasicCalculator)
│       ├── pages/              # Vue pages
│       ├── types/              # TypeScript types
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
- [ ] Law rules date selection uses supported dates (2023-2026)
- [ ] IKZE limits are stored in dedicated logic file (e.g. `src/logic/ikzeLimits.ts`)
- [ ] Changelog updated in `src/components/changeLogs/logs.ts` (describe user-visible changes)
