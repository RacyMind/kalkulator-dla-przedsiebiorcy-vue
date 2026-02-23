import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import Statistics from 'components/savingsPlan/components/Statistics.vue'
import { Result } from 'components/savingsPlan/interfaces/Result'
import {
  SavingsPlanScenario,
  SavingsPlanTool,
} from 'components/savingsPlan/types/SavingsPlanTypes'

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

const buildResult = (): Result => ({
  goalAmount: 100000,
  horizonMonths: 24,
  monthlyContribution: 1000,
  activeTool: SavingsPlanTool.Ike,
  annualLimitGrowthRate: 0,
  chartLabels: ['Start', 'Rok 1', 'Rok 2'],
  chartSeries: [
    {
      scenario: SavingsPlanScenario.Conservative,
      values: [0, 12000, 26000],
    },
    {
      scenario: SavingsPlanScenario.Base,
      values: [0, 13000, 29000],
    },
    {
      scenario: SavingsPlanScenario.Optimistic,
      values: [0, 14000, 32000],
    },
  ],
  toolProjections: [],
})

describe('SavingsPlan statistics legend', () => {
  it('uses custom line legend and keeps chart.js legend disabled', () => {
    const wrapper = mount(Statistics, {
      props: {
        result: buildResult(),
      },
      global: {
        stubs: {
          LineChart: LineChartStub,
        },
      },
    })

    const chartOptions = wrapper
      .findComponent(LineChartStub)
      .props('chartOptions') as any
    const legendItems = wrapper.findAll('[data-test="line-legend-item"]')
    const legendValues = wrapper.findAll('[data-test="line-legend-value"]')

    expect(chartOptions.plugins.legend.display).toBe(false)
    expect(wrapper.find('[data-test="line-legend"]').exists()).toBe(true)
    expect(legendItems).toHaveLength(3)
    expect(wrapper.text()).toContain('Konserwatywny')
    expect(wrapper.text()).toContain('Bazowy')
    expect(wrapper.text()).toContain('Optymistyczny')
    expect(legendValues).toHaveLength(3)
    expect(legendValues.every((item) => item.text().includes('zł'))).toBe(true)
  })

  it('hides line chart and legend when chart labels are missing', () => {
    const wrapper = mount(Statistics, {
      props: {
        result: {
          ...buildResult(),
          chartLabels: [],
        },
      },
      global: {
        stubs: {
          LineChart: LineChartStub,
        },
      },
    })

    expect(wrapper.find('[data-test="line-chart-stub"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="line-legend"]').exists()).toBe(false)
    expect(wrapper.text()).toContain('Brak danych')
  })
})
