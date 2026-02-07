<template>
  <component
    :is="chartComponent"
    :data="chartData"
    :options="mergedOptions"
    :width="400"
  />
</template>
<script lang="ts" setup>
import {computed} from 'vue'
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
})

const chartComponentMap: Record<string, any> = {
  pie: Pie,
  bar: Bar,
  line: Line,
  doughnut: Doughnut,
}

const chartComponent = computed(() => chartComponentMap[props.type] || Bar)

const textColor = computed(() => Dark.isActive ? '#E0E0E0' : '#666666')

const mergedOptions = computed(() => ({
  ...props.chartOptions,
  plugins: {
    legend: {
      labels: {
        color: textColor.value,
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
