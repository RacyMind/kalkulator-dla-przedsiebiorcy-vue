import { describe, expect, it, vi } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'

vi.mock('components/accountingWithSpouse/store', () => ({
  useAccountingWithSpouseStore: () => ({
    husbandResult: {
      taxAmount: 3000,
    },
    wifeResult: {
      taxAmount: 2000,
    },
    jointResult: {
      taxAmount: 4200,
    },
  }),
}))

import Statistics from 'components/accountingWithSpouse/components/Statistics.vue'

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

describe('AccountingWithSpouse Statistics chart options', () => {
  it('hides legend and keeps horizontal orientation', () => {
    const wrapper = mount(Statistics, {
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
