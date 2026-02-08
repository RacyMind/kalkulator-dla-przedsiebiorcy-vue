# Quickstart: Dodanie obligacji ROS i ROD

**Feature**: [spec.md](./spec.md)  
**Branch**: `001-obligacje-ros-rod`

## Cel

Zweryfikować, że w module "Obligacje skarbowe" dostępne są typy ROS i ROD oraz że obliczenia i testy są zgodne ze specyfikacją.

## Manual verification (UI)

1. Otwórz moduł: `/obligacje-skarbowe`.
2. W polu wyboru rodzaju obligacji sprawdź, że istnieją pozycje:
   - ROS – obligacje 6-letnie
   - ROD – obligacje 12-letnie
3. Wybierz ROS:
   - sprawdź, że pole "oprocentowanie w 1. roku" ma wartość domyślną i jest edytowalne,
   - ustaw liczbę obligacji, inflację i podatek Belki,
   - przelicz.
4. Sprawdź w wynikach:
   - długość wyników (ROS: 72 miesiące),
   - wypłata (payout) pojawia się przy wykupie,
   - w kolejnych latach oprocentowanie odpowiada `max(0, inflacja) + marża`.
5. Powtórz dla ROD:
   - długość wyników (ROD: 144 miesiące).

## Unit tests

Uruchom testy selektywnie (zgodnie ze standardem repo):

- ROS:
  - `npx vitest run test/vitest/__tests__/modules/polishBonds/RosCalculator.test.ts`
- ROD:
  - `npx vitest run test/vitest/__tests__/modules/polishBonds/RodCalculator.test.ts`

## Notes

- Testy muszą zawierać wszystkie wartości wyjściowe (pola w `monthlyResults`).
- Data „przepisów” w testach powinna używać bieżącego roku (jak w istniejących testach modułu obligacji).
