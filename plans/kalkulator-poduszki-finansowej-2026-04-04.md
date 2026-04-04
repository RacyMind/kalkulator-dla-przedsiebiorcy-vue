# Plan funkcji: Kalkulator poduszki finansowej

## Skrót

Nowy moduł w sekcji oszczędności, który pomaga wyznaczyć docelową kwotę poduszki finansowej, ocenić obecny poziom zabezpieczenia i oszacować czas dojścia do celu. Wzorce repo: `savingsPlan` dla struktury modułu i persystencji formularza, `ikeSavings` dla czytelnego wyniku sekcyjnego oraz `rentalProfit` dla lekkiego układu z zakładkami wyników.

## Funkcje do implementacji

### MVP

- Obliczenie docelowej kwoty poduszki na podstawie miesięcznych kosztów niezbędnych i liczby miesięcy bufora.
- Wyliczenie obecnego pokrycia kosztów w miesiącach, luki do celu i procentu realizacji celu.
- Oszacowanie czasu dojścia do celu przy zadanej miesięcznej kwocie odkładania i opcjonalnej rocznej stopie zwrotu.
- Widok wyników w dwóch zakładkach: `Podsumowanie` i `Droga do celu`.
- Automatyczne przeliczanie wyników po zmianie danych wejściowych oraz zapamiętywanie pól formularza w `useLocalStorage`.

### P2

- Presety bufora `3 / 6 / 9 / 12 miesięcy` obok ręcznego pola liczbowego.
- Tryb przełączenia między kosztami `niezbędnymi` i `pełnymi wydatkami gospodarstwa`.
- Wykres dojścia do celu na podstawie harmonogramu miesięcznego.

### Poza zakresem

- Import danych z banku lub kategorii wydatków.
- Obsługa wielu scenariuszy zapisanych w jednym module.
- Uwzględnianie inflacji kosztów życia i osobnego oprocentowania dla kilku kont.

## Struktura rozwiązania

- Typ zmiany: `nowy moduł`
- Moduły referencyjne: `src/components/savingsPlan/`, `src/components/ikeSavings/`, `src/components/rentalProfit/`
- Struktura modułu:
  - `src/components/emergencyFund/components/Form.vue`
  - `src/components/emergencyFund/components/SummaryList.vue`
  - `src/components/emergencyFund/components/ProjectionTable.vue`
  - `src/components/emergencyFund/interfaces/InputFields.ts`
  - `src/components/emergencyFund/interfaces/Result.ts`
  - `src/components/emergencyFund/logic/EmergencyFundCalculator.ts`
  - `src/components/emergencyFund/pages/Index.vue`
  - `src/components/emergencyFund/store.ts`
- Logika ma korzystać z `BasicCalculator`, a `store.ts` ma przechowywać tylko `inputFields` i wyliczać `result` w getterze.
- Miejsca integracji w repo:
  - dodać route `/poduszka-finansowa` w `src/router/routes.ts`
  - dodać kafel w sekcji `savings` w `src/components/partials/menu/menuItems.ts`
  - dodać wpis do `src/components/changeLogs/logs.ts`
  - dodać testy do `test/vitest/__tests__/modules/emergencyFund/`

## UI

### Layout i przepływ

- Strona modułu korzysta z `ModulePageLayout` w układzie formularz po lewej i wyniki po prawej.
- Formularz ma trzy sekcje: `Cel bezpieczeństwa`, `Aktualna rezerwa`, `Budowanie poduszki`.
- Po kliknięciu `Oblicz` widok przewija do wyników.
- Wyniki są pokazane w dwóch zakładkach `Podsumowanie` i `Droga do celu`, analogicznie do lekkiego wzorca z `rentalProfit`.
- Stan pusty wyników: `Brak danych`.

### Pola wejściowe

| Pole                            | Typ UI                                       | Model danych            | Wymagane | Domyślna wartość | Walidacja                                 | Wpływ na wynik                                                            |
| ------------------------------- | -------------------------------------------- | ----------------------- | -------- | ---------------- | ----------------------------------------- | ------------------------------------------------------------------------- |
| Miesięczne koszty niezbędne     | `QInput` z sufiksem `zł`                     | `monthlyEssentialCosts` | Tak      | `6000`           | `requiredAmount`, `minValue(0.01)`        | Wyznacza docelową poduszkę, obecne pokrycie kosztów i harmonogram dojścia |
| Docelowa liczba miesięcy bufora | `QInput` typu integer lub `QSelect` presetów | `targetCoverageMonths`  | Tak      | `6`              | `required`, `minValue(1)`, `maxValue(24)` | Wyznacza kwotę celu                                                       |
| Aktualna kwota rezerwy          | `QInput` z sufiksem `zł`                     | `currentSavings`        | Tak      | `10000`          | `requiredAmount`, `minValue(0)`           | Wpływa na pokrycie kosztów, lukę do celu i procent realizacji             |
| Miesięczna kwota odkładania     | `QInput` z sufiksem `zł`                     | `monthlyContribution`   | Tak      | `1000`           | `requiredAmount`, `minValue(0.01)`        | Wyznacza czas dojścia do celu i harmonogram                               |
| Roczna stopa zwrotu rezerwy     | `QInput` z sufiksem `%`                      | `annualReturnRate`      | Nie      | `0`              | `minValue(0)`, `maxValue(15)`             | Koryguje harmonogram i czas dojścia do celu                               |

