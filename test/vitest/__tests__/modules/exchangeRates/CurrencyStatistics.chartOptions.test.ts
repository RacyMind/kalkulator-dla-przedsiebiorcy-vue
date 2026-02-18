import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('stores/currency-rate-store', () => ({
  useCurrencyRateStore: () => ({
    currencyRate: {
      currency: 'EUR',
      rates: [
        {
          effectiveDate: '2025-01-02',
          mid: 4.11,
        },
        {
          effectiveDate: '2025-01-03',
          mid: 4.14,
        },
        {
          effectiveDate: '2025-01-06',
          mid: 4.09,
        },
      ],
    },
  }),
}))

import CurrencyStatistics from 'components/exchangeRates/CurrencyStatistics.vue'

const LineChartStub = defineComponent({
  name: 'LineChart',
  props: {
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      required: false,
      default: () => ({}),
    },
  },
  template: '<div data-test="line-chart-stub" />',
})

describe('CurrencyStatistics chart options', () => {
  it('uses hidden legend and reduced x-axis density', () => {
    const wrapper = mount(CurrencyStatistics, {
      global: {
        stubs: {
          LineChart: LineChartStub,
        },
      },
    })

    const lineChart = wrapper.findComponent(LineChartStub)
    const chartOptions = lineChart.props('chartOptions') as any

    expect(lineChart.exists()).toBe(true)
    expect(chartOptions.plugins.legend.display).toBe(false)
    expect(chartOptions.scales.x.ticks.autoSkip).toBe(true)
    expect(chartOptions.scales.x.ticks.maxTicksLimit).toBe(8)
    expect(chartOptions.scales.x.ticks.maxRotation).toBe(0)
    expect(chartOptions.scales.x.ticks.minRotation).toBe(0)
    expect(chartOptions.legend).toBeUndefined()
  })
})
