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
import {computed, defineComponent, PropType} from 'vue'
import PieChart from 'components/PieChart.vue'
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {usePieChart} from 'src/use/usePieChart'
import contractWork from 'components/contractWork/contractWork'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<ContractWorkInputFields>,
      required: true,
    },
  },
  setup(props) {
    const labels:string[] =  [
      'Wynagrodzenie netto',
      'Zaliczka na podatek dochodowy',
    ]

    const result = computed(() => {
      try{
        return contractWork.getResult(props.input)
      }
      catch {
        return {
          basisForTax: 0,
          expenses:  0,
          grossAmount: 0,
          taxAmount: 0,
          netAmount: 0,
        }
      }
    })

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
})
</script>
