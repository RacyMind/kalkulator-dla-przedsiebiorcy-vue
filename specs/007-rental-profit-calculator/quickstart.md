# Quick Start: Kalkulator zysku z najmu

**Branch**: `007-rental-profit-calculator`  
**Date**: 2026-02-06

## Prerequisites

- Node.js 18+
- npm / yarn
- Project dependencies installed (`npm install`)

## Development

```bash
# Start dev server
npx quasar dev

# Run tests for this module
npx vitest run test/vitest/__tests__/modules/rentalProfit/RentalProfitCalculator.test.ts
```

## Module location

```
src/components/rentalProfit/
```

## Route

```
/zysk-z-najmu
```

## Key files to create

| File | Purpose |
|------|---------|
| `src/components/rentalProfit/interfaces/InputFields.ts` | Input interface |
| `src/components/rentalProfit/interfaces/Result.ts` | Result interfaces (YearResult, Summary, Result) |
| `src/components/rentalProfit/logic/RentalProfitCalculator.ts` | Calculator extending BasicCalculator |
| `src/components/rentalProfit/store.ts` | Pinia store |
| `src/components/rentalProfit/components/Form.vue` | Input form |
| `src/components/rentalProfit/components/AnnualResultList.vue` | Annual summary tab |
| `src/components/rentalProfit/components/ProjectionTable.vue` | Multi-year projection tab |
| `src/components/rentalProfit/pages/Index.vue` | Main page with tabs |
| `test/vitest/__tests__/modules/rentalProfit/RentalProfitCalculator.test.ts` | Unit tests |

## Key files to modify

| File | Change |
|------|--------|
| `src/logic/constants.ts` | Add `rentalTax` constants (rates, thresholds) |
| `src/router/routes.ts` | Add route `'zysk-z-najmu'` |
| `src/components/changeLogs/logs.ts` | Add changelog entry |

## Reference implementations

- **Structure**: `src/components/contractWork/` — simplest module pattern
- **Tab UI**: `src/components/selfEmployment/pages/Index.vue` — q-tabs pattern
- **Tests**: `test/vitest/__tests__/modules/contractOfWork/ContractWorkCalculator.test.ts`

## Verification

1. Run calculator tests: `npx vitest run test/vitest/__tests__/modules/rentalProfit/RentalProfitCalculator.test.ts`
2. Start dev server and navigate to `/zysk-z-najmu`
3. Enter test data from spec (Scenario 1): monthlyRent=3000, monthlyExpenses=800, refactoredCharges=500, numberOfYears=1
4. Verify: tax=2550, netProfit=23850, effectiveTaxRate=7.08%
