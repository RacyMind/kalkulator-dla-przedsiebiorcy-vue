# Data Model: Rzeczywisty koszt zakupu — wyświetlanie kosztu rzeczywistego

**Date**: 2026-02-10  
**Branch**: `021-real-cost-display`

## Entities

### InputFields (no changes)

| Field                | Type                        | Description                      |
| -------------------- | --------------------------- | -------------------------------- |
| `price`              | `number`                    | Cena brutto produktu             |
| `vatTaxRate`         | `AvailableVatRate`          | Stawka VAT (0, 0.05, 0.08, 0.23) |
| `deductedVatTaxPart` | `0 \| 0.5 \| 1`             | Część VAT do odliczenia          |
| `incomeTaxRate`      | `0 \| 0.12 \| 0.19 \| 0.32` | Stawka podatku dochodowego       |

### Result (modified)

| Field                     | Type              | Description                                        | Status   |
| ------------------------- | ----------------- | -------------------------------------------------- | -------- |
| `price`                   | `readonly number` | Cena brutto                                        | existing |
| `vatTaxAmount`            | `readonly number` | Kwota podatku VAT                                  | existing |
| `deductedVatTaxAmount`    | `readonly number` | VAT do odliczenia                                  | existing |
| `deductedIncomeTaxAmount` | `readonly number` | Podatek dochodowy do odliczenia                    | existing |
| `healthContribution`      | `readonly number` | Składka zdrowotna                                  | existing |
| `savedAmount`             | `readonly number` | Zaoszczędzona kwota                                | existing |
| `realCost`                | `readonly number` | **Rzeczywisty koszt zakupu** = price - savedAmount | **NEW**  |

## Relationships

```
InputFields → RealBoughtCostCalculator.calculate() → Result
```

No new relationships. The `realCost` field is derived from existing `price` and `savedAmount` fields within the same `Result` object.

## Validation Rules

- `realCost` >= 0 (always true since savedAmount <= price by definition)
- `realCost` = `price` when no deductions are applied (savedAmount = 0)
- Rounded to 2 decimal places (grosze)
