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

import InflationStatistics from 'components/inflation/InflationStatistics.vue'

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
            0: [3.1],
            1: [2.8],
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
          values: [{ id: '2024-01' }, { id: '2024-02' }],
        },
      ],
    },
  },
}

describe('InflationStatistics chart options', () => {
  it('uses modern chart options with reduced x-axis density', async () => {
    mockAxiosGet.mockResolvedValue({ data: ecbResponse })

    const wrapper = mount(InflationStatistics, {
      global: {
        stubs: {
          LineChart: LineChartStub,
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
    expect(chartOptions.scales.y.title.text).toBe('Inflacja w %')
    expect(chartOptions.legend).toBeUndefined()
  })

  it('formats tooltip label as percentage instead of PLN', async () => {
    mockAxiosGet.mockResolvedValue({ data: ecbResponse })

    const wrapper = mount(InflationStatistics, {
      global: {
        stubs: {
          LineChart: LineChartStub,
          'q-select': QSelectStub,
        },
      },
    })

    await flushPromises()

    const lineChart = wrapper.findComponent(LineChartStub)
    const chartOptions = lineChart.props('chartOptions') as any
    const tooltipLabel = chartOptions.plugins.tooltip.callbacks.label({
      label: 'Stycze� 2024',
      parsed: {
        y: 3.1,
      },
      raw: 3.1,
    })

    expect(tooltipLabel).toContain('%')
    expect(tooltipLabel).not.toContain('z�')
    expect(tooltipLabel).toBe('Stycze� 2024: 3,1%')
  })
})
