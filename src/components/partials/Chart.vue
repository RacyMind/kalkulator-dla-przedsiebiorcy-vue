<template>
  <Vue3ChartJs
    ref="chartRef"
    :type="type"
    :data="chart.data"
    :options="chart.options"
    :width="400"
  />
</template>
<script lang="ts">

import {defineComponent, ref, watch} from 'vue'
import Vue3ChartJs from '@j-t-mcc/vue3-chartjs'
export default defineComponent({
  components: {
    Vue3ChartJs,
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
    type: {
      required: true,
      type: String,
    },
  },
  setup (props) {
    const chartRef = ref<Vue3ChartJs>(null)

    const chart = {
      data: {
        ...props.chartData,
        labels: [...props.chartData.labels],
      },
      options: {
        ...props.chartOptions,
        plugins: {},
      },
    }


    watch(props, async () => {
      chart.data.datasets[0].data = [...props.chartData.datasets[0].data]
      chart.data.labels = [...props.chartData.labels]
      chartRef.value.update(1)
    }, {deep: true})

    return {
      chart,
      chartRef,
    }
  },
})
</script>
