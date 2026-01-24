# Research: Ujednolicenie UI modułów

## Cel

Ujednolicić UI/UX w modułach:
- Faktura VAT (`src/pages/Invoice.vue` + `src/components/invoice/*`)
- Limit sprzedaży dla zwolnienia z VAT (`src/pages/VatLimit.vue` + `src/components/vatLimit/*`)
- Lokata (`src/pages/Investment.vue` + `src/components/investment/*`)
- Odsetki (`src/pages/Interest.vue` + `src/components/interest/*`)
- Waluty (kursy + przelicznik):
  - `src/pages/ExchangeRates.vue` + `src/components/exchangeRates/*`
  - `src/pages/CurrencyConverter.vue` + `src/components/currencyConverter/*`
  - `src/pages/Currency.vue` + `src/components/exchangeRates/*`

## Obserwacje (stan obecny)

- Moduły „stare” używają bezpośrednio `q-page` + ręcznie składanego wrappera `<div class="full-width bg-white">`.
- Moduł referencyjny „nowego UI” (`src/components/contractWork/pages/Index.vue`) używa `ModulePageLayout` i spójnych elementów:
  - `SectionHeader`
  - `FormSection`
  - ustandaryzowanego submitu (`q-form` + `@validation-error`)
  - prezentacji wyników warunkowo (np. `Brak danych`).

## Decyzje

- **Decision**: Standaryzacja layoutu stron modułów przez użycie `components/partials/ModulePageLayout.vue`.
  - **Rationale**: Layout już istnieje i jest używany w modułach referencyjnych; minimalizuje rozjazdy wizualne między modułami.
  - **Alternatives considered**:
    - pozostawienie `q-page` na stronach i tylko „podciągnięcie” stylów (odrzucone: ryzyko dalszej dywergencji).

- **Decision**: Standaryzacja sekcji formularzy przez użycie wzorca `FormSection` (tam gdzie ma sens) i spójnych reguł walidacji.
  - **Rationale**: Użytkownik dostaje taki sam układ, walidację i komunikaty w całej aplikacji.
  - **Alternatives considered**:
    - tylko kosmetyczne zmiany (odrzucone: nie domyka celu spójności zachowań).

- **Decision**: Brak zmian w logice obliczeń.
  - **Rationale**: Feature jest refaktorem UI; minimalizuje ryzyko regresji.
  - **Alternatives considered**:
    - poprawki logiki „przy okazji” (odrzucone: rozszerza scope i ryzyko).

## Ryzyka i mitigacje

- **Ryzyko**: regresja UX (np. scrollowanie do podsumowania, warunki pokazywania wyników).
  - **Mitigacja**: zachować dotychczasowe eventy (`@save`, `@scroll`) lub ustandaryzować je do `@submit` i przejść moduł po module.

- **Ryzyko**: moduły „Waluty” mają zależność od API NBP (asynchroniczne ładowanie, stany `isLoading`).
  - **Mitigacja**: refaktor UI bez ingerencji w przepływ danych; utrzymać istniejące store’y (`currency-rate-store`, `currency-converter-store`).

## Konkluzja

Plan wdrożenia powinien skupić się na:
- refaktorze stron `src/pages/*` do wspólnego layoutu
- ujednoliceniu formularzy i sekcji
- zachowaniu dotychczasowych wyliczeń i store’ów
