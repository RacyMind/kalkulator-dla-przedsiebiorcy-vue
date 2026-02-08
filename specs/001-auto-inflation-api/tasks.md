# Tasks: Automatyczne pobieranie danych inflacyjnych z ECB SDMX API

**Input**: Documents from `/specs/001-auto-inflation-api/`
**Required**: plan.md, spec.md

**Tests**: Tests are REQUIRED. Must include all output values.

**Organization**: Tasks grouped by user scenarios.

## Format: `[ID] [P?] [US?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[US?]**: Which user scenario (e.g., US1, US2)
- Include exact file paths

## Path Conventions

- **Module**: `src/components/inflation/`
- **Tests**: `test/vitest/__tests__/modules/inflation/`
- **Changelog**: `src/components/changeLogs/logs.ts`

---

## Phase 1: Foundational — Interface & Type Definitions

**Goal**: Update TypeScript interfaces to match ECB SDMX API response structure

- [x] T001 Replace `InflationApiResponse` interface with `EcbSdmxResponse` in `src/components/inflation/interfaces/InflationApiResponse.ts`

**Checkpoint**: TypeScript interfaces compile without errors

---

## Phase 2: Core Data Layer (US1 — Automatyczne pobieranie danych inflacyjnych, P1) 🎯 MVP

**Goal**: Replace custom API with ECB SDMX API in `inflation.ts`, maintaining the same `InflationEntry[]` output contract

**Independent Test**: Otworzyć moduł inflacji, wybrać okres "Ostatnie 5 lat" i zweryfikować, że wykres wyświetla aktualne dane miesięczne.

### Tests

- [x] T002 [US1] Update test file `test/vitest/__tests__/modules/inflation/Inflation.test.ts` — replace mocked API URL and response structure with ECB SDMX format, verify mapping to `InflationEntry[]` with all output values (year, month, value)
- [x] T003 [US1] Add test case for `lastMonth` mode — verify filtering returns only last month of each year with all output values

### Implementation

- [x] T004 [US1] Rewrite `fetchInflationRates` in `src/components/inflation/inflation.ts` — call ECB SDMX API endpoint `https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR?format=jsondata&startPeriod={fromYear}-01`, map `EcbSdmxResponse` to `InflationEntry[]` (parse TIME_PERIOD.id for year/month, observations[index][0] for value), implement `lastMonth` mode filtering client-side (keep only last month per year)

**Checkpoint**: `npx vitest run test/vitest/__tests__/modules/inflation/Inflation.test.ts` — all tests pass

---

## Phase 3: Purchasing Power (US2 — Siła nabywcza pieniądza, P1) 🎯 MVP

**Goal**: Verify purchasing power module works with new data source (uses same `fetchInflationRates` with `lastMonth` mode)

- [x] T005 [US2] Verify `PurchasingPowerOfMoneyStatistics.vue` works correctly with new API — no code changes expected since it calls `inflation.fetchInflationRates(year.value, 'lastMonth')` which is already updated in Phase 2

**Checkpoint**: Purchasing power chart renders correctly with ECB data

---

## Phase 4: Error Handling (US3 — Obsługa błędów API, P2)

**Goal**: Graceful handling of API failures — timeout, 5xx, empty response, unexpected format

### Tests

- [x] T006 [US3] Add test case for API error (network failure) in `test/vitest/__tests__/modules/inflation/Inflation.test.ts` — verify function returns empty array and does not throw
- [x] T007 [P] [US3] Add test case for empty/malformed API response in `test/vitest/__tests__/modules/inflation/Inflation.test.ts` — verify function returns empty array

### Implementation

- [x] T008 [US3] Add try/catch error handling in `fetchInflationRates` in `src/components/inflation/inflation.ts` — catch axios errors, return empty array on failure (cache fallback added in Phase 5)

**Checkpoint**: `npx vitest run test/vitest/__tests__/modules/inflation/Inflation.test.ts` — error handling tests pass

---

## Phase 5: Cache (US4 — Cache danych, P3)

**Goal**: In-memory cache with 24h TTL, stale cache fallback on API failure

### Tests

- [x] T009 [US4] Add test cases for cache behavior in `test/vitest/__tests__/modules/inflation/Inflation.test.ts` — verify: (1) second call with same params returns cached data without API call, (2) call after TTL expiry triggers new API call, (3) API failure returns stale cache data

### Implementation

- [x] T010 [US4] Implement in-memory cache in `src/components/inflation/inflation.ts` — add `Map<string, {data: InflationEntry[], timestamp: number}>` cache with 24h TTL (86400000ms), cache key = `{fromYear}-{mode}`, on API error return stale cache if available

**Checkpoint**: `npx vitest run test/vitest/__tests__/modules/inflation/Inflation.test.ts` — cache tests pass

---

## Phase 6: Polish & Cross-Cutting Concerns

**Goal**: Update UI data source attribution and changelog

- [x] T011 [P] Update data source link in `src/components/inflation/InflationStatistics.vue` — change "GUS" attribution to "Eurostat/ECB" with link to `https://data.ecb.europa.eu/data/datasets/ICP/ICP.M.PL.N.000000.4.ANR`
- [x] T012 [P] Update data source link in `src/components/inflation/PurchasingPowerOfMoneyStatistics.vue` — same change as T011
- [x] T013 Update changelog in `src/components/changeLogs/logs.ts` — add entry describing data source change from custom API to ECB SDMX API
- [x] T014 Run full test suite: `npx vitest run test/vitest/__tests__/modules/inflation/Inflation.test.ts`

---

## Dependencies and Execution Order

### Phase Dependencies

- **Phase 1 (Interfaces)**: No dependencies — start immediately
- **Phase 2 (Core Data, US1)**: Requires Phase 1 — BLOCKS all other phases
- **Phase 3 (Purchasing Power, US2)**: Requires Phase 2 — verification only
- **Phase 4 (Error Handling, US3)**: Requires Phase 2
- **Phase 5 (Cache, US4)**: Requires Phase 4 (error handling needed for cache fallback)
- **Phase 6 (Polish)**: Requires Phase 5

### Within Each Phase

- Tests MUST be written BEFORE implementation
- Tests MUST include all output values

### Parallel Opportunities

- T006 and T007 can run in parallel (different test cases, same file but independent)
- T011 and T012 can run in parallel (different Vue files)

---

## Implementation Strategy

### MVP (Phase 1-3)

1. Update interfaces (T001)
2. Write tests for ECB API mapping (T002-T003)
3. Implement ECB API integration (T004)
4. Verify purchasing power works (T005)
5. **VALIDATE**: Both charts render with ECB data

### Full Implementation

1. MVP → data flows correctly
2. Error handling → resilient to API failures (T006-T008)
3. Cache → optimized API usage (T009-T010)
4. Polish → UI attribution + changelog (T011-T014)

---

## Notes

- [P] = different files, no dependencies — can run in parallel
- [US?] = assignment to user scenario
- Tests ALWAYS before implementation
- Tests MUST include all output values
- Use static year 2026 in tests with static expected values
- UI in Polish language with Quasar components
- Test command: `npx vitest run test/vitest/__tests__/modules/inflation/Inflation.test.ts`
