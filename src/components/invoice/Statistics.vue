<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.netAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts">
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'
import {PropType, computed, defineComponent} from 'vue'
import { usePieChart } from 'src/use/usePieChart'
import PieChart from 'components/partials/statistics/PieChart.vue'
import invoice from './invoice'

export default defineComponent({
  components: {
    PieChart,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<InvoiceInputFields>,
    },
  },
  setup(props) {
    const labels:string[] =  [
      'Kwota netto',
      'Kwota podatku',
    ]

    const result = computed(() => invoice.getResult(props.input))

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.netAmount,
          result.value.taxAmount,
        ],
      ),
    )

    return {
      chartData,
      result,
    }
  },
})
</script>
