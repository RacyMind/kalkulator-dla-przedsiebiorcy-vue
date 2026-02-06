# Research: Kalkulator zysku z najmu

**Branch**: `007-rental-profit-calculator`  
**Date**: 2026-02-06

## 1. Stawki ryczałtu od najmu prywatnego (2026)

**Decision**: Dwie stawki progresywne: 8,5% i 12,5%

**Rationale**: Od 2023 roku najem prywatny w Polsce rozliczany jest wyłącznie ryczałtem od przychodów ewidencjonowanych (art. 6 ust. 1a ustawy o zryczałtowanym podatku dochodowym). Stawki:
- **8,5%** od przychodu do 100 000 zł rocznie
- **12,5%** od nadwyżki przychodu ponad 100 000 zł rocznie
- Małżonkowie składający oświadczenie o opodatkowaniu całości u jednego z nich: próg wynosi **200 000 zł**
- Limit dotyczy łącznego przychodu ze wszystkich wynajmowanych nieruchomości

**Alternatives considered**:
- Zasady ogólne (skala podatkowa) — niedostępne dla najmu prywatnego od 2023
- Najem w ramach DG (skala/liniowy/ryczałt) — poza zakresem tego kalkulatora

**Sources**: e-pity.pl, wynajmistrz.pl, gofin.pl (artykuły z 2025/2026)

## 2. Opłaty refakturowane na najemcę

**Decision**: Opłaty za media i czynsz administracyjny refakturowane na najemcę nie stanowią przychodu wynajmującego

**Rationale**: Zgodnie z interpretacjami KIS, jeśli umowa najmu wyodrębnia opłaty za media/czynsz administracyjny i przenosi je na najemcę, wynajmujący nie wykazuje ich jako przychodu. Dotyczy to:
- Opłat za media (prąd, gaz, woda, internet)
- Czynszu administracyjnego do spółdzielni/wspólnoty
- Funduszu remontowego

**Alternatives considered**:
- Wliczanie wszystkich opłat do przychodu — poprawne tylko gdy umowa nie wyodrębnia opłat
- Kalkulator obsługuje oba scenariusze: pole "opłaty refakturowane" z domyślną wartością 0

## 3. Wzorzec modułu kalkulatora w projekcie

**Decision**: Wzorzec `contractWork` (struktura) + `selfEmployment` (zakładki UI)

**Rationale**: Analiza istniejących modułów wykazała spójny wzorzec:
- `BasicCalculator<Input, Result>` — abstract class z `setInputData()`, `calculate()`, `getResult()`
- `Calculator<Input, Result>` — interface implementowany przez kalkulatory
- Pinia store z computed getter wywołującym `new Calculator().setInputData(input).calculate().getResult()`
- `useLocalStorage` z `@vueuse/core` do persystencji formularza
- UI: `ModulePageLayout` > `SectionHeader` > `Form` > wyniki
- Zakładki: `q-tabs` + `q-tab-panels` z enum `Tabs` (wzorzec selfEmployment)

**Alternatives considered**:
- Composable zamiast class — niezgodne z istniejącym wzorcem projektu
- Vuex zamiast Pinia — projekt używa Pinia

## 4. Projekcja wieloletnia z waloryzacją

**Decision**: Calculator generuje tablicę `RentalYearResult[]` z opcjonalną roczną waloryzacją czynszu

**Rationale**: Projekcja wieloletnia wymaga iteracji rok po roku z akumulacją zysku. Waloryzacja czynszu (domyślnie 0%) pozwala na realistyczne projekcje. Formuła dla roku N:
```
przychódMiesięczny[N] = przychódMiesięczny[1] × (1 + waloryzacja/100)^(N-1)
```
Koszty utrzymania pozostają stałe (uproszczenie MVP).

**Alternatives considered**:
- Osobna waloryzacja kosztów — odrzucone w clarify (uproszczenie)
- Inflacja z API — zbyt skomplikowane dla MVP, brak zależności od zewnętrznych API

## 5. Walidacja danych wejściowych

**Decision**: Reuse istniejących `validationRules` z `src/logic/validationRules.ts`

**Rationale**: Projekt posiada gotowe reguły walidacji:
- `requiredAmount` — pole kwotowe wymagane
- `minValue(0)` — kwoty nie mogą być ujemne
- `minValue(1)` / `maxValue(30)` — liczba lat w zakresie 1–30
- `maxValue(100)` — waloryzacja max 100%
- `minValue(0)` / `maxValue(12)` — pustostany 0–12 miesięcy

Dodatkowa walidacja biznesowa: opłaty refakturowane ≤ przychód brutto.

## 6. Stałe podatkowe

**Decision**: Dodać stałe ryczałtu najmu do `src/logic/constants.ts`

**Rationale**: Wszystkie stałe podatkowe w projekcie są zdefiniowane centralnie w `constants.ts`. Nowe stałe:
```typescript
rentalTax: {
  lumpSumRate: 0.085,           // 8.5%
  lumpSumRateAboveThreshold: 0.125,  // 12.5%
  threshold: 100000,            // 100 000 zł
  spouseThreshold: 200000,      // 200 000 zł
}
```

**Alternatives considered**:
- Hardcoded w kalkulatorze — niezgodne z wzorcem projektu
- Osobny plik constants — projekt używa jednego centralnego pliku

## Podsumowanie

Wszystkie NEEDS CLARIFICATION rozwiązane. Brak zależności zewnętrznych. Gotowe do Phase 1 (Design & Contracts).
