<template>
  <div
    ref="chartContainer"
    role="img"
    :aria-label="ariaLabel"
    style="position: relative; width: 100%; overflow: hidden"
  >
    <component
      :is="chartComponent"
      :key="containerWidth"
      :data="chartData"
      :options="mergedOptions"
    />
  </div>
</template>
<script lang="ts" setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { Dark } from 'quasar'
import { Pie, Bar, Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import {
  calculatePieChartPercentages,
  formatPieChartPercentage,
} from 'src/composables/usePieChartPercentages'

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
)

const props = defineProps({
  chartData: {
    required: true,
    type: Object,
  },
  chartOptions: {
    required: false,
    type: Object,
  },
  type: {
    required: true,
    type: String,
  },
  ariaLabel: {
    required: false,
    type: String,
    default: 'Wykres danych',
  },
})

const chartContainer = ref<HTMLElement | null>(null)
const containerWidth = ref(0)
let resizeObserver: ResizeObserver | null = null

const syncWidth = () => {
  if (!chartContainer.value) return
  const w = Math.round(chartContainer.value.clientWidth)
  if (w > 0 && Math.abs(w - containerWidth.value) > 20) {
    containerWidth.value = w
  }
}

let resizeTimer: ReturnType<typeof setTimeout> | null = null
const onWindowResize = () => {
  if (resizeTimer) clearTimeout(resizeTimer)
  resizeTimer = setTimeout(syncWidth, 150)
}

onMounted(() => {
  if (chartContainer.value) {
    containerWidth.value = chartContainer.value.clientWidth
    resizeObserver = new ResizeObserver(() => syncWidth())
    resizeObserver.observe(chartContainer.value)
  }
  window.addEventListener('resize', onWindowResize)
})

onUnmounted(() => {
  resizeObserver?.disconnect()
  window.removeEventListener('resize', onWindowResize)
  if (resizeTimer) clearTimeout(resizeTimer)
})

const chartComponentMap: Record<string, any> = {
  pie: Pie,
  bar: Bar,
  line: Line,
  doughnut: Doughnut,
}

const chartComponent = computed(() => chartComponentMap[props.type] || Bar)

const textColor = computed(() => (Dark.isActive ? '#E0E0E0' : '#666666'))

const formatPln = (value: number) =>
  value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })

const isPieChartType = computed(
  () => props.type === 'pie' || props.type === 'doughnut',
)
const isBarChartType = computed(() => props.type === 'bar')

const getContextRawValue = (context: any): number => {
  const isHorizontal = context.chart?.options?.indexAxis === 'y'
  const raw =
    typeof context.parsed === 'number'
      ? context.parsed
      : ((isHorizontal ? context.parsed?.x : context.parsed?.y) ?? context.raw)

  return Number(raw)
}

const defaultTooltipLabel = (context: any) => {
  const label = context.label || ''

  if (isPieChartType.value) {
    const percentages = calculatePieChartPercentages(
      context.dataset?.data ?? [],
    )
    const percentage = percentages[context.dataIndex] ?? 0

    return `${label}: ${formatPieChartPercentage(percentage)}`
  }

  return `${label}: ${formatPln(getContextRawValue(context))}`
}

const mergedOptions = computed(() => {
  const externalTooltip = props.chartOptions?.plugins?.tooltip
  const externalTooltipCallbacks = externalTooltip?.callbacks
  const defaultTooltipOptions = isPieChartType.value
    ? {}
    : isBarChartType.value
      ? {
          mode: 'nearest',
          intersect: true,
        }
      : {
          mode: 'index',
          intersect: false,
        }

  return {
    ...props.chartOptions,
    plugins: {
      ...props.chartOptions?.plugins,
      legend: {
        ...props.chartOptions?.plugins?.legend,
        labels: {
          ...props.chartOptions?.plugins?.legend?.labels,
          color: textColor.value,
        },
      },
      tooltip: {
        ...defaultTooltipOptions,
        ...externalTooltip,
        callbacks: {
          ...externalTooltipCallbacks,
          label: externalTooltipCallbacks?.label ?? defaultTooltipLabel,
        },
      },
    },
    scales: isPieChartType.value
      ? undefined
      : {
          ...props.chartOptions?.scales,
          x: {
            ...props.chartOptions?.scales?.x,
            ticks: {
              autoSkip: true,
              maxTicksLimit: 8,
              maxRotation: 0,
              minRotation: 0,
              padding: 6,
              ...props.chartOptions?.scales?.x?.ticks,
              color: textColor.value,
            },
            grid: {
              ...props.chartOptions?.scales?.x?.grid,
              color: Dark.isActive
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
            },
          },
          y: {
            ...props.chartOptions?.scales?.y,
            ticks: {
              maxTicksLimit: 6,
              ...props.chartOptions?.scales?.y?.ticks,
              color: textColor.value,
            },
            grid: {
              ...props.chartOptions?.scales?.y?.grid,
              color: Dark.isActive
                ? 'rgba(255,255,255,0.1)'
                : 'rgba(0,0,0,0.1)',
            },
          },
        },
  }
})
</script>
