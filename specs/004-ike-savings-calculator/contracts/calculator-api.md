# Calculator API Contract: IkeSavingsCalculator

**Feature**: 004-ike-savings-calculator  
**Date**: 2026-01-24

## Overview

Internal TypeScript API for IKE savings calculations. No external REST/GraphQL endpoints.

## Class: IkeSavingsCalculator

Extends `BasicCalculator<InputFields, Result>` and implements `Calculator<InputFields, Result>`.

### Methods

#### setInputData(input: InputFields): this

Sets the input data for calculation.

**Parameters:**
```typescript
interface InputFields {
  currentAge: number              // 18-100
  contributionType: ContributionType
  contributionAmount: number      // >= 0
  expectedReturnRate: number      // -20 to +30 (percent)
  withdrawalAge: number           // > currentAge, <= 100
  withdrawalPeriod: number        // 1-50 (years)
  initialCapital: number          // >= 0 (optional, default 0)
}

enum ContributionType {
  Monthly = 'monthly',
  Yearly = 'yearly'
}
```

**Returns:** `this` (for chaining)

**Throws:** None

---

#### calculate(): this

Performs the IKE savings calculation.

**Parameters:** None

**Returns:** `this` (for chaining)

**Throws:** 
- `Error('The input data is undefined!')` if `setInputData` was not called

**Algorithm:**
1. Calculate savings period: `withdrawalAge - currentAge`
2. Calculate yearly contribution based on type
3. Calculate total contributions: `yearlyContribution × years + initialCapital`
4. Calculate final capital using FVA formula
5. Calculate investment gain: `finalCapital - totalContributions`
6. Calculate tax saving: `investmentGain × 0.19`
7. Calculate monthly pension: `finalCapital / (withdrawalPeriod × 12)`
8. Check IKE limit exceeded

---

#### getResult(): Result

Returns the calculation result.

**Parameters:** None

**Returns:**
```typescript
interface Result {
  savingsPeriodYears: number
  yearlyContribution: number
  totalContributions: number
  finalCapital: number
  investmentGain: number
  belkaTax: number
  taxSaving: number
  monthlyPension: number
  exceedsIkeLimit: boolean
  ikeLimit: number
}
```

**Throws:**
- `Error('The result is undefined!')` if `calculate` was not called

---

## Usage Example

```typescript
import { IkeSavingsCalculator } from 'components/ikeSavings/logic/IkeSavingsCalculator'
import { ContributionType } from 'components/ikeSavings/types/ContributionType'

const calculator = new IkeSavingsCalculator()

const result = calculator
  .setInputData({
    currentAge: 30,
    contributionType: ContributionType.Monthly,
    contributionAmount: 500,
    expectedReturnRate: 5,
    withdrawalAge: 60,
    withdrawalPeriod: 20,
    initialCapital: 0
  })
  .calculate()
  .getResult()

console.log(result.finalCapital)    // ~398633.28
console.log(result.taxSaving)       // ~41540.32
console.log(result.monthlyPension)  // ~1661.11
```

## Store Integration

```typescript
import { useIkeSavingsStore } from 'components/ikeSavings/store'

const store = useIkeSavingsStore()

// Set input
store.inputFields = {
  currentAge: 30,
  contributionType: ContributionType.Monthly,
  contributionAmount: 500,
  expectedReturnRate: 5,
  withdrawalAge: 60,
  withdrawalPeriod: 20,
  initialCapital: 0
}

// Get result (reactive)
const result = computed(() => store.result)
```

## Error Handling

| Error | Cause | Resolution |
|-------|-------|------------|
| `The input data is undefined!` | Called `calculate()` before `setInputData()` | Call `setInputData()` first |
| `The result is undefined!` | Called `getResult()` before `calculate()` | Call `calculate()` first |

## Rounding

All monetary results are rounded to 2 decimal places using `helpers.round(value, 2)`.
