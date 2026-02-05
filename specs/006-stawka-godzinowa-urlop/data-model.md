# Data Model: Stawka godzinowa i urlop w JDG

## Cel

Opisać model danych wejściowych, pochodnych i wynikowych dla trybu stawki godzinowej w module samozatrudnienia.

## Encje

### 1) Dane wejściowe (SelfEmploymentHourlyInput)

- **Opis**: Dane wymagane do wyliczenia przychodu miesięcznego na podstawie godzin.
- **Pola**:
  - `incomeMode` (string) — `monthly_revenue` | `hourly_rate`
  - `hourlyRate` (number) — stawka za godzinę (>= 0)
  - `plannedHours` (number) — planowane godziny pracy w miesiącu (>= 0, dopuszczalne wartości dziesiętne)
  - `deductLeave` (boolean) — czy odliczać urlop/zwolnienie
  - `leaveHours` (number | undefined) — godziny urlopu/zwolnienia (>= 0, dopuszczalne wartości dziesiętne, tylko gdy `deductLeave = true`)

### 2) Dane pochodne (SelfEmploymentHourlyDerived)

- **Opis**: Wartości pochodne dla obliczeń przychodu.
- **Pola**:
  - `billableHours` (number) — `max(0, plannedHours - leaveHours)`
  - `monthlyRevenueFromHourly` (number) — `hourlyRate * billableHours`

### 3) Wynik (SelfEmploymentResult)

- **Opis**: Wyniki kalkulatora samozatrudnienia (bez zmian w strukturze wyników) z przychodem uwzględniającym tryb godzinowy.

## Walidacja

- `hourlyRate`: wymagane w trybie `hourly_rate`, `>= 0`.
- `plannedHours`: wymagane w trybie `hourly_rate`, `>= 0`.
- `leaveHours`: wymagane gdy `deductLeave = true`, `>= 0` i `<= plannedHours`.
- `incomeMode`: wybór z listy rozwijanej, domyślnie `monthly_revenue`.
