# Research: Rzeczywisty koszt zakupu — wyświetlanie kosztu rzeczywistego

**Date**: 2026-02-10  
**Branch**: `021-real-cost-display`

## Research Tasks

### 1. Existing module structure and patterns

**Decision**: Extend the existing `realBoughtCosts` module — no new module needed.

**Rationale**: The module already calculates all components (VAT, income tax deduction, health contribution, saved amount). The only missing piece is the final `realCost = price - savedAmount` field and its display in the result list.

**Alternatives considered**:

- Creating a separate derived value in the store getter — rejected because the calculator should own all result fields
- Computing `realCost` only in the UI template — rejected because it violates the pattern where all calculated values live in the `Result` interface

### 2. Result interface extension pattern

**Decision**: Add `readonly realCost: number` to the existing `Result` interface.

**Rationale**: All other calculator modules follow the pattern where every displayed value is a field in the `Result` interface. This keeps the UI layer thin (just rendering) and the logic testable.

**Alternatives considered**: None — this is the established pattern.

### 3. UI highlight pattern

**Decision**: Move the `highlight` prop from "Zaoszczędzona kwota" `ListRow` to the new "Rzeczywisty koszt zakupu" `ListRow`. The `ListRow` component already supports a `highlight` boolean prop.

**Rationale**: The primary result the user seeks is the real cost, not the saved amount. The highlight should indicate the main answer.

**Alternatives considered**:

- Highlighting both rows — rejected, only one row should be the primary result per existing module conventions

### 4. Test update strategy

**Decision**: Add `expect(result.realCost).toBe(...)` assertions to all existing test cases. Values are deterministic: `realCost = price - savedAmount`.

**Rationale**: Per project rules, tests must contain all output values. The `realCost` field is a new output value.

**Alternatives considered**: None — mandatory per project conventions.

## Summary

No unknowns remain. All decisions align with existing module patterns. The change is minimal: 1 new field in interface, 1 line in calculator, 1 new `ListRow` in template, assertions in tests.
