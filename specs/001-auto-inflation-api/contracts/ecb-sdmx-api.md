# API Contract: ECB SDMX API — Polish HICP Data

**Date**: 2026-02-06  
**Feature**: 001-auto-inflation-api

## Endpoint

```
GET https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR
```

## Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `format` | string | Yes | `jsondata` — JSON output |
| `startPeriod` | string | No | Start date `YYYY-MM` (np. `2020-01`) |
| `endPeriod` | string | No | End date `YYYY-MM` (np. `2025-12`) |

## Series Key Breakdown

```
ICP / M.PL.N.000000.4.ANR
       │  │  │   │     │  └── ANR = Annual rate of change (% YoY)
       │  │  │   │     └── 4 = Eurostat
       │  │  │   └── 000000 = HICP Overall index
       │  │  └── N = Not seasonally adjusted
       │  └── PL = Poland
       └── M = Monthly
```

## Response Schema (format=jsondata)

```typescript
interface EcbSdmxResponse {
  header: {
    id: string
    test: boolean
    prepared: string
    sender: { id: string }
  }
  dataSets: Array<{
    action: string
    validFrom: string
    series: {
      [seriesKey: string]: {
        attributes: Array<number | null>
        observations: {
          [observationIndex: string]: Array<number | null>
          // [0] = value (inflation rate %)
          // [1] = OBS_STATUS (0 = normal)
          // [2] = OBS_CONF (0 = free)
          // [3] = OBS_PRE_BREAK
          // [4] = OBS_COM
        }
      }
    }
  }>
  structure: {
    dimensions: {
      series: Array<{
        id: string
        name: string
        values: Array<{ id: string; name: string }>
      }>
      observation: Array<{
        id: string  // "TIME_PERIOD"
        name: string
        role: string  // "time"
        values: Array<{
          id: string    // "2024-01"
          name: string  // "2024-01"
          start: string // ISO datetime
          end: string   // ISO datetime
        }>
      }>
    }
  }
}
```

## Example Request

```
GET https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR?format=jsondata&startPeriod=2024-01&endPeriod=2025-12
```

## Example Response (truncated)

```json
{
  "dataSets": [{
    "series": {
      "0:0:0:0:0:0": {
        "observations": {
          "0": [4.5, 0, 0, null, null],
          "1": [3.7, 0, 0, null, null],
          "2": [2.7, 0, 0, null, null]
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
          {"id": "2024-03", "name": "2024-03"}
        ]
      }]
    }
  }
}
```

## Error Handling

| HTTP Status | Meaning | App Behavior |
|-------------|---------|-------------|
| 200 | Success | Parse and map data |
| 404 | No data for period | Return empty array |
| 500/503 | Server error | Use cache if available, else show error |
| Network error | CORS/timeout | Use cache if available, else show error |

## Rate Limits

ECB SDMX API does not publish explicit rate limits, but reasonable usage (< 1 req/s) is expected.

## CORS

ECB API supports CORS — direct browser requests are allowed.
