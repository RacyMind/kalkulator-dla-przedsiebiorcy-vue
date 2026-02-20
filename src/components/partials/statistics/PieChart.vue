<template>
  <div class="pie-chart-wrapper">
    <Chart
      type="pie"
      :chart-options="mergedChartOptions"
      :chart-data="props.chartData"
    />

    <ul
      v-if="legendItems.length"
      class="pie-chart-legend"
      data-test="pie-legend"
    >
      <li
        v-for="item in legendItems"
        :key="item.key"
        class="pie-chart-legend__item"
        data-test="pie-legend-item"
      >
        <span
          class="pie-chart-legend__swatch"
          :style="{ backgroundColor: item.color }"
          aria-hidden="true"
        />

        <div class="pie-chart-legend__content">
          <div class="pie-chart-legend__header">
            <span class="pie-chart-legend__label">{{ item.label }}</span>
            <span
              class="pie-chart-legend__percent"
              data-test="pie-legend-percent"
            >
              {{ item.percentageLabel }}
            </span>
          </div>

          <div class="pie-chart-legend__track" aria-hidden="true">
            <span
              class="pie-chart-legend__fill"
              :style="{
                width: item.percentageWidth,
                backgroundColor: item.color,
              }"
            />
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import Chart from 'components/partials/Chart.vue'
import {
  calculatePieChartPercentages,
  formatPieChartPercentage,
} from 'src/composables/usePieChartPercentages'

interface PieChartDataset {
  backgroundColor?: string[] | string
  data?: unknown[]
}

interface PieChartData {
  datasets?: PieChartDataset[]
  labels?: string[]
}

interface PieLegendItem {
  color: string
  key: string
  label: string
  percentage: number
  percentageLabel: string
  percentageWidth: string
  originalIndex: number
}

const props = withDefaults(
  defineProps<{
    chartData: PieChartData
    chartOptions?: Record<string, any>
  }>(),
  {
    chartOptions: () => ({
      responsive: true,
      maintainAspectRatio: true,
      animation: { animateRotate: true, duration: 600 },
      plugins: {
        tooltip: { enabled: true },
        legend: { position: 'bottom' },
      },
    }),
  },
)

const firstDataset = computed(() => props.chartData?.datasets?.[0])

const values = computed(() => firstDataset.value?.data ?? [])

const percentages = computed(() => calculatePieChartPercentages(values.value))

const colors = computed(() => {
  const backgroundColor = firstDataset.value?.backgroundColor

  if (Array.isArray(backgroundColor)) {
    return backgroundColor
  }

  return values.value.map(() => backgroundColor || '#1565C0')
})

const mergedChartOptions = computed(() => ({
  ...props.chartOptions,
  plugins: {
    ...props.chartOptions?.plugins,
    legend: {
      ...props.chartOptions?.plugins?.legend,
      display: false,
    },
  },
}))

const legendItems = computed<PieLegendItem[]>(() => {
  const labels = props.chartData?.labels ?? []

  return values.value
    .map((_, index) => {
      const label = labels[index] ?? `Pozycja ${index + 1}`
      const color = colors.value[index] ?? '#1565C0'
      const percentage = percentages.value[index] ?? 0
      const boundedPercentage = Math.max(0, Math.min(percentage, 100))

      return {
        key: `${label}-${index}`,
        label,
        color,
        percentage,
        percentageLabel: formatPieChartPercentage(percentage),
        percentageWidth: `${boundedPercentage}%`,
        originalIndex: index,
      }
    })
    .filter((item) => item.percentage > 0)
    .sort((a, b) => {
      if (b.percentage === a.percentage) {
        return a.originalIndex - b.originalIndex
      }

      return b.percentage - a.percentage
    })
})
</script>

<style lang="scss" scoped>
.pie-chart-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.pie-chart-legend {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pie-chart-legend__item {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.pie-chart-legend__swatch {
  width: 12px;
  height: 12px;
  border-radius: 999px;
  margin-top: 4px;
  flex: 0 0 12px;
}

.pie-chart-legend__content {
  flex: 1;
  min-width: 0;
}

.pie-chart-legend__header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 8px;
}

.pie-chart-legend__label {
  font-size: 0.9rem;
  line-height: 1.25rem;
}

.pie-chart-legend__percent {
  min-width: 52px;
  text-align: right;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--q-primary);
}

.pie-chart-legend__track {
  width: 100%;
  height: 6px;
  margin-top: 4px;
  background: rgba(128, 128, 128, 0.22);
  border-radius: 999px;
  overflow: hidden;
}

.pie-chart-legend__fill {
  display: block;
  height: 100%;
  border-radius: inherit;
  transition: width 220ms ease;
}

@media (max-width: 599px) {
  .pie-chart-legend__percent {
    min-width: 48px;
  }
}
</style>
