# Data Model: Refaktoryzacja kodu (Milestone 2)

**Branch**: `011-code-refactoring` | **Date**: 2026-02-07

## Overview

This milestone doesn't introduce new user-facing data entities. The data model describes the **new Pinia constants store** interfaces and the **Design Tokens** structure — the two main architectural artifacts.

---

## 1. Constants Store (`src/stores/constantsStore.ts`)

### Store Definition

```typescript
defineStore('constants', () => {
  // State: static data
  // Getters: year-dependent computed data
  // Actions: none (read-only store)
})
```

### Interfaces

#### AvailableYear

```typescript
type AvailableYear = 2021 | 2022 | 2023 | 2024 | 2025 | 2026
```

#### YearParams

```typescript
interface YearParams {
  accidentRate: number
  amountOfTaxThreshold: number
  averageSalary: number
  expensesIfYouWorkWhereYouDontLive: number
  expensesIfYouWorkWhereYouLive: number
  freeAmountOfTax: number
  grossAmountLimitForAid: number
  limitBasicAmountForZus: number
  lumpSumUpToAmount: number
  minimumSalary: number | { firstHalfOfYear: number; secondHalfOfYear: number }
  ppk: PpkConstants
  taxRates: TaxRates
  taxRatesForLumpSum: Array<{ label: string; value: number }>
  taxReducingAmount: number
  us: UsConstants
  zus: ZusOwnerConstants
  holidayRate: number
}
```

#### ZusConstants (computed, year-dependent)

```typescript
interface ZusConstants {
  contributionBasisLimit: number
  employee: EmployeeZusConstants
  employer: EmployerZusConstants
  entrepreneur: EntrepreneurZusConstants
}

interface EmployeeZusConstants {
  rates: {
    disabilityContribution: number
    healthContribution: number
    pensionContribution: number
    ppkContribution: { default: number; min: number; max: number }
    sickContribution: number
  }
}

interface EmployerZusConstants {
  rates: {
    accidentCContribution: { default: number; min: number; max: number }
    disabilityContribution: number
    fgspContribution: number
    fpContribution: number
    fsContribution: number
    pensionContribution: number
    ppkContribution: { default: number; min: number; max: number }
  }
}

interface EntrepreneurZusConstants {
  basises: {
    big: number
    small: (monthIndex?: number) => number
    startRelief: number
  }
  rates: {
    accidentCContribution: { default: number; min: number; max: number }
    disabilityContribution: number
    fgspContribution: number
    fpContribution: number
    fsContribution: number
    healthContribution: { taxScales: number; flatTax: number }
    pensionContribution: number
    sickContribution: number
  }
}
```

#### IncomeTaxConstants (computed, year-dependent)

```typescript
interface IncomeTaxConstants {
  taxReliefLimit: number
  taxScale: {
    expenses: {
      amounts: { workInLivingPlace: number; workOutsideLivingPlace: number }
      rates: { default: number; author: number }
      withoutExpensesUpTo: number
    }
    taxFreeAmount: number
    taxThreshold: number
    taxRates: { first: number; second: number }
  }
  flatTax: {
    deductibleHealthContributionLimit: number
    taxRate: number
  }
  belkaTaxRate: number
}
```

#### WageStats (computed, year-dependent)

```typescript
interface WageStats {
  averageWageInLastQuarter: (year?: number) => number
  minimumWage: (year?: number, monthIndex?: number) => number
  minimumHourlyWage: (year?: number, monthIndex?: number) => number
  projectedAverageWage: () => number
}
```

#### AppConfig (static)

```typescript
interface AppConfig {
  name: string       // 'Kalkulator finansowy'
  version: string    // '5.11.0'
}
```

#### Static Constants (non-year-dependent)

