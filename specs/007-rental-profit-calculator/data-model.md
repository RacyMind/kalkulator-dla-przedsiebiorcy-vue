# Data Model: Kalkulator zysku z najmu

**Branch**: `007-rental-profit-calculator`  
**Date**: 2026-02-06

## Entities

### InputFields

Dane wejściowe formularza. Persystowane w `localStorage` via `useLocalStorage`.

```typescript
interface InputFields {
  monthlyRent: number           // Miesięczny przychód z najmu — czysty czynsz (zł), > 0
  monthlyExpenses: number       // Miesięczne koszty utrzymania wynajmującego (zł), >= 0
                                // Tooltip: "Twoje wydatki jako wynajmującego (ubezpieczenie, naprawy, kredyt).
                                //   NIE zmniejszają podatku ryczałtowego, ale wpływają na realny zysk netto."
  refactoredCharges: number     // Opłaty refakturowane na najemcę (zł/mies.), >= 0
                                // Tooltip: "Kwoty, które najemca Ci płaci, a Ty przekazujesz dalej
                                //   (spółdzielnia, dostawcy mediów). Zmniejszają przychód do opodatkowania ryczałtem."
  numberOfYears: number         // Liczba lat projekcji (integer, 1–30)
  isSpouseSettlement: boolean   // Rozliczenie małżonków (próg 200 000 zł)
  vacancyMonths: number         // Pustostany — miesiące bez najemcy w roku (0–12)
  annualRentIncrease: number    // Roczna waloryzacja czynszu (%, 0–100), domyślnie 0
}
```

**Validation rules**:
- `monthlyRent`: `requiredAmount`, `greaterThan(0)`
- `monthlyExpenses`: `requiredAmount`, `minValue(0)`
- `refactoredCharges`: `requiredAmount`, `minValue(0)`, must be ≤ `monthlyRent`
- `numberOfYears`: `requiredAmount`, `minValue(1)`, `maxValue(30)`
- `vacancyMonths`: `requiredAmount`, `minValue(0)`, `maxValue(12)`
- `annualRentIncrease`: `requiredAmount`, `minValue(0)`, `maxValue(100)`

**Default values**:
- `monthlyRent`: 3000
- `monthlyExpenses`: 500
- `refactoredCharges`: 0
- `numberOfYears`: 1
- `isSpouseSettlement`: false
- `vacancyMonths`: 0
- `annualRentIncrease`: 0

### YearResult

Wynik obliczenia dla jednego roku. Generowany przez `RentalProfitCalculator`.

```typescript
interface YearResult {
  year: number                     // Numer roku (1-based)
  monthlyRent: number              // Miesięczny czynsz w tym roku (po waloryzacji)
  grossRevenue: number             // Roczny przychód brutto (monthlyRent × activeMonths)
  taxableRevenue: number           // Przychód do opodatkowania (grossRevenue − refactoredCharges × activeMonths)
  tax: number                      // Podatek ryczałtowy
  annualExpenses: number           // Roczne koszty utrzymania (monthlyExpenses × 12)
  netProfit: number                // Zysk netto (grossRevenue − tax − annualExpenses)
  effectiveTaxRate: number         // Efektywna stawka podatku (tax / grossRevenue × 100)
  cumulativeProfit: number         // Skumulowany zysk netto od roku 1
}
```

### Result

Pełny wynik kalkulatora — zwracany przez `getResult()`.

```typescript
interface Result {
  yearResults: YearResult[]        // Wyniki rok po roku
  summary: Summary                 // Podsumowanie całego okresu
}
```

### Summary

Podsumowanie całego okresu projekcji.

```typescript
interface Summary {
  totalGrossRevenue: number        // Łączny przychód brutto
  totalTaxableRevenue: number      // Łączny przychód do opodatkowania
  totalTax: number                 // Łączny podatek
  totalExpenses: number            // Łączne koszty utrzymania
  totalNetProfit: number           // Łączny zysk netto
  averageMonthlyProfit: number     // Średni miesięczny zysk netto
  effectiveTaxRate: number         // Efektywna stawka podatku za cały okres
}
```

## Relationships

```
InputFields ──[1:1]──> RentalProfitCalculator ──[1:1]──> Result
                                                           ├── yearResults: YearResult[] (1:N)
                                                           └── summary: Summary (1:1)
```

## Constants (to add to `constants.ts`)

```typescript
rentalTax: {
  lumpSumRate: 0.085,                  // 8.5%
  lumpSumRateAboveThreshold: 0.125,    // 12.5%
  threshold: 100000,                   // 100 000 zł
  spouseThreshold: 200000,             // 200 000 zł
}
```

## Calculation Logic

### Tax calculation (per year)

```
threshold = isSpouseSettlement ? 200000 : 100000
activeMonths = 12 - vacancyMonths
grossRevenue = monthlyRent × activeMonths
taxableRevenue = grossRevenue - (refactoredCharges × activeMonths)

if taxableRevenue <= threshold:
  tax = round(taxableRevenue × 0.085, 2)
else:
  tax = round(threshold × 0.085 + (taxableRevenue - threshold) × 0.125, 2)
```

### Annual rent indexation

```
monthlyRent[year] = round(monthlyRent[1] × (1 + annualRentIncrease / 100) ^ (year - 1), 2)
```

### Net profit

```
annualExpenses = monthlyExpenses × 12
netProfit = grossRevenue - tax - annualExpenses
effectiveTaxRate = grossRevenue > 0 ? round(tax / grossRevenue × 100, 2) : 0
```

## State Transitions

No state transitions — this is a stateless calculator. Input → Output.
Form state persisted via `useLocalStorage` (same pattern as other modules).
