import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'

vi.mock('quasar', () => ({
  Dark: {
    isActive: false,
  },
}))

vi.mock('vue-chartjs', () => ({
  Pie: {
    name: 'Pie',
    props: ['data', 'options'],
    template: '<div data-test="pie-render" />',
  },
  Bar: {
    name: 'Bar',
    props: ['data', 'options'],
    template: '<div data-test="bar-render" />',
  },
  Line: {
    name: 'Line',
    props: ['data', 'options'],
    template: '<div data-test="line-render" />',
  },
  Doughnut: {
    name: 'Doughnut',
    props: ['data', 'options'],
    template: '<div data-test="doughnut-render" />',
  },
}))

import Chart from 'components/partials/Chart.vue'

describe('Chart options', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'ResizeObserver',
      class {
        observe() {}
        disconnect() {}
      },
    )
  })

  it('formats pie chart tooltip values as percentages', () => {
    const wrapper = mount(Chart, {
      props: {
        type: 'pie',
        chartData: {
          labels: ['A', 'B'],
          datasets: [
            {
              data: [3, 1],
            },
          ],
        },
      },
    })

    const options = wrapper
      .findComponent({ name: 'Pie' })
      .props('options') as any

    const result = options.plugins.tooltip.callbacks.label({
      chart: {
        options: {},
      },
      dataIndex: 0,
      dataset: {
        data: [3, 1],
      },
      label: 'A',
      parsed: 3,
      raw: 3,
    })

    expect(result).toBe('A: 75,0%')
  })

  it('treats negative pie values as zero in percentage tooltips', () => {
    const wrapper = mount(Chart, {
      props: {
        type: 'pie',
        chartData: {
          labels: ['A', 'B'],
          datasets: [
            {
              data: [100, -50],
            },
          ],
        },
      },
    })

    const options = wrapper
      .findComponent({ name: 'Pie' })
      .props('options') as any

    const result = options.plugins.tooltip.callbacks.label({
      chart: {
        options: {},
      },
      dataIndex: 1,
      dataset: {
        data: [100, -50],
      },
      label: 'B',
      parsed: -50,
      raw: -50,
    })

    expect(result).toBe('B: 0,0%')
  })

  it('keeps currency tooltip formatting for non-pie charts', () => {
    const wrapper = mount(Chart, {
      props: {
        type: 'bar',
        chartData: {
          labels: ['A'],
          datasets: [
            {
              data: [1234],
            },
          ],
        },
      },
    })

    const options = wrapper
      .findComponent({ name: 'Bar' })
      .props('options') as any

    const result = options.plugins.tooltip.callbacks.label({
      chart: {
        options: {
          indexAxis: 'x',
        },
      },
      label: 'A',
      parsed: 1234,
      raw: 1234,
    })

    expect(result).toContain('A:')
    expect(result).toContain(',00')
    expect(result).not.toContain('%')
  })

  it('uses nearest tooltip interaction for bar charts', () => {
    const wrapper = mount(Chart, {
      props: {
        type: 'bar',
        chartData: {
          labels: ['A', 'B'],
          datasets: [
            {
              data: [1000, 1200],
            },
          ],
        },
      },
    })

    const options = wrapper
      .findComponent({ name: 'Bar' })
      .props('options') as any

    expect(options.plugins.tooltip.mode).toBe('nearest')
    expect(options.plugins.tooltip.intersect).toBe(true)
  })

  it('uses default UX options for line charts', () => {
    const wrapper = mount(Chart, {
      props: {
        type: 'line',
        chartData: {
          labels: ['I', 'II', 'III'],
          datasets: [
            {
              data: [1000, 1200, 1100],
            },
          ],
        },
      },
    })

    const options = wrapper
      .findComponent({ name: 'Line' })
      .props('options') as any

    expect(options.plugins.tooltip.mode).toBe('index')
    expect(options.plugins.tooltip.intersect).toBe(false)
    expect(options.scales.x.ticks.autoSkip).toBe(true)
    expect(options.scales.x.ticks.maxTicksLimit).toBe(8)
    expect(options.scales.x.ticks.maxRotation).toBe(0)
    expect(options.scales.x.ticks.minRotation).toBe(0)
    expect(options.scales.y.ticks.maxTicksLimit).toBe(6)
  })

  it('allows overriding default line UX options', () => {
    const wrapper = mount(Chart, {
      props: {
        type: 'line',
        chartData: {
          labels: ['I', 'II', 'III'],
          datasets: [
            {
              data: [1000, 1200, 1100],
            },
          ],
        },
        chartOptions: {
          plugins: {
            tooltip: {
              mode: 'nearest',
              intersect: true,
            },
          },
          scales: {
            x: {
              ticks: {
                maxTicksLimit: 5,
              },
            },
          },
        },
      },
    })

    const options = wrapper
      .findComponent({ name: 'Line' })
      .props('options') as any

    expect(options.plugins.tooltip.mode).toBe('nearest')
    expect(options.plugins.tooltip.intersect).toBe(true)
    expect(options.scales.x.ticks.maxTicksLimit).toBe(5)
  })

  it('keeps container style without overflow clipping and does not bind window resize', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener')

    const wrapper = mount(Chart, {
      props: {
        type: 'line',
        chartData: {
          labels: ['I', 'II'],
          datasets: [
            {
              data: [1000, 1200],
            },
          ],
        },
      },
    })

    const resizeListenerCalls = addEventListenerSpy.mock.calls.filter(
      ([eventName]) => eventName === 'resize',
    )
    const style = wrapper.attributes('style') || ''

    expect(resizeListenerCalls).toHaveLength(0)
    expect(style).toContain('width: 100%')
    expect(style).not.toContain('overflow: hidden')

    addEventListenerSpy.mockRestore()
  })

  it('uses external tooltip label callback when provided', () => {
    const customLabel = vi.fn(() => 'Niestandardowy tooltip')

    const wrapper = mount(Chart, {
      props: {
        type: 'pie',
        chartData: {
          labels: ['A'],
          datasets: [
            {
              data: [1],
            },
          ],
        },
        chartOptions: {
          plugins: {
            tooltip: {
              callbacks: {
                label: customLabel,
              },
            },
          },
        },
      },
    })

    const options = wrapper
      .findComponent({ name: 'Pie' })
      .props('options') as any

    const result = options.plugins.tooltip.callbacks.label({
      label: 'A',
      parsed: 1,
      raw: 1,
    })

    expect(result).toBe('Niestandardowy tooltip')
    expect(customLabel).toHaveBeenCalledTimes(1)
  })
})
