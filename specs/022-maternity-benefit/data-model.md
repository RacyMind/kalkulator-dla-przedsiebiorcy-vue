# Data Model: Kalkulator zasiłku macierzyńskiego

**Branch**: `022-maternity-benefit` | **Date**: 2026-02-10

## Types

### EmploymentType (enum)

```typescript
enum EmploymentType {
  EmploymentContract = 'employmentContract',
  SelfEmployment = 'selfEmployment',
}
```

### ZusType (enum)

```typescript
enum ZusType {
  Big = 'big',
  Preferential = 'preferential',
  Custom = 'custom',
}
```

### ChildrenCount (type)

```typescript
type ChildrenCount = 1 | 2 | 3 | 4 | 5
```

Wartość 5 oznacza "5 lub więcej dzieci".

## Interfaces

### InputFields

```typescript
interface InputFields {
  readonly employmentType: EmploymentType
  readonly zusType: ZusType // tylko dla selfEmployment
  readonly averageBasis: number // średnia pensja brutto (UoP) lub podstawa składki chorobowej (DG)
  readonly childrenCount: ChildrenCount
}
```

| Pole             | Typ              | Walidacja                                           | Opis                            |
| ---------------- | ---------------- | --------------------------------------------------- | ------------------------------- |
| `employmentType` | `EmploymentType` | wymagane                                            | Forma zatrudnienia              |
| `zusType`        | `ZusType`        | wymagane dla selfEmployment                         | Typ składek ZUS                 |
| `averageBasis`   | `number`         | > 0, ≤ 250% przeciętnego wynagrodzenia (dla custom) | Średnia miesięczna podstawa     |
| `childrenCount`  | `ChildrenCount`  | 1–5                                                 | Liczba dzieci w jednym porodzie |

### LeavePeriodsResult

```typescript
interface LeavePeriodsResult {
  readonly maternityLeaveWeeks: number
  readonly maternityLeaveDays: number
  readonly parentalLeaveWeeks: number
  readonly parentalLeaveDays: number
  readonly totalWeeks: number
  readonly totalDays: number
}
```

### VariantResult

```typescript
interface VariantResult {
  readonly maternityLeaveAmount: number
  readonly parentalLeaveAmount: number
  readonly totalAmount: number
  readonly maternityDailyRate: number
  readonly parentalDailyRate: number
}
```

### Result

```typescript
interface Result {
  readonly benefitBasis: number // podstawa zasiłku (po odjęciu 13,71%)
  readonly dailyRate: number // stawka dzienna (benefitBasis / 30)
  readonly leavePeriods: LeavePeriodsResult
  readonly variantA: VariantResult // stały 81,5%
  readonly variantB: VariantResult // zmienny 100% / 70%
  readonly secondParentBenefit: number // zasiłek dla drugiego rodzica (9 tyg. × 70%)
  readonly secondParentDailyRate: number // stawka dzienna drugiego rodzica
  readonly secondParentDays: number // 63 dni (9 tygodni)
}
```

| Pole                            | Typ      | Formuła                                            |
| ------------------------------- | -------- | -------------------------------------------------- |
| `benefitBasis`                  | `number` | `averageBasis × (1 - socialContributionRate)`      |
| `dailyRate`                     | `number` | `benefitBasis / 30`                                |
| `variantA.maternityDailyRate`   | `number` | `dailyRate × 0.815`                                |
| `variantA.maternityLeaveAmount` | `number` | `variantA.maternityDailyRate × maternityLeaveDays` |
| `variantA.parentalDailyRate`    | `number` | `dailyRate × 0.815`                                |
| `variantA.parentalLeaveAmount`  | `number` | `variantA.parentalDailyRate × parentalLeaveDays`   |
| `variantA.totalAmount`          | `number` | `maternityLeaveAmount + parentalLeaveAmount`       |
| `variantB.maternityDailyRate`   | `number` | `dailyRate × 1.0`                                  |
| `variantB.maternityLeaveAmount` | `number` | `variantB.maternityDailyRate × maternityLeaveDays` |
| `variantB.parentalDailyRate`    | `number` | `dailyRate × 0.7`                                  |
| `variantB.parentalLeaveAmount`  | `number` | `variantB.parentalDailyRate × parentalLeaveDays`   |
| `variantB.totalAmount`          | `number` | `maternityLeaveAmount + parentalLeaveAmount`       |
| `secondParentDailyRate`         | `number` | `dailyRate × 0.7`                                  |
| `secondParentBenefit`           | `number` | `secondParentDailyRate × 63`                       |

## Constants (module-level)

### leavePeriodsConfig

```typescript
const MATERNITY_LEAVE_WEEKS: Record<ChildrenCount, number> = {
  1: 20,
  2: 31,
  3: 33,
  4: 35,
  5: 37,
}

const PARENTAL_LEAVE_WEEKS: Record<ChildrenCount, number> = {
  1: 32,
  2: 34,
  3: 34,
  4: 34,
  5: 34,
}

const SECOND_PARENT_LEAVE_WEEKS = 9
```

### Rates

```typescript
const VARIANT_A_RATE = 0.815 // stały zasiłek
const VARIANT_B_MATERNITY_RATE = 1.0 // 100% za urlop macierzyński
const VARIANT_B_PARENTAL_RATE = 0.7 // 70% za urlop rodzicielski
const SECOND_PARENT_RATE = 0.7 // 70% dla drugiego rodzica
const DAYS_PER_WEEK = 7
const DAYS_IN_MONTH = 30 // do obliczenia stawki dziennej
```

## State (Pinia Store)

```typescript
type Store = {
  inputFields: InputFields | undefined
}
```

Getter `result` oblicza wynik reaktywnie na podstawie `inputFields` (wzorzec z `contractWork/store.ts`).

## Relationships

```
InputFields → MaternityBenefitCalculator → Result
                    ↓
              leavePeriodsConfig (stałe wymiary urlopów)
              constantsStore (stawki ZUS, podstawy składek)
```
