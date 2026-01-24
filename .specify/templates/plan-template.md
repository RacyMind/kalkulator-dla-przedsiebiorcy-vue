# Implementation Plan: [FEATURE NAME]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled by the `/speckit.plan` command.

## Summary

[Extract from spec: main requirement + technical approach]

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

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

[Gates determined based on constitution file]

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
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
│   └── [moduleName]/           # New calculator module
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
