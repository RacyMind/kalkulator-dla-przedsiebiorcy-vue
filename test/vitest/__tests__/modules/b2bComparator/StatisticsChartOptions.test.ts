import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import Statistics from 'components/b2bComparator/components/Statistics.vue'

const BarChartStub = defineComponent({
  name: 'BarChart',
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
  template: '<div data-test="bar-chart-stub" />',
})

describe('B2BComparator Statistics chart options', () => {
  it('hides legend and keeps horizontal orientation', () => {
    const wrapper = mount(Statistics, {
      props: {
        taxScale: 8000,
        flatTax: 7600,
        lumpSumTax: 7900,
      },
      global: {
        stubs: {
          BarChart: BarChartStub,
        },
      },
    })

    const barChart = wrapper.findComponent(BarChartStub)
    const chartOptions = barChart.props('chartOptions') as any

    expect(barChart.exists()).toBe(true)
    expect(chartOptions.indexAxis).toBe('y')
    expect(chartOptions.plugins.legend.display).toBe(false)
    expect(chartOptions.plugins.tooltip).toBeUndefined()
  })
})
