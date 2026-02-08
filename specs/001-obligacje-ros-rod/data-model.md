# Data Model: Dodanie obligacji ROS i ROD

**Feature**: [spec.md](./spec.md)  
**Branch**: `001-obligacje-ros-rod`  

## Context

Feature rozszerza istniejący moduł "Obligacje skarbowe" o dwa nowe typy obligacji rodzinnych: ROS i ROD.

## Entities

### BondType

- **Description**: Typ obligacji wybierany przez użytkownika.
- **New values**: `ROS`, `ROD`.

### SimulationInput (ROS/ROD)

Wartości wejściowe potrzebne do obliczeń:

- **bondType**: `ROS` lub `ROD`
- **boughtBondCount**: liczba obligacji (integer, >= 0)
- **yearlyInflationRate**: inflacja roczna jako pojedyncza wartość (float, % w UI; do obliczeń jako ułamek, np. 0.036)
- **belkaTaxEnabled**: boolean
- **initialInterestRateYear1**: oprocentowanie w 1. roku (float, % w UI; do obliczeń jako ułamek)

### ProductParams (ROS)

- **maturityMonths**: 72
- **nominalPerBond**: 100 zł
- **interestCapitalization**: roczna
- **payoutMode**: przy wykupie
- **margin**: 2,00%
- **year2plusRateFormula**: `max(0, yearlyInflationRate) + margin`

### ProductParams (ROD)

- **maturityMonths**: 144
- **nominalPerBond**: 100 zł
- **interestCapitalization**: roczna
- **payoutMode**: przy wykupie
- **margin**: 1,75%
- **year2plusRateFormula**: `max(0, yearlyInflationRate) + margin`

### MonthlyResult

Lista miesięcznych rekordów wyświetlanych w zakładce "Wypłaty".

Pola (zgodne z istniejącym modelem modułu obligacji):

- **interestRate**: roczna stopa obowiązująca w danym miesiącu (ułamek, np. 0.052)
- **interest**: odsetki w danym miesiącu (PLN)
- **accumulatedInterest**: odsetki narastająco (PLN)
- **taxAmount**: podatek za dany miesiąc (PLN) — dla ROS/ROD oczekiwane 0 aż do wykupu
- **accumulatedTaxAmount**: podatek narastająco (PLN)
- **accumulatedProfit**: zysk narastająco (PLN)
- **accumulatedRealProfit**: zysk realny narastająco (PLN, z uwzględnieniem inflacji)
- **payout**: wypłata w danym miesiącu (PLN) — dla ROS/ROD oczekiwana tylko w miesiącu wykupu

### Result

- **monthlyResults**: `MonthlyResult[]`

## Validation Rules (at a glance)

- **boughtBondCount**: wymagane, >= 0
- **yearlyInflationRate**: wymagane (może być ujemne w UI), ale do oprocentowania używać `max(0, inflacja)`
- **initialInterestRateYear1**: wymagane, >= 0

## Out of scope

- Symulacja przedterminowego wykupu.
- Weryfikacja limitów zakupu/uprawnień (800+).
