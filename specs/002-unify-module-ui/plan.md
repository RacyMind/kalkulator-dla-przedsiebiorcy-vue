 # Implementation Plan: Ujednolicenie UI formularzy (pola + przyciski)

**Branch**: `[002-unify-module-ui]` | **Date**: 2026-01-24 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-unify-module-ui/spec.md`

**Note**: This template is filled by the `/speckit.plan` command.

## Summary

Ujednolicić UI/UX formularzy i przycisków akcji w wybranych modułach aplikacji (spójny układ pól, odstępy, walidacja, stany disabled/loading) oraz objąć zakresem dodatkowe moduły: Kontakt, Historia zmian, Limit obrotu dla kasy fiskalnej.

Zakres jest refaktorem warstwy prezentacji. Logika obliczeń i istniejące wyniki nie mogą się zmienić.

## Technical Context

**Language/Version**: TypeScript 4.5+ / Vue 3.4+
**Framework**: Quasar 2.18+ (UI components)
**State Management**: Pinia 2.x
**Testing**: Vitest 2.x
**Platform**: PWA (Progressive Web App) + Cordova (Android/iOS)
**Project Type**: Single-page application (SPA)
**UI Language**: Polish

**Reference Pattern**:
- `src/components/contractWork/` — referencja najbardziej aktualnego UI (sekcje formularza, spójne przyciski, walidacja)

**Key Dependencies (existing)**:
- `src/logic/validationRules.ts` — wspólny zestaw reguł walidacji
- `src/components/partials/form/*` — wspólne komponenty formularza (np. sekcje, przycisk submit)
- `src/components/partials/ModulePageLayout.vue` — wspólny wrapper strony modułu

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] Brak zmian w wynikach obliczeń (feature jest refaktorem UI)
- [x] Brak nowych technologii / bibliotek
- [x] UI teksty pozostają po polsku
- [x] Zgodność PWA/Cordova (responsywność)
- [x] Spójna walidacja (tam gdzie możliwe — wspólne reguły)

Uwagi: `constitution.md` w repo jest szablonem; bramki powyżej wynikają z wymagań feature i standardów repo.

## Project Structure

### Documentation (this feature)

```text
specs/002-unify-module-ui/
├── plan.md                   # This file
├── research.md               # Research and decisions
├── data-model.md             # UI-level data model (inputs/results at a glance)
├── quickstart.md             # Quick start / verification
├── contracts/
│   └── no-api-changes.md     # Contract note: no API changes
└── tasks.md                  # Task list (generated in next step)
```

### Source Code (relevant areas)

```text
src/
├── components/
│   ├── contractWork/                # Referencja nowego UI
│   ├── partials/
│   │   ├── form/                     # Wspólne komponenty formularza
│   │   └── ModulePageLayout.vue
│   ├── invoice/
│   ├── vatLimit/
│   ├── investment/
│   ├── interest/
│   ├── exchangeRates/
│   ├── currencyConverter/
│   ├── cashRegisterLimit/
│   ├── contact/
│   └── changeLogs/
├── pages/                            # Strony modułów
└── logic/                            # validationRules, helpers, constants

test/vitest/__tests__/
└── modules/                          # Testy modułów
```

## Pre-Implementation Checklist

- [ ] Formularze i przyciski akcji są spójne wizualnie pomiędzy modułami objętymi zakresem
- [ ] Walidacja jest spójna i oparta o wspólne reguły tam gdzie to możliwe
- [ ] Brak zmian w logice obliczeń i wynikach
- [ ] UI działa poprawnie na mobile i desktop (PWA/Cordova)
- [ ] Istniejące testy przechodzą; nowe testy dodane tam gdzie brakowało coverage dla refaktoru UI
