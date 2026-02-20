import { describe, expect, it } from 'vitest'
import { defineComponent } from 'vue'
import { mount } from '@vue/test-utils'
import Statistics from 'components/selfEmployment/components/Statistics.vue'

const PieChartStub = defineComponent({
  name: 'PieChart',
  props: {
    chartData: {
      type: Object,
      required: true,
    },
  },
  template: '<div data-test="pie-chart-stub" />',
})

const buildResult = (overrides: Record<string, unknown> = {}) => ({
  income: 0,
  expenses: 0,
  taxAmount: 0,
  healthContribution: 0,
  sickContribution: 0,
  disabilityContribution: 0,
  pensionContribution: 0,
  accidentContribution: 0,
  fpAndFsContribution: 0,
  ...overrides,
})

const mountComponent = (resultOverrides: Record<string, unknown> = {}) => {
  return mount(Statistics, {
    props: {
      result: buildResult(resultOverrides),
    },
    global: {
      stubs: {
        PieChart: PieChartStub,
      },
    },
  })
}

describe('SelfEmployment Statistics', () => {
  it('shows no data message when all pie segments are non-positive', () => {
    const wrapper = mountComponent({
      income: -200,
      expenses: 0,
      taxAmount: 0,
      healthContribution: 0,
      sickContribution: 0,
      disabilityContribution: 0,
      pensionContribution: 0,
      accidentContribution: 0,
      fpAndFsContribution: 0,
    })

    expect(wrapper.text()).toContain('Brak danych')
    expect(wrapper.find('[data-test="pie-chart-stub"]').exists()).toBe(false)
  })

  it('keeps chart visible when at least one positive segment exists and sanitizes negative income', () => {
    const wrapper = mountComponent({
      income: -200,
      expenses: 500,
    })

    expect(wrapper.find('[data-test="pie-chart-stub"]').exists()).toBe(true)

    const chartData = wrapper
      .findComponent(PieChartStub)
      .props('chartData') as any

    expect(chartData.datasets[0].data[0]).toBe(0)
    expect(chartData.datasets[0].data[1]).toBe(500)
  })
})
