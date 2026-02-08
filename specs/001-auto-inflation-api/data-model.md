# Data Model: Automatyczne pobieranie danych inflacyjnych

**Date**: 2026-02-06  
**Feature**: 001-auto-inflation-api

## Entities

### InflationEntry (existing — no changes)

Pojedynczy wpis danych inflacyjnych używany wewnętrznie w aplikacji.

| Field | Type | Description |
|-------|------|-------------|
| `year` | `number` | Rok (np. 2024) |
| `month` | `number` | Miesiąc 1-12 |
| `value` | `number` | Zmiana % rok do roku (np. 3.6) |

### EcbSdmxResponse (new)

Surowa odpowiedź z ECB SDMX API w formacie `jsondata`.

```typescript
interface EcbSdmxResponse {
  dataSets: Array<{
    series: {
      [key: string]: {
        observations: {
          [index: string]: Array<number | null>
        }
      }
    }
  }>
  structure: {
    dimensions: {
      observation: Array<{
        id: string
        values: Array<{
          id: string    // np. "2024-01"
          name: string
        }>
      }>
    }
  }
}
```

### InflationCache (new)

Cache danych inflacyjnych w pamięci.

| Field | Type | Description |
|-------|------|-------------|
| `data` | `Map<string, InflationEntry[]>` | Klucz = `{fromYear}` lub `{fromYear}-lastMonth` |
| `timestamp` | `Map<string, number>` | Timestamp ostatniego pobrania per klucz |
| `TTL` | `number` | 24 godziny w ms (86400000) |

## Data Flow

```
ECB SDMX API → EcbSdmxResponse → mapowanie → InflationEntry[] → cache → Vue components
```

1. Komponent Vue wywołuje `inflation.fetchInflationRates(fromYear, mode)`
2. Sprawdzenie cache (klucz = `{fromYear}` lub `{fromYear}-lastMonth`)
3. Jeśli cache ważny (< 24h) → zwróć dane z cache
4. Jeśli cache nieważny → zapytanie do ECB API
5. Mapowanie `EcbSdmxResponse` → `InflationEntry[]`
6. Jeśli `mode === 'lastMonth'` → filtrowanie: tylko ostatni miesiąc każdego roku
7. Zapis do cache + zwrot danych
8. Przy błędzie API → zwrot danych z cache (nawet starych) lub pusty wynik

## Mapowanie ECB → InflationEntry

```
TIME_PERIOD.id "2024-01" → year: 2024, month: 1
observations["0"][0] = 4.5  → value: 4.5
```
