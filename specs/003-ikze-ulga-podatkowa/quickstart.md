# Quickstart: Kalkulator ulgi podatkowej IKZE

## Cel

Szybka weryfikacja działania modułu IKZE po wdrożeniu.

## Wymagania

- Node + zależności projektu zainstalowane.

## Uruchomienie aplikacji

1. Uruchom aplikację w trybie dev.
2. Otwórz nowy moduł: „Kalkulator ulgi podatkowej IKZE”.

## Scenariusze weryfikacyjne

1. **Data obowiązywania przepisów**: wybierz po kolei daty 2023-2026 i sprawdź, że limit IKZE jest aktualizowany oraz prezentowany jako konkretna kwota.
2. **Status**:
   - wybierz „Umowa o pracę” i sprawdź, że wybór formy opodatkowania jest ukryty i ustawiony na „Skala podatkowa”.
   - wybierz „Działalność gospodarcza” i sprawdź, że można wybrać: skala / liniowy / ryczałt.
3. **Walidacja limitu**: ustaw wpłatę większą niż limit → formularz ma zablokować zatwierdzenie i pokazać komunikat błędu.
4. **Wyniki**: po poprawnych danych sprawdź, że UI pokazuje:
   - limit IKZE
   - wpłatę
   - podatek przed
   - podatek po
   - oszczędność podatkową

## Testy

Uruchom testy modułu (po ich dodaniu):

`npx vitest run test/vitest/__tests__/modules/ikzeTaxRelief/IkzeTaxReliefCalculator.test.ts`

Testy muszą zawierać wszystkie wartości wyjściowe i używać bieżącego roku (zgodnie ze standardem repo).
