<template>
  <div ref="chartContainer"
       role="img"
       :aria-label="ariaLabel"
       style="position: relative; width: 100%;">
    <component
      :is="chartComponent"
      :key="containerWidth"
      :data="chartData"
      :options="mergedOptions"
    />
  </div>
</template>
<script lang="ts" setup>
import {computed, ref, onMounted, onUnmounted} from 'vue'
import {Dark} from 'quasar'
import {Pie, Bar, Line, Doughnut} from 'vue-chartjs'
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

onMounted(() => {
  if (chartContainer.value) {
    containerWidth.value = chartContainer.value.clientWidth
    resizeObserver = new ResizeObserver((entries) => {
      const w = Math.round(entries[0].contentRect.width)
      if (Math.abs(w - containerWidth.value) > 20) {
        containerWidth.value = w
      }
    })
    resizeObserver.observe(chartContainer.value)
  }
})

onUnmounted(() => {
  resizeObserver?.disconnect()
})

const chartComponentMap: Record<string, any> = {
  pie: Pie,
  bar: Bar,
  line: Line,
  doughnut: Doughnut,
}

const chartComponent = computed(() => chartComponentMap[props.type] || Bar)

const textColor = computed(() => Dark.isActive ? '#E0E0E0' : '#666666')

const formatPln = (value: number) =>
  value.toLocaleString('pl-PL', { style: 'currency', currency: 'PLN' })

const mergedOptions = computed(() => ({
  ...props.chartOptions,
  plugins: {
    ...props.chartOptions?.plugins,
    legend: {
      ...props.chartOptions?.plugins?.legend,
      labels: {
        color: textColor.value,
      },
    },
    tooltip: {
      ...props.chartOptions?.plugins?.tooltip,
      callbacks: {
        label: (context: any) => {
          const label = context.label || ''
          const raw = typeof context.parsed === 'number' ? context.parsed : (context.parsed?.y ?? context.raw)
          return `${label}: ${formatPln(Number(raw))}`
        },
      },
    },
  },
  scales: props.type === 'pie' || props.type === 'doughnut' ? undefined : {
    x: {
      ticks: { color: textColor.value },
      grid: { color: Dark.isActive ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
    },
    y: {
      ticks: { color: textColor.value },
      grid: { color: Dark.isActive ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' },
    },
  },
}))
</script>
