# Data Model: Kalkulator IKE

**Feature**: 004-ike-savings-calculator  
**Date**: 2026-01-24

## Entities

### ContributionType (Enum)

Typ składki wprowadzanej przez użytkownika.

```typescript
enum ContributionType {
  Monthly = 'monthly',
  Yearly = 'yearly'
}
```

### InputFields (Interface)

Dane wejściowe kalkulatora IKE.

```typescript
interface InputFields {
  currentAge: number              // Aktualny wiek (18-100)
  contributionType: ContributionType  // Typ składki
  contributionAmount: number      // Kwota składki (zł)
  expectedReturnRate: number      // Oczekiwana stopa zwrotu (% rocznie, -20 do +30)
  withdrawalAge: number           // Wiek rozpoczęcia wypłat (> currentAge, max 100)
  withdrawalPeriod: number        // Okres wypłat w latach (1-50, domyślnie 20)
  initialCapital: number          // Kapitał początkowy (domyślnie 0)
}
```

| Field | Type | Validation | Default |
|-------|------|------------|---------|
| currentAge | number | 18-100, required | - |
| contributionType | ContributionType | required | Monthly |
| contributionAmount | number | >= 0, required | - |
| expectedReturnRate | number | -20 to +30, required | 5 |
| withdrawalAge | number | > currentAge, <= 100, required | - |
| withdrawalPeriod | number | 1-50, required | 20 |
| initialCapital | number | >= 0 | 0 |

### Result (Interface)

Wyniki obliczeń kalkulatora.

```typescript
interface Result {
  // Dane wejściowe (do wyświetlenia)
  savingsPeriodYears: number      // Okres oszczędzania (lat)
  yearlyContribution: number      // Roczna składka (zł)
  
  // Wyniki główne
  totalContributions: number      // Suma wpłat (zł)
  finalCapital: number            // Przewidywany kapitał (zł)
  investmentGain: number          // Zysk z inwestycji (zł)
  
  // Oszczędność podatkowa
  belkaTax: number                // Podatek Belki który byłby zapłacony (zł)
  taxSaving: number               // Oszczędność podatkowa IKE (zł)
  
  // Emerytura
  monthlyPension: number          // Średnia miesięczna emerytura (zł)
  
  // Ostrzeżenia
  exceedsIkeLimit: boolean        // Czy przekracza limit IKE
  ikeLimit: number                // Aktualny limit IKE (zł)
}
```

| Field | Type | Calculation |
|-------|------|-------------|
| savingsPeriodYears | number | withdrawalAge - currentAge |
| yearlyContribution | number | monthly × 12 or yearly |
| totalContributions | number | yearlyContribution × savingsPeriodYears + initialCapital |
| finalCapital | number | FVA formula (see research.md) |
| investmentGain | number | finalCapital - totalContributions |
| belkaTax | number | investmentGain × 0.19 |
| taxSaving | number | belkaTax (same value) |
| monthlyPension | number | finalCapital / (withdrawalPeriod × 12) |
| exceedsIkeLimit | boolean | yearlyContribution > ikeLimit |
| ikeLimit | number | from ikeLimits.ts |

### IkeLimit (Type)

Limity wpłat IKE pobierane z `src/logic/ikeLimits.ts`.

```typescript
function getIkeLimit(dateOfLawRules: Date): number
```

## State Management

### Store Structure

```typescript
interface IkeSavingsStore {
  inputFields: InputFields | undefined
}
```

### Computed Properties (Getters)

```typescript
getters: {
  result(state): Result | undefined {
    if (state.inputFields === undefined) return undefined
    return new IkeSavingsCalculator()
      .setInputData(state.inputFields)
      .calculate()
      .getResult()
  }
}
```

## Validation Rules

| Field | Rules |
|-------|-------|
| currentAge | required, minValue(18), maxValue(100) |
| contributionAmount | requiredAmount, minValue(0) |
| expectedReturnRate | required, minValue(-20), maxValue(30) |
| withdrawalAge | required, greaterThan(currentAge), maxValue(100) |
| withdrawalPeriod | required, minValue(1), maxValue(50) |
| initialCapital | minValue(0) |

## Relationships

```
┌─────────────┐     uses      ┌──────────────────────┐
│ InputFields │ ──────────────▶│ IkeSavingsCalculator │
└─────────────┘               └──────────────────────┘
                                        │
                                        │ produces
                                        ▼
                              ┌─────────┐
                              │ Result  │
                              └─────────┘
                                        │
                                        │ includes
                                        ▼
                              ┌──────────┐
                              │ IkeLimit │
                              └──────────┘
```
