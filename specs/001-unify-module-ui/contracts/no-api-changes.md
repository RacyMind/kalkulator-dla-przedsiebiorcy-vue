# Contracts: No API Changes

## Zakres

Feature dotyczy refaktoru UI/UX w istniejących modułach i **nie wprowadza żadnych nowych endpointów ani zmian w kontraktach API**.

## Zewnętrzne integracje (stan obecny)

- Moduły walut korzystają z API NBP poprzez `src/api/nbp.ts`.
- Nie planuje się zmian w:
  - parametrach wywołań
  - ścieżkach
  - formacie danych

## Wnioski

- Brak migracji kontraktów.
- Brak zmian wymagających testów kontraktowych.
