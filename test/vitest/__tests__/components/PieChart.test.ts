import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import PieChart from 'components/partials/statistics/PieChart.vue'

const ChartStub = defineComponent({
  name: 'Chart',
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
    type: {
      type: String,
      required: true,
    },
  },
  template: '<div data-test="chart-stub" />',
})

const buildChartData = () => ({
  labels: ['A', 'B', 'C'],
  datasets: [
    {
      backgroundColor: ['#111111', '#222222', '#333333'],
      data: [20, 60, 20],
    },
  ],
})

const mountComponent = (props: Record<string, unknown> = {}) => {
  return mount(PieChart, {
    props: {
      chartData: buildChartData(),
      ...props,
    },
    global: {
      stubs: {
        Chart: ChartStub,
      },
    },
  })
}

describe('PieChart', () => {
  it('sorts legend by percentage descending and keeps stable order for ties', () => {
    const wrapper = mountComponent()

    expect(wrapper.findAll('[data-test="pie-legend-item"]')).toHaveLength(3)
    expect(
      wrapper.findAll('.pie-chart-legend__label').map((node) => node.text()),
    ).toEqual(['B', 'A', 'C'])
    expect(
      wrapper
        .findAll('[data-test="pie-legend-percent"]')
        .map((node) => node.text()),
    ).toEqual(['60,0%', '20,0%', '20,0%'])
    expect(
      wrapper.findAll('.pie-chart-legend__fill')[0]?.attributes('style'),
    ).toContain('width: 60%')
  })

  it('hides legend entries with 0,0% value', () => {
    const wrapper = mountComponent({
      chartData: {
        labels: ['Income', 'Costs', 'Tax'],
        datasets: [
          {
            backgroundColor: ['#111111', '#222222', '#333333'],
            data: [100, 0, -50],
          },
        ],
      },
    })

    expect(wrapper.findAll('[data-test="pie-legend-item"]')).toHaveLength(1)
    expect(wrapper.find('.pie-chart-legend__label').text()).toBe('Income')
    expect(wrapper.find('[data-test="pie-legend-percent"]').text()).toBe(
      '100,0%',
    )
  })

  it('does not render legend when total percentage equals zero', () => {
    const wrapper = mountComponent({
      chartData: {
        labels: ['A', 'B'],
        datasets: [
          {
            backgroundColor: ['#111111', '#222222'],
            data: [0, 0],
          },
        ],
      },
    })

    expect(wrapper.find('[data-test="pie-legend"]').exists()).toBe(false)
    expect(wrapper.findAll('[data-test="pie-legend-item"]')).toHaveLength(0)
  })

  it('forces Chart.js legend off while preserving provided legend config', () => {
    const wrapper = mountComponent({
      chartOptions: {
        plugins: {
          legend: {
            labels: {
              usePointStyle: true,
            },
            position: 'left',
          },
          tooltip: {
            enabled: true,
          },
        },
      },
    })

    const chartOptions = wrapper
      .findComponent(ChartStub)
      .props('chartOptions') as any

    expect(chartOptions.plugins.legend.display).toBe(false)
    expect(chartOptions.plugins.legend.position).toBe('left')
    expect(chartOptions.plugins.legend.labels.usePointStyle).toBe(true)
    expect(chartOptions.plugins.tooltip.enabled).toBe(true)
  })
})
