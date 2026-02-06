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

const mergedOptions = computed(() => ({
  ...props.chartOptions,
  plugins: {},
}))
</script>
