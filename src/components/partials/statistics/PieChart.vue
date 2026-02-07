<template>
  <Chart
    type="pie"
    :chart-options="props.chartOptions"
    :chart-data="props.chartData"
  />
</template>

<script lang="ts" setup>
import Chart from 'components/partials/Chart.vue'

const props = defineProps({
  chartData: {
    type: Object,
    required: true,
  },
  chartOptions: {
    type: Object,
    required: false,
    default: () => ({
      responsive: true,
      maintainAspectRatio: true,
      animation: { animateRotate: true, duration: 600 },
      plugins: {
        tooltip: { enabled: true },
        legend: { position: 'bottom' },
      },
    }),
  },
})
</script>
