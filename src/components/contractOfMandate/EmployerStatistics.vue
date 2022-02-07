<template>
  <div class="q-pa-md">
    <PieChart
      v-if="result.grossAmount"
      class="pieChart"
      :chart-data="chartData"/>
    <span v-else>Brak danych</span>
  </div>
</template>

<script lang="ts">
import {computed, defineComponent, PropType} from 'vue'
import employerContractOfMandate from 'components/contractOfMandate/employerContractOfMandate'
import PieChart from 'components/PieChart.vue'
import {ContractOfMandateInputFields} from 'components/contractOfMandate/interfaces/ContractOfMandateInputFields'
import {usePieChart} from 'src/use/usePieChart'

export default defineComponent({
  props: {
    input: {
      type: Object as PropType<ContractOfMandateInputFields>,
      required: true,
    },
  },
  setup(props) {
    const labels:string[] =  [
      'Wynagrodzenie brutto',
      'Składka wypadkowa',
      'Składka rentowa',
      'Składka emerytalna',
      'Składka PPK',
    ]

    const result = computed(() => {
      return employerContractOfMandate.getMonthlyResult(props.input)
    })

    const chartData = computed(() => usePieChart(
        labels,
        [
          result.value.grossAmount,
          result.value.accidentContribution,
          result.value.rentContribution,
          result.value.pensionContribution,
          result.value.ppkContribution,
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
