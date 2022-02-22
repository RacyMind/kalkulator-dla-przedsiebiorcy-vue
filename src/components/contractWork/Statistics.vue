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
import {ContractWorkInputFields} from 'components/contractWork/interfaces/ContractWorkInputFields'
import {usePieChart} from 'src/use/usePieChart'
import {ContractWorkResult} from 'components/contractWork/interfaces/ContractWorkResult'
import contractWork from 'components/contractWork/contractWork'

export default {
  props: {
    input: {
      type: Object as PropType<ContractWorkInputFields>,
      required: true,
    },
  },
  setup(props: any) {
    const labels:string[] =  [
      'Wynagrodzenie netto',
      'Zaliczka na podatek dochodowy',
    ]

    const { input } = toRefs(props)

    const result:Readonly<Ref<Readonly<ContractWorkResult>>> = computed(() => {
      try{
        return contractWork.getResult(input.value)
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
}
</script>
