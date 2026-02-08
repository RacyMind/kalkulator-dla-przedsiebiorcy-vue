# Implementation Plan: Dodanie obligacji ROS i ROD

**Branch**: `001-obligacje-ros-rod` | **Date**: 2026-01-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-obligacje-ros-rod/spec.md`

**Note**: This template is filled by the `/speckit.plan` command.

## Summary

Rozszerzyć istniejący moduł „Obligacje skarbowe” (`/obligacje-skarbowe`) o obsługę dwóch brakujących typów obligacji rodzinnych:

- ROS (6-letnie)
- ROD (12-letnie)

Zakres obejmuje:

- dodanie nowych opcji wyboru rodzaju obligacji,
- dodanie formularzy/parametrów specyficznych dla ROS/ROD (oprocentowanie w 1. roku z domyślną wartością, edytowalne),
- dodanie logiki obliczeń zgodnej z wymaganiami w spec (inflacja jako jedna wartość dla kolejnych lat, marża stała wg typu obligacji, kapitalizacja roczna, wypłata przy wykupie, podatek Belki wyliczany przy wykupie),
- dodanie testów Vitest dla kalkulatorów ROS i ROD (wszystkie wartości wyjściowe).

## Technical Context

**Language/Version**: TypeScript 4.5+ / Vue 3.4+  
**Framework**: Quasar 2.18+ (UI components)  
**State Management**: Pinia 2.x  
**Testing**: Vitest 2.x  
**Platform**: PWA (Progressive Web App) + Cordova (Android/iOS)  
**Project Type**: Single-page application (SPA)  
**UI Language**: Polish  
**Key Dependencies**:
- `BasicCalculator` - base class for all calculators (`src/logic/BasicCalculator.ts`)
- `validationRules` - form validation rules (`src/logic/validationRules.ts`)
- `helpers.round()` - rounding helper (`src/logic/helpers.ts`)
- Quasar components - UI components

**Existing module (to extend)**:
- `src/components/polishBonds/` — obecny moduł obligacji (COI/DOR/EDO/OTS/ROR/TOS)
- Router: `src/router/routes.ts` → ścieżka `obligacje-skarbowe`
- Testy: `test/vitest/__tests__/modules/polishBonds/*.test.ts`

**Reference Pattern**:
- `src/components/contractWork/` — referencja najbardziej aktualnego wzorca modułu (FormSection, SubmitButton, walidacja)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Brak nowych bibliotek / technologii (Vue/Quasar/Pinia/Vitest już w repo)
- [x] UI w języku polskim
- [x] Walidacja oparta o `validationRules`
- [x] Logika obliczeń realizowana przez klasy dziedziczące po `BasicCalculator`
- [x] Testy jednostkowe zawierają wszystkie wartości wyjściowe

Uwagi: `constitution.md` w repo jest szablonem; bramki powyżej wynikają z wymagań feature i standardów repo.

## Project Structure

### Documentation (this feature)

```text
specs/001-obligacje-ros-rod/
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
│   └── polishBonds/                  # Existing module extended with ROS/ROD
│       ├── components/               # Module-specific Vue components
│       │   └── bondForms/            # Forms per bond type (add RosForm/RodForm)
│       ├── interfaces/               # TypeScript interfaces (add RosInputFields/RodInputFields)
│       ├── logic/                    # Business logic (add RosCalculator/RodCalculator)
│       ├── pages/                    # Vue pages (extend Index.vue)
│       └── store.ts                  # Pinia store (extend BondType and state)
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
│   └── polishBonds/
│       ├── RosCalculator.test.ts
│       └── RodCalculator.test.ts
└── logic/                      # Shared logic tests
```

**Module Pattern**: Use `src/components/contractWork/` as reference implementation

## Pre-Implementation Checklist

- [ ] Calculator logic extends `BasicCalculator`
- [ ] UI components use Quasar
- [ ] UI text in Polish language
- [ ] Validation uses `validationRules`
- [ ] Tests include all output values
- [ ] ROS/ROD parameters are stored in bond constants for the module (if needed)
- [ ] Changelog updated in `src/components/changeLogs/logs.ts` (describe user-visible changes)
