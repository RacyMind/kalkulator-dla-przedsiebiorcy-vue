import {beforeEach, describe, expect, it, vi} from 'vitest'
import axios from 'axios'
import inflation from 'components/inflation/inflation'

vi.mock('axios', () => {
  return {
    default: {
      get: vi.fn(),
    },
  }
})

function createEcbResponse(periods: string[], values: number[]) {
  const observations: Record<string, Array<number | null>> = {}
  periods.forEach((_, i) => {
    observations[String(i)] = [values[i], 0, 0, null, null]
  })
  return {
    data: {
      dataSets: [{
        series: {
          '0:0:0:0:0:0': { observations },
        },
      }],
      structure: {
        dimensions: {
          observation: [{
            id: 'TIME_PERIOD',
            values: periods.map(p => ({ id: p, name: p })),
          }],
        },
      },
    },
  }
}

describe('Inflation module', () => {
  const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockedAxios.get.mockReset()
    inflation.clearCache()
  })

  it('fetches inflation rates from ECB API and maps response', async () => {
    mockedAxios.get.mockResolvedValue(
      createEcbResponse(
        ['2025-11', '2025-12', '2026-01'],
        [4.7, 4.8, 4.3],
      ),
    )

    const result = await inflation.fetchInflationRates(2025)

    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'https://data-api.ecb.europa.eu/service/data/ICP/M.PL.N.000000.4.ANR?format=jsondata&startPeriod=2025-01',
    )

    expect(result).toEqual([
      { year: 2025, month: 11, value: 4.7 },
      { year: 2025, month: 12, value: 4.8 },
      { year: 2026, month: 1, value: 4.3 },
    ])
  })

  it('filters lastMonth mode — returns only last month of each year', async () => {
    mockedAxios.get.mockResolvedValue(
      createEcbResponse(
        ['2025-01', '2025-06', '2025-12', '2026-01', '2026-06'],
        [3.1, 2.8, 2.4, 4.3, 3.5],
      ),
    )

    const result = await inflation.fetchInflationRates(2025, 'lastMonth')

    expect(result).toEqual([
      { year: 2025, month: 12, value: 2.4 },
      { year: 2026, month: 6, value: 3.5 },
    ])
  })

  it('returns empty array when API returns no data', async () => {
    mockedAxios.get.mockResolvedValue(
      createEcbResponse([], []),
    )

    const result = await inflation.fetchInflationRates(2026)
    expect(result).toEqual([])
  })

  it('returns empty array on network error', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Network Error'))

    const result = await inflation.fetchInflationRates(2026)
    expect(result).toEqual([])
  })

  it('returns empty array on malformed response', async () => {
    mockedAxios.get.mockResolvedValue({ data: { unexpected: 'format' } })

    const result = await inflation.fetchInflationRates(2026)
    expect(result).toEqual([])
  })

  it('uses cache on second call with same params', async () => {
    mockedAxios.get.mockResolvedValue(
      createEcbResponse(['2026-01'], [4.3]),
    )

    await inflation.fetchInflationRates(2026)
    const result = await inflation.fetchInflationRates(2026)

    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(result).toEqual([
      { year: 2026, month: 1, value: 4.3 },
    ])
  })

  it('fetches fresh data after cache TTL expires', async () => {
    mockedAxios.get.mockResolvedValue(
      createEcbResponse(['2026-01'], [4.3]),
    )

    await inflation.fetchInflationRates(2026)

    inflation.expireCache()

    mockedAxios.get.mockResolvedValue(
      createEcbResponse(['2026-01'], [4.5]),
    )

    const result = await inflation.fetchInflationRates(2026)

    expect(mockedAxios.get).toHaveBeenCalledTimes(2)
    expect(result).toEqual([
      { year: 2026, month: 1, value: 4.5 },
    ])
  })

  it('returns stale cache on API failure', async () => {
    mockedAxios.get.mockResolvedValue(
      createEcbResponse(['2026-01'], [4.3]),
    )

    await inflation.fetchInflationRates(2026)

    inflation.expireCache()

    mockedAxios.get.mockRejectedValue(new Error('Network Error'))

    const result = await inflation.fetchInflationRates(2026)

    expect(result).toEqual([
      { year: 2026, month: 1, value: 4.3 },
    ])
  })
})
