<template>
  <Chart
    type="line"
    :chart-options="chartOptions"
    :chart-data="chartData"
  />
</template>
<script setup lang="ts">
import type {ChartData, ChartOptions} from 'chart.js'
import Chart from 'components/partials/Chart.vue'

interface Props {
  chartData: ChartData
  chartOptions?: ChartOptions
}

defineProps<Props>()
</script>
