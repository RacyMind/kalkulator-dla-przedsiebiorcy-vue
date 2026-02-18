import { describe, expect, it, vi } from 'vitest'

vi.mock('src/composables/useChartColors', () => ({
  useChartColors: () => ({
    chartColors: {
      value: {
        chart1: '#111111',
        chart2: '#222222',
        chart3: '#333333',
        chart4: '#444444',
        chart5: '#555555',
        chart6: '#666666',
        chart7: '#777777',
        chart8: '#888888',
        chart9: '#999999',
        chart10: '#AAAAAA',
      },
    },
  }),
}))

import { usePieChart } from 'src/composables/usePieChart'

describe('usePieChart', () => {
  it('normalizes non-positive values to zero', () => {
    const result = usePieChart(['A', 'B', 'C', 'D'], [100, 0, -20, Number.NaN])

    expect(result.datasets[0].data).toEqual([100, 0, 0, 0])
  })

  it('keeps labels and cutout while matching color count to dataset length', () => {
    const result = usePieChart(['A', 'B'], [10, 20], '70%')

    expect(result.labels).toEqual(['A', 'B'])
    expect(result.datasets[0].cutout).toBe('70%')
    expect(result.datasets[0].backgroundColor).toEqual(['#111111', '#222222'])
    expect(result.datasets[0].data).toEqual([10, 20])
  })
})
