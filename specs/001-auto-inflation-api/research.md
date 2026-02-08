# Research: Automatyczne pobieranie danych inflacyjnych

**Date**: 2026-02-06  
**Feature**: 001-auto-inflation-api

## Decision 1: Wybór API dla danych inflacyjnych

**Decision**: ECB SDMX API (`data-api.ecb.europa.eu`)

**Rationale**:
- Jedyne zbadane API oferujące miesięczne dane HICP dla Polski w formacie JSON z bezpośrednim dostępem (bez klucza API)
- Dane już w formacie % zmiany rok do roku — nie wymaga konwersji indeksu
- Dobrze udokumentowane, stabilne API (SDMX standard)
- Dane od 1996 roku (spełnia wymaganie DR-002: 20+ lat wstecz)
- Obsługuje CORS (ECB API jest zaprojektowane do użytku z przeglądarek)

**Alternatives considered**:

| API | Powód odrzucenia |
|-----|-----------------|
| GUS BDL API | Tylko dane roczne/kwartalne, brak miesięcznych |
| GUS DBW API | Brak dostępnej dokumentacji, endpointy niestabilne, trudne do nawigacji |
| dane.gov.pl | Linki do stron HTML, nie bezpośrednie dane JSON |

## Decision 2: Endpoint i format danych

**Decision**: `https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR?format=jsondata&startPeriod={year}-01`

**Rationale**:
- `ICP` = Indices of Consumer Prices
- `M` = Monthly frequency
- `PL` = Poland
- `N` = Not seasonally adjusted
- `000000` = Overall index (HICP total)
- `4` = Eurostat
- `ANR` = Annual rate of change (% rok do roku)
- `format=jsondata` = JSON output
- `startPeriod` = filtrowanie od roku

**Struktura odpowiedzi JSON**:
```json
{
  "dataSets": [{
    "series": {
      "0:0:0:0:0:0": {
        "observations": {
          "0": [4.5, 0, 0, null, null],  // wartość inflacji = pierwszy element tablicy
          "1": [3.7, 0, 0, null, null],
          ...
        }
      }
    }
  }],
  "structure": {
    "dimensions": {
      "observation": [{
        "id": "TIME_PERIOD",
        "values": [
          {"id": "2024-01", "name": "2024-01"},
          {"id": "2024-02", "name": "2024-02"},
          ...
        ]
      }]
    }
  }
}
```

**Mapowanie na InflationEntry**:
- `year` = parseInt z `TIME_PERIOD.id` (np. "2024-01" → 2024)
- `month` = parseInt z drugiej części `TIME_PERIOD.id` (np. "2024-01" → 1)
- `value` = `observations[index][0]` (pierwszy element tablicy obserwacji)

## Decision 3: Tryb "lastMonth" dla siły nabywczej

**Decision**: Filtrowanie po stronie klienta — pobrać wszystkie dane, wybrać ostatni miesiąc każdego roku.

**Rationale**:
- ECB API nie obsługuje filtrowania "ostatni miesiąc roku"
- Dane miesięczne są lekkie (12 rekordów/rok × 20 lat = 240 rekordów max)
- Filtrowanie client-side jest prostsze i nie wymaga dodatkowych zapytań API

## Decision 4: Cache strategy

**Decision**: In-memory cache z TTL 24h, fallback na stale cache przy błędzie API.

**Rationale**:
- Dane inflacyjne zmieniają się raz w miesiącu
- 24h TTL zapewnia aktualność bez nadmiernych zapytań
- Przy niedostępności API — wyświetlenie danych z cache bez ostrzeżenia (decyzja z clarify)

## Decision 5: HICP vs CPI

**Decision**: Użycie HICP (Harmonised Index of Consumer Prices) zamiast krajowego CPI.

**Rationale**:
- HICP i CPI dla Polski różnią się minimalnie (metodologia Eurostat vs GUS)
- Różnice rzędu 0.1-0.3 pp — akceptowalne dla celów informacyjnych kalkulatora
- HICP jest jedynym dostępnym wskaźnikiem z miesięczną granulacją przez publiczne API
- Źródło danych w UI powinno zostać zaktualizowane z "GUS" na "Eurostat/ECB"
