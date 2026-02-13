# Calculator API Contract: Kalkulator zasiłku macierzyńskiego

**Branch**: `022-maternity-benefit` | **Date**: 2026-02-10

## Overview

Moduł nie eksponuje REST API — jest kalkulatorem client-side. Poniższy kontrakt opisuje interfejs klasy `MaternityBenefitCalculator` oraz Pinia store.

## Calculator Class Contract

### `MaternityBenefitCalculator`

Extends `BasicCalculator<InputFields, Result>`, implements `Calculator<InputFields, Result>`.

#### Usage

```typescript
const calculator = new MaternityBenefitCalculator()
const result = calculator.setInputData(inputFields).calculate().getResult()
```

#### Input: `InputFields`

```typescript
{
  employmentType: EmploymentType // 'employmentContract' | 'selfEmployment'
  zusType: ZusType // 'big' | 'preferential' | 'custom'
  averageBasis: number // > 0, ≤ maxBasis (for custom)
  childrenCount: ChildrenCount // 1 | 2 | 3 | 4 | 5
}
```

#### Output: `Result`

```typescript
{
  benefitBasis: number // averageBasis × (1 - 0.1371)
  dailyRate: number // benefitBasis / 30
  leavePeriods: {
    maternityLeaveWeeks: number // 20 | 31 | 33 | 35 | 37
    maternityLeaveDays: number // weeks × 7
    parentalLeaveWeeks: number // 32 | 34
    parentalLeaveDays: number // weeks × 7
    totalWeeks: number // maternity + parental
    totalDays: number // maternity + parental (days)
  }
  variantA: {
    // stały 81,5%
    maternityDailyRate: number // dailyRate × 0.815
    maternityLeaveAmount: number // maternityDailyRate × maternityLeaveDays
    parentalDailyRate: number // dailyRate × 0.815
    parentalLeaveAmount: number // parentalDailyRate × parentalLeaveDays
    totalAmount: number // maternity + parental
  }
  variantB: {
    // zmienny 100% / 70%
    maternityDailyRate: number // dailyRate × 1.0
    maternityLeaveAmount: number // maternityDailyRate × maternityLeaveDays
    parentalDailyRate: number // dailyRate × 0.7
    parentalLeaveAmount: number // parentalDailyRate × parentalLeaveDays
    totalAmount: number // maternity + parental
  }
  secondParentDailyRate: number // dailyRate × 0.7
  secondParentDays: number // 63 (9 weeks × 7)
  secondParentBenefit: number // secondParentDailyRate × 63
}
```

## Pinia Store Contract

### `useMaternityBenefitStore`

```typescript
// State
{
  inputFields: InputFields | undefined
}

// Getters
{
  result: Result | undefined // computed from inputFields via MaternityBenefitCalculator
}
```

## Form → Store Flow

1. User fills form fields (employmentType, zusType/averageBasis, childrenCount)
2. On submit: form constructs `InputFields` object
3. Form sets `store.inputFields = inputFields`
4. Store getter `result` reactively computes via `MaternityBenefitCalculator`
5. `ResultList.vue` reads `store.result` and displays both variants side-by-side

## Validation Rules

| Field                       | Rule                           | Message                                                   |
| --------------------------- | ------------------------------ | --------------------------------------------------------- |
| `averageBasis`              | `> 0`                          | "Podaj kwotę większą od 0"                                |
| `averageBasis` (custom ZUS) | `≤ 2.5 × projectedAverageWage` | "Kwota przekracza maksymalną podstawę składki chorobowej" |
| `employmentType`            | required                       | "Wybierz formę zatrudnienia"                              |
| `childrenCount`             | required, 1–5                  | "Wybierz liczbę dzieci"                                   |

## Error States

| Condition                          | Behavior                                 |
| ---------------------------------- | ---------------------------------------- |
| `averageBasis = 0` or empty        | Validation error, form not submitted     |
| `averageBasis < 0`                 | Validation error                         |
| `averageBasis > maxBasis` (custom) | Validation error with limit info         |
| Missing required fields            | Quasar form validation highlights fields |
