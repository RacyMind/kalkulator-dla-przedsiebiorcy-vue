import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { flushPromises, mount } from '@vue/test-utils'

const { mockAxiosGet } = vi.hoisted(() => ({
  mockAxiosGet: vi.fn(),
}))

vi.mock('axios', () => ({
  default: {
    get: mockAxiosGet,
  },
}))

vi.mock('stores/constantsStore', () => ({
  useConstantsStore: () => ({
    localeDate: {
      months: [
        'Stycze�',
        'Luty',
        'Marzec',
        'Kwiecie�',
        'Maj',
        'Czerwiec',
        'Lipiec',
        'Sierpie�',
        'Wrzesie�',
        'Pa�dziernik',
        'Listopad',
        'Grudzie�',
      ],
    },
  }),
}))

import PurchasingPowerOfMoneyStatistics from 'components/inflation/PurchasingPowerOfMoneyStatistics.vue'

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

const QInputStub = defineComponent({
  name: 'QInput',
  template: '<div data-test="q-input-stub" />',
})

const QSelectStub = defineComponent({
  name: 'QSelect',
  template: '<div data-test="q-select-stub" />',
})

const ecbResponse = {
  dataSets: [
    {
      series: {
        '0:0:0:0': {
          observations: {
            0: [2.2],
            1: [3.5],
          },
        },
      },
    },
  ],
  structure: {
    dimensions: {
      observation: [
        {
          id: 'TIME_PERIOD',
          values: [{ id: '2024-12' }, { id: '2025-12' }],
        },
      ],
    },
  },
}

describe('PurchasingPowerOfMoneyStatistics chart options', () => {
  it('uses modern chart options with reduced x-axis density', async () => {
    mockAxiosGet.mockResolvedValue({ data: ecbResponse })

    const wrapper = mount(PurchasingPowerOfMoneyStatistics, {
      global: {
        stubs: {
          LineChart: LineChartStub,
          'q-input': QInputStub,
          'q-select': QSelectStub,
        },
      },
    })

    await flushPromises()

    const lineChart = wrapper.findComponent(LineChartStub)
    const chartOptions = lineChart.props('chartOptions') as any

    expect(lineChart.exists()).toBe(true)
    expect(chartOptions.plugins.legend.display).toBe(false)
    expect(chartOptions.scales.x.ticks.autoSkip).toBe(true)
    expect(chartOptions.scales.x.ticks.maxTicksLimit).toBe(8)
    expect(chartOptions.scales.x.ticks.maxRotation).toBe(0)
    expect(chartOptions.scales.x.ticks.minRotation).toBe(0)
    expect(chartOptions.scales.y.title.text).toBe(
      'Siła nabywcza pieniądza w zł',
    )
    expect(chartOptions.legend).toBeUndefined()
  })
})
