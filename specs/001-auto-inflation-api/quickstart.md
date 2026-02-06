# Quickstart: Automatyczne pobieranie danych inflacyjnych

**Date**: 2026-02-06  
**Feature**: 001-auto-inflation-api

## Przegląd zmian

Zamiana źródła danych inflacyjnych z własnego API (`kalkulatorfinansowy.app/inflation.php`) na publiczne ECB SDMX API (`data-api.ecb.europa.eu`). Zmiana dotyczy wyłącznie warstwy danych — UI pozostaje bez zmian.

## Pliki do modyfikacji

| Plik | Zmiana |
|------|--------|
| `src/components/inflation/inflation.ts` | Nowa implementacja `fetchInflationRates` z ECB API |
| `src/components/inflation/interfaces/InflationApiResponse.ts` | Zastąpienie interfejsem `EcbSdmxResponse` |
| `src/components/inflation/InflationStatistics.vue` | Aktualizacja źródła danych w stopce (GUS → Eurostat) |
| `src/components/inflation/PurchasingPowerOfMoneyStatistics.vue` | Aktualizacja źródła danych w stopce (GUS → Eurostat) |
| `test/vitest/__tests__/modules/inflation/Inflation.test.ts` | Aktualizacja testów dla nowego API |

## Nowe pliki

Brak — wszystkie zmiany w istniejących plikach.

## Jak przetestować

```bash
# Uruchom testy jednostkowe
npx vitest run test/vitest/__tests__/modules/inflation/Inflation.test.ts

# Uruchom aplikację i sprawdź moduł inflacji
npx quasar dev
```

## ECB API — szybki test

```bash
# Pobierz dane inflacyjne dla Polski za 2024
curl "https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR?format=jsondata&startPeriod=2024-01&endPeriod=2024-12"
```
