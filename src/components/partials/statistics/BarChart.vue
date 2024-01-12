<template>
  <Chart
    type="bar"
    :chart-options="props.chartOptions"
    :chart-data="props.chartData"
  />
</template>

<script lang="ts" setup>
import Chart from 'components/partials/Chart.vue'

const props = defineProps({
  chartData: Object,
  chartOptions: {
    type: Object,
    required: false,
    default: () => { return {} },
  },
})
</script>
