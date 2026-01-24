# Implementation Plan: Kalkulator IKE – podstawowy symulator oszczędności

**Branch**: `004-ike-savings-calculator` | **Date**: 2026-01-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/004-ike-savings-calculator/spec.md`

## Summary

Podstawowy symulator oszczędności IKE obliczający przewidywany kapitał metodą procentu składanego, oszczędność podatkową (zwolnienie z 19% podatku Belki) oraz średnią miesięczną emeryturę. Moduł przyjmuje 6 parametrów wejściowych i wyświetla wyniki w czasie rzeczywistym.

**Technical Approach**: Nowy moduł kalkulatora wzorowany na `contractWork`, wykorzystujący `BasicCalculator` jako bazę, Pinia store z computed getterami dla reaktywnych obliczeń, komponenty Quasar UI.

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
- Quasar components - UI components (QInput, QSelect, QToggle, QCard)

**New Dependencies to Create**:
- `ikeLimits.ts` - IKE annual contribution limits by year (similar to `ikzeLimits.ts`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Gate | Status | Notes |
|------|--------|-------|
| Calculator extends BasicCalculator | ✅ PASS | FR-010 requires this |
| UI uses Quasar components | ✅ PASS | FR-011 requires this |
| UI text in Polish | ✅ PASS | FR-012 requires this |
| Validation uses validationRules | ✅ PASS | FR-009 requires this |
| Tests include all output values | ✅ PASS | CR-005 requires this |

## Project Structure

### Documentation (this feature)

```text
specs/004-ike-savings-calculator/
├── plan.md              # This file
├── research.md          # Research and analysis
├── data-model.md        # Data model
├── quickstart.md        # Quick start
└── tasks.md             # Task list
```

### Source Code

```text
src/
├── components/
│   └── ikeSavings/             # New IKE savings calculator module
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
- [ ] Constants added to `src/logic/constants.ts` (if needed)
- [ ] Changelog updated in `src/components/changeLogs/logs.ts` (describe user-visible changes)
