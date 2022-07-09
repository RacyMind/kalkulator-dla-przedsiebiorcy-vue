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
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {PropType, computed, defineComponent} from 'vue'
import {usePieChart} from 'src/use/usePieChart'
import PieChart from 'components/partials/PieChart.vue'
import contractWork from 'components/contractWork/contractWork'

export default defineComponent({
  components: {
    PieChart,
  },
  props: {
    input: {
      required: true,
      type: Object as PropType<ContractWorkInputFields>,
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
          netAmount: 0,
          taxAmount: 0,
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
      chartData,
      result,
    }
  },
})
</script>
