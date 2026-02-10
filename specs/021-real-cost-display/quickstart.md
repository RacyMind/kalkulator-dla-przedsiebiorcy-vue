# Quickstart: Rzeczywisty koszt zakupu — wyświetlanie kosztu rzeczywistego

**Date**: 2026-02-10  
**Branch**: `021-real-cost-display`

## Overview

Add a new `realCost` field (price - savedAmount) to the real bought cost calculator and display it as the highlighted result in the UI.

## Files to Modify

| File                                                                            | Change                                                                                      |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `src/components/realBoughtCosts/interfaces/Result.ts`                           | Add `readonly realCost: number`                                                             |
| `src/components/realBoughtCosts/logic/RealBoughtCostCalculator.ts`              | Compute `realCost = price - savedAmount`                                                    |
| `src/components/realBoughtCosts/components/ResultList.vue`                      | Add highlighted "Rzeczywisty koszt zakupu" row, remove highlight from "Zaoszczędzona kwota" |
| `test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts` | Add `realCost` assertions to all test cases                                                 |

## Steps

1. Add `readonly realCost: number` to `Result` interface
2. In `RealBoughtCostCalculator.calculate()`, add `realCost: helpers.round(this.getInputData().price - savedAmount, 2)` to the result object
3. In `ResultList.vue`:
   - Remove `highlight` from "Zaoszczędzona kwota" `ListRow`
   - Add new `ListRow` with `highlight` for "Rzeczywisty koszt zakupu" displaying `props.result.realCost`
4. Update all test cases to assert `result.realCost` value
5. Run tests: `npx vitest run test/vitest/__tests__/modules/realBoughtCost/RealBoughtCostCalculator.test.ts`

## Expected Test Values (price=123, VAT 23%)

| Test case                    | savedAmount | realCost |
| ---------------------------- | ----------- | -------- |
| VAT + income tax 12%         | 44          | 79       |
| VAT only (no income tax)     | 23          | 100      |
| Income tax 32% only (no VAT) | 41          | 82       |
| Flat tax 19% only (no VAT)   | 23.9        | 99.1     |
