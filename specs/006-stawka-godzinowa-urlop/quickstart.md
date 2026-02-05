# Quickstart: Stawka godzinowa i urlop w JDG

## Cel

Szybka weryfikacja działania trybu stawki godzinowej i odliczenia urlopu w module samozatrudnienia.

## Wymagania

- Node + zależności projektu zainstalowane.

## Uruchomienie aplikacji

1. Uruchom aplikację w trybie dev.
2. Otwórz moduł: „Samozatrudnienie (B2B)”.

## Scenariusze weryfikacyjne

1. **Tryb przychodu**: lista rozwijana domyślnie ustawiona na wersję aktualną (miesięczny przychód).
2. **Stawka godzinowa**: wybierz tryb stawki godzinowej, wpisz stawkę 120 zł, 160 godzin pracy i brak urlopu → przychód miesięczny 19 200 zł.
3. **Odliczenie urlopu**: włącz odliczenie urlopu, wpisz 24 godziny → przychód miesięczny 16 320 zł.
4. **Walidacja godzin urlopu**: wpisz godziny urlopu większe niż plan → blokada zapisu i komunikat walidacyjny, przychód 0.

## Testy

Uruchom testy modułu (po ich dodaniu):

`npx vitest run test/vitest/__tests__/modules/selfEmployment/EntrepreneurCalculator.test.ts`

Testy muszą zawierać wszystkie wartości wyjściowe i używać bieżącego roku (zgodnie ze standardem repo).