### Wyniki

| Wynik                   | Forma prezentacji                 | Źródło/wzór                                       | Warunki wyświetlania                |
| ----------------------- | --------------------------------- | ------------------------------------------------- | ----------------------------------- |
| Docelowa kwota poduszki | wyróżniony `ListRow`              | `monthlyEssentialCosts * targetCoverageMonths`    | zawsze po obliczeniu                |
| Obecne pokrycie kosztów | `ListRow` w miesiącach            | `currentSavings / monthlyEssentialCosts`          | zawsze po obliczeniu                |
| Luka do celu            | `ListRow`                         | `max(targetAmount - currentSavings, 0)`           | zawsze po obliczeniu                |
| Procent realizacji      | `ListRow` lub pasek postępu       | `min(currentSavings / targetAmount * 100, 100)`   | zawsze po obliczeniu                |
| Szacowany czas do celu  | wyróżniony `ListRow`              | iteracja miesięczna do osiągnięcia `targetAmount` | gdy `currentSavings < targetAmount` |
| Status celu             | badge lub alert                   | `isTargetReached`                                 | zawsze po obliczeniu                |
| Harmonogram dojścia     | tabela w zakładce `Droga do celu` | symulacja miesięczna salda                        | gdy `monthlyContribution > 0`       |

## Logika i dane

- `targetAmount = monthlyEssentialCosts * targetCoverageMonths`
- `currentCoverageMonths = currentSavings / monthlyEssentialCosts`
- `gapAmount = max(targetAmount - currentSavings, 0)`
- `progressPercent = min((currentSavings / targetAmount) * 100, 100)`
- `monthsToTarget = 0`, jeśli `currentSavings >= targetAmount`
- Jeśli cel nie jest osiągnięty i `monthlyContribution <= 0`, pokaż wynik `Brak dojścia do celu przy obecnych danych` zamiast liczby miesięcy.
- Dla dodatniej stopy zwrotu użyj miesięcznej stopy efektywnej `((1 + annualReturnRate / 100)^(1 / 12) - 1)` i aktualizuj saldo iteracyjnie miesiąc po miesiącu.
- Harmonogram obcinaj po osiągnięciu celu albo po 360 miesiącach, aby uniknąć nieskończonych symulacji.
- Dane wejściowe zapisuj w `useLocalStorage` pod prefiksem `emergencyFund/form/...`.
- `Result.ts` powinien zawierać zarówno wynik zagregowany, jak i listę wpisów harmonogramu miesięcznego do tabeli.
- Edge cases:
  - bardzo niska kwota celu i już osiągnięta poduszka,
  - `annualReturnRate = 0`,
  - `monthlyContribution = 0`,
  - koszty z groszami,
  - bardzo wysoki cel i długi harmonogram.

## Testy i akceptacja

- Testy jednostkowe `EmergencyFundCalculator.test.ts`:
  - poprawne wyliczenie celu, luki i pokrycia kosztów,
  - scenariusz celu już osiągniętego,
  - scenariusz bez dojścia do celu przy `monthlyContribution = 0`,
  - scenariusz z dodatnią stopą zwrotu,
  - scenariusz z groszami i zaokrągleniem wszystkich pól wyniku.
- Testy komponentowe `EmergencyFundForm.test.ts`:
  - walidacja pól wymaganych,
  - zapis do store po submit,
  - przewijanie do wyników,
  - render zakładek i tabeli harmonogramu.
- Testy integracyjne repo:
  - obecność route w `src/router/routes.ts`,
  - obecność kafla w `src/components/partials/menu/menuItems.ts`,
  - obecność wpisu w `src/components/changeLogs/logs.ts`.
- Kryteria ukończenia:
  - plan wyników odpowiada obu zakładkom,
  - formularz ma spójne domyślne wartości,
  - wszystkie wyniki z `Result.ts` są asercjami w testach logiki.

## Założenia i otwarte pytania

### Założenia

- V1 liczy jedną poduszkę finansową dla jednego gospodarstwa domowego.
- V1 wymaga podania miesięcznej kwoty odkładania, aby wynik `czas do celu` był zawsze deterministyczny.
- W module nie zapisujemy wielu scenariuszy, bo w repo nie ma jeszcze wspólnego wzorca wielowariantowego dla prostych kalkulatorów diagnostycznych.

### Otwarte pytania

- Czy wynik `Droga do celu` ma pozostać wyłącznie tabelą, czy od razu dodać prosty wykres liniowy jako część P2.
