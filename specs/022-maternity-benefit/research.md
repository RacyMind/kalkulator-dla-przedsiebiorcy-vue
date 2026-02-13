# Research: Kalkulator zasiłku macierzyńskiego

**Branch**: `022-maternity-benefit` | **Date**: 2026-02-10

## R1: Wzorzec kalkulatora w projekcie

**Decision**: Użyć wzorca `BasicCalculator<InputFields, Result>` z interfejsem `Calculator<InputFields, Result>`.

**Rationale**: Wszystkie kalkulatory w projekcie (ContractWork, SickPay, UnregisteredCompany, Entrepreneur, PartialZusContributions) stosują ten sam wzorzec:

- Klasa rozszerza `BasicCalculator<InputFields, Result>`
- Implementuje `Calculator<InputFields, Result>`
- Metoda `calculate()` zwraca `this`
- Wynik zapisywany w `this.result`
- Zaokrąglanie przez `helpers.round(value, 2)`

**Alternatives considered**: Brak — wzorzec jest narzucony przez architekturę projektu.

## R2: Dostęp do stałych ZUS (podstawy składek)

**Decision**: Pobierać podstawy składek z `useConstantsStore()` → `zusConstants.entrepreneur.basises.big` (duży ZUS) i `zusConstants.entrepreneur.basises.small()` (preferencyjny ZUS).

**Rationale**: Stałe są już zdefiniowane w `constantsStore.ts` i aktualizowane per rok w `yearParams.ts`. Wzorzec użycia widoczny w `SickPayCalculator` i `EntrepreneurCalculator` — `storeToRefs(useConstantsStore())`.

**Alternatives considered**: Hardcoded wartości — odrzucone, bo nie aktualizują się z rokiem.

## R3: Stawka potrącenia 13,71% (składki społeczne)

**Decision**: Obliczać stawkę 13,71% dynamicznie z `zusConstants.employee.rates` jako sumę: `pensionContribution (9,76%) + disabilityContribution (1,5%) + sickContribution (2,45%)`.

**Rationale**: Stawka 13,71% to suma składek społecznych pracownika. Wzorzec widoczny w `SickPayCalculator` (linia 17): `zusContributionRate = pensionContribution + disabilityContribution + sickContribution`. Dynamiczne obliczanie zapewnia poprawność przy zmianie stawek.

**Alternatives considered**: Hardcoded 0.1371 — odrzucone, bo stawki mogą się zmienić.

## R4: Górny limit podstawy składki chorobowej (250% przeciętnego wynagrodzenia)

**Decision**: Limit obliczać jako `2.5 * wageStats.projectedAverageWage()`. Walidacja w formularzu blokuje obliczenie z komunikatem.

**Rationale**: Zgodne z przepisami ZUS. Wartość `projectedAverageWage()` jest już dostępna w `constantsStore`. Dla 2026: 250% × 9 420 zł = 23 550 zł.

**Alternatives considered**: Stała wartość w `yearParams.ts` — odrzucone, bo można ją obliczyć z istniejących danych.

## R5: Wzorzec store (Pinia)

**Decision**: Użyć wzorca z `contractWork/store.ts` — Pinia store z `inputFields` w state i `result` jako computed getter wywołujący kalkulator.

**Rationale**: Spójność z istniejącymi modułami. Store jest prosty i reaktywny.

**Alternatives considered**: Brak — wzorzec narzucony.

## R6: Wzorzec UI (formularz + wyniki)

**Decision**: Struktura komponentów: `Form.vue` (formularz), `ResultList.vue` (wyniki z dwoma kolumnami wariantów). Użyć `useLocalStorage` do persystencji pól formularza, `validationRules` do walidacji, `FormSection` i `SubmitButton` jako shared components.

**Rationale**: Wzorzec z `contractWork/components/` — Form.vue używa Quasar components (`q-form`, `q-input`, `q-select`), `useLocalStorage` z `@vueuse/core`, `validationRules` z `src/logic/validationRules.ts`.

**Alternatives considered**: Brak — wzorzec narzucony.

## R7: Wymiary urlopów — źródło danych

**Decision**: Zdefiniować mapę wymiarów urlopów jako stałą w module kalkulatora (nie w `constantsStore`), ponieważ te wartości wynikają z Kodeksu Pracy i nie zmieniają się rocznie.

**Rationale**: Wymiary urlopów (20/31/33/35/37 tyg. macierzyński, 32/34 tyg. rodzicielski) są stałe od 2023 r. Nie ma potrzeby dodawania ich do `yearParams.ts`.

**Alternatives considered**: Dodanie do `constantsStore` — odrzucone, bo wartości nie zmieniają się per rok.
