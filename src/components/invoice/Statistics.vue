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
import {computed, PropType, Ref, toRefs} from 'vue'
import PieChart from 'components/PieChart.vue'
import { usePieChart } from 'src/use/usePieChart'
import {InvoiceInputFields} from 'components/invoice/interfaces/InvoiceInputFields'
import invoice from './invoice'
import {InvoiceResult} from 'components/invoice/interfaces/InvoiceResult'

export default {
  props: {
    input: {
      type: Object as PropType<InvoiceInputFields>,
      required: true,
    },
  },
  setup(props: any) {
    const labels:string[] =  [
      'Kwota netto',
      'Kwota podatku',
    ]

    const { input } = toRefs(props)

    const result:Readonly<Ref<Readonly<InvoiceResult>>> = computed(() => invoice.getResult(input.value))

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.netAmount,
          result.value.taxAmount,
        ],
      ),
    )

    return {
      result,
      chartData,
    }
  },
  components: {
    PieChart,
  },
}
</script>
