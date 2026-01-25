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

describe('Inflation module', () => {
  const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockedAxios.get.mockReset()
  })

  it('fetches inflation rates and maps + sorts response', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        { rok: 2024, miesiac: 12, wartosc: '2.50' },
        { rok: 2024, miesiac: 1, wartosc: '1.10' },
        { rok: 2023, miesiac: 11, wartosc: '9.99' },
      ],
    })

    const result = await inflation.fetchInflationRates(2023)

    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith('https://kalkulatorfinansowy.app/inflation.php?year=2023&mode=')

    expect(result).toEqual([
      { month: 11, value: 9.99, year: 2023 },
      { month: 1, value: 1.1, year: 2024 },
      { month: 12, value: 2.5, year: 2024 },
    ])
  })

  it('passes mode param to API', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] })

    const result = await inflation.fetchInflationRates(2020, 'avg')

    expect(mockedAxios.get).toHaveBeenCalledTimes(1)
    expect(mockedAxios.get).toHaveBeenCalledWith('https://kalkulatorfinansowy.app/inflation.php?year=2020&mode=avg')
    expect(result).toEqual([])
  })
})
