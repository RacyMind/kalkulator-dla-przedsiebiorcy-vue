# Quickstart: Ujednolicenie UI formularzy (pola + przyciski)

## Uruchomienie aplikacji

1. Zainstaluj zależności (jeśli potrzeba):
   - `npm ci`
2. Uruchom aplikację:
   - `quasar dev`

## Testy jednostkowe (selektywnie)

Uruchamiaj tylko testy powiązane z modułami refaktoryzowanymi, np.:

- `npx vitest run test/vitest/__tests__/modules/invoice/Invoice.test.ts`
- `npx vitest run test/vitest/__tests__/modules/investment/Investment.test.ts`
- `npx vitest run test/vitest/__tests__/modules/interest/Interest.test.ts`
- `npx vitest run test/vitest/__tests__/modules/vatLimit/VatLimit.test.ts`
- `npx vitest run test/vitest/__tests__/modules/currencyConverter/CurrencyConverter.test.ts`

## Weryfikacja manualna (UI)

Otwórz strony:

- `src/pages/Invoice.vue`
- `src/pages/VatLimit.vue`
- `src/pages/Investment.vue`
- `src/pages/Interest.vue`
- `src/pages/ExchangeRates.vue`
- `src/pages/Currency.vue`
- `src/pages/CurrencyConverter.vue`
- `src/pages/CashRegisterLimit.vue`
- `src/pages/Contact.vue`
- `src/pages/ChangeLogs.vue`

Sprawdź:

- Spójny układ pól (mobile/desktop), odstępy oraz czytelność etykiet
- Spójne zachowanie walidacji pól wymaganych
- Spójny wygląd przycisków akcji oraz stany disabled/loading
- Brak zmian w wynikach obliczeń
