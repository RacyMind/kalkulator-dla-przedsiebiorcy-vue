# Research: Kalkulator ulgi podatkowej IKZE

## Cel

Ustalić sposób wyliczenia ulgi IKZE oraz oszczędności podatkowej dla dat obowiązywania przepisów 2023-2026, przy dwóch statusach limitu (umowa o pracę / działalność gospodarcza) oraz trzech systemach podatkowych (skala, liniowy, ryczałt) dla działalności gospodarczej.

## Obserwacje (stan obecny)

- Nowsze moduły opierają parametry prawne o `settingStore.dateOfLawRules` (wybierane w UI przez `components/partials/LawRuleDate.vue`).
- `lawRuleDateWatcher(store)` resetuje stan modułu przy zmianie `dateOfLawRules`.
- Stawki i parametry podatkowe dla nowszych modułów są pobierane przez `useConstants()` (np. `incomeTaxConstants`, `zusConstants`).

## Decyzje

- **Decision**: W module IKZE używamy `settingStore.dateOfLawRules` (zakres 2023-2026) jako jedynego źródła roku.
  - **Rationale**: Tak działa większość nowszych modułów; upraszcza spójność UX.

- **Decision**: Podatek „przed” i „po” liczymy poprzez klasy `TaxScale` / `FlatTax` / `LumpSumTax` z `src/logic/taxes/*`, które bazują na `useConstants()` i `dateOfLawRules`.
  - **Rationale**: Spójność z nowszymi modułami i automatyczne dostosowanie stawek do `dateOfLawRules`.

- **Decision**: Status limitu (Umowa o pracę / Działalność gospodarcza) jest przełącznikiem limitu w UI (bez weryfikacji) i wpływa na limit IKZE.
  - **Rationale**: Tak ustalono w doprecyzowaniach spec; minimalizuje scope i ryzyko.

- **Decision**: Dla statusu Umowa o pracę system podatkowy jest stały: skala podatkowa (UI ukrywa wybór).
  - **Rationale**: Uproszczenie UX zgodne ze spec.

- **Decision**: Dla działalności gospodarczej użytkownik wybiera system podatkowy: skala / liniowy / ryczałt.
  - **Rationale**: Wymaganie spec (wraz z doprecyzowaniem).

- **Decision**: Dla ryczałtu wymagamy dodatkowego pola „stawka ryczałtu” (analogicznie jak w module `selfEmployment`), bo bez niej nie da się policzyć podatku i oszczędności.
  - **Rationale**: `taxes.calculateIncomeTaxUsingLumpSumRules` wymaga `lumpSumTaxRate`.
  - **Alternatives considered**:
    - użycie stałej stawki (odrzucone: niezgodne z realnymi scenariuszami ryczałtu).

- **Decision**: Limity IKZE trzymamy w dedykowanym pliku `src/logic/ikzeLimits.ts` i pobieramy je na podstawie `dateOfLawRules` i statusu.
  - **Rationale**: Izoluje dane domenowe limitów od dużego `constants.ts` i jest spójne z podejściem „nowszych” modułów (małe, wyspecjalizowane pliki w module/logic).

## Ryzyka i mitigacje

- **Ryzyko**: Rozjazd interpretacji „podstawa opodatkowania” pomiędzy systemami (skala/liniowy vs ryczałt).
  - **Mitigacja**: W module IKZE jasno nazywać pole wejściowe „roczna podstawa opodatkowania” dla skali/liniowego i „roczny przychód do opodatkowania ryczałtem” dla ryczałtu.

- **Ryzyko**: Brak gotowej reguły `validationRules` dla „max = limit”.
  - **Mitigacja**: Dodać modułową regułę walidacji (w module IKZE) wykorzystującą obliczony limit; albo rozszerzyć `validationRules` o funkcję fabrykującą regułę `max(value)`.

## Konkluzja

W fazie implementacji tworzymy nowy moduł kalkulatora z logiką opartą o `BasicCalculator` + `src/logic/taxes/*` (przez `useConstants()` i `dateOfLawRules`) i źródłem limitów w `src/logic/ikzeLimits.ts`, z UI wzorowanym na `components/contractWork/`.
