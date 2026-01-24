# Quickstart: Ujednolicenie UI modułów

## Cel

Ta funkcja dotyczy refaktoru UI/UX w istniejących modułach:
- Faktura VAT
- Limit sprzedaży dla zwolnienia z VAT
- Lokata
- Odsetki
- Waluty (kursy + przelicznik)

## Uruchomienie aplikacji

- Start (PWA): `npm run start`

## Testy

- Testy jednostkowe (całość): `npm run test:unit:ci`

Uwaga: w kolejnych krokach (`/speckit.tasks` i implementacja) należy uruchamiać tylko testy istotne dla zmienianych modułów.

## Miejsca w kodzie

- Strony (wejścia do modułów): `src/pages/*.vue`
  - `Invoice.vue`, `VatLimit.vue`, `Investment.vue`, `Interest.vue`
  - `Currency.vue`, `CurrencyConverter.vue`, `ExchangeRates.vue`

- Komponenty modułów: `src/components/*`
- Wzorzec nowego UI (referencja): `src/components/contractWork/pages/Index.vue`
- Layout wspólny: `src/components/partials/ModulePageLayout.vue`

## Szybka weryfikacja manualna

- Otwórz każdy z modułów i sprawdź:
  - spójność nagłówków sekcji
  - spójność formularza (układ pól, walidacja, komunikaty)
  - spójność wyników (sekcja podsumowania / wykresy)
  - poprawność działania na małym ekranie