```typescript
interface StaticConstants {
  app: AppConfig
  amountTypes: { gross: AmountType; net: AmountType }
  taxTypes: { general: IncomeTaxType; linear: IncomeTaxType; lumpSum: IncomeTaxType }
  availableYears: AvailableYear[]
  contractOfEmployment: { authorExpensesRate: number; expensesIfYouWorkWhereYouDontLive: number; expensesIfYouWorkWhereYouLive: number }
  contractOfMandate: { authorExpensesRate: number; expensesRate: number }
  contractWork: { expenses20: number; expenses50: number }
  ppk: PpkConstants
  vatLimit: number
  cashRegisterLimit: number
  rentalTax: { lumpSumRate: number; lumpSumRateAboveThreshold: number; threshold: number; spouseThreshold: number }
  localeDate: LocaleDateConfig
  monthNames: string[]
  fullYear: string
}
```

### Store Getters (year-dependent)

| Getter | Returns | Depends on |
|--------|---------|------------|
| `zusConstants` | `ZusConstants` | `settingStore.dateOfLawRules` |
| `incomeTaxConstants` | `IncomeTaxConstants` | `settingStore.dateOfLawRules` |
| `wageStats` | `WageStats` | `settingStore.dateOfLawRules` |
| `yearParams` | `YearParams` | `settingStore.dateOfLawRules` |

### Relationships

```
settingStore.dateOfLawRules (year)
  └── constantsStore
        ├── zusConstants (getter)
        ├── incomeTaxConstants (getter)
        ├── wageStats (getter)
        └── yearParams (getter → PARAMS[year])
```

---

## 2. Design Tokens (`src/css/_design-tokens.scss`)

### Token Categories

| Category | CSS Variable Pattern | Example |
|----------|---------------------|---------|
| Brand | `--color-primary`, `--color-secondary`, `--color-accent` | `--color-primary: #...` |
| Surface | `--surface`, `--surface-variant`, `--surface-elevated` | `--surface: #ffffff` |
| Module | `--module-work`, `--module-business`, `--module-taxes`, `--module-currencies`, `--module-percentage`, `--module-informator` | `--module-work: #...` |
| Chart | `--chart-1` through `--chart-8` | `--chart-1: #...` |
| Semantic | `--color-positive`, `--color-negative`, `--color-info`, `--color-warning` | `--color-positive: #...` |
| Text | `--text-primary`, `--text-secondary`, `--text-on-brand` | `--text-primary: #1a1a1a` |

### Selectors

| Selector | Purpose |
|----------|---------|
| `:root` | Light mode defaults |
| `.body--dark` | Dark mode overrides |
| `.c-work` | Work module brand color scope |
| `.c-business` | Business module brand color scope |
| `.c-taxes` | Taxes module brand color scope |
| `.c-currencies` | Currencies module brand color scope |
| `.c-percentage` | Percentage/savings module brand color scope |
| `.c-informator` | Informator module brand color scope |

---

## 3. useChartColors Composable

### Interface

```typescript
interface ChartColors {
  chart1: string
  chart2: string
  chart3: string
  chart4: string
  chart5: string
  chart6: string
  chart7: string
  chart8: string
}

interface ModuleColors {
  work: string
  business: string
  taxes: string
  currencies: string
  percentage: string
  informator: string
}

function useChartColors(): {
  chartColors: ComputedRef<ChartColors>
  moduleColors: ComputedRef<ModuleColors>
  refresh: () => void
}
```

---

## 4. Shared findGrossAmountUsingNetAmount

### Interface

```typescript
interface GrossAmountCalculator {
  getResult(amount: number): { netAmount: number }
}

function findGrossAmountUsingNetAmount<T extends GrossAmountCalculator>(
  calculator: T,
  netAmount: number,
  precision?: number
): number
```

---

## 5. Extracted Composables

### useScrollToResults

```typescript
function useScrollToResults(): {
  summaryRef: Ref<HTMLElement | null>
  scrollToResults: () => void
}
```

### useTaxThresholdNotification

```typescript
function useTaxThresholdNotification(): {
  checkTaxThreshold: (yearlyIncome: number) => void
}
```
