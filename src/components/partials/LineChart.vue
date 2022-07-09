<template>
  <Chart
    type="line"
    :chart-options="chartOptions"
    :chart-data="chartData"
  />
</template>
<script lang="ts">

import {defineComponent} from 'vue'
import Chart from 'components/partials/Chart.vue'
export default defineComponent({
  components: {
    Chart,
  },
  props: {
    chartData: {
      required: true,
      type: Object,
    },
    chartOptions: {
      required: false,
      type: Object,
    },
  },
})
</script>
