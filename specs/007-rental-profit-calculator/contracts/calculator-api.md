# Calculator API Contract: Kalkulator zysku z najmu

**Branch**: `007-rental-profit-calculator`  
**Date**: 2026-02-06

## Overview

Client-side calculator — no REST/GraphQL API. This contract defines the TypeScript class interface following the `BasicCalculator` pattern.

## RentalProfitCalculator

### Class signature

```typescript
class RentalProfitCalculator
  extends BasicCalculator<InputFields, Result>
  implements Calculator<InputFields, Result>
```

### Methods

#### `setInputData(input: InputFields): this`
Inherited from `BasicCalculator`. Sets the input data for calculation.

#### `calculate(): this`
Performs the rental profit calculation:
1. For each year (1 to `numberOfYears`):
   - Apply annual rent indexation: `monthlyRent[year] = monthlyRent × (1 + annualRentIncrease/100)^(year-1)`
   - Calculate `activeMonths = 12 - vacancyMonths`
   - Calculate `grossRevenue = monthlyRent[year] × activeMonths`
   - Calculate `taxableRevenue = grossRevenue - (refactoredCharges × activeMonths)`
   - Calculate tax using two-bracket system (8.5% / 12.5%)
   - Calculate `annualExpenses = monthlyExpenses × 12`
   - Calculate `netProfit = grossRevenue - tax - annualExpenses`
   - Accumulate `cumulativeProfit`
2. Generate `Summary` from all year results
3. Store result

**Returns**: `this` (for chaining)

#### `getResult(): Result`
Inherited from `BasicCalculator`. Returns the calculated result.

**Throws**: `Error('The result is undefined!')` if `calculate()` not called.

### Tax calculation detail

```typescript
calculateTax(taxableRevenue: number, isSpouseSettlement: boolean): number {
  const threshold = isSpouseSettlement ? SPOUSE_THRESHOLD : THRESHOLD
  if (taxableRevenue <= 0) return 0
  if (taxableRevenue <= threshold) {
    return helpers.round(taxableRevenue * LUMP_SUM_RATE, 2)
  }
  return helpers.round(
    threshold * LUMP_SUM_RATE + (taxableRevenue - threshold) * LUMP_SUM_RATE_ABOVE_THRESHOLD,
    2
  )
}
```

## Pinia Store Contract

```typescript
const useRentalProfitStore = defineStore('rentalProfitStore', {
  state: () => ({
    inputFields: undefined as InputFields | undefined,
  }),
  getters: {
    result(state): Result | undefined {
      if (state.inputFields === undefined) return undefined
      return new RentalProfitCalculator()
        .setInputData(state.inputFields)
        .calculate()
        .getResult()
    },
  },
})
```

## Form → Store data flow

1. User fills form fields (persisted via `useLocalStorage`)
2. On submit: form builds `InputFields` object and sets `store.inputFields`
3. Store getter `result` auto-computes via `RentalProfitCalculator`
4. UI components reactively display `store.result`

## UI Component Contract

### Index.vue (page)
- `ModulePageLayout` wrapper
- `SectionHeader` "Wypełnij formularz"
- `Form` component (emits `@submit`)
- `q-tabs` with two tabs:
  - `Tabs.AnnualSummary` → "Podsumowanie roczne"
  - `Tabs.MultiYearProjection` → "Projekcja wieloletnia"
- `q-tab-panels` with corresponding content

### Form.vue
Input fields (each with `Tooltip` component):
- `monthlyRent` — `q-input` type="number", label="Miesięczny przychód z najmu (zł)"
  - Tooltip: "Czysty czynsz najmu, bez opłat za media i czynsz administracyjny"
- `monthlyExpenses` — `q-input` type="number", label="Miesięczne koszty utrzymania (zł)"
  - Tooltip: "Twoje wydatki jako wynajmującego (ubezpieczenie, naprawy, kredyt). NIE zmniejszają podatku ryczałtowego, ale wpływają na realny zysk netto"
- `refactoredCharges` — `q-input` type="number", label="Opłaty refakturowane na najemcę (zł/mies.)"
  - Tooltip: "Kwoty, które najemca Ci płaci, a Ty przekazujesz dalej (spółdzielnia, dostawcy mediów). Zmniejszają przychód do opodatkowania ryczałtem"
- `numberOfYears` — `q-input` type="number", label="Liczba lat"
  - Tooltip: "Na ile lat chcesz zobaczyć projekcję zysku z najmu"
- `isSpouseSettlement` — `q-toggle`, label="Rozliczenie małżonków (próg 200 000 zł)"
  - Tooltip: "Zaznacz, jeśli składasz oświadczenie o opodatkowaniu całości przychodu z najmu u jednego z małżonków. Próg podwyższonej stawki rośnie do 200 000 zł"
- `vacancyMonths` — `q-input` type="number", label="Pustostany (miesiące bez najemcy w roku)"
  - Tooltip: "Ile miesięcy w roku przewidujesz bez najemcy. Przychód zmniejsza się proporcjonalnie, koszty utrzymania pozostają"
- `annualRentIncrease` — `q-input` type="number", label="Roczna waloryzacja czynszu (%)"
  - Tooltip: "O ile procent rocznie planujesz podnosić czynsz. Stosowane w projekcji wieloletniej"
- `SubmitButton` — "Oblicz"

### AnnualResultList.vue
Displays first year results using `list-row` pattern:
- Roczny przychód brutto
- Przychód do opodatkowania
- Podatek ryczałtowy
- Roczne koszty utrzymania
- **Zysk netto** (highlighted)
- Efektywna stawka podatku
- Miesięczny zysk netto

### ProjectionTable.vue
Displays multi-year projection table:
- Columns: Rok, Przychód, Podatek, Koszty, Zysk netto, Skumulowany zysk
- One row per year
- Summary row at bottom with totals
